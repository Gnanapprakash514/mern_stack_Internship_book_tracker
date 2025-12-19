import { useState, useEffect } from 'react'

const Dashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    completedBooks: 0,
    readingBooks: 0,
    totalPagesRead: 0,
    avgSpeed: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch('http://localhost:5001/api/books/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="dashboard">
      <header>
        <div className="user-welcome">
          <h1>Reading Insights</h1>
          <h2>Your progress over time</h2>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      <div className="stats-overview">
        <div className="stat-card glass-panel">
          <h3>Total Books</h3>
          <div className="big-number">{stats.totalBooks}</div>
        </div>
        <div className="stat-card glass-panel">
          <h3>Active Readers</h3>
          <div className="big-number">{stats.readingBooks}</div>
        </div>
        <div className="stat-card glass-panel">
          <h3>Completed</h3>
          <div className="big-number">{stats.completedBooks}</div>
        </div>
      </div>

      <div className="charts-container">
        {/* Pages Read Progress */}
        <div className="chart-card glass-panel">
          <h3>Total Pages Read</h3>
          <div className="circular-progress">
            <div className="inner-circle">
              <span>{stats.totalPagesRead}</span>
              <small>Pages</small>
            </div>
          </div>
          <p className="chart-note">Keep turning those pages!</p>
        </div>

        {/* Reading Speed */}
        <div className="chart-card glass-panel">
          <h3>Avg. Speed</h3>
          <div className="speed-meter">
            <div className="speed-value">{stats.avgSpeed}</div>
            <div className="speed-unit">Pages / Day</div>
          </div>
          <div className="speed-bar-container">
            <div className="speed-bar" style={{ width: `${Math.min(stats.avgSpeed, 100)}%` }}></div>
          </div>
          <p className="chart-note">Based on completed books</p>
        </div>
      </div>

      <style>{`
        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .stat-card {
          padding: 2rem;
          text-align: center;
        }
        .big-number {
          font-size: 3rem;
          font-weight: 800;
          color: var(--accent-color);
          text-shadow: 0 0 15px rgba(0, 206, 201, 0.4);
          margin-top: 0.5rem;
        }
        .charts-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .chart-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        /* Circular Progress Styling simulating a chart */
        .circular-progress {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: conic-gradient(var(--primary-color) 0%, var(--secondary-color) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1.5rem 0;
          position: relative;
          box-shadow: 0 0 20px var(--primary-glow);
        }
        .circular-progress::before {
          content: '';
          position: absolute;
          width: 130px;
          height: 130px;
          background: var(--bg-dark);
          border-radius: 50%;
        }
        .inner-circle {
          position: relative;
          z-index: 1;
          text-align: center;
          display: flex;
          flex-direction: column;
        }
        .inner-circle span {
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
        }
        .inner-circle small {
          color: var(--text-muted);
          text-transform: uppercase;
          font-size: 0.8rem;
        }

        /* Speed Meter */
        .speed-meter {
          text-align: center;
          margin: 1rem 0;
        }
        .speed-value {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(to bottom, #fff, #74b9ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .speed-unit {
          color: var(--text-secondary);
          font-size: 1rem;
        }
        .speed-bar-container {
          width: 100%;
          height: 10px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          overflow: hidden;
          margin-top: 1rem;
        }
        .speed-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-color), var(--primary-color));
          border-radius: 10px;
          transition: width 1s ease-out;
        }
        .chart-note {
          margin-top: 1rem;
          font-size: 0.9rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  )
}

export default Dashboard