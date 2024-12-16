import { AuthProvider } from '@/context/AuthContext'
import { ProfileProvider } from '@/context/ProfileContext';
import '@/styles/globals.css'
export default function App({ Component, pageProps }) {
  return (
  <AuthProvider>
    <ProfileProvider>
      <Component {...pageProps} />
    </ProfileProvider>
  </AuthProvider>
  )
}
