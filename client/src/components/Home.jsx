import { useEffect, useState } from 'react'
import { api } from '../api'
import ListingCard from './ListingCard'

function Home() {
  const [listings, setListings] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/listings').then(setListings).catch((err) => setError(err.message)).finally(() => setLoading(false))
  }, [])

  const filtered = listings.filter((listing) =>
    `${listing.title} ${listing.location} ${listing.country}`.toLowerCase().includes(query.toLowerCase()),
  )

  return <div>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">Your world is waiting</span>
        <h1>Stay somewhere <em>unforgettable.</em></h1>
        <p>Discover beautiful homes, hidden escapes, and places made for your next story.</p>
        <div className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by location or title" /></div>
      </div>
    </section>
    <section className="section-heading"><div><span className="eyebrow">Curated for you</span><h2>Explore stays</h2></div><span className="muted">{filtered.length} places</span></section>
    {loading && <p className="status">Loading stays...</p>}
    {error && <p className="alert">{error}</p>}
    <div className="listing-grid">{filtered.map((listing) => <ListingCard key={listing._id} listing={listing} />)}</div>
    {!loading && !filtered.length && <p className="status">No stays match your search.</p>}
  </div>
}

export default Home
