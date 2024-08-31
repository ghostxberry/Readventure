import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AppProvider from './AppProvider.jsx'
import axios from 'axios'

axios.defaults.withCredentials=true

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <AppProvider>
    <App />
  </AppProvider>     
  </React.StrictMode>,
)
