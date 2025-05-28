
import Head from 'next/head'
import useStore from '@/components/store'
import ProtectedRoute from '@/components/ProtectedRoute'
import Sidebar from '@/components/Sidebar'
import VidPosts from '@/components/VidPosts'
import { styles } from '@/styles/styles'
import { useContext } from 'react'
import ProfileContext from '@/context/ProfileContext'
export default function Vidz() {
  const sidebarValue = useStore((state) => state.sidebarValue);
  const profile = useContext(ProfileContext);
  return (
    <ProtectedRoute>
      <div className='app-container'>
        <Head>
          <title>NuCliq</title>
          <link rel="icon" href='/favicon.icon' />
        </Head>
        <div style={styles.pageContainer}>
          <div className='flex'>
            <Sidebar />
            <div className=''>  
              {sidebarValue ? null :
                <div className='flex flex-row'>
                  <section className=''>
                    {profile ? <VidPosts profile={profile}/> : <></>}
                  </section>
                </div>}
            </div>
            
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
