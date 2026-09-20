import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import FormCard from './FormCard'

function ListingForm({ edit = false }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', price: '', location: '', country: '', image: { url: '' } })
  const [error, setError] = useState('')
  useEffect(() => { if (edit) api(`/listings/${id}/edit`).then(setForm).catch((err) => setError(err.message)) }, [edit, id])
  const submit = async (e) => {
    e.preventDefault()
    try {
      const result = await api(edit ? `/listings/${id}` : '/listings', { method: edit ? 'PUT' : 'POST', body: JSON.stringify(form) })
      navigate(`/listings/${edit ? id : result.listing._id}`)
    } catch (err) { setError(err.message) }
  }
  const update = (key, value) => setForm({ ...form, [key]: value })
  return <FormCard title={edit ? 'Edit your stay' : 'List a new stay'} error={error}><form onSubmit={submit} className="form-grid"><label>Title<input required value={form.title} onChange={(e) => update('title', e.target.value)} /></label><label>Price per night<input required type="number" min="1" value={form.price} onChange={(e) => update('price', e.target.value)} /></label><label>Location<input required value={form.location} onChange={(e) => update('location', e.target.value)} /></label><label>Country<input required value={form.country} onChange={(e) => update('country', e.target.value)} /></label><label className="wide">Image URL<input value={form.image?.url || ''} onChange={(e) => update('image', { url: e.target.value })} placeholder="https://..." /></label><label className="wide">Description<textarea value={form.description} onChange={(e) => update('description', e.target.value)} /></label><button className="button wide">{edit ? 'Save changes' : 'Create listing'}</button></form></FormCard>
}

export default ListingForm
