import { useState } from 'react'

const Login = ({ onLogin, onToggle }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (response.ok) {
        onLogin(data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Welcome Back</h2>
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn-primary">Login</button>
      
      <p className="toggle-text" onClick={onToggle}>
        Don't have an account? <span>Register</span>
      </p>
    </form>
  )
}

export default Login