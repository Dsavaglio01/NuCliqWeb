import React from 'react'
import { useState, useEffect, useMemo } from 'react';
import { query, collection, onSnapshot, getDoc, getDocs, deleteDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '@/context/AuthContext';
import NextButton from '@/components/NextButton';
import generateId from '../lib/generateId';
import { BeatLoader } from 'react-spinners';
import { TrashIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable';
import { styles } from '@/styles/styles';
import { getRequests } from '@/firebaseUtils';
const Notifications = () => {
    const [completeNotificationsDone, setCompleteNotificationsDone] = useState(false);
    const [notificationDone, setNotificationDone] = useState(false);
    const [actualNotifications, setActualNotifications] = useState([])
    const router = useRouter();
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [nonMessageNotifications, setNonMessageNotifications] = useState([]);
    const [username, setUsername] = useState('');
    const [smallKeywords, setSmallKeywords] = useState([]);
    const [largeKeywords, setLargeKeywords] = useState([]);
    const [completeNotifications, setCompleteNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)
    const [checkNotifications, setCheckNotifications] = useState([]);
    const [translateX, setTranslateX] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const handleSwipe = (dir) => {
    if (dir === 'left') {
      setTranslateX(-80); // Swipe left to reveal (adjust based on the icon width)
      setRevealed(true);
    } else if (dir === 'right') {
      setTranslateX(0); // Swipe right to hide the icon
      setRevealed(false);
    }
  };
    useEffect(() => {
      
        deleteCheckedNotifications()
    }, [])
    async function deleteCheckedNotifications() {
      const querySnapshot = await getDocs(collection(db, "profiles", user.uid, 'checkNotifications'));
      querySnapshot.forEach(async(docu) => {
        await deleteDoc(doc(db, 'profiles', user.uid, 'checkNotifications', docu.id))
      });
    }
    useEffect(() => {
    let unsubscribe;

    if (user.uid) {
      unsubscribe = getRequests(user.uid, (data) => {
        setRequests(data);
      });
    }

    return () => {
      if (unsubscribe) {
        return unsubscribe; 
      }
    };
  }, [user?.uid, onSnapshot]); // Dependency on user.uid and snapshot in case requests are accepted
    useEffect(()=> {
      const getRequest = async() => {
        const unsub = onSnapshot(doc(db, 'profiles', user.uid), (docSnap) => {
          setFriends(docSnap.data().following)
        })
       //const docSnap = await getDoc(doc(db, 'profiles', user.uid))
         
        return unsub;
      } 
      getRequest()
      
    }, [onSnapshot]);
    useEffect(()=> {
      const getRequest = async() => {
        const docSnap = await getDoc(doc(db, 'profiles', user.uid))
         setUsername(docSnap.data().userName)
         setSmallKeywords(docSnap.data().smallKeywords)
         setLargeKeywords(docSnap.data().largeKeywords)
      } 
      getRequest()
    }, []);
    useEffect(() => {
      let unsub;
      const fetchCards = async () => {
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'checkNotifications')), (snapshot) => {
          setCheckNotifications(snapshot.docs.map((doc)=> ( {
            id: doc.id,
            ...doc.data()
          })))
        })
      }
      fetchCards();
      setTimeout(() => {
        setLoading(false)
      }, 1000);
      return unsub;
    }, [])
    
    useEffect(() => {
      const q = query(collection(db, "profiles", user.uid, 'checkNotifications'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        //console.log(querySnapshot)
        const cities = [];
        querySnapshot.forEach((doc) => {
          //console.log(doc.id)
            cities.push(doc.id);
        });
        setNonMessageNotifications(cities.length)
      });
      return unsubscribe;
    }, [])
    async function schedulePushAcceptNotification(id, username, notificationToken) {
    //console.log(username)
    //console.log(notificationToken)
    let notis = (await getDoc(doc(db, 'profiles', id))).data().allowNotifications
      let banned = (await getDoc(doc(db, 'profiles', id))).data().banned
      if (notis && !banned) {
      fetch(`${BACKEND_URL}/api/acceptNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username, pushToken: notificationToken, "content-available": 1, data: {routeName: 'NotificationScreen', deepLink: 'nucliqv1://NotificationScreen'} 
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
  useEffect(() => {
        setNotificationDone(false)
        let templist = []
      const fetchCards = async () => {
        const q = query(collection(db, "profiles", user.uid, 'notifications'), orderBy('timestamp', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            templist.push({id: doc.id, loading: false, ...doc.data()})
          });
         setActualNotifications(templist)
      }
      
      setTimeout(() => {
        setNotificationDone(true)
      }, 1000);
      fetchCards();
    }, [])
     useMemo(() => {
      if (notificationDone) {
        //setLoading(true)
        let newData = [];
        let tempList = [];
        setCompleteNotifications([])
        Promise.all(actualNotifications.map(async(item) => {
          //console.log(item.timestamp)
          console.log(item)
          if (item.like && !item.video) {   
            //console.log(item)      
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            const dataSnap = await getDoc(doc(db, 'posts', item.item))
            if (dataSnap.exists() && docSnap.exists()) {
            if (!newData.includes(dataSnap.id)) {
              tempList.push({item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()})
               //setCompleteNotifications(prevState => [...prevState, {item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()}])
                newData.push(dataSnap.id)
            }
            
            }
          }
          else if (item.like && item.video) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            const dataSnap = await getDoc(doc(db, 'videos', item.item))
            if (dataSnap.exists() && docSnap.exists()) {
            if (!newData.includes(dataSnap.id)) {
              tempList.push({item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()})
               //setCompleteNotifications(prevState => [...prevState, {item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()}])
                newData.push(dataSnap.id)
            }
            
            }
          }
          else if (item.report) {
            if (item.comments) {
              tempList.push({item})
              //setCompleteNotifications(prevState => [...prevState, {item}])
            }
            else if (item.post && !item.video) {
              const postSnap = await getDoc(doc(db, 'posts', item.postId))
              if (postSnap.exists()) {
                tempList.push({item, postInfo: {id: postSnap.id, ...postSnap.data()}})
              }
            }
            else if (item.post && item.video) {
              const postSnap = await getDoc(doc(db, 'videos', item.postId))
              if (postSnap.exists()) {
                tempList.push({item, postInfo: {id: postSnap.id, ...postSnap.data()}})
              }
            }
            else if (item.message) {
              //setCompleteNotifications(prevState => [...prevState, {item}])
              tempList.push({item})
            }
            
          }
          else if (item.comment && !item.video) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            const dataSnap = await getDoc(doc(db, 'posts', item.postId))
            if (dataSnap.exists() && docSnap.exists()) {
              tempList.push({item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()})
            //setCompleteNotifications(prevState => [...prevState, {item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()}])
            }
          } 
          else if (item.comment && item.video) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            const dataSnap = await getDoc(doc(db, 'videos', item.postId))
            if (dataSnap.exists() && docSnap.exists()) {
              tempList.push({item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()})
            //setCompleteNotifications(prevState => [...prevState, {item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()}])
            }
          }
          else if (item.reply && !item.video) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            const dataSnap = await getDoc(doc(db, 'posts', item.postId))
            if (dataSnap.exists() && docSnap.exists()) {
              tempList.push({item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()})
            //setCompleteNotifications(prevState => [...prevState, {item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()}])
            }
          }
          else if (item.reply && item.video) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            const dataSnap = await getDoc(doc(db, 'videos', item.postId))
            if (dataSnap.exists() && docSnap.exists()) {
              tempList.push({item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()})
            //setCompleteNotifications(prevState => [...prevState, {item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()}])
            }
          }
          else if (item.acceptRequest) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            if (docSnap.exists()) {
              tempList.push({item, info: {id: docSnap.id, ...docSnap.data()}})
              //setCompleteNotifications(prevState => [...prevState, {item, info: {id: docSnap.id, ...docSnap.data()}}])
            }
            
          }
          else if (item.request) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            if (docSnap.exists()) {
              tempList.push({item, info: {id: docSnap.id, ...docSnap.data()}})
              //setCompleteNotifications(prevState => [...prevState, {item, info: {id: docSnap.id, ...docSnap.data()}}])
            }
          }
          else if (item.friend) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            if (docSnap.exists()) {
              tempList.push({item, info: {id: docSnap.id, ...docSnap.data()}})
              //setCompleteNotifications(prevState => [...prevState, {item, info: {id: docSnap.id, ...docSnap.data()}}])
            }
            
          }
          else if (item.mention && !item.video) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            const dataSnap = await getDoc(doc(db, 'posts', item.postId))
            if (dataSnap.exists() && docSnap.exists()) {
              tempList.push({item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()})
             //setCompleteNotifications(prevState => [...prevState, {item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()}])
            }
          }
          else if (item.mention && item.video) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            const dataSnap = await getDoc(doc(db, 'videos', item.postId))
            if (dataSnap.exists() && docSnap.exists()) {
              tempList.push({item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()})
             //setCompleteNotifications(prevState => [...prevState, {item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()}])
            }
          }
          else if (item.postMention && !item.video) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            const dataSnap = await getDoc(doc(db, 'posts', item.postId))
            if (dataSnap.exists() && docSnap.exists()) {
              tempList.push({item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()})
             //setCompleteNotifications(prevState => [...prevState, {item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()}])
            }
          }
          else if (item.postMention && item.video) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            const dataSnap = await getDoc(doc(db, 'videos', item.postId))
            if (dataSnap.exists() && docSnap.exists()) {
              tempList.push({item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()})
             //setCompleteNotifications(prevState => [...prevState, {item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()}])
            }
          }
          else if (item.repost) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            const dataSnap = await getDoc(doc(db, 'posts', item.postId))
            if (dataSnap.exists() && docSnap.exists()) {
              tempList.push({item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()})
            //setCompleteNotifications(prevState => [...prevState, {item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()}])
            }
          }
          else if (item.remove || item.ban) {
            const docSnap = (await getDoc(doc(db, 'profiles', item.requestUser)))
            const dataSnap = await getDoc(doc(db, 'groups', item.postId))
            if (dataSnap.exists() && docSnap.exists()) {
              tempList.push({item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()})
             //setCompleteNotifications(prevState => [...prevState, {item, postInfo: {id: dataSnap.id, ...dataSnap.data()}, info: docSnap.data()}])
            }
          }
          
          
        })).then(() => setCompleteNotifications(tempList)).finally(() => {setLoading(false); setCompleteNotificationsDone(true)})
       
      }
      
    }, [notificationDone])
    async function removeFriend(ele, friendId) {
      //console.log(ele)
      const updatedObject = { ...ele };

    // Update the array in the copied object
    updatedObject.loading = true
      const objectIndex = completeNotifications.findIndex(obj => obj.item.id === ele.id);
      //console.log(objectIndex)
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...completeNotifications];
      updatedData[objectIndex].item = updatedObject;
      // Set the new array as the state
      setCompleteNotifications(updatedData);
    }
    let newFriend = generateId(friendId, user.uid)
    //let url = 'https://us-central1-nucliq-c6d24.cloudfunctions.net/removeFriend'
    window.alert('Are you sure you want to unfollow?', 'If you unfollow, you will be unable to message them and they will be unable to message you.', [
                {
                  text: 'Cancel',
                  onClick: () => {const updatedObject = { ...ele };

    // Update the array in the copied object
    updatedObject.loading = false
      const objectIndex = completeNotifications.findIndex(obj => obj.item.id === ele.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...completeNotifications];
      updatedData[objectIndex].item = updatedObject;
      // Set the new array as the state
      setCompleteNotifications(updatedData);
    }},
                  style: 'cancel',
                },
                {text: 'OK', onClick: async() => {try {
    const response = await fetch(`${BACKEND_URL}/api/removeFriend`, {
      method: 'POST', // Use appropriate HTTP method (GET, POST, etc.)
      headers: {
        'Content-Type': 'application/json', // Set content type as needed
      },
      body: JSON.stringify({ data: {newFriend: newFriend, user: user.uid, friendId: friendId}}), // Send data as needed
    })
    const data = await response.json();
    if (data.done) {
      const updatedObject = { ...ele };

    // Update the array in the copied object
    updatedObject.loading = false
      const objectIndex = completeNotifications.findIndex(obj => obj.item.id === ele.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...completeNotifications];
      updatedData[objectIndex].item = updatedObject;
      // Set the new array as the state
      setCompleteNotifications(updatedData);
    }
    }
  } catch (error) {
    console.error('Error:', error);
  }},
  }]);
    
  }
  //console.log(completeNotifications[0])
  //console.log(friends)
 // console.log(friends)
  async function addFriend(item, ele) {
    //console.log(ele)
      const updatedObject = { ...ele };
   //console.log(updatedObject.loading)
    // Update the array in the copied object
    updatedObject.loading = true
      const objectIndex = completeNotifications.findIndex(obj => obj.item.id === ele.id);
      //console.log(objectIndex)
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...completeNotifications];
      updatedData[objectIndex].item = updatedObject;
      // Set the new array as the state
      setCompleteNotifications(updatedData);
    }
    //console.log(newFriend)
    let newFriend = generateId(item.id, user.uid)
    //console.log(newFriend)
    //console.log(ele)
   // let url = 'https://us-central1-nucliq-c6d24.cloudfunctions.net/addFriendTwo'
    try {
    const response = await fetch(`${BACKEND_URL}/api/addFriendTwo`, {
      method: 'POST', // Use appropriate HTTP method (GET, POST, etc.)
      headers: {
        'Content-Type': 'application/json', // Set content type as needed
      },
      body: JSON.stringify({ data: {item: item, newFriend: newFriend, user: user.uid, username: username, smallKeywords: smallKeywords, largeKeywords: largeKeywords,}}), // Send data as needed
    })
    const data = await response.json();
   // console.log(data)
      if (data.request) {
        const updatedObject = { ...ele };
        
    // Update the array in the copied object
    updatedObject.loading = false
      const objectIndex = completeNotifications.findIndex(obj => obj.item.id === ele.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...completeNotifications];
      updatedData[objectIndex].item = updatedObject;
      // Set the new array as the state
      setCompleteNotifications(updatedData);
    }
        schedulePushRequestFriendNotification(item.id, username, item.notificationToken)
      }
      else if (data.friend) {
        const updatedObject = { ...ele };

    // Update the array in the copied object
    updatedObject.loading = false
      const objectIndex = completeNotifications.findIndex(obj => obj.item.id === ele.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...completeNotifications];
      updatedData[objectIndex].item = updatedObject;
      // Set the new array as the state
      setCompleteNotifications(updatedData);
    }
        schedulePushFriendNotification(item.id, username, item.notificationToken)
      }
  } catch (error) {
    console.error('Error:', error);
  }
  }
  
async function deleteNotification(item)  {
  if (item.item.request) {
     setCompleteNotifications(completeNotifications.filter((e) => e.item.id != item.item.id))
    await deleteDoc(doc(db, 'profiles', user.uid, 'notifications', item.item.id))
    .then(async() => await deleteDoc(doc(db, 'profiles', user.uid, 'requests', item.item.requestUser))).then(async() => await deleteDoc(doc(db, 'profiles', item.item.requestUser, 'requests', user.uid))) 
  }
  else {
    setCompleteNotifications(completeNotifications.filter((e) => e.item.id != item.item.id))
    await deleteDoc(doc(db, 'profiles', user.uid, 'notifications', item.item.id))
  }
  
  //console.log(item)
}
async function deleteAllNotifications()  {
  /* if (item.item.request) {
     setCompleteNotifications(completeNotifications.filter((e) => e.item.id != item.item.id))
    await deleteDoc(doc(db, 'profiles', user.uid, 'notifications', item.item.id))
    .then(async() => await deleteDoc(doc(db, 'profiles', user.uid, 'requests', item.item.requestUser))).then(async() => await deleteDoc(doc(db, 'profiles', item.item.requestUser, 'requests', user.uid))) 
  }
  else {
    setCompleteNotifications(completeNotifications.filter((e) => e.item.id != item.item.id))
    await deleteDoc(doc(db, 'profiles', user.uid, 'notifications', item.item.id))
  } */
  
  //console.log(item)
}
async function schedulePushRequestFriendNotification(id, username, notificationToken) {
      let notis = (await getDoc(doc(db, 'profiles', id))).data().allowNotifications
      let banned = (await getDoc(doc(db, 'profiles', id))).data().banned
      if (notis && !banned) {
     fetch(`${BACKEND_URL}/api/requestedNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username, pushToken: notificationToken
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
  async function schedulePushFriendNotification(id, username, notificationToken) {
    let notis = (await getDoc(doc(db, 'profiles', id))).data().allowNotifications
    let banned = (await getDoc(doc(db, 'profiles', id))).data().banned
      if (notis && !banned) {
      fetch(`${BACKEND_URL}/api/friendNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username, pushToken: notificationToken
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
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    trackMouse: true, // Enables mouse tracking for desktop swipes
  });
  async function acceptRequest(item) {
  const newUser = generateId(item.item.requestUser, user.uid)
  //let url = 'https://us-central1-nucliq-c6d24.cloudfunctions.net/acceptRequestInd'
    try {
    const response = await fetch(`${BACKEND_URL}/api/acceptRequestInd`, {
      method: 'POST', // Use appropriate HTTP method (GET, POST, etc.)
      headers: {
        'Content-Type': 'application/json', // Set content type as needed
      },
      body: JSON.stringify({ data: {item: item, newUser: newUser, username: username, smallKeywords: smallKeywords, largeKeywords: largeKeywords, user: user.uid}}), // Send data as needed
    })
    const data = await response.json();
      if (data.done) {
        schedulePushAcceptNotification(item.item.requestUser, username, item.info.notificationToken)
        setCompleteNotifications(completeNotifications.filter((e) => e.item.id != item.item.id)) 
      }
  } catch (error) {
    console.error('Error:', error);
  }
}
  return (
    <div>
      <div style={styles.commentHeader}>
        <span style={{...styles.headerText, ...{textAlign: 'center'}}}>Notifications</span>
      </div>
      <div className='divider'/>
      <div>
        {<>
        {loading ?  
          <div style={styles.repostLoadingContainer}>
            <BeatLoader color='#9edaff'/> 
          </div> : actualNotifications.length > 0 ? 
          <>
            {!loading && completeNotificationsDone ? <div style={styles.notificationContainer}>
              {completeNotifications.slice().sort((a, b) => b.item.timestamp - a.item.timestamp).map((item, index) => {
                  return (
                    <div className='swipe-container'>
                      <div className='swipe-content' style={{ transform: `translateX(${translateX}px)` }}>
                      {item.item.like && !item.item.repost ? 
                        <div style={styles.notificationItemContainer}>
                        <div style={styles.notificationItemHeader} className='cursor-pointer' onClick={() => router.push({pathname: 'ViewingProfile', query: {name: item.item.requestUser, viewing: true}})}>
                          {item.info.pfp ? <img src={item.info.pfp} style={styles.notificationImage}/> :
                              <UserCircleIcon className='userBtn' style={styles.notificationImage}/>
                              }
                          <span className='numberOfLines2' style={styles.notificationText}><span style={{fontWeight: '700'}} >@{item.info.userName}</span> liked your {!item.postInfo.repost ? item.postInfo.post[0].image ? 'post' : 
                          item.postInfo.post[0].video ? 'vid' : 'vibe' : 're-vibe'}: </span>
                        </div>
                        {!item.postInfo.repost ? item.postInfo.post[0].image ? 
                      <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
                        <img src={item.postInfo.post[0].post} style={styles.notificationImageBorder}/>
                      </button> : item.postInfo.post[0].video ? <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push('Post', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null, video: true}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
                        <img src={item.postInfo.post[0].thumbnail} style={styles.notificationImageBorder}/>
                      </button> : <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
                        <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post[0].value}</span>
                      </button> : item.postInfo.post.post[0].image ? <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
                        <img src={item.postInfo.post.post[0].post} style={styles.notificationImageBorder}/>
                      </button> : item.postInfo.post.post[0].video ? <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push('Post', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null, video: true}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
                        <img src={item.postInfo.post.post[0].thumbnail} style={styles.notificationImageBorder}/>
                      </button> : <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
                        <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post.post[0].value}</span>
                      </button>}
                        
                        </div> : item.item.request ? 
          <div style={styles.notificationItemContainer}>
          <div style={styles.notificationItemHeader} className='cursor-pointer' onClick={() => router.push({pathname: 'ViewingProfile', query: {name: item.item.requestUser, viewing: true}})}>
            {item.info.pfp ? <img src={item.info.pfp} style={styles.notificationImage}/> :
                <UserCircleIcon className='userBtn' style={styles.notificationImage}/>
                }
            <span className='numberOfLInes2' style={styles.notificationText}><span  style={{fontWeight: '700'}} >@{item.info.userName}</span> requested to add you as a friend.</span>
          </div>
          <div style={styles.acceptContainer}>
            <NextButton text={"Accept"} textStyle={styles.acceptText} onClick={() => acceptRequest(item)}/>
          </div>
          
          </div>
          : item.item.repost ? 
          <div style={styles.notificationItemContainer}>
          <div style={styles.notificationItemHeader} className='cursor-pointer' onClick={() => router.push({pathname: 'ViewingProfile', query: {name: item.item.requestUser, viewing: true}})}>
            {item.info.pfp ? <img src={item.info.pfp} style={styles.notificationImage}/> :
                <UserCircleIcon className='userBtn' style={styles.notificationImage}/>
                }
            <span className='numberOfLInes2' style={styles.notificationText}><span style={{fontWeight: '700'}} 
            >@{item.info.userName}</span> re-vibed your vibe: </span>
          </div>
          <button style={styles.notificationButton} onClick={() => router.push({pathname: 'Post',  query: {post: item.postInfo.id}})}>
          <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post[0].value}</span>
        </button>
          
          </div> :
          item.item.acceptRequest ? 
          <div style={styles.notificationItemContainer}>
          <div style={styles.notificationItemHeader} className='cursor-pointer' onClick={() => router.push({pathname: 'ViewingProfile', query: {name: item.item.requestUser, viewing: true}})}>
            {item.info.pfp ? <img src={item.info.pfp} style={styles.notificationImage}/> :
                <UserCircleIcon className='userBtn' style={styles.notificationImage}/>
                }
            <span className='numberOfLInes2' style={styles.notificationText}><span  style={{fontWeight: '700'}} >@{item.info.userName}</span> accepted your friend request!</span>
          </div>
          </div> :
          item.item.friend ? 
          <div style={styles.notificationItemContainer}>
          <div style={styles.notificationItemHeader} className='cursor-pointer' onClick={() => router.push({pathname: 'ViewingProfile', query: {name: item.item.requestUser, viewing: true}})}>
            {item.info.pfp ? <img src={item.info.pfp} style={styles.notificationImage}/> :
                <UserCircleIcon className='userBtn' style={styles.notificationImage}/>
                }
            <span className='numberOfLInes2' style={styles.notificationText}><span  style={{fontWeight: '700'}} >@{item.info.userName}</span> added you as a friend!</span>
          </div>
          </div> :
          item.item.report ? 
          <div style={styles.notificationItemContainer}>
          <div style={styles.notificationCommentContainer}>
            {item.item.comments ? <div>
              <span className='numberOfLInes2' style={styles.addTextReport}>You have been reported for this comment: {item.item.postId.comment} for {item.item.item}</span>
            </div> : item.item.post ? 
            <div style={{flexDirection: 'row', display: 'flex', flex: 1, marginTop: 0}}>
              <span className='numberOfLInes2' style={styles.addTextReport}>This post has been reported for {item.item.item}:</span>
              {!item.postInfo.repost ? item.postInfo.post[0].image ? 
              <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
                <img src={item.postInfo.post[0].post} style={styles.notificationImageBorder}/>
              </button> : item.postInfo.post[0].video ? <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push('Post', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null, video: true}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post[0].thumbnail} style={styles.notificationImageBorder}/>
        </button> : <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post[0].value}</span>
        </button> : item.postInfo.post.post[0].image ? 
              <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
                <img src={item.postInfo.post.post[0].post} style={styles.notificationImageBorder}/>
              </button> : item.postInfo.post.post[0].video ? <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push('Post', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null, video: true}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post.post[0].thumbnail} style={styles.notificationImageBorder}/>
        </button> : <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post.post[0].value}</span>
        </button>}
            </div> : item.item.message ? 
            <div style={{marginLeft: '-3%', width: '110%'}}> 
              <span className='numberOfLInes2' style={styles.notificationText}>You have been reported for a chat message for {item.item.item}</span>
            </div> : item.item.theme ? 
            <div style={{flexDirection: 'row', display: 'flex', flex: 1, marginTop: 0}}>
              <span className='numberOfLInes2' style={styles.addTextReport}>This theme has been reported:</span>
              <button style={styles.notificationButton} onClick={() => router.push('SpecificTheme', {productId: item.postInfo.id, free: true, purchased: false})}>
                <img src={item.postInfo.images[0]} style={styles.notificationImage}/>
              </button>
            </div>  : null}
          </div>
          
          </div> 
          :
          item.item.comment ? item.item.likedComment ? 
          <div style={styles.notificationItemContainer}>
          <div style={styles.notificationItemHeader} className='cursor-pointer' onClick={() => router.push({pathname: 'ViewingProfile', query: {name: item.item.requestUser, viewing: true}})}>
            {item.info.pfp ? 
            <img src={{uri: item.info.pfp}} style={styles.notificationImage}/> : <UserCircleIcon className='userBtn' style={styles.notificationImage}/>}
            <span className='numberOfLInes2' style={styles.notificationText}><span  style={{fontWeight: '700'}} >@{item.item.likedBy}</span> liked your comment:  {item.item.item} </span>
          </div>
          {!item.postInfo.repost ? item.postInfo.post[0].image ? 
        <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post[0].post} style={styles.notificationImageBorder}/>
        </button> : item.postInfo.post[0].video ? <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push('Post', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null, video: true}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post[0].thumbnail} style={styles.notificationImageBorder}/>
        </button> : <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post[0].value}</span>
        </button> : item.postInfo.post.post[0].image ? 
        <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post.post[0].post} style={styles.notificationImageBorder}/>
        </button> : item.postInfo.post.post[0].video ? <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push('Post', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null, video: true}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post.post[0].thumbnail} style={styles.notificationImageBorder}/>
        </button> : <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post.post[0].value}</span>
        </button>}
          </div> : 
          <div style={styles.notificationItemContainer}>
          <div style={styles.notificationItemHeader} className='cursor-pointer' onClick={() => router.push({pathname: 'ViewingProfile', query: {name: item.item.requestUser, viewing: true}})}>
            {item.info.pfp ? 
            <img src={{uri: item.info.pfp}} style={styles.notificationImage}/> : <UserCircleIcon className='userBtn' style={styles.notificationImage}/>}
            <span className='numberOfLInes2' style={styles.notificationText}><span  style={{fontWeight: '700'}} >@{item.item.likedBy}</span> commented:  {item.item.item} </span>
          </div>
          {!item.postInfo.repost ? item.postInfo.post[0].image ? 
        <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post[0].post} style={styles.notificationImageBorder}/>
        </button> : item.postInfo.post[0].video ? <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push('Post', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null, video: true}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post[0].thumbnail} style={styles.notificationImageBorder}/>
        </button> : <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post[0].value}</span>
        </button> : item.postInfo.post.post[0].image ? 
        <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post.post[0].post} style={styles.notificationImageBorder}/>
        </button> : item.postInfo.post.post[0].video ? <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push('Post', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null, video: true}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post.post[0].thumbnail} style={styles.notificationImageBorder}/>
        </button> : <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post.post[0].value}</span>
        </button>}
          </div>
          : item.item.reply ? 
          <div style={styles.notificationItemContainer}>
          <div style={styles.notificationItemHeader} className='cursor-pointer' onClick={() => router.push({pathname: 'ViewingProfile', query: {name: item.item.requestUser, viewing: true}})}>
            {item.info.pfp ? 
            <img src={{uri: item.info.pfp}} style={styles.notificationImage}/> : <UserCircleIcon className='userBtn' style={styles.notificationImage}/>}
            <span className='numberOfLInes2' style={styles.notificationText}><span  style={{fontWeight: '700'}} >@{item.item.likedBy}</span> replied to you:  {item.item.item} </span>
          </div>
          {!item.postInfo.repost ? item.postInfo.post[0].image ? 
        <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post[0].post} style={styles.notificationImageBorder}/>
        </button> : item.postInfo.post[0].video ? <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push('Post', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null, video: true}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post[0].thumbnail} style={styles.notificationImageBorder}/>
        </button> : <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post[0].value}</span>
        </button> :item.postInfo.post.post[0].image ? 
        <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post.post[0].post} style={styles.notificationImageBorder}/>
        </button> : item.postInfo.post.post[0].video ? <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push('Post', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null, video: true}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post.post[0].thumbnail} style={styles.notificationImageBorder}/>
        </button> : <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post.post[0].value}</span>
        </button>}
          </div> :
          item.item.theme ? 
          <div style={styles.notificationItemContainer}>
          <div style={styles.notificationItemHeader} className='cursor-pointer' onClick={() => router.push({pathname: 'ViewingProfile', query: {name: item.item.requestUser, viewing: true}})}>
            {item.info.pfp ? 
            <img src={{uri: item.info.pfp}} style={styles.notificationImage}/> : <UserCircleIcon className='userBtn' style={styles.notificationImage}/>}
            <span className='numberOfLInes2' style={styles.notificationText}><span  style={{fontWeight: '700'}} >@{item.info.userName}</span> bought your theme: </span>
          </div>
        <button style={styles.notificationButton} onClick={() => router.push('SpecificTheme', {productId: item.postInfo.id, free: true, purchased: false})}>
                <img src={item.postInfo.images[0]} style={styles.notificationImage}/>
              </button>
          
          </div> :
          item.item.mention ? 
          <div style={styles.notificationItemContainer}>
          <div style={styles.notificationItemHeader} className='cursor-pointer' onClick={() => router.push({pathname: 'ViewingProfile', query: {name: item.item.requestUser, viewing: true}})}>
            {item.info.pfp ? 
            <img src={{uri: item.info.pfp}} style={styles.notificationImage}/> : <UserCircleIcon className='userBtn' style={styles.notificationImage}/>}
            <span className='numberOfLInes2' style={styles.notificationText}><span  style={{fontWeight: '700'}} >@{item.item.likedBy}</span> mentioned you in a comment.</span>
          </div>
          {!item.postInfo.repost ? item.postInfo.post[0].image ? 
        <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post[0].post} style={styles.notificationImageBorder}/>
        </button> : item.postInfo.post[0].video ? <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push('Post', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null, video: true}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post[0].thumbnail} style={styles.notificationImageBorder}/>
        </button> : <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post[0].value}</span>
        </button> : item.postInfo.post.post[0].image ? 
        <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post.post[0].post} style={styles.notificationImageBorder}/>
        </button> : item.postInfo.post.post[0].video ? <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push('Post', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null, video: true}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <img src={item.postInfo.post.post[0].thumbnail} style={styles.notificationImageBorder}/>
        </button> : <button style={styles.notificationButton} onClick={!item.postInfo.repost ? () => router.push({pathname: 'Post',  query: {post: item.postInfo.id}}) : () => router.push('Repost', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null})}>
          <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post.post[0].value}</span>
        </button>}
          </div> : item.item.remove ? 
          <div style={styles.notificationItemContainer}>
            <div style={{flexDirection: 'row', display: 'flex', flex: 1, marginTop: 0}}>
              <span className='numberOfLInes2' style={styles.addTextReport}>You have been removed from this Cliq: {item.postInfo.name}</span>
              {<div style={styles.notificationButton}>
                <img src={item.postInfo.banner ? {uri: item.postInfo.banner, priority: 'normal'} : null} style={styles.notificationImage}/>
              </div>}
            </div>
          </div> 
          : item.item.postMention ? 
          <div style={styles.notificationItemContainer}>
          <div style={styles.notificationItemHeader} className='cursor-pointer' onClick={() => router.push({pathname: 'ViewingProfile', query: {name: item.item.requestUser, viewing: true}})}>
            {item.info.pfp ? 
            <img src={{uri: item.info.pfp}} style={styles.notificationImage}/> : <UserCircleIcon className='userBtn' style={styles.notificationImage}/>}
            <span className='numberOfLInes2' style={styles.notificationText}><span  style={{fontWeight: '700'}} >@{item.item.likedBy}</span> mentioned you in a post.</span>
          </div>
          {item.postInfo.post[0].image ? 
        <button style={styles.notificationButton} onClick={() => router.push({pathname: 'Post',  query: {post: item.postInfo.id}})}>
          <img src={item.postInfo.post[0].post} style={styles.notificationImageBorder}/>
        </button> : item.postInfo.post[0].video ? <button style={styles.notificationButton} onClick={() => router.push('Post', {post: item.postInfo.id, requests: requests, name: item.postInfo.userId, groupId: null, video: true})}>
          <img src={item.postInfo.post[0].thumbnail} style={styles.notificationImageBorder}/>
        </button> : <button style={styles.notificationButton} onClick={() => router.push({pathname: 'Post',  query: {post: item.postInfo.id}})}>
          <span className='numberofLines2' style={styles.notificationImageText}>{item.postInfo.post[0].value}</span>
        </button>}
          </div>
          : item.item.ban ? 
          <div style={styles.notificationItemContainer}>
            <div style={{flexDirection: 'row', display: 'flex', flex: 1, marginTop: 0}}>
              <span className='numberOfLInes2' style={styles.addTextReport}>You have been banned from this Cliq: {item.postInfo.name}</span>
              {<div style={styles.notificationButton}>
                <img src={item.postInfo.banner} style={styles.notificationImage}/>
              </div>}
            </div>
          </div > :
          null
          }
          {revealed ? <TrashIcon className='trashBtn' /> : null}
          </div>
          </div>
                  )
              })}
              
          </div> : null}
          {loading ? 
              <div style={{alignItems: 'center', flex: 1, justifyContent: 'flex-end', marginVertical: '5%'}}>
          <BeatLoader color="#9edaff"/>
          </div> : null
              }
        {/* </div> */}
        </> 
        :
        <div style={{justifyContent: 'center', flex: 1, marginBottom: '40%'}}>
          <span style={styles.reportContentText}>Sorry no Notifications</span>
        </div>}
        </>
        }
            
      </div>
  </div>
  )
}

export default Notifications

