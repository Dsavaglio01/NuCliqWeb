import React, { useState, useMemo, useEffect, useContext} from 'react'
import { useAuth } from '@/context/AuthContext'
import { db } from '../firebase';
import { onSnapshot, query, collection, where, orderBy, limit, getDoc, setDoc, doc, addDoc, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import ProfileContext from '@/context/ProfileContext';
function SendingModal () {
    const profile = useContext(ProfileContext);
    const [friends, setFriends] = useState([]);
    const [alert, setAlert] = useState(false);
    const [completeFriends, setCompleteFriends] = useState([]);
    const router = useRouter();
    const {video, payload, payloadUsername, theme} = router.query;
    const [caption, setCaption] = useState('');
    const [actuallySending, setActuallySending] = useState(false);
    const [person, setPerson] = useState(null);
    const [sendingFriend, setSendingFriend] = useState(null);
    const [friendsInfo, setFriendsInfo] = useState([]);
    const [ableToShare, setAbleToShare] = useState(true);
    const [lastVisible, setLastVisible] = useState(null);
    const {user} = useAuth();
     async function schedulePushThemeNotification(item, friendId, firstName, lastName, notificationToken) {
      let notis = (await getDoc(doc(db, 'profiles', item.id))).data().allowNotifications
      const deepLink = `nucliqv1://PersonalChat?person=${item}&friendId=${friendId}`;
     let banned = (await getDoc(doc(db, 'profiles', item.id))).data().banned
      if (notis && !banned) {
        fetch(`${BACKEND_URL}/api/sentThemeNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName, lastName: lastName, pushToken: notificationToken, "content-available": 1, data: {routeName: 'PersonalChat', person: item, friendId: friendId, deepLink: deepLink}
      }),
      })
    .then(response => response.json())
    .then(responseData => {
      // Handle the response from the server
      console.log(responseData);
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error(error);
    })
  }
    }
    async function schedulePushPostNotification(item, friendId, firstName, lastName, username, notificationToken) {
      let notis = (await getDoc(doc(db, 'profiles', item.id))).data().allowNotifications
      const deepLink = `nucliqv1://PersonalChat?person=${item}&friendId=${friendId}`;
      let banned = (await getDoc(doc(db, 'profiles', item.id))).data().banned
      if (notis && !banned) {
        fetch(`${BACKEND_URL}/api/postNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName, lastName: lastName, username: username, pushToken: notificationToken, "content-available": 1, data: {routeName: 'PersonalChat', person: item, friendId: friendId, deepLink: deepLink}
      }),
      })
    .then(response => response.json())
    .then(responseData => {
      // Handle the response from the server
      console.log(responseData);
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error(error);
    })
  }
    }
    useMemo(() => {
      
      Promise.all(friends.map(async(item) => await getDoc(doc(db, 'friends', item.friendId))))
      .then(snapshots => {
        setCompleteFriends(snapshots.map(snapshot => ({id: snapshot.id, ...snapshot.data()})))
        //console.log(snapshots.map(snapshot => snapshot.data()))
        //const documents = snapshots.map(snapshot => snapshot.data());
        // Process the fetched documents here
      })
      .catch(error => {
        // Handle errors
      });
    }, [friends])
    useEffect(() => {
        if (alert){
        window.alert("Message Sent", "Your message has been sent!", [
      
      {text: 'OK', onClick: () => {navigation.goBack(); setAlert(false)}},
    ])
}
    }, [alert])
    function addPostToChatter() {
      if (ableToShare) {
        Promise.all(friendsInfo.map(async(item) => {
          //console.log(item)
        if (item.checked == true && payload && video) {
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
    )).then(() => setActuallySending(false)).then(() => setAlert(true)).then(() => schedulePushPostNotification(person, friendId[0].id, firstName, lastName, payload.username, person.notificationToken))
        } 
        else if (item.checked == true && payload && !video) {
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
    )).then(() => setActuallySending(false)).then(() => setAlert(true)).then(() => schedulePushPostNotification(person, friendId[0].id, firstName, lastName, payload.username, person.notificationToken))
        } 
      else if (item.checked == true && theme) {
        const friendId = completeFriends.filter((element) => element.id.includes(item.id))
          const docRef = await addDoc(collection(db, 'friends', friendId[0].id, 'chats'), {
       message: {theme: theme, text: caption},
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
    )).then(() => setActuallySending(false)).then(() => setAlert(true)).then(() => schedulePushThemeNotification(person, friendId[0].id,firstName, lastName, person.notificationToken))
      }
      }))
      
      }
      else {
        window.alert('Post unavailable to share')
      }
      
      
    }
    useMemo(()=> {
      setFriends([])
      let unsub;
      const fetchCards = async () => {
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'friends'), where('actualFriend', '==', true), orderBy('lastMessageTimestamp', 'desc'), limit(20)), (snapshot) => {
          setFriends(snapshot.docs.filter((doc => profile.followers.includes(doc.id) && profile.following.includes(doc.id))).map((doc)=> ( {
            id: doc.id,
            ...doc.data()
          })))
           setLastVisible(snapshot.docs[snapshot.docs.length - 1])
        })
       
      } 
      fetchCards();
      return unsub;
    }, [profile.followers, profile.following]);
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
        setSendingFriend(result[0].friendId)
        setPerson(list[index])
      }
      else {
        setActuallySending(false)
        setSendingFriend(null)
      }
      var newList = list.slice()
      setFriendsInfo(newList)
      
      
    }
    const handleCaption = (event) => {
    setCaption(event.target.value)
}
    const header = {
        fontSize: 19.20,
        color: "#fafafa",
        marginLeft: 'auto'
    }
    const usernameText = {
        fontSize: 12.29,
        color: "#fafafa",
        alignSelf: 'center',
        padding: 5
    }
    const addCommentSecondContainer = {
        //flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: '10%',
        alignItems: 'flex-end',
        //flex: 1,
        //marginHorizontal: '5%',
        //marginBottom: '17.5%',
        width: '100%',
        borderColor: "#fafafa"
    }
    const input = {
        borderTopWidth: 0.25,
      width: '110%',
      marginLeft: '-5%',
      padding: 15,
      margin: '2.5%',
      marginTop: 0,
      borderColor: "#fafafa",
      color: "#fafafa"
    }
  return (
    <div>
        <div style={{flexDirection: 'row', display: 'flex', marginTop: '5%', marginHorizontal: '5%'}}>
            <p style={header}>Send To: </p>
            <XMarkIcon className='btn' onClick={() => router.back()}/>
        </div>
        {friendsInfo.map((item, index) => {
            return (
                <div key={index} style={{width: '30%', margin: 5}}>
            <div className='cursor-pointer'  onClick={() => renderChecked(item)}>
                <img src={item.pfp ? item.pfp : require('../public/defaultpfp.jpg')} style={{height: 55, width: 55, borderRadius: 55, alignSelf: 'center'}}/>
                {item.checked ? <CheckIcon color='#9edaff' style={{position: 'relative', bottom: 20, left: 80}}/> : null}
                <p style={usernameText}>{item.userName}</p>
            </div>
            
            </div>
            )
        })}
      
      {actuallySending ?
      <div style={addCommentSecondContainer}>
        <div style={{flexDirection: 'row', marginHorizontal: '5%', width: '90%'}}>
            <textarea style={input} placeholder='Add Message...' className='text-white' maxLength={200} value={caption} onChange={handleCaption}/>
            </div> 
          </div> : null}
    </div>
  )
}

export default SendingModal

