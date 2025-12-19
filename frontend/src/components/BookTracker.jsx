import { useState, useEffect } from 'react'

const BookTracker = ({ user, onLogout }) => {
  const [books, setBooks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '', author: '', status: 'want-to-read', rating: '', notes: '',
    totalPages: '', pagesRead: '', startDate: '', finishDate: ''
  })

  const token = localStorage.getItem('token')
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001'

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/books`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error('Error fetching books:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        fetchBooks()
        setFormData({
          title: '', author: '', status: 'want-to-read', rating: '', notes: '',
          totalPages: '', pagesRead: '', startDate: '', finishDate: ''
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error adding book:', error)
    }
  }

  const deleteBook = async (id) => {
    try {
      await fetch(`${API_BASE}/api/books/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchBooks()
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }

  return (
    <div className="book-tracker">
      <header>
        <div className="user-welcome">
          <h1>My Library</h1>
          <h2>Manage your collection</h2>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ marginBottom: '2rem' }}>
        {showForm ? 'Cancel' : '+ Add New Book'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Book Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              placeholder="Author Name"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="want-to-read">Want to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Total Pages</label>
            <input type="number" placeholder="e.g. 300" value={formData.totalPages} onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Pages Read</label>
            <input type="number" placeholder="e.g. 50" value={formData.pagesRead} onChange={(e) => setFormData({ ...formData, pagesRead: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Finish Date</label>
            <input type="date" value={formData.finishDate} onChange={(e) => setFormData({ ...formData, finishDate: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Notes</label>
            <textarea
              placeholder="Write your thoughts..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1' }}>Save Book</button>
        </form>
      )}

      <div className="books-grid">
        {books.map(book => (
          <div key={book._id} className="book-card">
            <div className="book-info">
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
            </div>

            <span className={`status-badge status-${book.status}`}>
              {book.status.replace('-', ' ')}
            </span>

            {/* Progress Bar */}
            {book.totalPages && (
              <div style={{ margin: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Progress</span>
                  <span>{Math.round((book.pagesRead / book.totalPages) * 100) || 0}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min((book.pagesRead / book.totalPages) * 100, 100)}%`,
                    height: '100%',
                    background: 'var(--accent-color)',
                    transition: 'width 0.5s'
                  }}></div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {book.pagesRead} / {book.totalPages} pages
                </div>
              </div>
            )}

            {book.rating && (
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: i < book.rating ? '#fdcb6e' : '#444' }}>★</span>
                ))}
              </div>
            )}

            {book.notes && <div className="notes">{book.notes}</div>}

            <button onClick={() => deleteBook(book._id)} className="delete-btn">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BookTracker