import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom' 


export default function AuthLayout({children, authentication = true}) {

const navigate = useNavigate()
const [loader, setLoader] = useState(true)
const authStatus = useSelector((state) => state.auth.status)

useEffect(() => {
    if (authentication && !authStatus) {
        navigate('/login')
    } else if (!authentication && authStatus) {
        navigate('/')
    }
    setLoader(false)

}, [authStatus, navigate, authentication])

  return loader ? <div>Loading...</div> : <div>{children}</div>
}


