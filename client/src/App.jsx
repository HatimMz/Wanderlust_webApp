import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { api } from './api'
import './App.css'
import AuthForm from './components/AuthForm'
import Home from './components/Home'
import Layout from './components/Layout'
import ListingDetails from './components/ListingDetails'
import ListingForm from './components/ListingForm'
import NotFound from './components/NotFound'
import Protected from './components/Protected'

function App() {
  const [user, setUser] = useState(null)
  useEffect(() => { api('/users/me').then(setUser).catch(() => setUser(null)) }, [])
  return <BrowserRouter><Layout user={user} setUser={setUser}><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<AuthForm mode="login" setUser={setUser} />} />
    <Route path="/signup" element={<AuthForm mode="signup" setUser={setUser} />} />
    <Route path="/listings/:id" element={<ListingDetails user={user} />} />
    <Route path="/listings/new" element={<Protected user={user}><ListingForm /></Protected>} />
    <Route path="/listings/:id/edit" element={<Protected user={user}><ListingForm edit /></Protected>} />
    <Route path="*" element={<NotFound />} />
  </Routes></Layout></BrowserRouter>
}

export default App
