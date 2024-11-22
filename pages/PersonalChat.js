import { useAuth } from '@/context/AuthContext';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import React from 'react'
import {useState, useEffect, useRef} from 'react'
import { BeatLoader } from 'react-spinners';
import { onSnapshot, getDoc, doc, getDocs, updateDoc, limit, orderBy, query, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import {HeartIcon as SolidHeart, UserCircleIcon } from '@heroicons/react/24/solid';
import { PhotoIcon, DocumentDuplicateIcon, TrashIcon, FlagIcon, XMarkIcon, HeartIcon} from '@heroicons/react/24/outline';
function PersonalChat({firstName, lastName, pfp, friendId, userName, id, notificationToken}) {
    const [newMessages, setNewMessages] = useState([]);
    const chatContainerRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const router = useRouter();
    const inputRef = useRef(null);
    const [lastMessageId, setLastMessageId] = useState('');
    const [inputText, setInputText] = useState('');
    const [active, setActive] = useState();
    const [singleMessageLoading, setSingleMessageLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    //const {firstName, lastName, pfp, friendId, id} = router.query;
    //console.log(friendId)
    const {user} = useAuth(); 
    //console.log(person)
    const messageText = {
        fontSize: 15.36,
  color: "#fafafa",
    }
    const sendButton = {
    width: 70,
    height: 40,
    alignItems: 'center',
    backgroundColor: '#005278',
    borderRadius: 10,
    }
    const copyText = {
        fontSize: 15.36,
    paddingRight: 10,
    color: "#fafafa",
    }
    const regImage = {
         height: 200,
    width: 200,
    borderRadius: 10,
    resizeMode: 'contain'
    }
    const readRightText = {
        fontSize: 12.29,
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'right',
    marginRight: 20
    }
    const text = {
    fontSize: 15.36, 
    color: "#fafafa",
    alignSelf: 'flex-start',
    textAlign: 'left'
  }
  const userText = {
    fontSize: 15.36,
    color: "#121212",
    textAlign: 'left'
  }
    const copyTextContainer = {
        flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
     display: 'flex'
    }
    const messageContainer = {
        padding: 15,
    paddingVertical: 7.5,
    //margin: '2.5%',
    //maxWidth: 500,
    backgroundColor: '#005278',
    borderRadius: 20,
    marginVertical: 0,
    marginBottom: 0,
    
    }
    const timestamp = {
    fontSize: 12,
    color: '#fafafa',
    marginRight: 'auto',
    marginTop: 5,
  }
  const userTimestamp = {
    fontSize: 12,
    color: '#121212',
    marginTop: 5,
  }
   const profileImage = {
    width: 40,
    height: 40,
    backgroundColor: "#fafafa",
    borderRadius: 20,
    marginRight: 10, // Add spacing between image and text
  }
  const userBubbleStyle = {
    backgroundColor: '#9edaff',
    padding: 10,
    
    margin: 5,
    borderRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 5,
    maxWidth: '100%',
    alignSelf: 'flex-end',
  }
   const bubbleStyle = {
    backgroundColor: '#005278',
    padding: 10,
    
    margin: 5,
    borderRadius: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 20,
    maxWidth: '100%',
    alignSelf: 'flex-start',
   
  };
    const messageUserContainer  = {
      padding: 15,
      marginLeft: '2.5%',
  backgroundColor: 'grey',
  borderRadius: 20,
  display: 'flex', 
  minWidth: 0

    }
    const timestampContainer = { 
    width: '100%',  // Adjust the width as needed
    alignItems: 'flex-end', // Align timestamp to the right
  }
  const userTimestampContainer = {
    width: '100%',
    alignItems: 'flex-start',
  }
  const likeButton = {
  top: 5,
  right: 10, // Default: right side
}
 const userLikeButton = {
  left: 'auto',
  right: 10
}
    const postUsername = {
        fontSize: 15.36,
    alignSelf: 'center',
    paddingLeft: 5,
     color: "#fafafa",
     display: 'flex'
    }
    const imagepfp = {
        height: 33, width: 33, borderRadius: 8, margin: '5%'
    }
    const copyModal = {
        borderRadius: 10,
    backgroundColor: "gray",
    marginRight: '5%',
    marginLeft: '5%',
    marginBottom: '2.5%'
    }
    const captionText = {
        fontSize: 12.29,
    padding: 10,
    color: "#fafafa",
    paddingBottom: 0,
    paddingHorizontal: 5,
    paddingRight: 0,
    //marginTop: '5%'
    }
    const postContainer = {
        margin: '2.5%',
    padding: 5,
    height: 60,
    width: 245,
    borderRadius: 20,
    backgroundColor: "#005278"
    }
    const input = {
      height: 40,
      width: '87.5%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginLeft: '2.5%',
    marginRight: '2.5%',
    flexDirection: 'row',
    display: 'flex'
    }
    const postPostContainer = {
        height: 295, paddingRight: 8.5,
        margin: '2.5%',
    padding: 5,
    width: 245,
    borderRadius: 20,
    backgroundColor: "#005278"
    }
    const postPostUserContainer = {
    height: 295, paddingRight: 8.5,
            margin: '2.5%',
        padding: 5,
        width: 245,
        borderRadius: 20,
        backgroundColor: "grey",
        alignSelf: 'flex-start',
        display: 'flex'
    }
    const addpfp = {
        flexDirection: 'row',
        display: 'flex',
    marginTop: 0,
    margin: '2.5%',
    position: 'relative'
    }
    const pfpstyle = {
        width: 30,
    height: 30,
    borderRadius: 15
    }
    const postUserContainer = {
       margin: '2.5%',
    padding: 5,
    width: 245,
    borderRadius: 20,
    backgroundColor: "grey",
    height: 60, alignSelf: 'flex-start',
    display: 'flex'
    }
    const postThemeContainer = {
        height: 275, paddingRight: 12.5, padding: 7.5,
        margin: '2.5%',
    width: 245,
    borderRadius: 20,
    backgroundColor: "#005278"
    }
    const postThemeUserContainer = {
        backgroundColor: "grey", 
        height: 275, 
        padding: 7.5, 
        paddingRight: 12.5, 
        alignSelf: 'flex-start',
        display: 'flex',
        margin: '2.5%',
    width: 245,
    borderRadius: 20,
    }
    const image = {
        height: 220, width: 223.4375, borderRadius: 8, marginLeft: 5
    }
    const themeImage = {
        height: 220, width: 220, borderRadius: 8, marginLeft: 5
    }
    const postImage = {
        height: 220, width: 223.4375, borderRadius: 8, marginLeft: 5, borderBottomLeftRadius: 0, borderBottomRightRadius: 0
    }
    const textImage = {
        height: 220, width: 223.4375, borderRadius: 8, marginLeft: 5, fontSize: 15.36, width: '95%', color: "#fafafa"
    }
    const TIME_THRESHOLD_MINUTES = 10; // Display timestamp every 10 minutes
let lastTimestampDisplayed = null;
function getCalculatedTime(time) {
    if (time != null) {
      return time.toDate().toLocaleTimeString([], {hour: 'numeric', minute:'numeric'})
    }
    }
    function toggleCopyToTrue(e) {
   const updatedArray = newMessages.map(item => {
      if (item.id === e.id) {
        // Update the "isActive" property from false to true
        return { ...item, copyModal: true, saveModal: false};
      }
      return item;
    });
    setNewMessages(updatedArray) 
  }
  const sendMessage = async() => {
    if (active && inputText.trim() !== '') {
    if (inputText.trim() === '') {
      return;
    }
    const newMessage = {
      text: inputText,
      //user: user.uid,
      //toUser: id
    };
    setSingleMessageLoading(true)
        schedulePushTextNotification(id, firstName, lastName, newMessage, notificationToken)
    const docRef = await addDoc(collection(db, 'friends', friendId, 'chats'), {
        message: newMessage,
        liked: false,
        toUser: id,
        user: user.uid,
        firstName: firstName,
        lastName: lastName,
        pfp: pfp,
        readBy: [],
        timestamp: serverTimestamp()
    })
    addDoc(collection(db, 'friends', friendId, 'messageNotifications'), {
      //message: true,
      id: docRef.id,
      toUser: id,
      readBy: [],
      timestamp: serverTimestamp()
    }).then(async() => await updateDoc(doc(db, 'friends', friendId), {
      lastMessage: newMessage,
      messageId: docRef.id,
      readBy: [],
      active: true,
      toUser: id,
      lastMessageTimestamp: serverTimestamp()
    }
    )).then(async() => await updateDoc(doc(db, 'profiles', user.uid, 'friends', id), {
      lastMessageTimestamp: serverTimestamp()
    })).then(async() => await updateDoc(doc(db, 'profiles', id, 'friends', user.uid), {
      lastMessageTimestamp: serverTimestamp()
    }))
    setInputText('');
    setSingleMessageLoading(false)
    
  }
  else if (!active && inputText.trim() !== 0) {
    window.alert('You must both be following each other first (mutual friends) in order to message!')
  }
}
    function handleMessagePress(item) {
    //console.log(item)
    setTapCount(tapCount + 1);
    //renderLiked(item)
    if (tapCount === 0) {
      // Set a timer for the second tap
      timerRef.current = setTimeout(() => {
        // If no second tap occurs within the timer, treat it as a single tap
        setTapCount(0);
        console.log('Single Tap!');
      }, 500); // Adjust the time limit according to your requirements
    } else if (tapCount === 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      // If it's the second tap and the timer is still active, treat it as a double tap
      clearTimeout(timerRef.current);
      setTapCount(0);
      renderLiked(item)
      
      
    }
  }
  useEffect(() => {
    let unsub;
    unsub = onSnapshot(doc(db, "friends", friendId), (document) => {
        setActive(document.data().active)
      
  });
  return unsub;
  }, [onSnapshot])
    function handleThemePress(item) {
    setTapCount(tapCount + 1);
    console.log(item.message.theme)
    if (tapCount === 0) {
      // Set a timer for the second tap
      timerRef.current = setTimeout(() => {
        // If no second tap occurs within the timer, treat it as a single tap
        setTapCount(0);
        if (item.message.theme.free) {
          navigation.navigate('SpecificTheme', {productId: item.message.theme.id, free: true, purchased: false})
        } 
        
        //console.log('Single Tap!');
      }, 300); // Adjust the time limit according to your requirements
    } else if (tapCount === 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      // If it's the second tap and the timer is still active, treat it as a double tap
      clearTimeout(timerRef.current);
      setTapCount(0);
      renderLiked(item)
    }
  }
  function inputTextFunction(event) {
    setInputText(event.target.value)
  }
  useEffect(() => {
    let unsub;

      const fetchCards = async () => {
  
        unsub = onSnapshot(query(collection(db, 'friends', friendId, 'chats'), orderBy('timestamp', 'desc'), limit(25)), (snapshot) => {
          //console.log(snapshot)
          setMessages(snapshot.docs.map((doc)=> ( {
            id: doc.id,
            ...doc.data(),
            copyModal: false,
            saveModal: false
          })))
          //setLastVisible(snapshot.docs[snapshot.docs.length-1])
        })
      } 

      fetchCards();
      return unsub;
  }, [friendId])
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = 0;
    }
  }, []);
  useEffect(() => {
    if (messages.length > 0) {
      //console.log('first')
      const newArray = [...messages];
      messages.map((item, index) => {
        //console.log(item)
        if (item) {
      if (item.message.post != undefined) {
        //console.log('first')
        if (item.message.post.group != undefined) {
          //console.log(item.message.post)
          const getData = async() => {
          //const docSnap = await getDoc(doc(db, 'groups', item.message.post.group))
            //console.log(docSnap.data())
            newArray[index].message.post = newArray[index].message.post
            //console.log(newArray)
            setNewMessages(newArray)
          
        }

      
          getData()
        }
        if (item.message.post.group == undefined) {
          //console.log('first')
          const getData = async() => {
          const docSnap = await getDoc(doc(db, 'posts', item.message.post))
          if (docSnap.exists()) {
           
            newArray[index].message.post = docSnap.data()
            //console.log(newArray[index])
            setNewMessages(newArray)
            //console.log(newArray[0])
          }
          else {
            newArray[index].message.post = null
            setNewMessages(newArray)
          }
          
        }
        getData()
        }

        //console.log(index)
        
      }
      else if (item.message.theme != undefined) {
        //console.log(item.message.theme.images[0])
        const getData = async() => {
          //const docSnap = await getDoc(doc(db, 'products', item.message.theme.id))
          const themeRef = collection(db, 'products')
                const q = query(themeRef, where('images', 'array-contains', item.message.theme.images[0]))
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                  if (doc.exists()) {
                    newArray[index].message.theme = {...item, id: doc.id, ...doc.data(), purchased: true, free: false}
                  //console.log(newArray)
                  //console.log(newArray)
                  setNewMessages(newArray)
                  }
                  else {
                    newArray[index].message.theme == null
                    setNewMessages(newArray)
                  }
                  //console.log(doc)
                  
                })
        const freeThemeRef = collection(db, 'freeThemes')
                const freeQ = query(freeThemeRef, where('images', 'array-contains', item.message.theme.images[0]))
                const freeQuerySnapshot = await getDocs(freeQ);
                freeQuerySnapshot.forEach((doc) => {
                  if (doc.exists()) {
                    newArray[index].message.theme = {...item, id: doc.id, ...doc.data(), free: true, purchased: false}
                  //console.log(newArray)
                  //console.log(newArray)
                  setNewMessages(newArray)
                  }
                  
                  //console.log(doc)
                  
                }) 
        }
          getData()
      }
      else {
       setNewMessages(newArray)
      }
      //console.log(item)
      //console.log(newArray[0])
    }
    })
    
    }
  }, [messages])
    function getDateAndTime(timestamp) {
      if (timestamp != null) {
      var t = new Date(Date.UTC(1970, 0, 1)); // Epoch
      t.setUTCSeconds(timestamp.seconds);
      const date = new Date(t);
      const yesterday = new Date();
      const twodays = new Date();
      const threedays = new Date();
      const fourdays = new Date();
      const fivedays = new Date();
      const sixdays = new Date();
      const lastWeek = new Date();
      const twoWeeks = new Date();
      const threeWeeks = new Date();
      const fourWeeks = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      twoWeeks.setDate(twoWeeks.getDate() - 14);
      threeWeeks.setDate(threeWeeks.getDate() - 21);
      fourWeeks.setDate(fourWeeks.getDate() - 28);
      twodays.setDate(twodays.getDate() - 2);
      threedays.setDate(threedays.getDate() - 3);
      fourdays.setDate(fourdays.getDate() - 4);
      fivedays.setDate(fivedays.getDate() - 5);
      sixdays.setDate(sixdays.getDate() - 6);
      yesterday.setDate(yesterday.getDate() - 1);
      if  (date.getTime() >= yesterday.getTime()) {
        return `${getCalculatedTime(timestamp)}`
      }
      else if (date.getTime() <= fourWeeks.getTime()) {
        return `${new Date(timestamp.seconds*1000).toLocaleDateString()}`
      }
      else if (date.getTime() <= threeWeeks.getTime()) {
        return `3w ago`
      }
      else if (date.getTime() <= twoWeeks.getTime()) {
        return `2w ago`
      }
      else if (date.getTime() <= lastWeek.getTime()) {
        return `1w ago`
      }
      else if (date.getTime() <= sixdays.getTime()) {
        return `6d ago`
      }
      else if (date.getTime() <= fivedays.getTime()) {
        return `5d ago`
      }
      else if (date.getTime() <= fourdays.getTime()) {
        return `4d ago`
      }
      else if (date.getTime() <= threedays.getTime()) {
        return `3d ago`
      }
      else if (date.getTime() <= twodays.getTime()) {
        return `2d ago`
      }
      else if (date.getTime() <= yesterday.getTime()) {
        return `Yesterday`
      } 
      }
      
    }
  return (
    <div className='flex flex-col h-screen' style={{marginLeft: '30%'}}>
    {newMessages.length >= 0  ? 
            <div className='chatHeader' style={{flexDirection: 'row', display: 'flex'}}>
              {pfp ?  <img src={pfp} style={{height: 45, width: 45, borderRadius: 8, alignSelf: 'center', borderWidth: 1.5, borderColor: '#fafafa'}}/> :
               <UserCircleIcon className='pfpBtn' />
              }
            <p className='min-w-full' style={{fontSize: 15.36, alignSelf: 'center', color: "#fafafa", marginLeft: 15}}>{firstName} {lastName}</p>
            </div>
        : null}
        <div className='divider chat-header' style={{marginLeft: '-2.5%'}}/>
        <div className=' flex mr-16 overflow-y-auto flex-grow flex-col-reverse' ref={chatContainerRef}>
    {newMessages.length > 0 ? 
        newMessages.sort((a, b) => b.timestamp - a.timestamp).map((item, index) => {
            return (    
              item.message.theme!= undefined ? 
            item.message.theme== null ? 
              <div style={item.user == user.uid ? {alignSelf: 'flex-end', marginLeft: 'auto'}: {alignSelf: 'flex-start', display: 'flex', flexDirection: 'row'}}>
                {item.user != user.uid && ( // Only show image for non-user messages
        pfp ? <img src={pfp} style={profileImage} /> : <UserCircleIcon className='userBtn' style={profileImage} />
      )}
              <div style={item.user == user.uid ? userBubbleStyle : bubbleStyle}>
                <p  style={item.user == user.uid ? [postUsername, {color: "#121212"}] : [postUsername, {color: "#fafafa"}]}>Theme unavailable</p>
                
                <div style={item.user != user.uid ? {...timestampContainer, ...userTimestampContainer} : timestampContainer}>
                   {getDateAndTime(item.timestamp) ?  <p style={item.user == user.uid ? userTimestamp : timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
                </div>
            </div>
            
            {lastMessageId == item.id && readBy.includes(item.toUser) && item.user == user.uid && <p style={readReceipt}>Read</p>}
            </div> 
             :
             
            <div style={item.user == user.uid ? {alignSelf: 'flex-end', marginLeft: 'auto'}: {alignSelf: 'flex-start', display: 'flex', flexDirection: 'row'}}>
                {item.user != user.uid && ( // Only show image for non-user messages
        pfp ? <img src={pfp} style={profileImage} /> : <UserCircleIcon className='userBtn' style={profileImage} />
      )}
      <div style={item.user == user.uid ? userPostContainer : postContainer}>
          <button onPress={() => handleThemePress(item)}  activeOpacity={1}
          onLongPress={item.user == user.uid ? () => { setThemeCopied(item); toggleSaveToTrue(item)}: () => {
               setThemeCopied(item); toggleSaveToTrue(item)
            }}>
                <div style={{flexDirection: 'row', alignItems: 'center', display: 'flex',}}>
                    
                    <div style={{alignSelf: 'center', paddingTop: 5}}>
                      <p  style={item.user == user.uid ? [postUsername, {color: "#121212"}] : [postUsername, {color: "#fafafa"}]}>Theme: {item.message.theme.name}</p>
                    </div>
                </div>
                <div style={{ marginTop: '5%'}}>
                {item.message.theme.images[0] ?  <img src={item.message.theme.images[0]} style={image}/> :
               <PhotoIcon className='btn' style={image}/>
               
              }
              </div>
            </button>
            <div style={item.user != user.uid ? {...timestampContainer, ...userTimestampContainer} : timestampContainer}>
                   {getDateAndTime(item.timestamp) ?  <p style={item.user == user.uid ? userTimestamp : timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
                </div>
              
                        <button style={item.user == user.uid ? userLikeButton : likeButton} onPress={item.user != user.uid ? () => renderLiked(item) : null}>
                            {item.liked ? <SolidHeart className='btn' style={{color: 'red'}} /> : <SolidHeart className='btn' style={{color: 'grey'}} />}
                            </button>
            </div>
           
            {item.message.text.length > 0 ? 
             <div style={item.user == user.uid ? {alignSelf: 'flex-end', marginLeft: 'auto'}: {alignSelf: 'flex-start', flexDirection: 'row', display: 'flex',}}>
                {item.user != user.uid && ( // Only show image for non-user messages
        pfp ? <img src={pfp} style={profileImage} /> : <UserCircleIcon className='userBtn' style={profileImage} />
      )}
            <div style={item.user == user.uid ? userBubbleStyle : bubbleStyle}>
              <button activeOpacity={1}  onPress={() => handleMessagePress(item)}
              onLongPress={() => {toggleCopyToTrue(item); setTextCopied(item.message.text); setReplyTo(item.user == user.uid ? user.uid : userName)}}>
                {item.message.text !== "" ?
                <>
                
                <p  style={item.user == user.uid ? userText : text}>{item.message.text}</p>
                
                </> : null}
                 
              </button> 
              <div style={item.user != user.uid ? {...timestampContainer, ...userTimestampContainer} : timestampContainer}>
                   {getDateAndTime(item.timestamp) ?  <p style={item.user == user.uid ? userTimestamp : timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
                </div>
                        <button style={item.user == user.uid ? userLikeButton : likeButton} onPress={item.user != user.uid ? () => renderLiked(item) : null}>
                            {item.liked ? <SolidHeart className='btn' style={{color: 'red'}} /> : <SolidHeart className='btn' style={{color: 'grey'}} />}
                            </button>
            </div> 
            </div>
            : null}
            {(item.saveModal && item.user == user.uid) || (item.saveModal && !reportedContent.includes(item.id)) ?  
          <div style={copyModal}>
            {item.user == user.uid ? <>
                <button style={copyTextContainer} onPress={() => deleteMessage(item)}>
                  <p  style={copyText}>Delete Message</p>
                  <TrashIcon className='btn' style={{alignSelf: 'center'}} />
                </button>
                <div className='divider' />
                </>
                : null}
                {!reportedContent.includes(item.id) ? 
                <>
                <button style={copyTextContainer} onPress={() => navigation.navigate('ReportPage', {id: item.id, video: false, theme: false, comment: null, cliqueId: null, post: false, comments: false, message: true, cliqueMessage: false, reportedUser: item.user})}>
                  <p  style={copyText}>Report</p>
                  <FlagIcon className='btn' style={{alignSelf: 'center'}} />
                </button> 
                <div className='divider' />
                </>
                : null}
                <button style={copyTextContainer} onPress={() => toggleSaveToFalse(item)}>
                  <p  style={copyText}>Cancel</p>
                  <XMarkIcon className='btn' style={{alignSelf: 'center'}} />
                </button>
              </div> 
          : null}
            {lastMessageId == item.id && readBy.includes(item.toUser) && item.user == user.uid && <p style={readReceipt}>Read</p>}
            </div>
            :
            item.message.post == undefined && item.message.text !== "" ? 
            <div >
            { 
            item.message.text != undefined ?
            <div style={ item.user == user.uid ? { display: 'flex', justifyContent: 'flex-end' } : { display: 'flex', justifyContent: 'flex-start' }}>
              <div style={item.user == user.uid ? {alignSelf: 'flex-end'}: {alignSelf: 'flex-start', flexDirection: 'row', display: 'flex',}}>
                {item.user != user.uid && ( // Only show image for non-user messages
        pfp ? <img src={pfp} style={profileImage} /> : <UserCircleIcon className='userBtn' style={profileImage} />
      )}
            <div style={item.user == user.uid ? userBubbleStyle : bubbleStyle}>
              <button style={{alignItems: 'flex-end'}} activeOpacity={1}  onPress={() => handleMessagePress(item)}
              onLongPress={() => {toggleCopyToTrue(item); setTextCopied(item.message.text);}}>
                {item.message.text !== "" ?
                
                <p  style={item.user == user.uid ? userText : text}>{item.message.text}</p>
                
                : null}
             
              </button> 
              <div className='flex'>
              <div style={item.user != user.uid ? {...timestampContainer, ...userTimestampContainer} : timestampContainer}>
                   {getDateAndTime(item.timestamp) ?  <p style={item.user == user.uid ? userTimestamp : timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
                </div>
                        <button style={item.user == user.uid ? userLikeButton : likeButton} onPress={item.user != user.uid ? () => renderLiked(item) : null}>
                            {item.liked ? <SolidHeart className='btn' style={{color: 'red'}} /> : <SolidHeart className='btn' style={{color: 'grey'}} />}
                            </button>
                            </div>
        </div>
             {lastMessageId == item.id && readBy.includes(item.toUser) && item.user == user.uid && <p style={readReceipt}>Read</p>}
            </div>
            </div> : null
            }
            
            {
              item.copyModal ?
              <div style={copyModal}>
                <button style={copyTextContainer} onPress={() => copyFunction(item)}>
                  <p  style={copyText}>Copy</p>
                  <DocumentDuplicateIcon style={{alignSelf: 'center'}} className='btn'/>
                </button>
                <div className='divider' />
                {item.user == user.uid ? <>
                <button style={copyTextContainer} onPress={() => deleteMessage(item)}>
                  <p  style={copyText}>Delete Message</p>
                  <TrashIcon className='btn' style={{alignSelf: 'center'}} />
                </button>
                <div className='divider' />
                </>
                : null}
               {!reportedContent.includes(item.id) ? 
                <>
                <button style={copyTextContainer} onPress={() => navigation.navigate('ReportPage', {id: item.id, video: false, theme: false, comment: null, cliqueId: null, post: false, comments: false, message: true, cliqueMessage: false, reportedUser: item.user})}>
                  <p  style={copyText}>Report</p>
                  <FlagIcon className='btn' style={{alignSelf: 'center'}} />
                </button> 
                <div className='divider' />
                </>
                : null}
                <button style={copyTextContainer} onPress={() => toggleCopyToFalse(item)}>
                  <p  style={copyText}>Cancel</p>
                  <XMarkIcon className='btn' style={{alignSelf: 'center'}} />
                </button>
              </div> 
              :
               <div style={{margin: '2.5%'}}>
          <button activeOpacity={1}  onPress={() => handleImagePress(item)} onLongPress={() => {toggleSaveToTrue(item); setImageCopied(item.message.image)}}>
            {
            item.message.image != undefined ? 
            <div style={item.user == user.uid ? {alignSelf: 'flex-end', marginLeft: 'auto'}: {alignSelf: 'flex-start', flexDirection: 'row', display: 'flex',}}>
                {item.user != user.uid && ( // Only show image for non-user messages
        pfp ? <img src={pfp} style={profileImage} /> : <UserCircleIcon className='userBtn' style={profileImage} />
      )}
            
            
            <img src={item.message.image} style={regImage}/>
     
            {lastMessageId == item.id && readBy.includes(item.toUser) && item.user == user.uid && <p style={readReceipt}>Read</p>}
            {(item.saveModal && item.user == user.uid) || (item.saveModal && !reportedContent.includes(item.id)) ?  
          <div style={copyModal}>
            {item.user == user.uid ? <>
                <button style={copyTextContainer} onPress={() => deleteMessage(item)}>
                  <p  style={copyText}>Delete Message</p>
                  <TrashIcon className='btn' style={{alignSelf: 'center'}} />
                </button>
                <div className='divider' />
                </>
                : null}
                {!reportedContent.includes(item.id) ? 
                <>
                <button style={copyTextContainer} onPress={() => navigation.navigate('ReportPage', {id: item.id, video: false, theme: false, comment: null, cliqueId: null, post: false, comments: false, message: true, cliqueMessage: false, reportedUser: item.user})}>
                  <p  style={copyText}>Report</p>
                  <FlagIcon className='btn' style={{alignSelf: 'center'}} />
                </button> 
                <div className='divider' />
                </>
                : null}
                <button style={copyTextContainer} onPress={() => toggleSaveToFalse(item)}>
                  <p style={copyText}>Cancel</p>
                  <XMarkIcon className='btn' style={{alignSelf: 'center'}} />
                </button>
              </div> 
          : null}
            </div>
            : null}
          </button>
          </div>
            }
            </div> :
          item.message.post != undefined && item.message.post == null ? 
              <div style={item.user == user.uid ? {alignSelf: 'flex-end', marginLeft: 'auto'}: {alignSelf: 'flex-start', flexDirection: 'row', display: 'flex',}}>
                {item.user != user.uid && ( // Only show image for non-user messages
        pfp ? <img src={pfp} style={profileImage} /> : <UserCircleIcon className='userBtn' style={profileImage} />
      )}
              <div style={item.user == user.uid ? userBubbleStyle : bubbleStyle}>
                <p  style={item.user == user.uid ? [postUsername, {color: "#121212"}] : [postUsername, {color: "#fafafa"}]}>Post unavailable</p>
                <div style={item.user != user.uid ? {...timestampContainer, ...userTimestampContainer} : timestampContainer}>
                   {getDateAndTime(item.timestamp) ?  <p style={item.user == user.uid ? userTimestamp : timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
                </div>
            </div>
            
            {lastMessageId == item.id && readBy.includes(item.toUser) && item.user == user.uid && <p style={readReceipt}>Read</p>}
            </div> 
             : 
          item.message.post != undefined && item.message.post.multiPost == true  ? 
          <div style={{flexDirection: 'column'}}>
           <div style={item.user == user.uid ? {alignSelf: 'flex-end', marginLeft: 'auto'}: {alignSelf: 'flex-start', flexDirection: 'row', display: 'flex',}}>
                {item.user != user.uid && ( // Only show image for non-user messages
        pfp ? <img src={pfp} style={profileImage} /> : <UserCircleIcon className='userBtn' style={profileImage} />
      )}
      <div style={item.user == user.uid ? userPostContainer : postContainer}>
            <button  activeOpacity={1} onPress={() => handlePostPress(item)}
          onLongPress={item.user == user.uid ? () => { setUserCopied(item.message.post.username); toggleSaveToTrue(item); }: () => {
               setUserCopied(item.message.post.username); toggleSaveToTrue(item);
            }}>
                <div style={{flexDirection: 'row', display: 'flex',}}>
                  {item.message.post.pfp ?  <img src={item.message.post.pfp} style={imagepfp}/> :
               <UserCircleIcon className='userBtn' style={imagepfp}/>
              }
                    <p  style={item.user == user.uid ? [postUsername, {color: "#121212"}] : [postUsername, {color: "#fafafa"}]}>@{item.message.post.username}</p>
                </div>
                 {item.message.post.post[0].image ?
                      <img src={item.message.post.post[0].post} style={image}/>: item.message.post.post[0].video ?
                      <img src={item.message.post.post[0].thumbnail} style={image}/> : 
                    <div style={{marginTop: -5}}>
          <ChatBubble bubbleColor='#fff' tailColor='#fff'>
         <p  style={image}>{item.message.post.post[0].value}</p>
        </ChatBubble>
        </div>
                    
                     }
                {item.message.post.caption.length > 0 ? 
                <div style={{width: '90%'}}>
                  <p  numberOfLines={1} style={item.user == user.uid ? [captionText, {color: "#121212"}] : [captionText, {color: "#fafafa"}]}>{item.message.post.username} - {item.message.post.caption}</p> 
                </div>
                : null}
                </button> 
            <div style={item.user != user.uid ? {...timestampContainer, ...userTimestampContainer} : timestampContainer}>
                   {getDateAndTime(item.timestamp) ?  <p style={item.user == user.uid ? userTimestamp : timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
                </div>
              
                        <button style={item.user == user.uid ? userLikeButton : likeButton} onPress={item.user != user.uid ? () => renderLiked(item) : null}>
                            {item.liked ? <SolidHeart className='btn' style={{color: 'red'}} /> : <SolidHeart className='btn' style={{color: 'grey'}} />}
                            </button>
            </div>
                  </div>
            {item.message.text.length > 0 ? 
            <div style={item.user == user.uid ? {alignSelf: 'flex-end', marginLeft: 'auto'}: {alignSelf: 'flex-start', flexDirection: 'row', display: 'flex',}}>
                {item.user != user.uid && ( // Only show image for non-user messages
        pfp ? <img src={pfp} style={profileImage} /> : <UserCircleIcon className='userBtn' style={profileImage} />
      )}
            <div style={item.user == user.uid ? userBubbleStyle : bubbleStyle}>
              <button activeOpacity={1}  onPress={() => handleMessagePress(item)}
              onLongPress={() => {toggleCopyToTrue(item); setTextCopied(item.message.text); setReplyTo(item.user == user.uid ? user.uid : userName)}}>
                {item.message.text !== "" ?
                <>
                
                <p  style={item.user == user.uid ? userText : text}>{item.message.text}</p>
                
                </> : null}
               
              </button> 
              <div style={item.user != user.uid ? {...timestampContainer, ...userTimestampContainer} : timestampContainer}>
                   {getDateAndTime(item.timestamp) ?  <p style={item.user == user.uid ? userTimestamp : timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
                </div>
                        <button style={item.user == user.uid ? userLikeButton : likeButton} onPress={item.user != user.uid ? () => renderLiked(item) : null}>
                            {item.liked ? <SolidHeart className='btn' style={{color: 'red'}} /> : <SolidHeart className='btn' style={{color: 'grey'}} />}
                            </button>
              
            </div> 
            </div>
            
            : null}
            
            {(item.saveModal && item.user == user.uid) || (item.saveModal && !reportedContent.includes(item.id)) ?  
          <div style={copyModal}>
            {item.user == user.uid ? <>
                <button style={copyTextContainer} onPress={() => deleteMessage(item)}>
                  <p  style={copyText}>Delete Message</p>
                  <TrashIcon className='btn' style={{alignSelf: 'center'}} />
                </button>
                <div className='divider' />
                </>
                : null}
                {!reportedContent.includes(item.id) ? 
                <>
                <button style={copyTextContainer} onPress={() => navigation.navigate('ReportPage', {id: item.id, video: false, theme: false, comment: null, cliqueId: null, post: false, comments: false, message: true, cliqueMessage: false, reportedUser: item.user})}>
                  <p  style={copyText}>Report</p>
                  <FlagIcon className='btn' style={{alignSelf: 'center'}} />
                </button> 
                <div className='divider' />
                </>
                : null}
                <button style={copyTextContainer} onPress={() => toggleSaveToFalse(item)}>
                  <p  style={copyText}>Cancel</p>
                  <XMarkIcon className='btn' style={{alignSelf: 'center'}} />
                </button>
              </div> 
          : null}
            
            
            
            {lastMessageId == item.id && readBy.includes(item.toUser) && item.user == user.uid && <p style={readReceipt}>Read</p>}
          </div> 
          : 
          item.message.post != null && item.message.post.group ? 
         <>
         <div style={item.user == user.uid ? [postContainer, {height: 275, padding: 7.5, paddingRight: 12.5}] : [postContainer, {backgroundColor: "grey", alignSelf: 'flex-start'}]} >
          <button activeOpacity={1} onPress={() => handleGroupPress(item)} onLongPress={item.user == user.uid ? () => {  toggleSaveToTrue(item) }: () => {
               toggleSaveToTrue(item)

            }}>
                <div style={{flexDirection: 'row', alignItems: 'center', display: 'flex',}}>
                    
                    <div style={{alignSelf: 'center', paddingTop: 5}}>
                      <p  style={item.user == user.uid ? [postUsername, {color: "#121212"}] : [postUsername, {color: "#fafafa"}]}>Cliq: {item.message.post.name}</p>
                    </div>
                </div>
                <div style={{ marginTop: '5%'}}>
                {item.message.post ? item.message.post.pfp ?  <img src={item.message.post.pfp} style={image}/> :
               <UserCircleIcon className='userBtn' style={image}/> : <UserCircleIcon className='userBtn' style={image}/> 
               
              }
              </div>
            </button>
            
            </div>

            {item.message.text.length > 0 ? 
            <div style={item.user == user.uid ? {alignSelf: 'flex-end', marginLeft: 'auto', width: 400}: {alignSelf: 'flex-start', flexDirection: 'row', width: 400, display: 'flex',}}>
                {item.user != user.uid && ( // Only show image for non-user messages
        pfp ? <img src={pfp} style={profileImage} /> : <UserCircleIcon className='userBtn' style={profileImage} />
      )}
            <div style={item.user == user.uid ? userBubbleStyle : bubbleStyle}>
              <button activeOpacity={1}  onPress={() => handleMessagePress(item)}
              onLongPress={() => {toggleCopyToTrue(item); setTextCopied(item.message.text); setReplyTo(item.user == user.uid ? user.uid : userName)}}>
                {item.message.text !== "" ?
                <>
                
                <p  style={item.user == user.uid ? userText : text}>{item.message.text}</p>
                
                </> : null}
              
              </button> 
               <div style={item.user != user.uid ? {...timestampContainer, ...userTimestampContainer} : timestampContainer}>
                   {getDateAndTime(item.timestamp) ?  <p style={item.user == user.uid ? userTimestamp : timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
                </div>
                        <button style={item.user == user.uid ? userLikeButton : likeButton} onPress={item.user != user.uid ? () => renderLiked(item) : null}>
                            {item.liked ? <SolidHeart className='btn' style={{color: 'red'}} /> : <SolidHeart className='btn' style={{color: 'grey'}} />}
                            </button>
            </div> 
            </div>
            : null}
            {(item.saveModal && item.user == user.uid) || (item.saveModal && !reportedContent.includes(item.id)) ?  
          <div style={copyModal}>
            {item.user == user.uid ? <>
                <button style={copyTextContainer} onPress={() => deleteMessage(item)}>
                  <p  style={copyText}>Delete Message</p>
                  <TrashIcon className='btn' style={{alignSelf: 'center'}} />
                </button>
                <div className='divider' />
                </>
                : null}
                {!reportedContent.includes(item.id) ? 
                <>
                <button style={copyTextContainer} onPress={() => navigation.navigate('ReportPage', {id: item.id, video: false, theme: false, comment: null, cliqueId: null, post: false, comments: false, message: true, cliqueMessage: false, reportedUser: item.user})}>
                  <p  style={copyText}>Report</p>
                  <FlagIcon className='btn' style={{alignSelf: 'center'}} />
                </button> 
                <div className='divider' />
                </>
                : null}
                <button style={copyTextContainer} onPress={() => toggleSaveToFalse(item)}>
                  <p  style={copyText}>Cancel</p>
                  <XMarkIcon className='btn' style={{alignSelf: 'center'}} />
                </button>
              </div> 
          : null}
            {lastMessageId == item.id && readBy.includes(item.toUser) && item.user == user.uid && <p style={readReceipt}>Read</p>}

          </> 
          : <></>
            )
        
        })
        : null
      } 
      </div>
      {!uploading ? 
      <div style={newMessages.length == 0 ? {flexDirection: 'row', display: 'flex', marginLeft: '-2%', position: 'sticky', bottom: 0, marginTop: '5%'} : {marginBottom: '5%', marginLeft: '-2%', bottom: 50, position: 'sticky', display: 'flex', flexDirection: 'row'}}>
        <div style={inputText.length > 0 ? {...input, width: '80%'} : input}>
          <input maxLength={200} ref={inputRef} style={{width: '95%', marginLeft: '1%', backgroundColor: "#121212", color: "#fafafa", padding: 5, alignSelf: 'center'}} placeholder='Type message...' value={inputText} onChange={async(event) => {
            const text = event.target.value
              const sanitizedText = text.replace(/\n/g, ''); // Remove all new line characters
              setInputText(sanitizedText); 
              if (text.length > 0) {
              await updateDoc(doc(db, 'profiles', user.uid), {
              messageTyping: id
            })
            }
            else {
              await updateDoc(doc(db, 'profiles', user.uid), {
              messageTyping: ''
            })
            }
          }}/>
          {inputText.length == 0 ? <>
          <PhotoIcon className='btn' style={{alignSelf: 'center', margin: 5}} />
          </> : null }
        
        </div>
        {!singleMessageLoading || !uploading ?
                inputText.length > 0 ? <button style={sendButton} onPress={ () => {sendMessage()}}>
          <span className='text-white font-bold'>Send</span>
        </button> : null
                : 
                <div style={{ flex: 1, alignItems: 'center', marginTop: '2.5%'}}>
                <BeatLoader style={{alignSelf: 'center'}} color='#9edaff'/>
                </div>
                }
        
        {/*  */}
        </div> 
        : 
        <BeatLoader color={"#9edaff"}/>}
      </div>
  )
}

export default PersonalChat