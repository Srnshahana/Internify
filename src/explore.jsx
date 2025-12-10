import { useEffect, useMemo, useState } from 'react'
import './App.css'

export default function Explore({ mentors, onBack, renderStars, initialQuery }) {
  const [term, setTerm] = useState(initialQuery || '')
  const [query, setQuery] = useState(initialQuery || '')

  useEffect(() => {
    setTerm(initialQuery || '')
    setQuery(initialQuery || '')
  }, [initialQuery])

  const filteredMentors = useMemo(() => {
    const q = (query || '').toLowerCase()
    if (!q) return mentors
    return mentors.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.focus.toLowerCase().includes(q),
    )
  }, [mentors, query])

  return (
    <div className="page explore-page">
      <div className="explore-header">
        <div>
          <p className="eyebrow">All mentors</p>
          <h1>Browse every mentor on Internify.</h1>
          <p className="lead">
            Filter-free view of all mentors. Pick anyone to start your free session and
            design your path.
          </p>
        </div>
        <button className="ghost" onClick={onBack}>
          Back
        </button>
      </div>

      <div className="explore-search">
        <input
          placeholder="Search mentors by name, role, or focus"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setQuery(term.trim())
          }}
        />
        <button className="mini search-go" onClick={() => setQuery(term.trim())}>
          Search
        </button>
      </div>

      <div className="explore-grid">
        {filteredMentors.map((mentor) => (
          <div className="mentor-card" key={`explore-${mentor.name}`}>
            <div className="mentor-row1">
              <div className="avatar-img">
                <img src={mentor.image} alt={mentor.name} />
              </div>
              <div className="identity">
                <h4>{mentor.name}</h4>
                <p className="meta">{mentor.role}</p>
                {mentor.assured && <span className="assured-pill">Platform assured</span>}
              </div>
            </div>
            <div className="mentor-row2">
              <p className="mentor-text">{mentor.focus}</p>
              <span className="rating">
                {renderStars(mentor.rating)} <span className="rating-num">{mentor.rating}</span>
              </span>
              <div className="mentor-actions">
                <button className="tiny">Book your free session</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

