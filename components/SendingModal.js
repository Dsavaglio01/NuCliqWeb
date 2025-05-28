import React, {useMemo, useState} from 'react'
import ReactModal from 'react-modal'
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/solid'
import { onSnapshot, query, collection, orderBy, where, limit, getDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { styles } from '@/styles/styles'
function SendingModal({sendingModal, closeSendingModal, followers, following, user, post, video, theme}) {
    const handleClose = () => {
        closeSendingModal()
    }
    const [friends, setFriends] = useState([]);
    const [actuallySending, setActuallySending] = useState(false);
    const [friendsInfo, setFriendsInfo] = useState([]);
    const [caption, setCaption] = useState('');
    useMemo(()=> {
      setFriends([])
      let unsub;
      const fetchCards = async () => {
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'friends'), where('actualFriend', '==', true), orderBy('lastMessageTimestamp', 'desc'), limit(20)), (snapshot) => {
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
      if (friends.length > 0) {
        Promise.all(friends.map(async(item) => await getDoc(doc(db, 'profiles', item.id))))
      .then(snapshots => {
        setFriendsInfo(snapshots.map(snapshot => ({id: snapshot.id, ...snapshot.data(), checked: false})))
        //console.log(snapshots.map(snapshot => snapshot.data()))
        //const documents = snapshots.map(snapshot => snapshot.data());
        // Process the fetched documents here
      })
      .catch(error => {
        // Handle errors
      });
      }
    }, [friends])
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
console.log(friendsInfo)
  return (
    <ReactModal isOpen={sendingModal} style={{content: styles.modalContainer}}>
         <div className='flex flex-col'>
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
          }) : <p>No friends to send to yet!</p>}
        </div>
      {actuallySending ?
      <div style={styles.addCommentSecondContainer} className='bg-black flex flex-col items-center absolute bottom-0 w-full'>
            <textarea style={styles.sendingInput} placeholder='Add Message...' className='text-white' maxLength={200} value={caption} onChange={handleCaption}/>
          <button style={styles.sendingButton}>
              <p style={styles.sendText}>Send</p>
          </button>
          </div> : null}
    </div>
      </ReactModal>
  )
}

export default SendingModal