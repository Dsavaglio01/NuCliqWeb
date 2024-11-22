import React, {useMemo, useState} from 'react'
import ReactModal from 'react-modal'
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/solid'
import { onSnapshot, query, collection, orderBy, where, limit, getDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import { UserCircleIcon } from '@heroicons/react/24/outline'
const styles = { 
    header: {
        fontSize: 19.20,
        color: "#fafafa",
        marginLeft: '42.5%'
    },
    usernameTextSending: {
        fontSize: 12.29,
        color: "#fafafa",
        alignSelf: 'center',
        padding: 5
    },
    usernameTextSendingChecked: {
        fontSize: 12.29,
        color: "#fafafa",
        marginTop: -27.5,
        alignSelf: 'center',
        padding: 5
    },
     addCommentSecondContainer: {
        marginBottom: '10%',
        marginLeft: '-5%',
        backgroundColor: "#121212",
        width: '105%',
        borderColor: "#fafafa"
    },
    input: {
        borderTopWidth: 0.25,
      width: '95%',
     // marginLeft: 0,
      padding: 15,
      backgroundColor: "#121212",
      margin: '2.5%',
      marginTop: 0,
      paddingBottom: 0,
      marginBottom: 0,
      borderColor: "#fafafa",
      color: "#fafafa"
    }
}
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
  return (
    <ReactModal isOpen={sendingModal} style={{content: {width: '40%',
      left: '50%',
      right: 'auto',
      borderRadius: 10,
      transform: 'translate(-50%, 0)',
      backgroundColor: "#121212",
      marginRight: '-50%',}}}>
         <div className='flex flex-col'>
        <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-between', marginHorizontal: '5%'}}>
            <p style={styles.header}>Send To: </p>
            <XMarkIcon className='btn' onClick={() => handleClose()}/>
        </div>
        <div className='flex flex-row flex-wrap'>
        {friendsInfo.map((item, index) => {
            return (
                <div key={index} style={{width: '30%', margin: 5, alignItems: 'center', justifyContent: 'center'}}>
            <div className='cursor-pointer items-center flex flex-col'  onClick={() => renderChecked(item)}>
              {item.pfp ? <img src={item.pfp} style={{height: 55, width: 55, borderRadius: 55, alignSelf: 'center'}}/> : 
              <UserCircleIcon className='userBtn' style={{height: 55, width: 55, borderRadius: 55, alignSelf: 'center'}}/>}
                
                {item.checked ? <CheckIcon color='#9edaff' className='btn' style={{position: 'relative', bottom: 20, left: 80}}/> : null}
                {!item.checked ? <p style={styles.usernameTextSending} className='numberOfLines1'>{item.userName}</p> 
                : <p style={styles.usernameTextSendingChecked} className='numberOfLines1'>{item.userName}</p>}
                
            </div>
            
            </div>
            )
        })}
        </div>
      {actuallySending ?
      <div style={styles.addCommentSecondContainer} className='bg-black flex flex-col items-center absolute bottom-0 w-full'>
            <textarea style={styles.input} placeholder='Add Message...' className='text-white' maxLength={200} value={caption} onChange={handleCaption}/>
          <button style={{borderRadius: 10, borderWidth: 1, height: 40, borderColor: "#9EDAFF", marginTop: 10, marginRight: 5, backgroundColor: "#9EDAFF"}}>
              
              <p style={{fontSize: 12.29,
              
              padding: 6,
              paddingLeft: 12.5,
              paddingRight: 12.5,
              textAlign: 'center',
              alignSelf: 'center'}}>Send</p>
          </button>
          </div> : null}
    </div>
      </ReactModal>
  )
}

export default SendingModal