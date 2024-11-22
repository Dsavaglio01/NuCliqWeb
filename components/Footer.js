import { HomeIcon, PhotoIcon, PlusCircleIcon, UserGroupIcon, UserIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import React from 'react'

function Footer() {
    const router = useRouter();
  return (
    <div className='shadow-sm border-t'>
        <div className='justify-between flex mt-3' style={{width: '80%', marginLeft: '10%', marginBottom: '1%'}}>
        <HomeIcon className='navBtn' color='#fafafa' style={{height: 35}}/>
        <UserGroupIcon className='navBtn' color='#fafafa' style={{height: 35}}/>
        <PlusCircleIcon className='navBtn' color='#fafafa' style={{height: 35}}/>
        <PhotoIcon className='navBtn' color='#fafafa' style={{height: 35}}/>
        <UserIcon className='navBtn' color='#fafafa' style={{height: 35}} onClick={() => router.push('Profile')}/>
    </div>
    </div>
    
  )
}

export default Footer