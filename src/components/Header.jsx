import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/templates', label: 'Templates' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand-link" to="/" aria-label="System Forge home">
          <img className="brand-logo" src="/system-forge-logo.svg" alt="System Forge" />
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map(({ to, label, end }) => (
            <NavLink className="nav-link" end={end} key={to} to={to}>
              {label}
            </NavLink>
          ))}
          <NavLink className="nav-link nav-cta" to="/templates">
            Browse templates
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
