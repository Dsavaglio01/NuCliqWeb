import { AuthProvider } from '@/context/AuthContext'
import '@/styles/globals.css'
import { Montserrat } from 'next/font/google'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
export default function App({ Component, pageProps }) {
  return (
  <AuthProvider>
  <Component {...pageProps} />
  </AuthProvider>
  )
}
