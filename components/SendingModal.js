import React, {useMemo, useState} from 'react'
import ReactModal from 'react-modal'
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/solid'
import { onSnapshot, query, collection, orderBy, where, addDoc, limit, getDoc, doc, setDoc, updateDoc, serverTimestamp, arrayUnion } from 'firebase/firestore'
import { db } from '@/firebase'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { styles } from '@/styles/styles'
import { BeatLoader } from 'react-spinners'
import { fetchLimitedFriendsInfo } from '@/firebaseUtils'
function SendingModal({sendingModal, closeSendingModal, followers, following, user, payload,
    payloadUsername, post, video, theme}) {
    const handleClose = () => {
        closeSendingModal()
    }
    const [friends, setFriends] = useState([]);
    const [actuallySending, setActuallySending] = useState(false);
    const [friendsInfo, setFriendsInfo] = useState([]);
    const [caption, setCaption] = useState('');
    const [alert, setAlert] = useState('');
    const [ableToShare, setAbleToShare] = useState(true);
    const [completeFriends, setCompleteFriends] = useState([]);
    const [sendLoading, setSendLoading] = useState(false);
    useMemo(()=> {
      setFriends([])
      let unsub;
      const fetchCards = async () => {
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'friends'), where('actualFriend', '==', true), orderBy('lastMessageTimestamp', 'desc'), limit(20)), (snapshot) => {
          console.log(snapshot.docs.length)
          setFriends(snapshot.docs.filter((doc => followers.includes(doc.id) && following.includes(doc.id))).map((doc)=> ( {
            id: doc.id,
            ...doc.data()
          })))
        })
       
      } 
      fetchCards();
      return unsub;
    }, [followers, following]);
    useMemo(() => {
      const fetchFriends = async() => {
        const completeFriendsArray = await fetchLimitedFriendsInfo(friends);
        setCompleteFriends(completeFriendsArray)
      } 
      fetchFriends();
    }, [friends])
    useMemo(() => {
      if (friends.length > 0) {
        Promise.all(friends.map(async(item) => await getDoc(doc(db, 'profiles', item.id))))
      .then(snapshots => {
        setFriendsInfo(snapshots.map(snapshot => ({id: snapshot.id, ...snapshot.data(), checked: false})))
      })
      .catch(error => {
        // Handle errors
      });
      }
    }, [friends])
    function sendMessage() { // add to firebaseUtils later
      if (ableToShare) {
        setSendLoading(true)
        Promise.all(friendsInfo.map(async(item) => {
        if (item.checked == true && payload && video && !theme) {
          const friendId = completeFriends.filter((element) => element.id.includes(item.id))
          const docRef = await addDoc(collection(db, 'friends', friendId[0].id, 'chats'), {
        message: {post: payload, userName: payloadUsername, text: caption},
        liked: false,
        toUser: item.id,
        user: user.uid,
        firstName: item.firstName,
        video: true,
        lastName: item.lastName,
        pfp: item.pfp,
        indirectReply: false,
        indirectReplyTo: "",
        readBy: [],
        timestamp: serverTimestamp()
    })
    addDoc(collection(db, 'friends', friendId[0].id, 'messageNotifications'), {
      //message: true,
      id: docRef.id,
      readBy: [],
      timestamp: serverTimestamp()
    }).then(async() => await updateDoc(doc(db, 'profiles', item.id), {
      messageNotifications: arrayUnion({id: docRef.id, user: user.uid})
    })).then(async() => await updateDoc(doc(db, 'friends', friendId[0].id), {
      lastMessage: {post: payload, userName: payloadUsername, text: caption},
      messageId: docRef.id,
      readBy: [],
      video: true,
      active: true,
      lastMessageTimestamp: serverTimestamp()
    }
    )).then(() => setActuallySending(false)).then(() => setAlert(true)).then(() => setSendLoading(false)) // add notification later
        } 
        else if (item.checked == true && payload && !video && !theme) {
          const friendId = completeFriends.filter((element) => element.id.includes(item.id))
          const docRef = await addDoc(collection(db, 'friends', friendId[0].id, 'chats'), {
        message: {post: payload, userName: payloadUsername, text: caption},
        liked: false,
        toUser: item.id,
        user: user.uid,
        firstName: item.firstName,
        lastName: item.lastName,
        pfp: item.pfp,
        indirectReply: false,
        indirectReplyTo: "",
        readBy: [],
        timestamp: serverTimestamp()
    })
    addDoc(collection(db, 'friends', friendId[0].id, 'messageNotifications'), {
      //message: true,
      id: docRef.id,
      readBy: [],
      timestamp: serverTimestamp()
    }).then(async() => await updateDoc(doc(db, 'profiles', item.id), {
      messageNotifications: arrayUnion({id: docRef.id, user: user.uid})
    })).then(async() => await updateDoc(doc(db, 'friends', friendId[0].id), {
      lastMessage: {post: payload, userName: payloadUsername, text: caption},
      messageId: docRef.id,
      readBy: [],
      active: true,
      lastMessageTimestamp: serverTimestamp()
    }
    )).then(() => setActuallySending(false)).then(() => setAlert(true)).then(() => setSendLoading(false)) // add notification later
        } 
      else if (item.checked == true && theme && payload) {
        const friendId = completeFriends.filter((element) => element.id.includes(item.id))
          const docRef = await addDoc(collection(db, 'friends', friendId[0].id, 'chats'), {
       message: {theme: payload, text: caption},
        liked: false,
        toUser: item.id,
        user: user.uid,
        firstName: item.firstName,
        lastName: item.lastName,
        pfp: item.pfp,
        indirectReply: false,
        indirectReplyTo: "",
        readBy: [],
        timestamp: serverTimestamp()
    })
    addDoc(collection(db, 'friends', friendId[0].id, 'messageNotifications'), {
      //message: true,
      id: docRef.id,
      toUser: item.id,
      readBy: [],
      timestamp: serverTimestamp()
    }).then(async() => await updateDoc(doc(db, 'profiles', item.id), {
      messageNotifications: arrayUnion({id: docRef.id, user: user.uid})
    })).then(async() => await setDoc(doc(db, 'friends', friendId[0].id), {
      lastMessage: {theme: theme, text: caption},
      messageId: docRef.id,
      readBy: [],
      active: true,
      lastMessageTimestamp: serverTimestamp()
    }
    )).then(() => setActuallySending(false)).then(() => setAlert(true)).then(() => setSendLoading(false)).then(() => schedulePushThemeNotification(person, friendId[0].id, profile.firstName, profile.lastName, person.notificationToken))
      }
      }))
      
      }
      else {
       window.alert('Post unavailable to share')
      }
      
    }
    const renderChecked = (id) => {

        
        let list = friendsInfo
      //console.log(list[id])
      let index = list.indexOf(id)
      //console.log(index)
      list[index].checked = !list[index].checked
      const result = friends.filter((element) => 
      {if (element.friendId != undefined) {
        return element.friendId.includes(list[index].id)
      }
      })
      //console.log(result[0].friendId)
      if (list[index].checked) {
        setActuallySending(true)
      }
      else {
        setActuallySending(false)
      }
      var newList = list.slice()
      setFriendsInfo(newList)
      
      
    }
      const handleCaption = (event) => {
    setCaption(event.target.value)
}
  return (
    <ReactModal isOpen={sendingModal} style={{content: styles.modalContainer}}>
         <div className='flex flex-col'>
          {alert ? 
          <div className='flex justify-center items-center'>
            <span className='text-white text-3xl'>Your Message has been Sent!</span>
          </div>  
            :
          <>
        <div style={styles.closeSend}>
            <p style={styles.header}>Send To: </p>
            <XMarkIcon className='btn' onClick={() => handleClose()}/>
        </div>
        <div className='flex flex-row flex-wrap'>
          {friendsInfo.length > 0 ? friendsInfo.map((item, index) => {
            return (
              <div key={index} style={styles.sendingFriendsContainer}>
                <div className='cursor-pointer items-center flex flex-col'  onClick={() => renderChecked(item)}>
                  {item.pfp ? <img src={item.pfp} style={styles.sendingFriendPfp}/> : 
                  <UserCircleIcon className='userBtn' style={styles.sendingFriendPfp}/>}
                    {item.checked ? <CheckIcon color='#9edaff' className='btn' style={styles.sendingCheck}/> : null}
                    {!item.checked ? <p style={styles.usernameTextSending} className='numberOfLines1'>{item.userName}</p> 
                    : <p style={styles.usernameTextSendingChecked} className='numberOfLines1'>{item.userName}</p>}
                    
                </div>
              </div>
            )
          }) :
          <div className='items-center justify-center flex align-middle'>
            <p className='text-white self-center'>No friends to send to yet!</p>
          </div>
          }
        </div>
      {actuallySending ?
      <div style={styles.addCommentSecondContainer} className='bg-black flex flex-col items-center absolute bottom-0 w-full'>
            <textarea style={styles.sendingInput} placeholder='Add Message...' className='text-white' maxLength={200} value={caption} onChange={handleCaption}/>
            {sendLoading ? <BeatLoader color={"#9edaff"} style={{alignSelf: 'center'}}/> :
            <button style={styles.sendingButton} onClick={() => sendMessage()}>
              <p style={styles.sendText}>Send</p>
          </button>}
          </div> : null}
      </>
    }
    </div>
    
      </ReactModal>
  )
}

export default SendingModal