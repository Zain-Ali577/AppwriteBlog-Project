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

export default Logo
