import React, { useState, useEffect, useRef, useContext, createContext, Suspense} from 'react'
import { useRouter } from 'next/router'
import ReactModal from 'react-modal';
import { ChatBubbleBottomCenterIcon, ChevronLeftIcon, EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/solid';
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
const Chat = React.lazy(() => import ('../pages/Chat'))
const Notifications = React.lazy(() => import ('../pages/Notifications'))
export default function Sidebar({ style, onStateChange}) {
    const router = useRouter();
    const {user} = useAuth();
    const [initialText, setInitialText] = useState(null);
    const [themes, setThemes] = useState(false);
    const [text, setText] = useState('');
    const [actualTextSize, setActualTextSize] = useState(15.36)
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
     const openMenu = (obj) => {
      //console.log(obj)
      const newArray = data.map((obj) => ({ ...obj }));
      //console.log(newArray)
    // Find the index of the item you want to modify (e.g., item with id 2)
    const index = newArray.findIndex(item => item.id === obj.id);
    //console.log(index)
    if (index !== -1) {
      // Update the value of the specific object
      newArray[index].visible = true;
      //console.log(newArray)
      // Update the state with the modified array
      setData(newArray);
    }
  }
  const closeMenu = (obj) => {
    const newArray = [...data];
    
    // Find the index of the item you want to modify (e.g., item with id 2)
    const index = newArray.findIndex(item => item === obj);
    if (index !== -1) {
      // Update the value of the specific object
      newArray[index].visible = false;

      // Update the state with the modified array
      setData(newArray);
    }
  }
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
     const replaceImage = async(e) => {
    
    if (!mStatus != false) {
    await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: false,
          aspect: [4, 3],
          allowsEditing: true,
          quality: 0.8,
        }).then(async(image) => {
          if (!image.canceled) {
              image.assets.map(async(ite, index) => {
              const result = await Image.compress(
                ite.uri,
                {},
              );
              //console.log(result)
             const updatedItems = data.map(item => (item.post === e.post ? {id: item.id, image: true, post: result, visible: item.visible} : item));
            //image.assets[0].uri
            setData(updatedItems)
                      
            })
            }
        }) 
      }
  }
  const deleteData = (obj) => {
    const updatedItems = data.filter(item => item != obj)
    updatedItems.map((item) => {
      item.id = item.id - 1
    })
    setData(updatedItems)
  }
    const toggleView = {
      borderWidth: 2,
      width: '90%',
      marginLeft: '5%',
      marginRight: '5%',
      borderRadius: 10,
      height: window.innerHeight / 7,
      marginTop: '5%',
      borderColor: '#005278',
      backgroundColor: "#f5f5f5"
    }
    const editText = {
       fontSize: window.innerHeight / 68.7,
    padding: 10,
    paddingTop: 0,
    marginTop: '5%',
    color: "#fafafa",
    textAlign: 'center'
    }
    const input = {
      minHeight: 150,
    borderRadius: 5,
    borderWidth: 0.25,
    padding: 5,
    width: '95%',
    marginLeft: '2.5%',
    fontSize: actualTextSize, 
    textAlign: 'left', 
    color: "#121212", 
    borderColor: "#fafafa",
    }
    const editBottomText = {
      fontSize: window.innerHeight / 68.7,
    padding: 10,
    paddingTop: 0,
    marginTop: 0,
    color: "#fafafa",
    textAlign: 'center'
    }
    const editPostText = {
       fontSize: window.innerHeight / 54.9,
    padding: 10,
    paddingBottom: 0,
    color: "#005278"
    }
    const postLength = {
      fontSize: 12.29,
    paddingBottom: 10,
    paddingTop: 5,
    color: "#fafafa",
    textAlign: 'right',
    marginRight: '5%'
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

const grid = 5;
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
console.log(notificationsExpanded)
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

  console.log("Drawer buttons found:", drawerButtons); // Check if buttons are found

  drawerButtons.forEach(button => {
    let isOpen = false; // Add a variable to track the state

  button.addEventListener('click', () => {
    const drawerContent = button.nextElementSibling; 
    drawerContent.classList.toggle('open'); 

    isOpen = !isOpen; // Toggle the state

    console.log("Drawer content open:", isOpen); 
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
      <ReactModal isOpen={newPostModal} style={{content: {width: '40%',
      left: '50%',
      right: 'auto',
      borderRadius: 10,
      transform: 'translate(-50%, 0)',
      backgroundColor: "#121212",
      marginRight: '-50%',}}}>
        <div>
          <p className='text-white'>New Post</p>
        <div className='divider'/>
      <div>

        <NewPostHeader group={false} data={data} pfp={pfp}/>
        <div style={toggleView}>
          <div style={{flexDirection: 'row', display: 'flex'}}>
         <div style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-evenly', flex: 1}}>
          <>
          <button style={{borderRadius: 10, flexDirection: 'row', display: 'flex', backgroundColor: "#fafafa"}} onClick={handleClick}>
              <PhotoIcon className='postBtn' color='#005278' style={{alignSelf: 'center'}}/>
                <div>
                  <p style={editPostText}>Select Images</p>
                  <p style={postPostText}>up to {5 - (data.filter((item) => item.image == true)).length} images</p>
                </div>
          </button>
          <input type='file' multiple ref={fileInputRef} style={{display: 'none'}} accept="image/*" onChange={handleFileChange}/>
          </>
        <div style={{height: 35, borderWidth: 0.5, alignSelf: 'center', borderColor: "grey"}}/>
        <>
          <button style={{borderRadius: 10, flexDirection: 'row', display: 'flex', backgroundColor: "#fafafa"}} onClick={handleVideoClick}>
              <VideoCameraIcon className='postBtn' color='#005278' style={{alignSelf: 'center'}}/>
                <div>
                  <p style={editPostText}>Select Vid</p>
                  <p style={postPostText}>up to 60 seconds</p>
                </div>
          </button>
          <input type='file' ref={fileVideoInputRef} style={{display: 'none'}} accept="video/*" onChange={handleVideoFileChange}/>
          </>
         </div>
      </div>
      <div className='cursor-pointer' style={{alignItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '-2.5%'}} 
      onClick={() => setTextOpen(true)}>
       <ChatBubbleBottomCenterTextIcon className='postBtn' color='#005278'/>
        <div>
         <p style={editPostText}>What's vibing?</p>
          <p style={postPostText}>Post Text</p>
        </div>
        
      </div>
      
      </div>
       
        <p style={editText}>Hold, drag and drop to change order of your posts</p>
        <p style={editBottomText}>To edit/adjust your post, press the three dots</p>
        {loading ? 
        <div style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
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
                      <img src={item.post} style={{height: 50, width: 50}}/>
                      <p className='text-black self-center pl-6'>Post #{index + 1}</p>
                      <EllipsisVerticalIcon className='postBtn' style={{alignSelf: 'center', marginLeft: 'auto'}} color='#121212'/>
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
      <div style={{flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '5%', marginRight: '5%', paddingBottom: 5}}>
         <>
         <div style={{flexDirection: 'row',display: 'flex', }}>
          <ChatBubbleBottomCenterTextIcon className='postBtn' color='#9edaff' style={{alignSelf: 'center'}}/>
          <p style={editText}>Type your message below</p>
        </div>
          
         </>
      </div>
      <div className='divider'/>
      <>
      <div style={{marginTop: '5%'}}>
        <textarea placeholder={initialText ? initialText.value : "What's Vibing?"} value={text} style={input} onChange={handleText} maxLength={300} />
       {/*  <TextInput placeholder={initialText ? initialText.value : "What's Vibing?"} placeholderTextColor={'grey'} value={text} style={[styles.input, 
        {fontSize: actualTextSize, textAlign: 'left', color: theme.color, backgroundColor: theme.backgroundColor, borderColor: theme.color, fontFamily: 'Montserrat_500Medium'}]} 
              onChangeText={setText} multiline maxLength={300} blurOnSubmit onFocus={handleFocus} onBlur={handleBlur}/> */}
              <p style={postLength}>{text.length}/300</p>
      </div>
      <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'flex-end', marginHorizontal: '10%'}}>
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
      <aside style={style} className={`${expanded || notificationsExpanded ? 'small-side-footer' : !themes ? 'side-footer' : 'side-theme-footer'}`}>
        {!expanded && !notificationsExpanded ?
          <div style={{marginLeft: '25%'}} className='relative hidden lg:inline-grid items-center justify-center h-24 w-24 cursor-pointer'>
                <Image
                  src={require('../assets/DarkMode5.png')} // Make sure this path is correct
                  alt="Your logo description"
                  height={50}
                  width={150}
                />
            </div> : <div className='relative hidden lg:inline-grid h-24 w-24 cursor-pointer'>
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
