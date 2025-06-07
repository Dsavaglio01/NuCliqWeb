
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
          <div className='flex h-screen w-screen'> {/* Main Layout Container - A */}

      {/* Left Column (simulating Sidebar) - B */}
      <Sidebar />

      {/* Right Column (Main Content Area) - C */}
      <div className='flex flex-col flex-grow overflow-y-auto'>
        
        {/* Placeholder for your actual video list content */}
        <div className="flex justify-center p-4"> {/* This is where your VidPosts would go, or a container for it */}
             <div className="flex justify-center items-center">
              <section>  
                {profile ? <VidPosts profile={profile}/> : null}
              </section> 
             </div>
        </div>

      </div>
    </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
