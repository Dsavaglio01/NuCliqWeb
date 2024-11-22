import React from 'react'
import Image from 'next/image'
import {ArrowDownCircleIcon, BellIcon, ChatBubbleLeftIcon, MagnifyingGlassIcon} from '@heroicons/react/24/outline'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useRouter } from 'next/router';
function Header() {
  const router = useRouter();
  return (
    <div className='shadow-sm justify-end flex items-end mt-5'>
    <div className='max-w-6xl mx-5 xl:mx-auto'>
    <div className=' justify-end space-x-20'>
      <MagnifyingGlassIcon className='navBtn' color='#fafafa' onClick={() => router.push({pathname: 'Chat', query: {sending: false, message: true, }})}/>
      <ChatBubbleLeftIcon className='navBtn' color='#fafafa' onClick={() => router.push({pathname: 'Chat', query: {sending: false, message: true, }})}/>
      <BellIcon className='navBtn' color='#fafafa' />
      <Popup trigger={ <ArrowDownCircleIcon className='navBtn' color='#fafafa'/>}>
    <div className='flex flex-col'>
      <button>
        <p className='text-black text-left'>For You</p>
      </button>
      <hr style={{ border: "1px solid lightgray", margin: "2px 0" }} />
      <button>
         <p className='text-black text-left'>Following</p>
      </button>
     
    </div>
  </Popup>
     
    </div>
    </div>
    </div>
  )
}

export default Header