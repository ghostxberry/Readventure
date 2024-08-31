from extensions import db
from uuid import uuid4
from sqlalchemy.dialects.postgresql import UUID



def get_uuid():
    return uuid4().hex


class Book(db.Model):
    __tablename__ = 'books'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=get_uuid)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=False)
    cover_i = db.Column(db.Integer)
    author_key = db.Column(db.ARRAY(db.String(255)))

    saved_books = db.relationship('SavedBook', back_populates='book')

class SavedBook(db.Model):
    __tablename__ = "saved_books"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=get_uuid)
    book_id = db.Column(UUID(as_uuid=True), db.ForeignKey('books.id'), nullable=False)
    reading_goal = db.Column(db.Integer) 
    reading_frequency = db.Column(db.String(10)) 
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)

    book = db.relationship('Book', back_populates='saved_books')
    user = db.relationship('User', back_populates='saved_books')

class User(db.Model):
    __tablename__="users"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=get_uuid)
    username = db.Column(db.Text, nullable=False)
    password = db.Column(db.Text, nullable=False)
    pfp_url = db.Column(db.String(255))
    about_me = db.Column(db.String(250))
    saved_books = db.relationship('SavedBook', back_populates='user')
