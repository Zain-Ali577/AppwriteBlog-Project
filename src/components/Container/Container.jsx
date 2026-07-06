import React from 'react'
import LogoImage from '../Logo.png'

function Logo({ width = '100px' }) {
  return (
    <img
      src={LogoImage}
      alt='12MegaBlog Logo'
      style={{ width, height: 'auto' }}
      className='block'
    />
  )
}

function Container({ children }) {
  return (
    <div className='w-full max-w-7xl mx-auto px-4'>{children}</div>
  )
}

export default Container
