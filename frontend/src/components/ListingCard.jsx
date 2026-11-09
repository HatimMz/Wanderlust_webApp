import { Link } from 'react-router-dom'

const fallbackImage = 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=900&q=80'

function ListingCard({ listing }) {
  return <Link className="listing-card" to={`/listings/${listing._id}`}>
    <img src={listing.image?.url || fallbackImage} alt={listing.title} />
    <div className="card-body"><div className="card-row"><h3>{listing.title}</h3><strong>${listing.price}<small> / night</small></strong></div><p>{listing.location}, {listing.country}</p><p className="description">{listing.description || 'A beautiful place to stay.'}</p></div>
  </Link>
}

export default ListingCard
