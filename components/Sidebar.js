import React, { useState, useEffect, Suspense} from 'react'
import { useRouter } from 'next/router'
import { HomeIcon, PlusCircleIcon, UserIcon, EnvelopeIcon, BellIcon, VideoCameraIcon} from '@heroicons/react/24/outline';
import {PhotoIcon} from '@heroicons/react/24/solid';
import Image from 'next/image';
import useStore from './store';
import NewPostModal from './NewPostModal';
const Chat = React.lazy(() => import ('../pages/Chat'))
const Notifications = React.lazy(() => import ('../pages/Notifications'))
export default function Sidebar({onStateChange}) {
  const router = useRouter();
  const [newPostModal, setNewPostModal] = useState(false);
  const sidebarValue = useStore((state) => state.sidebarValue);
  const setSidebarValue = useStore((state) => state.setSidebarValue);
  const [expanded, setExpanded] = useState(false);
  const [notificationsExpanded, setNotificationsExpanded] = useState(false);
  const handleClickTwo = () => {
    onStateChange(notificationsExpanded)
  }
  useEffect(() => {
    const drawerButtons = document.querySelectorAll('.drawer-button');
      drawerButtons.forEach(button => {
        let isOpen = false; // Add a variable to track the state
        button.addEventListener('click', () => {
          const drawerContent = button.nextElementSibling; 
          drawerContent.classList.toggle('open'); 
          isOpen = !isOpen; // Toggle the state
      });
    });
  }, []);
    return (
      <>
        {newPostModal ? <NewPostModal newPostModal={newPostModal} closePostModal={() => setNewPostModal(false)}/> : null}
        <aside className={`${expanded || notificationsExpanded ? 'small-side-footer' : 'side-footer'}`}>
          {!expanded && !notificationsExpanded ?
            <div style={{marginLeft: '25%'}} className='relative hidden lg:inline-grid items-center mt-5 justify-center h-24 w-24 cursor-pointer'>
              <Image
                src={require('../assets/DarkMode5.png')} // Make sure this path is correct
                alt="Your logo description"
                height={50}
                width={150}
              />
            </div> : 
            <div className='smallLogoWrapper'>
                <Image
                  src={require('../assets/logo.png')} // Make sure this path is correct
                  alt="Your logo description"
                  height={50}
                  width={50}
                />
            </div>
              }
          <ul className='sidebar-nav'>
            <div className='flex flex-row mb-12 mt-5 cursor-pointer' onClick={() => {router.push('/'); setExpanded(false); setSidebarValue(false)}}>
              <HomeIcon className='navBtn' color='#fafafa' style={{height: 35}}/>
              {expanded || notificationsExpanded ? null : 
              <li className={'text-white pl-5 self-center w-0'}>Home</li>}
            </div>
            <button className='flex flex-row mb-12 mt-5 cursor-pointer' onClick={() => {setExpanded(!expanded); setSidebarValue(!sidebarValue)}}>
              <EnvelopeIcon className='navBtn' color='#fafafa' style={{height: 35}}/>
              {expanded || notificationsExpanded  ? null : 
              <li className={'text-white pl-5 self-center w-0'}>Message</li>}
            </button>
            <div className='flex flex-row mb-12 mt-5 cursor-pointer' onClick={() => {setNotificationsExpanded(!notificationsExpanded); handleClickTwo()}}>
              <BellIcon className='navBtn' color='#fafafa' style={{height: 35}}/>
              {expanded || notificationsExpanded  ? null : 
              <li className={'text-white pl-5 self-center w-0'}>Notifications</li>}
            </div>
            <div className='flex flex-row  my-12 cursor-pointer' onClick={() => setNewPostModal(!newPostModal)}>
              <PlusCircleIcon className='navBtn' color='#fafafa' style={{height: 35}}/>
              {expanded || notificationsExpanded  ? null : 
              <li className={'text-white pl-5 self-center'}>New Post</li>}
            </div>
            <div className='flex flex-row  my-12 cursor-pointer' onClick={() => {router.push('/Vidz'); setExpanded(false); setSidebarValue(false)}}>
              <VideoCameraIcon className='navBtn' color='#fafafa' style={{height: 35}}/>
              {expanded || notificationsExpanded  ? null : 
              <li className={'text-white pl-5 self-center w-0'}>Vidz</li>}
            </div>
            <div className='flex flex-row my-12 cursor-pointer' onClick={() => {router.push('/GetThemes', {name: null, groupId: null, goToMy: false, groupTheme: null, group: null, registers: false}); setExpanded(false); setSidebarValue(false)}}>
              <PhotoIcon className='navBtn' color='#fafafa' style={{height: 35}}/>
              {expanded || notificationsExpanded  ? null : 
              <li className={'text-white pl-5 self-center w-0'}>Themes</li>}
            </div>
            <div className='flex flex-row my-12 cursor-pointer' onClick={() => {router.push('Profile'); setExpanded(false); setSidebarValue(false)}}>
              <UserIcon className='navBtn' color='#fafafa' style={{height: 35}} />
              {expanded || notificationsExpanded ? null : 
              <li className={'text-white pl-5 self-center w-0'}> Profile</li>}
            </div>
          </ul>
                
        </aside>
        <Suspense fallback={<div>Loading...</div>}>
          {expanded && !notificationsExpanded ?
            <aside className='side-chat'>
              <Chat />
            </aside> : !expanded && notificationsExpanded ? 
            <aside className='side-chat'>
              <Notifications />
            </aside> : null}
        </Suspense>
      </>
    )
}
