import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const location = useLocation()

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'All Posts', slug: '/all-posts', active: authStatus },
    { name: 'Add Post', slug: '/add-post', active: authStatus },
    { name: 'Login', slug: '/login', active: !authStatus },
    { name: 'Signup', slug: '/signup', active: !authStatus },
  ]

  const isActive = (slug) => location.pathname === slug

  return (
    <header className='sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl shadow-[0_24px_120px_-50px_rgba(15,23,42,0.5)]'>
      <Container>
        <div className='flex flex-wrap items-center justify-between gap-4 py-4'>
          <Link to='/' className='flex items-center gap-3 transition duration-300 hover:-translate-y-0.5 hover:opacity-90'>
            <div className='flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 shadow-lg shadow-sky-500/20'>
              <Logo width='42px' />
            </div>
            <div>
              <p className='text-xs uppercase tracking-[0.45em] text-slate-400'>Indeepth Solution</p>
              <h1 className='text-lg font-semibold text-white'>AppwriteBlog</h1>
            </div>
          </Link>

          <nav className='ml-auto flex flex-wrap items-center gap-3'>
            {navItems.map(
              (item) =>
                item.active && (
                  <Link
                    key={item.name}
                    to={item.slug}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                      isActive(item.slug)
                        ? 'bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 shadow-lg shadow-sky-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
            )}
            {authStatus && (
              <div className='ml-2'>
                <LogoutBtn />
              </div>
            )}
          </nav>
        </div>
      </Container>
    </header>
  )
}

export default Header

      

