import { AuthProvider } from '@/context/AuthContext'
import { ProfileProvider } from '@/context/ProfileContext';
import '@/styles/globals.css'
import {Montserrat} from 'next/font/google'
const montserrat = Montserrat({
  subsets: ['latin'], // Crucial for font optimization
  display: 'swap', 
});
export default function App({ Component, pageProps }) {
  return (
    <main className={montserrat.className}>
      <AuthProvider>
        <ProfileProvider>
          <Component {...pageProps} />
        </ProfileProvider>
      </AuthProvider>
    </main>
  
  )
}
