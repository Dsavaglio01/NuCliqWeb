import React, { useState, useEffect, useRef, Suspense} from 'react'
import { useRouter } from 'next/router'
import ReactModal from 'react-modal';
import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { HomeIcon, PlusCircleIcon, UserIcon, EnvelopeIcon, BellIcon, VideoCameraIcon, ChatBubbleBottomCenterTextIcon, } from '@heroicons/react/24/outline';
import { BeatLoader } from 'react-spinners';
import {PhotoIcon} from '@heroicons/react/24/solid';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import NewPostHeader from './NewPostHeader';
import MainButton from './MainButton';
import Image from 'next/image';
import useStore from './store';
import { styles } from '@/styles/styles';
const Chat = React.lazy(() => import ('../pages/Chat'))
const Notifications = React.lazy(() => import ('../pages/Notifications'))
const grid = 5;
export default function Sidebar({ style, onStateChange}) {
    const router = useRouter();
    const {user} = useAuth();
    const [initialText, setInitialText] = useState(null);
    const [text, setText] = useState('');
    const {postArray} = router.query;
    const [newPostModal, setNewPostModal] = useState(false);
    const [data, setData] = useState([])
    const [textOpen, setTextOpen] = useState(false);
    const [pfp, setPfp] = useState(null);
    const sidebarValue = useStore((state) => state.sidebarValue);
    const setSidebarValue = useStore((state) => state.setSidebarValue);
    const [expanded, setExpanded] = useState(false);
    const [notificationsExpanded, setNotificationsExpanded] = useState(false);
    const [loading, setLoading] = useState(false)
  
    useEffect(() => {
      if(newPostModal) {
      const getData = async() => {
        const docSnap = await getDoc(doc(db, 'profiles', user.uid))
        setPfp(docSnap.data().pfp)
      }
      getData()
    }
    }, [newPostModal]) 
    async function addVideoToArray(item) {
        try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        item,
      );
       setData([{id: index, image: false, video: true, thumbnail: uri, post: item, visible: false}])
       setTimeout(() => {
        setLoading(false)
       }, 1000);
    } catch (e) {
      console.warn(e);
    }
    }
    const postPostText = {
      fontSize: window.innerHeight / 68.7,
        padding: 10,
        paddingTop: 0,
        color: "#005278"
    }
    const fileInputRef = useRef(null);
    const fileVideoInputRef = useRef(null);
    const handleClick = () => {
        fileInputRef.current.click();
    }
    const handleVideoClick = () => {
      fileVideoInputRef.current.click();
    }
    const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
    const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  paddingBottom: 10,
  marginLeft: 0,
  marginRight: 0,
  margin: `0 0 ${grid}px 0`,
  flexDirection: 'row',
  display: 'flex',
  borderBottomWidth: 1,
  borderColor: "#121212",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: "#fafafa",
  padding: grid,
  paddingBottom: 0,
  width: '100%'
});
    function onDragEnd(result) {
    console.log(result)
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      data,
      result.source.index,
      result.destination.index
    );

    setData(items)
  }
   const handleText = (event) => {
    setText(event.target.value)
}
    const handleClickTwo = () => {
      onStateChange(notificationsExpanded)
    }

    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        //console.log(selectedFiles)
        if (selectedFiles) {
      Array.from(selectedFiles).slice(0, 5).map((file, index) => {
        const item = URL.createObjectURL(file)
        setData(prevState => [...prevState, {id: index, image: true, video: false, thumbnail: null, post: item, visible: false}])
      }
      );
    }
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
     
    const handleVideoFileChange = (event) => {
      const selectedFile = event.target.file;
        //console.log(selectedFiles)
        if (selectedFile) {
         addVideoToArray(selectedFile)
            //onFileSelected(selectedFile)
        }
    }
    return (
      <>
      <ReactModal isOpen={newPostModal} style={{content: styles.modalContainer}}>
        <div>
          <p className='text-white'>New Post</p>
        <div className='divider'/>
      <div>

        <NewPostHeader group={false} data={data} pfp={pfp}/>
        <div style={styles.toggleView}>
          <div style={{display: 'flex'}}>
         <div style={styles.newPostContainer}>
          <>
          <button style={styles.selectImageContainer} onClick={handleClick}>
              <PhotoIcon className='postBtn' color='#005278' style={{alignSelf: 'center'}}/>
                <div>
                  <p style={styles.editPostText}>Select Images</p>
                  <p style={postPostText}>up to {5 - (data.filter((item) => item.image == true)).length} images</p>
                </div>
          </button>
          <input type='file' multiple ref={fileInputRef} style={{display: 'none'}} accept="image/*" onChange={handleFileChange}/>
          </>
        <div style={{height: 35, borderWidth: 0.5, alignSelf: 'center', borderColor: "grey"}}/>
        <>
          <button style={styles.selectImageContainer} onClick={handleVideoClick}>
              <VideoCameraIcon className='postBtn' color='#005278' style={{alignSelf: 'center'}}/>
                <div>
                  <p style={styles.editPostText}>Select Vid</p>
                  <p style={postPostText}>up to 60 seconds</p>
                </div>
          </button>
          <input type='file' ref={fileVideoInputRef} style={{display: 'none'}} accept="video/*" onChange={handleVideoFileChange}/>
          </>
         </div>
      </div>
      <div className='cursor-pointer' style={styles.textContainer} 
      onClick={() => setTextOpen(true)}>
       <ChatBubbleBottomCenterTextIcon className='postBtn' color='#005278'/>
        <div>
         <p style={styles.editPostText}>What's vibing?</p>
          <p style={postPostText}>Post Text</p>
        </div>
        
      </div>
      
      </div>
       
        <p style={styles.editText}>Hold, drag and drop to change order of your posts</p>
        <p style={styles.editBottomText}>To edit/adjust your post, press the three dots</p>
        {loading ? 
        <div style={styles.loadContainer}> 
          <BeatLoader color='#9edaff'/>
          </div> : (postArray != undefined || data.length != 0) && !loading && !textOpen ? 
        <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {data.map((item, index) => (
                //console.log(item),
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                    className='flex flex-row'
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <img src={item.post} style={styles.postImage}/>
                      <p className='text-black self-center pl-6'>Post #{index + 1}</p>
                      <EllipsisVerticalIcon className='postBtn' style={styles.threeDotIcon} color='#121212'/>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
         : textOpen ? 
        <div>
            <div>
      <div style={styles.typeMessageContainer}>
         <>
         <div style={{display: 'flex'}}>
          <ChatBubbleBottomCenterTextIcon className='postBtn' color='#9edaff' style={{alignSelf: 'center'}}/>
          <p style={styles.editText}>Type your message below</p>
        </div>
          
         </>
      </div>
      <div className='divider'/>
      <>
      <div style={{marginTop: '5%'}}>
        <textarea placeholder={initialText ? initialText.value : "What's Vibing?"} value={text} style={styles.input} onChange={handleText} maxLength={300} />
        <p style={styles.postLength}>{text.length}/300</p>
      </div>
      <div style={styles.postContainerButton}>
      <div style={{alignSelf: 'center'}}>
        {text.length > 0 ? <div className='mr-3 mt-3'>
        <MainButton text={initialText ? "FINISH EDIT" : "FINISH"} onPress={text.length > 0 ? initialText ? () => putKeys() : () => addToArray() : null} />
        </div> : null}
      </div>

      </div>
      </>

      
      </div>
        </div> : null}
         
          
             
      
      </div>
      
      
      
    </div>
        <button className="close-button" onClick={() => {setNewPostModal(false); setData([])}}>
          <XMarkIcon className='btn'/>
        </button>
      </ReactModal>
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
            <div className='relative hidden lg:inline-grid h-24 w-24 mt-5 cursor-pointer'>
                <Image
                  src={require('../assets/logo.png')} // Make sure this path is correct
                  alt="Your logo description"
                  height={40}
                  width={40}
                />
            </div> }
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
                </aside>  : null
                }
                </Suspense>
              </>
    )
}
