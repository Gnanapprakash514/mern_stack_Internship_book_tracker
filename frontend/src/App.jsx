import { useState, useEffect } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import BookTracker from './components/BookTracker'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [showLogin, setShowLogin] = useState(true)
  const [currentView, setCurrentView] = useState('dashboard') // 'dashboard' or 'library'

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData.user)
    localStorage.setItem('token', userData.token)
    localStorage.setItem('user', JSON.stringify(userData.user))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  if (user) {
    return (
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="main-nav glass-panel">
          <div className="nav-logo">📚 Tracker</div>
          <div className="nav-links">
            <button
              className={currentView === 'dashboard' ? 'active' : ''}
              onClick={() => setCurrentView('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={currentView === 'library' ? 'active' : ''}
              onClick={() => setCurrentView('library')}
            >
              My Library
            </button>
          </div>
        </nav>

        {/* Content Area */}
        <div className="content-area">
          {currentView === 'dashboard' ? (
            <Dashboard user={user} onLogout={handleLogout} />
          ) : (
            <BookTracker user={user} onLogout={handleLogout} />
          )}
        </div>

        <style>{`
          .app-container {
            width: 100%;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .main-nav {
            width: 100%;
            max-width: 1200px;
            margin: 1rem auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 50px; /* Pill shape nav */
          }
          .nav-logo {
            font-size: 1.5rem;
            font-weight: 800;
            background: linear-gradient(to right, #fff, var(--secondary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .nav-links button {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-size: 1rem;
            font-weight: 500;
            padding: 0.5rem 1.5rem;
            cursor: pointer;
            transition: all 0.3s;
            border-radius: 20px;
          }
          .nav-links button:hover {
            color: #fff;
          }
          .nav-links button.active {
            background: rgba(255, 255, 255, 0.1);
            color: #fff;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
          }
          .content-area {
            width: 100%;
            padding-top: 1rem;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>📚 Book Tracker</h1>
      {showLogin ? (
        <Login onLogin={handleLogin} onToggle={() => setShowLogin(false)} />
      ) : (
        <Register onToggle={() => setShowLogin(true)} />
      )}
    </div>
  )
}

export default App