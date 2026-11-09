import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const fallbackImage = 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=900&q=80'

function ListingDetails({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [error, setError] = useState('')
  const [review, setReview] = useState({ comment: '', rating: 5 })

  const load = useCallback(() => api(`/listings/${id}`).then(setListing).catch((err) => setError(err.message)), [id])
  useEffect(() => {
    load()
  }, [load])

  if (!listing) return <p className="status">{error || 'Loading stay...'}</p>
  const isOwner = user && listing.owner?._id === user.id

  const deleteListing = async () => {
    if (!window.confirm('Delete this listing?')) return
    await api(`/listings/${id}`, { method: 'DELETE' })
    navigate('/')
  }
  const addReview = async (e) => {
    e.preventDefault()
    await api(`/listings/${id}/reviews`, { method: 'POST', body: JSON.stringify(review) })
    setReview({ comment: '', rating: 5 })
    load()
  }
  const deleteReview = async (reviewId) => {
    await api(`/listings/${id}/reviews/${reviewId}`, { method: 'DELETE' })
    load()
  }

  return <div className="detail">
    <Link className="back-link" to="/">← Back to all stays</Link>
    <img className="detail-image" src={listing.image?.url || fallbackImage} alt={listing.title} />
    <div className="detail-layout"><article><span className="eyebrow">{listing.location}, {listing.country}</span><h1>{listing.title}</h1><p className="lead">{listing.description || 'A beautiful place to stay.'}</p><div className="price">${listing.price}<small> / night</small></div>{isOwner && <div className="actions"><Link className="button" to={`/listings/${id}/edit`}>Edit listing</Link><button className="button danger" onClick={deleteListing}>Delete</button></div>}</article>
      <aside className="booking-card"><strong>${listing.price}</strong> / night<div className="booking-row"><span>Location</span><b>{listing.location}</b></div><div className="booking-row"><span>Country</span><b>{listing.country}</b></div><button className="button full">Reserve</button></aside>
    </div>
    <section className="reviews"><h2>Guest reviews</h2>{listing.reviews?.map((item) => <div className="review" key={item._id}><div><b>{item.author?.username || 'Guest'}</b><span>{'★'.repeat(item.rating)}</span></div><p>{item.comment}</p>{user?.id === item.author?._id && <button className="text-button" onClick={() => deleteReview(item._id)}>Delete</button>}</div>)}{user ? <form className="review-form" onSubmit={addReview}><h3>Share your experience</h3><textarea required value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="What did you love?" /><select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select><button className="button">Post review</button></form> : <p className="muted">Log in to leave a review.</p>}</section>
  </div>
}

export default ListingDetails
