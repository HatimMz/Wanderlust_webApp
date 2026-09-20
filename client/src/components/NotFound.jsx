import { Link } from 'react-router-dom'

function NotFound() {
  return <div className="status"><h1>Page not found</h1><Link to="/">Return home</Link></div>
}

export default NotFound
