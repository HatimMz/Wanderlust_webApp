import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import FormCard from './FormCard'

function AuthForm({ mode, setUser }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const submit = async (e) => { e.preventDefault(); try { const data = await api(`/users/${mode}`, { method: 'POST', body: JSON.stringify(form) }); setUser(data.user); navigate('/') } catch (err) { setError(err.message) } }
  return <FormCard title={mode === 'login' ? 'Welcome back' : 'Create your account'} error={error}><form onSubmit={submit} className="form-grid"><label className="wide">Username<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" /></label>{mode === 'signup' && <label className="wide">Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></label>}<label className="wide">Password<input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label><button className="button wide">{mode === 'login' ? 'Log in' : 'Sign up'}</button></form></FormCard>
}

export default AuthForm
