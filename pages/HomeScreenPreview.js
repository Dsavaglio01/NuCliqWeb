import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { ArrowUturnRightIcon, BookmarkIcon, ChatBubbleBottomCenterIcon, ChevronDownIcon, EllipsisVerticalIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeart, CheckIcon, BookmarkIcon as SolidBookmark, UserCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import { doc, getDoc } from 'firebase/firestore';
import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
import FollowingIcon from '@/components/FollowingIcon';
import ProfileContext from '@/context/ProfileContext';
function HomeScreenPreview({theme}) {
    const headerHeader = {
        color: "#fafafa",
        fontSize: 24,
        padding: 10,
        textAlign: 'center'
    }
    const profile = useContext(ProfileContext);
    
  return (
    <div>
         <div className='flex justify-center mt-5'>
        <span style={headerHeader}>{"Posts Theme Preview"} </span>
        </div>
         <div className='my-7 border-rounded-sm w-96 ml-96 relative items-center justify-center' style={{ 
    backgroundColor: "#121212",
    height: 700,
    backgroundImage: `url(${theme})`, // Add background image URL here
    backgroundSize: 'cover',  // Or 'contain', depending on desired behavior
    backgroundPosition: 'center',
}}>
  <div className='mt-8'>
  <div className='bg-[#121212] rounded-xl m-5'>
    <div className='flex p-5 py-3 items-center border-rounded-sm'>
        {profile.pfp ? <img src={profile.pfp} height={44} width={44} style={{borderRadius: 8}}/> :
          <UserCircleIcon className='userBtn' height={44} width={44} style={{borderRadius: 8}}/>}
          
        <p className='flex-1 font-bold' style={{color: "#fafafa"}}>{profile.username}</p>
        <FollowingIcon color={"#9EDAFF"} width={70} height={32} />
    </div>
    <div className='px-5 pb-5'>
          <PhotoIcon className='object-cover w-full rounded-md'/>
      </div> 
   </div>
   </div>
      <div className='bg-[#121212] rounded-xl m-5 mb-16 mt-0 relative'>
      
      <div className='flex justify-between pt-4 px-4'>
          <div className='flex space-x-4'>
            <div className='flex flex-row'>
              <SolidHeart className='btn' style={{color: 'red'}} />
              <span style={{fontSize: 12.29, color: "#fafafa", alignSelf: 'center', paddingLeft: 5}}>100</span>
            </div>
            <div className='flex flex-row'>
              <ChatBubbleBottomCenterIcon className='btn'/>
              <span style={{fontSize: 12.29, color: "#fafafa", alignSelf: 'center', paddingLeft: 5}}>10</span>
            </div>
            <div className='flex flex-row'>
              <SolidBookmark className='btn' style={{color: '#9EDAFF'}} />
            </div>
            <ArrowUturnRightIcon className='btn' />
          </div>
        <EllipsisVerticalIcon className='btn'/>
  
      
      </div>
      <p className='p-5 truncate text-white'>
        <span className='font-bold mr-1'>{profile.username}</span>Example Caption</p>
      
      </div>
      <div className='arrow' />
    </div>
    </div>
  )
}

export default HomeScreenPreview