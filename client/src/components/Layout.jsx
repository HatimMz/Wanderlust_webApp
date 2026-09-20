import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'

function Layout({ user, setUser, children }) {
  const navigate = useNavigate()
  const logout = async () => {
    await api('/users/logout')
    setUser(null)
    navigate('/login')
  }

  return (
    <>
      <nav className="navbar">
        <Link className="brand" to="/">WanderLust</Link>
        <div className="nav-links">
          <Link to="/">Explore</Link>
          {user ? (
            <>
              <Link to="/listings/new">Add a stay</Link>
              <span className="user-chip">{user.username}</span>
              <button className="link-button" onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link className="button small" to="/signup">Sign up</Link>
            </>
          )}
        </div>
      </nav>
      <main className="page">{children}</main>
      <footer>WanderLust · Find a place that feels like home.</footer>
    </>
  )
}

export default Layout
