from flask import Flask, jsonify, request, session, redirect, url_for
from flask_bcrypt import Bcrypt, check_password_hash, generate_password_hash
from extensions import db
from flask_cors import CORS
from models import SavedBook, Book, User  # Import only SavedBook model
import requests
from redis import Redis
from flask_session import Session
from datetime import timedelta
import secrets 


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://librarian:ilovebooks@localhost:5432/readventure'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = 'super_secret'

app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = Redis(host='localhost', port=6379, db=0)




bcrypt = Bcrypt(app)
Session(app)
db.init_app(app)
CORS(app, supports_credentials=True, origins='http://localhost:5173')


# Create tables before the first request
@app.before_request
def create_tables():
    db.create_all()

#User Routes -->
    
@app.route("/register", methods=["POST"])
def register_user():
    username = request.json["username"]
    password = request.json["password"]

    user_exists = User.query.filter_by(username=username).first() is not None

    if user_exists:
        return jsonify({"error":"User already exists"}), 409
    
    hashed_password = generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "username": new_user.username
    })


@app.route("/login", methods=["POST"])
def login_user():
    # Check if the request JSON contains the "username" and "password" fields
    if "username" not in request.json or "password" not in request.json:
        return jsonify({"error": "Missing username or password"}), 400
    
    # Extract the username and password from the request JSON
    username = request.json["username"]
    password = request.json["password"]

    # Query the database to find the user by username
    user = User.query.filter_by(username=username).first()

    # Check if the user exists and if the password is correct
    if user is None or not check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    # Set the user_id in the Flask session upon successful login
    session["user_id"] = user.id
    
    # Return the user details in the response JSON
    return jsonify({
        "id": user.id,
        "username": user.username
    })

@app.route('/api/user/profile', methods=['OPTIONS'])
def handle_options_request():
    return jsonify({'message': 'OPTIONS request handled'}), 200


@app.route('/api/user/profile', methods=['PUT'])
def update_profile():
    # Get user ID from the session
    user_id = session.get('user_id')

    # Check if user is logged in
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    # Get profile data from request JSON
    profile_data = request.json

    # Extract profile picture URL and About Me text from request data
    profile_picture_url = profile_data.get('profilePictureUrl')
    about_me = profile_data.get('aboutMe')

    try:
        # Update user's profile information
        user = User.query.filter_by(id=user_id).first()
        if user:
            user.pfp_url = profile_picture_url
            user.about_me = about_me
            db.session.commit()

            return jsonify({'message': 'Profile updated successfully'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route("/me", methods=["GET"])
def get_current_user():
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 401
    
    user_id = session['user_id']
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify({
        "id": user.id,
        "username": user.username,
        "pfp_url": user.pfp_url,
        "about_me": user.about_me
    })


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'}), 200

    


#Book Search Routes -->

@app.route('/api/search-books', methods=['GET'])
def search_books():
    search_query = request.args.get('query')
    if not search_query:
        return jsonify({'error': 'No search query provided'}), 400

    api_url = f'https://openlibrary.org/search.json?q={search_query}'
    response = requests.get(api_url)
    if response.status_code == 200:
        data = response.json().get('docs', [])
        formatted_data = []
        for book in data:
            # Join author names with a delimiter
            authors = ', '.join(book.get('author_name', []))
            formatted_book = {
                'title': book.get('title', ''),
                'author': authors,
                'cover_i': book.get('cover_i', None)
            }
            formatted_data.append(formatted_book)

            # Save each book to the books table if it doesn't already exist
            existing_book = Book.query.filter_by(title=formatted_book['title']).first()
            if not existing_book:
                new_book = Book(**formatted_book)
                db.session.add(new_book)

        # Commit changes to the database
        db.session.commit()

        return jsonify(formatted_data), 200
    else:
        return jsonify({'error': 'Failed to fetch books from the API'}), 500
    
@app.route('/api/save-book', methods=['POST'])
def save_book():
    data = request.json

    # Validate that the required fields exist in the request data
    required_fields = ['title', 'author', 'cover_i', 'user_id']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} field is missing in the request'}), 400

    # Extract data from the request
    title = data.get('title')
    author = data.get('author')
    cover_i = data.get('cover_i')
    user_id = data.get('user_id')  # Extract user_id from the request payload

    # Save book to the books table
    new_book = Book(title=title, author=author, cover_i=cover_i)
    db.session.add(new_book)
    db.session.commit()

    # Retrieve the Book object based on the provided data
    book = Book.query.filter_by(title=title, author=author, cover_i=cover_i).first()

    # If the book doesn't exist, handle this scenario
    if not book:
        return jsonify({'error': 'Failed to save book to the database'}), 500

    # Create a new SavedBook object with the retrieved book's id and user_id
    new_saved_book = SavedBook(
        book_id=book.id,
        user_id=user_id,  # Assign user_id to the new_saved_book object
        reading_goal=None,
        reading_frequency=None
    )

    # Add the new SavedBook object to the session and commit the changes
    db.session.add(new_saved_book)
    db.session.commit()

    return jsonify({'message': 'Book saved successfully'}), 200


@app.route('/api/saved-books', methods=['GET'])
def get_saved_books():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'You are not logged in'}), 401
    

    saved_books = SavedBook.query.filter_by(user_id=user_id).all()
    formatted_saved_books = []
    for saved_book in saved_books:
        formatted_saved_book = {
            'title': saved_book.book.title,
            'author': saved_book.book.author,
            'cover_i': saved_book.book.cover_i,
            'reading_goal': saved_book.reading_goal,
            'reading_frequency': saved_book.reading_frequency
        }
        formatted_saved_books.append(formatted_saved_book)
    return jsonify(formatted_saved_books), 200

@app.route('/api/saved-books/<book_id>', methods=['DELETE'])
def delete_saved_book(book_id):
    # Get user ID from the request headers
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return jsonify({'error': 'User ID not provided'}), 400

    # Check if the saved book belongs to the current user
    saved_book = SavedBook.query.filter_by(book_id=book_id, user_id=user_id).first()
    if not saved_book:
        return jsonify({'error': 'Saved book not found or does not belong to the current user'}), 404

    # Delete the saved book
    db.session.delete(saved_book)
    db.session.commit()

    return jsonify({'message': 'Saved book deleted successfully'}), 200



if __name__ == '__main__':
    app.run(debug=True)
