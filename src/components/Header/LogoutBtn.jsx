import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function LogoutBtn() {
  const dispatch = useDispatch()
  const logoutHandler = async () => {
    try {
      await authService.logout()
      dispatch(logout())
    } catch (error) {
      console.error('Logout failed:', error)
      alert('Unable to logout. Please try again.')
    }
  }

  return (
    <button
      className='inline-flex items-center rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition duration-200 hover:bg-slate-700 active:scale-95 shadow-sm'
      onClick={logoutHandler}
    >
      Logout
    </button>
  )
}

export default LogoutBtn
