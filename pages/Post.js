import React from 'react'
import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import {collection, getDocs, getDoc, doc, addDoc, increment, Timestamp, query, orderBy, limit, setDoc, deleteDoc, serverTimestamp, updateDoc, arrayRemove, arrayUnion, startAfter, where, onSnapshot} from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuth } from '@/context/AuthContext'
import FollowingIcon from '@/components/FollowingIcon'
import FollowIcon from '@/components/FollowIcon'
import RequestedIcon from '@/components/RequestedIcon'
import { ArrowUturnRightIcon, BookmarkIcon, ChatBubbleBottomCenterIcon, ChevronDownIcon, EllipsisVerticalIcon, FlagIcon, HeartIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeart, CheckIcon, BookmarkIcon as SolidBookmark, UserCircleIcon, ArrowPathIcon, ChevronLeftIcon } from '@heroicons/react/24/solid'
import 'reactjs-popup/dist/index.css';
import ReactModal from 'react-modal'
import { BeatLoader } from 'react-spinners'
import { useRouter } from 'next/router'
import NextButton from '@/components/NextButton'
import { useSwipeable } from 'react-swipeable'

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
function Post ({}) {
  const [meet, setMeet] = useState(true);
  const [reloadPage, setReloadPage] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState(null);
  const [tempPosts, setTempPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const [followers, setFollowers] = useState([]);
  const [replyFocus, setReplyFocus] = useState(false);
  const [likesModal, setLikesModal] = useState(false);
  const [repostLoading, setRepostLoading] = useState(false);
  const [replyToReplyFocus, setReplyToReplyFocus] = useState(false);
  const [tempReplyName, setTempReplyName] = useState();
  const [repostComment, setRepostComment] = useState('');
  const [repostModal, setRepostModal] = useState(false);
  const [ableToShare, setAbleToShare] = useState(true);
  const [repostItem, setRepostItem] = useState(null);
  const [caption, setCaption] = useState('');
  const [reportModal, setReportModal] = useState(false);
    const [tempReplyId, setTempReplyId] = useState('');
  const [lastVisible, setLastVisible] = useState(null);
  const [requests, setRequests] = useState([]);
  const [focusedLikedItem, setFocusedLikedItem] = useState(null);
  const [likesLoading, setLikesLoading] = useState(false);
  const [likesInfo, setLikesInfo] = useState([]);
  const [friendsInfo, setFriendsInfo] = useState([]);
  const [forSale, setForSale] = useState(false);
  const [background, setBackground] = useState(null);
  const [usernames, setUsernames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postDone, setPostDone] = useState(false);
  const [tempCommentId, setTempCommentId] = useState(null);
  const [friends, setFriends] = useState([]);
  const [comment, setComment] = useState('');
  const [replyLastVisible, setReplyLastVisible] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [actuallySending, setActuallySending] = useState(false);
    const [person, setPerson] = useState(null);
    const [sendingFriend, setSendingFriend] = useState(null);
  const commentDivRef = useRef(null);
  const [following, setFollowing] = useState(false);
  const [sendingModal, setSendingModal] = useState(false);
  const [followingCount, setFollowingCount] = useState(3);
  const [username, setUsername] = useState('')
  const [finishedReporting, setFinishedReporting] = useState(false);
  const [reply, setReply] = useState('');
  const [pfp, setPfp] = useState(null);
  const [notificationToken, setNotificationToken] = useState(null); 
  const [focusedItem, setFocusedItem] = useState(null);
  const {user} = useAuth();
  const [isFetching, setIsFetching] = useState(false);
  const [reportCommentModal, setReportCommentModal ] = useState(false);
  const [commentModal, setCommentModal] = useState(false)
  const bottomObserver = useRef(null);
  const dropdownRef = useRef(null);
  //console.log(reportModal)
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
      if (focusedItem != null) {
        const getData = async() => {
          const docSnap = await getDoc(doc(db, 'posts', focusedItem.id))
          if (!docSnap.exists()) {
            setAbleToShare(false)
          }
        }
        getData()
      }
    }, [focusedItem])
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);

      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  //console.log(user)
  function onSecondPress(item) {
        setCommentsLoading(true)
        if (reportedContent.length < 10) {
      addDoc(collection(db, 'profiles', reportComment.user, 'reportedContent'), {
      content: reportComment.id,
      reason: item,
      post: focusedPost,
      comment: reportComment.comment == undefined ? reportComment.reply : reportComment.comment,
      message: false,
      cliqueMessage: false,
      timestamp: serverTimestamp()
    }).then(() => addDoc(collection(db, 'profiles', reportComment.user, 'notifications'), {
      like: false,
comment: reportComment.comment == undefined ? reportComment.reply : reportComment.comment,
      friend: false,
      item: item,
      request: false,
      acceptRequest: false,
      theme: false,
      report: true,
      postId: focusedPost.id,
      requestUser: reportComment.user,
      requestNotificationToken: reportNotificationToken,
      post: focusedPost,
      comments: comments,
       message: false,
      cliqueMessage: false,
      likedBy: [],
      timestamp: serverTimestamp()
    })).then(() => addDoc(collection(db, 'profiles', reportComment.user, 'checkNotifications'), {
      userId: reportComment.user
    })).then(reportComment ? async() => await updateDoc(doc(db, 'profiles', user.uid), {
      reportedComments: arrayUnion(reportComment.id)
    }) : null).then(() => schedulePushReportNotification()).then(() => setFinishedReporting(true)).then(() => setReportCommentModal(false))
    }
    else {

      addDoc(collection(db, 'profiles', reportComment.user, 'reportedContent'), {
      content: reportComment.id,
      reason: item,
      post: focusedPost,
      comment: reportComment.comment == undefined ? reportComment.reply : reportComment.comment,
       message: false,
      cliqueMessage: false,
      timestamp: serverTimestamp()
    }).then(() => addDoc(collection(db, 'profiles', reportComment.user, 'notifications'), {
      like: false,
comment: reportComment.comment == undefined ? reportComment.reply : reportComment.comment,
      friend: false,
      item: item,
      request: false,
      acceptRequest: false,
      theme: false,
      report: true,
      postId: focusedPost.id,
      requestUser: reportComment.user,
      requestNotificationToken: reportNotificationToken,
      post: focusedPost,
       message: false,
      cliqueMessage: false,
      likedBy: [],
      timestamp: serverTimestamp()
    })).then(() => addDoc(collection(db, 'profiles', reportComment.user, 'checkNotifications'), {
      userId: reportComment.user
    })).then(reportComment ? async() => await updateDoc(doc(db, 'profiles', user.uid), {
      reportedComments: arrayUnion(reportComment.id)
    }) : null).then(() => schedulePushReportNotification()).then(() => setFinishedReporting(true)).then(() => setReportCommentModal(false))
    }
    setTimeout(() => {
        setCommentsLoading(false)
    }, 1000);
    }
  useMemo(()=> {
      setFriends([])
      let unsub;
      const fetchCards = async () => {
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'friends'), where('actualFriend', '==', true), orderBy('lastMessageTimestamp', 'desc'), limit(20)), (snapshot) => {
          setFriends(snapshot.docs.filter((doc => followers.includes(doc.id) && following.includes(doc.id))).map((doc)=> ( {
            id: doc.id,
            ...doc.data()
          })))
           setLastVisible(snapshot.docs[snapshot.docs.length - 1])
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
    const handleCaption = (event) => {
    setCaption(event.target.value)
}
    useEffect(() => {
      const getUsernames = async() => {
        (await getDocs(collection(db, 'usernames'))).forEach((doc) => {
          setUsernames(prevState  => [...prevState, doc.data().username])
        })
      }
      getUsernames()
    }, [])
    useEffect(()=> {
      let unsub;
      const fetchCards = async () => {
        //const passes = await getDocs(collection(db, 'users', user.uid, 'passes')).then((snapshot) => snapshot.docs.map((doc) => doc.id));
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'requests'), where('actualRequest', '==', true)), (snapshot) => {
          setRequests(snapshot.docs.map((doc)=> ( {
            id: doc.id,
            ...doc.data()
            //info: doc.data().info
          })))
        })
      } 
      fetchCards();
      return unsub;
    }, []);
    async function addHomeSave(item) {
    //console.log(id)
    //console.log(item)
    const updatedObject = { ...item };

    // Update the array in the copied object
    updatedObject.savedBy = [...item.savedBy, user.uid];
      const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      // Set the new array as the state
      setTempPosts(updatedData);
    }
    await updateDoc(doc(db, 'posts', item.id), {
      savedBy: arrayUnion(user.uid)
    }).then(async() => await setDoc(doc(db, 'profiles', user.uid, 'saves', item.id), {
      post: item,
      timestamp: serverTimestamp()
    })
    )
  }
  async function schedulePushLikeNotification(id, username, notificationToken) {
    let notis = (await getDoc(doc(db, 'profiles', id))).data().allowNotifications
    let banned = (await getDoc(doc(db, 'profiles', id))).data().banned
      if (notis && !banned) {
      console.log(notificationToken)
      fetch(`${BACKEND_URL}/api/likeNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username, pushToken: notificationToken,  "content-available": 1, data: {routeName: 'NotificationScreen', deepLink: 'nucliqv1://NotificationScreen'},
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
  async function removeHomeSave(item) {
    const updatedObject = { ...item };
    updatedObject.savedBy = item.savedBy.filter((e) => e != user.uid)
    const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      // Set the new array as the state
      setTempPosts(updatedData);
    }
    await updateDoc(doc(db, 'posts', item.id), {
      savedBy: arrayRemove(user.uid)
    }).then(async() => await deleteDoc(doc(db, 'profiles', user.uid, 'saves', item.id)))
    
  }
    async function addHomeLike(item, likedBy) {
    const updatedObject = { ...item };

    // Update the array in the copied object
    
    //console.log(updatedObject)
      if (item.username == username && !likedBy.includes(user.uid)&& !updatedObject.likedBy.includes(user.uid) ) {
        
        updatedObject.likedBy = [...item.likedBy, user.uid];
      const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      // Set the new array as the state
      setTempPosts(updatedData);
    }
       await setDoc(doc(db, 'profiles', user.uid, 'likes', item.id), {
      post: item.id,
      timestamp: serverTimestamp()
    }).then(async() =>
      await updateDoc(doc(db, 'posts', item.id), {
      likedBy: arrayUnion(user.uid)
    }))
    }
    else if (!likedBy.includes(user.uid) && !updatedObject.likedBy.includes(user.uid)) {
      updatedObject.likedBy = [...item.likedBy, user.uid];
      const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      // Set the new array as the state
      setTempPosts(updatedData);
    }
      await updateDoc(doc(db, 'posts', item.id), {
      likedBy: arrayUnion(user.uid)
    }).then(async() => await setDoc(doc(db, 'profiles', user.uid, 'likes', item.id), {
      post: item.id,
      timestamp: serverTimestamp()
    })).then(() => 
            addDoc(collection(db, 'profiles', item.userId, 'notifications'), {
              like: true,
              comment: false,
              friend: false,
              item: item.id,
              request: false,
              acceptRequest: false,
              theme: false,
              report: false,
              postId: item.id,
              requestUser: user.uid,
              requestNotificationToken: item.notificationToken,
              likedBy: [],
              timestamp: serverTimestamp()
            }).then(() => addDoc(collection(db, 'profiles', item.userId, 'checkNotifications'), {
                userId: item.userId
              })).then(() => schedulePushLikeNotification(item.userId, username, item.notificationToken)).then(() => addRecommendLike(item))
    )
        
    }
  }
  async function rePostFunction() {
    if (!ableToShare) {
    window.alert('Post unavailable to reply')
    setRepostModal(false)
  }
  else {
    //await updateDoc(doc())
    setRepostLoading(true)
   const docRef = await addDoc(collection(db, 'posts'), {
      userId: user.uid,
    repost: true,
    blockedUsers: blockedUsers,
    caption: repostComment,
    post: repostItem,
    forSale: forSale,
    postIndex: 0,
    mentions: [],
    pfp: pfp,
    likedBy: [],
    comments: 0,
    shares: 0,
    usersSeen: [],
    commentsHidden: false,
    likesHidden: false,
    archived: false,
    savedBy: [],
    multiPost: true,
    timestamp: serverTimestamp(),
    notificationToken: notificationToken,
    username: username,
    
    reportVisible: false,
    background: background
    })
    await setDoc(doc(db, 'profiles', user.uid, 'posts', docRef.id), {
      userId: user.uid,
      repost: true,
    caption: repostComment,
    post: repostItem,
    forSale: forSale,
    postIndex: 0,
    likedBy: [],
    mentions: [],
    comments: 0,
    shares: 0,
    usersSeen: [],
    commentsHidden: false,
    likesHidden: false,
    archived: false,
    savedBy: [],
    multiPost: true,
    timestamp: serverTimestamp(),
    notificationToken: notificationToken,
    username: username,
    pfp: pfp,
    reportVisible: false,
    }).then(async() => await updateDoc(doc(db, 'posts', repostItem.id), {
      reposts: increment(1)
    })).then(() => 
            addDoc(collection(db, 'profiles', repostItem.userId, 'notifications'), {
              like: true,
              comment: false,
              friend: false,
              item: repostItem.id,
              repost: true,
              request: false,
              acceptRequest: false,
              theme: false,
              report: false,
              postId: repostItem.id,
              requestUser: user.uid,
              requestNotificationToken: repostItem.notificationToken,
              likedBy: [],
              timestamp: serverTimestamp()
            }).then(() => addDoc(collection(db, 'profiles', repostItem.userId, 'checkNotifications'), {
                userId: repostItem.userId
              }))).then(() => setLoading(false)).then(() => setRepostModal(false)).finally(() => schedulePushRepostNotification(repostItem.userId, username, repostItem.notificationToken))

  }
}
async function schedulePushRepostNotification(id, username, notificationToken) {
      let notis = (await getDoc(doc(db, 'profiles', id))).data().allowNotifications
      let banned = (await getDoc(doc(db, 'profiles', id))).data().banned
      if (notis && !banned) {
     fetch(`${BACKEND_URL}/api/repostNotification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username, pushToken: notificationToken,  "content-available": 1, data: {routeName: 'NotificationScreen', deepLink: 'nucliqv1://NotificationScreen'}, 
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
  async function removeHomeLike(item) {
    console.log(item)
    const updatedObject = { ...item };

    // Update the array in the copied object
    updatedObject.likedBy = item.likedBy.filter((e) => e != user.uid)
    const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      // Set the new array as the state
      setTempPosts(updatedData);
    }
    await updateDoc(doc(db, 'posts', item.id), {
      likedBy: arrayRemove(user.uid)
    }).then(async() => await deleteDoc(doc(db, 'profiles', user.uid, 'likes', item.id)))
    

  }
  const CustomDot = ({ onClick, post, ...rest }) => {
  const {
    onMove,
    index,
    active,
    carouselState: { currentSlide, deviceType }
  } = rest;
  const carouselItems = post;
  // onMove means if dragging or swiping in progress.
  // active is provided by this lib for checking if the item is active or not.
  return (
    <div className='justify-end flex items-end'>
      <button
      className={active ? "activeDot" : "inactiveDot"}
    >
      
    </button>
    </div>
    
  );
};
  function getCalculatedTime(time) {
    if (time != null) {
  const currentTimestamp = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
  const timeDifference = currentTimestamp - time.seconds;
  //console.log(currentTimestamp)
  //console.log(timeDifference)
    //console.log(time)
  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;
  const secondsInMonth = 30 * secondsInDay;
  const secondsInYear = 365 * secondsInDay;
  //console.log(timeDifference)
  if (timeDifference < secondsInMinute) {
    return `${timeDifference} second${timeDifference !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < secondsInHour) {
    const minutes = Math.floor(timeDifference / secondsInMinute);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < secondsInDay) {
    const hours = Math.floor(timeDifference / secondsInHour);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < secondsInMonth) {
    const days = Math.floor(timeDifference / secondsInDay);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else if (timeDifference < secondsInYear) {
    const months = Math.floor(timeDifference / secondsInMonth);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(timeDifference / secondsInYear);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
}
    }
  const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};
  const Row = ({index, item}) => (
    item.post != null && item.post.length > 1 ? 
    <div className='my-7 border-rounded-sm w-96 relative flex flex-col justify-center' style={{ 
    backgroundColor: "#121212",
    height: 700,
    backgroundImage: `url(${item.background})`, // Add background image URL here
    backgroundSize: 'cover',  // Or 'contain', depending on desired behavior
    backgroundPosition: 'center',
}}>
  <div className='mt-8'>
  <div className='bg-[#121212] rounded-xl m-5 pb-3'>
    <div className='flex p-5 py-3 items-center border-rounded-sm'>
         {item.pfp ? <img src={item.pfp} className='rounded-xl h-12 w-12 object-fill p-1 mr-3'/> : 
          <img src='../public/defaultpfp.jpg' height={44} width={44} style={{borderRadius: 8}}/>
          }
        <p className='flex-1 font-bold' style={{color: "#fafafa"}}>{item.username}</p>
        <button onClick={user.uid != null ? friends.filter(e => e.id === item.userId).length > 0 ? () => removeFriend(item.userId) : item.userId == user.uid || requests.filter(e => e.id === item.userId).length > 0 ? null : () => addFriend(item): null}>
              {requests.filter(e => e.id === item.userId).length > 0 ? <RequestedIcon color={"#9EDAFF"} width={65} height={32} /> : 
              friends.filter(e => e.id === item.userId).length > 0 ? <FollowingIcon color={"#9EDAFF"} width={70} height={32} />
              : item.userId == user.uid ? null : <FollowIcon color={"#9EDAFF"}  width={50} height={32}/>}
              
            </button>
    </div>
    <Carousel responsive={responsive}
    swipeable
    draggable={false}
    showDots={true}
    customDot={<CustomDot post={item.post}/>}
    ssr={true}
    transitionDuration={500}
    >
      {item.post.map((e) => {
        console.log(e)
        return (
           <div className='px-5 pb-5'>
          <img src={e.post} className='object-cover w-full rounded-md'/>
      </div>
        )
      })}
     
    </Carousel>
    </div>
    </div>
    <div className='bg-[#121212] rounded-xl m-5 mb-16 mt-0 relative'>
      
      <div className='flex justify-between pt-4 px-4'>
          <div className='flex space-x-4'>
            <div className='flex flex-row'>
              {item.likedBy.includes(user.uid) ? 
              <SolidHeart className='btn' style={{color: 'red'}} onClick={() => removeHomeLike(item, item.likedBy)}/> : <HeartIcon className='btn' onClick={() => addHomeLike(item, item.likedBy)}/>}
              <span className='cursor-pointer' onClick={() => setFocusedLikedItem(item)} style={{fontSize: 12.29, color: "#fafafa", alignSelf: 'center', paddingLeft: 5}}>{item.likedBy.length}</span>
            </div>
            <div className='flex flex-row' onClick={() => {setCommentModal(true); setFocusedItem(item)}}>
              <ChatBubbleBottomCenterIcon className='btn'/>
              <span style={{fontSize: 12.29, color: "#fafafa", alignSelf: 'center', paddingLeft: 5}}>{item.comments}</span>
            </div>
            <div className='flex flex-row'>
              {item.savedBy.includes(user.uid) ? 
              <SolidBookmark className='btn' style={{color: '#9EDAFF'}} onClick={() => removeHomeSave(item)}/> : <BookmarkIcon className='btn' onClick={() => addHomeSave(item)}/>}
            </div>
            {!item.private ? 
            <ArrowUturnRightIcon className='btn' onClick={() => setSendingModal(true)}/> : null}
            {item.post[0].text && item.userId != user.uid && !item.private ? 
          <div style={{flexDirection: 'row', display: 'flex', alignItems: 'center'}}>
          <div className='cursor-pointer' onClick={() => {setRepostModal(true); setRepostItem(item)}}>
            <ArrowPathIcon className='btn' color='#fafafa'/>
            {/* <AntDesign name='retweet' size={25} style={{alignSelf: 'center', paddingLeft: 5}} color={theme.color}/>  */}
          </div>
          {item.reposts ?
          <div>
            <p style={postFooterText}>{item.reposts > 999 && item.reposts < 1000000 ? `${item.reposts / 1000}k` : item.reposts > 999999 ? `${item.reposts / 1000000}m` : item.reposts}</p>
          </div>
          : null}
          </div>
          : null}
          </div>
          <label htmlFor="hero-select">
            {!isOpen && (
        <EllipsisVerticalIcon className='btn' onClick={toggleOpen}/>
            )}
      </label>
      {isOpen && ( 
        <ul className="dropdown-list">
          <li className='cursor-pointer' style={{color: "#fafafa", fontSize: 12.29, borderWidth: 0.5, borderColor: "#fafafa", padding: 5}} onClick={() => setReportModal(true)}>Report</li>

        </ul>
      )}
      </div>
      <p className='p-5 truncate text-white'>
        <span className='font-bold mr-1'>{item.username}</span> {item.caption}
      </p>
      
      </div>
      <div className='arrow' />
    </div>
    :
    item.post != null && item.post.length == 1 && !item.repost ?
    <div className='my-7 border-rounded-sm w-96 relative flex flex-col justify-center' style={{ 
    backgroundColor: "#121212",
    height: 700,
    backgroundImage: `url(${item.background})`, // Add background image URL here
    backgroundSize: 'cover',  // Or 'contain', depending on desired behavior
    backgroundPosition: 'center',
}}>
  <div className='mt-8'>
  <div className='bg-[#121212] rounded-xl m-5'>
    <div className='flex p-5 py-3 items-center border-rounded-sm'>
         {item.pfp ? <img src={item.pfp} className='rounded-xl h-12 w-12 object-fill p-1 mr-3'/> : 
          <img src='../public/defaultpfp.jpg' height={44} width={44} style={{borderRadius: 8}}/>
          }
        <p className='flex-1 font-bold' style={{color: "#fafafa"}}>{item.username}</p>
        <button onClick={user.uid != null ? friends.filter(e => e.id === item.userId).length > 0 ? () => removeFriend(item.userId) : item.userId == user.uid || requests.filter(e => e.id === item.userId).length > 0 ? null : () => addFriend(item): null}>
              {requests.filter(e => e.id === item.userId).length > 0 ? <RequestedIcon color={"#9EDAFF"} width={65} height={32} /> : 
              friends.filter(e => e.id === item.userId).length > 0 ? <FollowingIcon color={"#9EDAFF"} width={70} height={32} />
              : item.userId == user.uid ? null : <FollowIcon color={"#9EDAFF"}  width={50} height={32}/>}
              
            </button>
    </div>
    {item.post[0].image ? 
      <div className='px-5 pb-5'>
          <img src={item.post[0].post} className='object-cover w-full rounded-md'/>
      </div> : item.post[0].text ?
       <div style={{marginLeft: '5%'}}> 
          <p style={postText}>{item.post[0].value}</p>
       </div> : null}
   </div>
   </div>
      <div className='bg-[#121212] rounded-xl m-5 mb-16 mt-0 relative'>
      
      <div className='flex justify-between pt-4 px-4'>
          <div className='flex space-x-4'>
            <div className='flex flex-row'>
              {item.likedBy.includes(user.uid) ? 
              <SolidHeart className='btn' style={{color: 'red'}} onClick={() => removeHomeLike(item, item.likedBy)}/> : <HeartIcon className='btn' onClick={() => addHomeLike(item, item.likedBy)}/>}
              <span className='cursor-pointer' onClick={() => setFocusedLikedItem(item)} style={{fontSize: 12.29, color: "#fafafa", alignSelf: 'center', paddingLeft: 5}}>{item.likedBy.length}</span>
            </div>
            <div className='flex flex-row' onClick={() => {setCommentModal(true); setFocusedItem(item)}}>
              <ChatBubbleBottomCenterIcon className='btn'/>
              <span style={{fontSize: 12.29, color: "#fafafa", alignSelf: 'center', paddingLeft: 5}}>{item.comments}</span>
            </div>
            <div className='flex flex-row'>
              {item.savedBy.includes(user.uid) ? 
              <SolidBookmark className='btn' style={{color: '#9EDAFF'}} onClick={() => removeHomeSave(item)}/> : <BookmarkIcon className='btn' onClick={() => addHomeSave(item)}/>}
            </div>
            <ArrowUturnRightIcon className='btn' onClick={() => setSendingModal(true)}/>
            {item.post[0].text && item.userId != user.uid && !item.private ? 
          <div style={{flexDirection: 'row', display: 'flex', alignItems: 'center'}}>
          <div className='cursor-pointer' onClick={() => {setRepostModal(true); setRepostItem(item)}}>
            <ArrowPathIcon className='btn' color='#fafafa'/>
            {/* <AntDesign name='retweet' size={25} style={{alignSelf: 'center', paddingLeft: 5}} color={theme.color}/>  */}
          </div>
          {item.reposts ?
          <div>
            <p style={postFooterText}>{item.reposts > 999 && item.reposts < 1000000 ? `${item.reposts / 1000}k` : item.reposts > 999999 ? `${item.reposts / 1000000}m` : item.reposts}</p>
          </div>
          : null}
          </div>
          : null}
          </div>
          <label htmlFor="hero-select">
            {!isOpen && (
        <EllipsisVerticalIcon className='btn' onClick={toggleOpen}/>
            )}
      </label>
      {isOpen && ( 
        <ul className="dropdown-list">
          <li className='cursor-pointer' style={{color: "#fafafa", fontSize: 12.29, borderWidth: 0.5, borderColor: "#fafafa", padding: 5}} onClick={() => setReportModal(true)}>Report</li>

        </ul>
      )}
      </div>
      <p className='p-5 truncate text-white'>
        <span className='font-bold mr-1'>{item.username}</span> {item.caption}
      </p>
      
      </div>
      <div className='arrow' />
    </div> : 
    <div className='my-7 border-rounded-sm w-96 relative flex flex-col justify-center' style={{ 
    backgroundColor: "#121212",
    height: 700,
    backgroundImage: `url(${item.background})`, // Add background image URL here
    backgroundSize: 'cover',  // Or 'contain', depending on desired behavior
    backgroundPosition: 'center',
}}>
  <div className='mt-8'>
      <div className='bg-[#121212] rounded-xl m-5'>
      <div className='flex p-5 py-3 items-center border-rounded-sm'>
         {item.pfp ? <img src={item.pfp} className='rounded-xl h-12 w-12 object-fill p-1 mr-3'/> : 
          <img src='../public/defaultpfp.jpg' height={44} width={44} style={{borderRadius: 8}}/>
          }
        <p className='flex-1 font-bold' style={{color: "#fafafa"}}>{item.username}</p>
        <button onClick={user.uid != null ? friends.filter(e => e.id === item.userId).length > 0 ? () => removeFriend(item.userId) : item.userId == user.uid || requests.filter(e => e.id === item.userId).length > 0 ? null : () => addFriend(item): null}>
              {requests.filter(e => e.id === item.userId).length > 0 ? <RequestedIcon color={"#9EDAFF"} width={65} height={32} /> : 
              friends.filter(e => e.id === item.userId).length > 0 ? <FollowingIcon color={"#9EDAFF"} width={70} height={32} />
              : item.userId == user.uid ? null : <FollowIcon color={"#9EDAFF"}  width={50} height={32}/>}
              
            </button>
    </div>
    <div>
       <p style={rePostText}>{item.caption}</p>
          <button className='mb-5' onClick={() => router.push('Repost', {post: item.post.id, requests: requests, name: user.uid, groupId: null, video: false})} style={repostContainer}>
            <div style={postHeader}>
            {item.post.pfp ? <img src={item.post.pfp} style={{height: 33, width: 33, borderRadius: 8}}/> : 
          <UserCircleIcon style={{height: 33, width: 33, borderRadius: 8}}/>
          }
            <button className='mt-0 pt-0'>
              <span style={addText}>@{item.post.username}</span>
            </button>
            <span style={{fontSize: 12.29}}>{getDateAndTime(item.post.timestamp)}</span>
          </div> 
            <p style={actualrepostText} className=''>{item.post.post[0].value}</p>
          </button>
    </div>
    </div>
    </div>
    <div className='bg-[#121212] rounded-xl m-5 mb-16 mt-0 relative'>
      
      <div className='flex justify-between pt-4 px-4'>
          <div className='flex space-x-4'>
            <div className='flex flex-row'>
              {item.likedBy.includes(user.uid) ? 
              <SolidHeart className='btn' style={{color: 'red'}} onClick={() => removeHomeLike(item, item.likedBy)}/> : <HeartIcon className='btn' onClick={() => addHomeLike(item, item.likedBy)}/>}
              <span className='cursor-pointer' onClick={() => setFocusedLikedItem(item)} style={{fontSize: 12.29, color: "#fafafa", alignSelf: 'center', paddingLeft: 5}}>{item.likedBy.length}</span>
            </div>
            <div className='flex flex-row' onClick={() => {setCommentModal(true); setFocusedItem(item)}}>
              <ChatBubbleBottomCenterIcon className='btn'/>
              <span style={{fontSize: 12.29, color: "#fafafa", alignSelf: 'center', paddingLeft: 5}}>{item.comments}</span>
            </div>
            <div className='flex flex-row'>
              {item.savedBy.includes(user.uid) ? 
              <SolidBookmark className='btn' style={{color: '#9EDAFF'}} onClick={() => removeHomeSave(item)}/> : <BookmarkIcon className='btn' onClick={() => addHomeSave(item)}/>}
            </div>
            <ArrowUturnRightIcon className='btn' onClick={() => setSendingModal(true)}/>
            
          </div>
          <label htmlFor="hero-select">
            {!isOpen && (
        <EllipsisVerticalIcon className='btn' onClick={toggleOpen}/>
            )}
      </label>
      {isOpen && ( 
        <ul className="dropdown-list">
          <li className='cursor-pointer' style={{color: "#fafafa", fontSize: 12.29, borderWidth: 0.5, borderColor: "#fafafa", padding: 5}} onClick={() => setReportModal(true)}>Report</li>

        </ul>
      )}
      </div>
      <p className='p-5 truncate text-white'>
        <span className='font-bold mr-1'>{item.username}</span> {item.caption}
      </p>
      
      </div>
      <div className='arrow' />
      </div>
  )
  const ultimateContainer = {
    marginBottom: '7.5%',
      //marginTop: '7.5%',
      shadowColor: "#000000",
      elevation: 20,
      shadowOffset: {width: 2, height: 3},
      shadowOpacity: 0.5,
      shadowRadius: 1,
      //height: '90%',
      borderTopWidth: 0.25,
  }
  const postText = {
    fontSize: 12.29,
    padding: 5,
    color: "#fafafa",
    paddingBottom: 10
  }
  const rePostText = {
fontSize: 15.36,
    padding: 5,
    paddingTop: 0,
    paddingLeft: '5%',
    color: "#fafafa",
    paddingBottom: 10
  }
  const actualrepostText = {
    fontSize: 12.29,
    padding: 5,
    //paddingLeft: 10,
    color: "#fafafa",
    paddingBottom: 10
  }
  const postingContainer = {
      justifyContent: 'center',
      //flex: 1,
      //justifyContent: 'center',
      flexDirection: 'column',
      //alignItems: 'center',
      backgroundColor: "#005278",
  }
  const postFooterText = {
      fontSize: 12.29,
      color: "#fafafa",
      padding: 5,
      alignSelf: 'center'
  }
  const posting = {
    width: '60%',
      shadowColor: '#171717',
      shadowOffset: {width: -1, height: 3},
      shadowOpacity: 0.25,
      shadowRadius: 0.5,
      borderRadius: 8,
      paddingBottom: 25,
      marginTop: '5%',
      elevation: 20,
      backgroundColor: "#121212"
  }
  const postHeader = {
    flexDirection: 'row',
    display: 'flex',
    marginTop: 0,
      alignItems: 'center',
      flex: 1,
      margin: '2.5%',
      marginLeft: '3.5%',
  }
  const addText = {
    fontSize: 15.36,
    padding: 7.5,
    paddingTop: 10,
    paddingLeft: 15,
    alignSelf: 'center'
  }
  const addContainer = {
    marginLeft: 'auto',
      alignItems: 'flex-end',
  }
  useEffect(() => {
    if (focusedItem != null) {
      setCommentModal(true)
            let unsub;
            let fetchedCount = 0;
      const fetchCards = async () => {
        const q = query(collection(db, 'posts', focusedItem.id, 'comments'), orderBy('timestamp', 'desc'), limit(10));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              if (blockedUsers.includes(doc.data().userId)) {
                fetchedCount++;
                
              }
              else {
                setComments(prevState => [...prevState, {id: doc.id, revealed: false, translateX: 0, loading: false, showReply: false, ...doc.data()}])
              }
            });
            if (fetchedCount === 10 && comments.length === 0) {
              // All 3 posts were blocked, fetch more
              const nextQuery = query(
                collection(db, 'posts', focusedItem.id, 'comments'),
                orderBy('timestamp', 'desc'),
                startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]), // Start after last doc
                limit(10)
              );
              const nextSnapshot = await getDocs(nextQuery);
              nextSnapshot.forEach((doc) => {
                setComments(prevState => [...prevState, {id: doc.id, revealed: false, translateX: 0, loading: false, showReply: false, ...doc.data()}])
              })
            }
            //setLastCommentVisible(querySnapshot.docs[querySnapshot.docs.length-1])
      } 
      fetchCards();
      /* setTimeout(() => {
        setCommentDone(true);
        
      }, 1000); */
      return unsub;
    }
  }, [focusedItem])
  useEffect(() => {
    if (focusedLikedItem != null) {
      setLikesModal(true)
      setLikesLoading(true)
      if (focusedLikedItem.likedBy.length > 0) {
            focusedLikedItem.likedBy.slice(0, 100).map((item) => {
                const getData = async() => {
                    const userSnap = (await getDoc(doc(db, 'profiles', user.uid)))
                    if (userSnap.exists() && !userSnap.data().blockedUsers.includes(item)) {
                      const docSnap = (await getDoc(doc(db, 'profiles', item)))
                      if (docSnap.exists()) {
                      setLikesInfo(prevState => [...prevState, {id: docSnap.id, ...docSnap.data()}])
                      }
                    }         
                }
                getData();
            })
            setTimeout(() => {
                setLikesLoading(false)
            }, 1000);
        }
    }
  }, [focusedLikedItem])
  useEffect(() => { 
    const getProfileDetails = async() => {
    const docSnap = await getDoc(doc(db, 'profiles', user.uid)); 
      
    if (docSnap.exists()) {
      const profileVariables = {
        username: await(await getDoc(doc(db, 'profiles', user.uid))).data().userName,
        pfp: await(await getDoc(doc(db, 'profiles', user.uid))).data().pfp,
        followers: await(await getDoc(doc(db, 'profiles', user.uid))).data().followers,
        following: await(await getDoc(doc(db, 'profiles', user.uid))).data().following,
        forSale: await(await getDoc(doc(db, 'profiles', user.uid))).data().forSale,
        postBackground: await(await getDoc(doc(db, 'profiles', user.uid))).data().postBackground,
        blockedUsers: await (await getDoc(doc(db, 'profiles', user.uid))).data().blockedUsers,
        notificationToken: await (await getDoc(doc(db, 'profiles', user.uid))).data().notificationToken,
      };
      setUsername(profileVariables.username);
      setFollowers(profileVariables.followers)
      setFollowing(profileVariables.following)
      setPfp(profileVariables.pfp)
      setForSale(profileVariables.forSale)
      setBackground(profileVariables.postBackground)
      setBlockedUsers(profileVariables.blockedUsers)
      setNotificationToken(profileVariables.notificationToken)
    } 
  }
  getProfileDetails();
  }, [])
  useEffect(() => {
    if (router.query.post && reloadPage && blockedUsers != null) {
        console.log('first')
      setTempPosts([])
        setPostDone(false)
        new Promise(resolve => {
          const fetchCards = async () => {
            const docSnap = await getDoc(doc(db, 'posts', router.query.post))
            setTempPosts([{id: docSnap.id, ...docSnap.data()}])
          }
          fetchCards();
           resolve(); // Resolve the Promise after setCompleteMessages is done
      }).finally(() => {setLoading(false); setPostDone(true); setReloadPage(false)}); 
    }
    else if (meet && reloadPage && blockedUsers != null) {

        setTempPosts([])
        setPostDone(false)
        let fetchedCount = 0;
        new Promise(resolve => {
          const fetchCards = async () => {
            const q = query(collection(db, 'posts'), where('private', '==', false), orderBy('timestamp', 'desc'), limit(3));
            //console.log(q)
            const querySnapshot = await getDocs(q);
            console.log(querySnapshot.docs.length)
            querySnapshot.forEach((doc) => {
              if (blockedUsers.includes(doc.data().userId)) {
                  fetchedCount++; // Increment blocked count
                } else {
                  setTempPosts(prevState => [...prevState, { id: doc.id, loading: false, postIndex: 0, ...doc.data() }]);
                }
                
            });
            if (fetchedCount === 3 && tempPosts.length === 0) {
              // All 3 posts were blocked, fetch more
              const nextQuery = query(
                collection(db, 'posts'),
                where('private', '==', false),
                orderBy('timestamp', 'desc'),
                startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]), // Start after last doc
                limit(3)
              );
              const nextSnapshot = await getDocs(nextQuery);
              nextSnapshot.forEach((doc) => {
                setTempPosts(prevState => [...prevState, { id: doc.id, loading: false, postIndex: 0, ...doc.data() }]);
              })
            }

            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
          }
          fetchCards();
           resolve(); // Resolve the Promise after setCompleteMessages is done
      }).finally(() => {setLoading(false); setPostDone(true); setReloadPage(false)}); 
          
      }
      else if (following && reloadPage) {
        console.log('fist')
        setTempPosts([]);
        setPostDone(false)
        const fetchCards = async () => {
          const docSnap = await getDoc(doc(db, 'userFeeds', user.uid))
          setTempPosts(docSnap.data().posts.slice(followingCount - 7, followingCount))

        }
        fetchCards();
        setTimeout(() => {
          setFollowingCount(followingCount + 7)
            setPostDone(true)
            setLoading(false)
            setReloadPage(false)
          }, 1000);
        
      }
      
    }, [meet, following, reloadPage, blockedUsers, router.query])
    useEffect(() => {
    if (bottomObserver.current && !router.query.post) {
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !isFetching) {
          setIsFetching(true);
          Promise.all(fetchMorePosts()).finally(() => setIsFetching(false)); // Fetch more posts
        }
      }, { threshold: 0.5 }); // Trigger at 50% visibility

      observer.observe(bottomObserver.current);
      return () => observer.disconnect();
    }
  }, [isFetching, router.query]);
  const CustomCommentText = (props) => {
 const arr = props.text.split(' ');
  const reducer = (acc, cur, index) => {
    let previousVal = acc[acc.length - 1];
    if (
      previousVal &&
      previousVal.startsWith('@') &&
      previousVal.endsWith('@')
    ) {
      //console.log(acc[acc.length - 1])
      acc[acc.length - 1] = previousVal + ' ' + cur;
    } else {
      acc.push(cur);
    }
    return acc;
  };

  const text = arr.reduce(reducer, []);
  //console.log(text)
  const onTextLayout = useCallback(e => {
    //console.log(e.nativeEvent.lines.length)
  }, []);
  //console.log(usernames)
  //console.log(props.image)
  async function findUser(text) {
    const getData = async() => {
      const q = query(collection(db, "usernames"), where("username", "==", text));
      const docSnap = await getDocs(q)
      docSnap.forEach((item) => {
        if (item.id != undefined) {
        //console.log('first')
        setCommentModal(false)
        setFocusedPost(null)
        setComments([]);
        if (item.id == user.uid) {
          router.push('Profile', {screen: 'ProfileScreen', params: {name: user.uid, preview: false, viewing: false, previewImage: null, previewMade: false, applying: false}})
        }
        else {
        router.push('ViewingProfile', {name: item.id, viewing: true})
        }
      } 
      })
      /* */
    }
    getData();
    //console.log(text)
  }
  //console.log(usernames)
  return (
    //console.log(text),
      <p style={commentText}>
      {text.slice(0).map((text) => {

        if (text.startsWith('@')) {
          return (
              <p style={text.startsWith('@') ? usernames.some((substring) => text.includes(substring)) ? {fontWeight: '600'} : null : null} 
              onClick={usernames.some((substring) => text.includes(substring)) ? () => findUser(usernames.find((substring) => text.includes(substring))) : null}>
                {text.startsWith('@') ? text.replaceAll('@', '@') : null}{' '}
              </p>
            
          );
        }
        return `${text} `;
      })}
    </p>
  );
};
function getDateAndTime(timestamp) {
      if (timestamp != null) {
        //const formattedDate = new Date(timestamp.seconds*1000)
        //return formattedDate.toLocaleString()
      //console.log(date)
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
        return `3 weeks ago`
      }
      else if (date.getTime() <= twoWeeks.getTime()) {
        return `2 weeks ago`
      }
      else if (date.getTime() <= lastWeek.getTime()) {
        return `1 week ago`
      }
      else if (date.getTime() <= sixdays.getTime()) {
        return `6 days ago`
      }
      else if (date.getTime() <= fivedays.getTime()) {
        return `5 days ago`
      }
      else if (date.getTime() <= fourdays.getTime()) {
        return `4 days ago`
      }
      else if (date.getTime() <= threedays.getTime()) {
        return `3 days ago`
      }
      else if (date.getTime() <= twodays.getTime()) {
        return `2 days ago`
      }
      else if (date.getTime() <= yesterday.getTime()) {
        return `Yesterday`
      } 
      }
      
    }
    const observer = useRef();
    const textInputRef = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    else if (router.query.post) return;
    else if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && lastVisible) {
        fetchMorePosts();
      }
    },
    {rootMargin: "0px 0px -100px 0px"}
  );
    if (node) observer.current.observe(node);

  }, [loading, lastVisible, router.query]);
  function fetchMorePosts() {
      if (lastVisible != undefined && meet) {
    setLoading(true)
    let newData = [];
    let fetchedCount = 0;
      const fetchCards = async () => {
        newData = [];
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(4));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              if (blockedUsers.includes(doc.data().userId)) {
                fetchedCount++;
              }
              else {
                newData.push({
                    id: doc.id,
                    reportVisible: false,
                    ...doc.data()
                  })
              }
                
              
            });
            if (fetchedCount === 4 && newData.length === 0) {
              // All 3 posts were blocked, fetch more
              const nextQuery = query(
                collection(db, 'posts'),
                orderBy('timestamp', 'desc'),
                startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]), // Start after last doc
                limit(4)
              );
              const nextSnapshot = await getDocs(nextQuery);
              nextSnapshot.forEach((doc) => {
                newData.push({
                    id: doc.id,
                    reportVisible: false,
                    ...doc.data()
                  })
              })
            }
            if (newData.length > 0) {
                setTempPosts([...tempPosts, ...newData])
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
              }
      }
      fetchCards();
        setTimeout(() => {
          setLoading(false)
        }, 1000);
    }
    else if (lastVisible != undefined && following) {
      setLoading(true)
        const fetchCards = async () => {
          newData = [];
          const docSnap = await getDoc(doc(db, 'userFeeds', user.uid))
          setTempPosts([...tempPosts, ...docSnap.data().posts.slice(followingCount - 7, followingCount)])
        }
        fetchCards();
        setTimeout(() => {
          setFollowingCount(followingCount + 7)
            setLoading(false)
          }, 1000);
    }
    }
    async function toggleShowReply(e) {
    //setCommentDone(false)
   const updatedArray = comments.map(item => {
      if (item.id === e.id) {
        // Update the "isActive" property from false to true
        return { ...item, actualReplies: item.replies.slice(0, replyLastVisible + 2), showReply: true};
      }
      
      return item;
    });
    setReplyLastVisible(prevValue => prevValue + 2)
    setComments(updatedArray) 
  }
  const handleComment = (event) => {
    setComment(event.target.value)
}
const handleReply = (event) => {
  setReply(event.targe.value)
}
const handleSwipe = (dir) => {
    if (dir === 'left') {
      const updatedData = comments.filter((e) => e.id == tempReplyId)
              const newObject = {reply: reply,
                commentId: tempReplyId,
                loading: false,
            pfp: pfp,
            notificationToken: notificationToken,
            username: username,
            replyToComment: true,
            timestamp: Timestamp.fromDate(new Date()),
            likedBy: [],
            postId: focusedItem.id,
            user: user.uid}
            // Add the new object to the array
            updatedData[0].replies = [...updatedData[0].replies, newObject]
            const objectInd = comments.findIndex(obj => obj.id === tempReplyId)
            const dataUpdated = [...comments];
            dataUpdated[objectInd] = updatedData[0];
            setComments(dataUpdated)
      //setTranslateX(-80); // Swipe left to reveal (adjust based on the icon width)
    //  setRevealed(true);
    } else if (dir === 'right') {
      setTranslateX(0); // Swipe right to hide the icon
    //  setRevealed(false);
    }
  };
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    trackMouse: true, // Enables mouse tracking for desktop swipes
  });
    const commentHeader ={
        flexDirection: 'row',
        marginTop: 5,
        marginLeft: '5%',
        marginRight: '5%',
        display: 'flex'
    }
    const name = {
        fontSize: 15.36,
        paddingTop: 5,
        color: "#fafafa"
        //width: '95%'
    }
    const message = {
        fontSize: 15.36,
        paddingBottom: 5,
        color: "#fafafa"
    }
    const noCommentsText = {
      fontSize: 19.20,
        padding: 10,
        color: "#fafafa"
    }
    const noCommentsTextSupp = {
      fontSize: 15.36,
        padding: 10,
        color: "#fafafa"
    }
    const commentSection = {
        marginLeft: '1.5%',
        width: '90%'
    }
    const captionText = {
      padding: 10,
      fontSize: 15.36,
      color: '#fafafa',
    }
    const header = {
        fontSize: 19.20,
        color: "#fafafa",
        marginLeft: '42.5%'
        //marginLeft: 'auto'
    }
    const usernameText = {
        fontSize: 15.36,
        paddingTop: 0,
        color: "#fafafa",
        padding: 5,
        paddingBottom: 0
    }
     const usernameTextSending = {
        fontSize: 12.29,
        color: "#fafafa",
        alignSelf: 'center',
        padding: 5
    }
    const usernameTextSendingChecked = {
        fontSize: 12.29,
        color: "#fafafa",
        marginTop: -27.5,
        alignSelf: 'center',
        padding: 5
    }
    const addCommentSecondContainer = {
        //flexDirection: 'row',
   
        marginBottom: '10%',
        marginLeft: '-5%',
        backgroundColor: "#121212",
        //flex: 1,
        //marginHorizontal: '5%',
        //marginBottom: '17.5%',
        width: '105%',
        borderColor: "#fafafa"
    }
    const input = {
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
    const friendsContainer = {
      borderRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#d3d3d3",
        padding: 10,
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        marginLeft: '2.5%'
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
    const handleRepostComment = (event) => {
    setRepostComment(event.target.value)
  }
    const commentText = {
      fontSize: 15.36,
      color: "#fafafa",
        padding: 5,
        paddingBottom: 0
    }
    const commentFooterContainer = {
      flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        display: 'flex'
    }
    const repost = {
      fontSize: 15.36,
      marginLeft: '5%',
      padding: 5,
      color: "#fafafa"
    }
    const listItemContainer = {
      flexDirection: 'row',
      display: 'flex',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: '5%',
    padding: 5
    }
    const reportSupplementText = {
      fontSize: 15.36,
    color: "#fafafa",
    padding: 10,
    alignSelf: 'center'
    }
    const reportContentText = {
       fontSize: 19.20,
    color: "#fafafa",
    textAlign: 'center',
    padding: 10
    }
    const reportThanksContentText = {
      fontSize: 24, 
      fontWeight: '600', 
      color: "#fafafa",
      marginVertical: '5%',
    textAlign: 'center',
    padding: 10

    }
    const headerHeader = {
        color: "#fafafa",
        fontSize: 24,
        padding: 10,
        textAlign: 'center'
    }
    const repostCommentStyle = {
      marginLeft: '5%',
      backgroundColor: "#121212",
      padding: 5,
      color: "#fafafa",
      fontSize: 19.20,
        paddingBottom: 20
    }

    const postRepostHeader = {
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      margin: '2.5%',
      marginTop: 0,
      marginLeft: '3.5%',
    }
    const repostContainer = {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#fafafa",
      width: '90%',
      marginLeft: '5%'
    }
    const addRepostText = {
      fontSize: 15.36,
      color: "#fafafa",
      padding: 7.5,
      paddingTop: 0,
      //width: '99%',
      paddingLeft: 15,
      //width: '98%',
      alignSelf: 'center'
    }
    const dateText = {
      fontSize: 12.29,
        padding: 5,
        width: 100,
        color: "#fff",
        alignSelf: 'center'
    }
    const replyStyle = {
      alignSelf: 'center',
        marginLeft: '5%',
    }
    const replyText = {
      fontSize: 12.29,
        color: "grey",
    }
    const viewRepliesText = {
      fontSize: 12.29,
        padding: 5,
        color: "#fff"
    }
    useEffect(() => {
    if (commentModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset'; // or 'auto', depending on your desired default
    }
  }, [commentModal]);
  return (
    <body className='mx-32' ref={dropdownRef}>
        {router.query.post ? 
        <div className='backButtonContainer'>
            <ChevronLeftIcon className='btn' style={{alignSelf: 'center'}} onClick={() => router.back()}/>
            <span style={headerHeader}>Viewing Post</span>
        </div> : null}
    <div className='flex-grow' style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth: '100vw'}}>
      {tempPosts.map((e, index) => {
        if (tempPosts.length === index + 1) {      
            return (
          <div ref={lastElementRef} key={e.id}>
        <Row index={index} item={e}/>
        </div>
            )
          
          }
          else {
            return(
            <div key={e.id}>
        <Row index={index} item={e}/>
        </div>
            )
          }
      })}
      <ReactModal isOpen={reportModal} style={{content: {width: '40%',
      left: '50%',
      right: 'auto',
      borderRadius: 10,
      transform: 'translate(-50%, 0)',
      backgroundColor: "#121212",
      marginRight: '-50%',}}}>
       <div>
                {loading ? <div style={{flex: 1, alignItems: 'center', justifyContent:'center', marginBottom: '20%'}}>
        <BeatLoader color={ "#9EDAFF"}/> 
        </div> : !finishedReporting ? 
        <>
                <p style={reportContentText}>Why Are You Reporting This Content?</p>
                <p style={reportSupplementText} className='mb-10'>Don't Worry Your Response is Anonymous! If it is a Dangerous Emergency, Call the Authorities Right Away!</p>
                <div className='divider'/>
                <div className='cursor-pointer' style={listItemContainer} onClick={() => onSecondPress('Discrimination')}>
                  <p style={reportSupplementText}>Discrimination</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={listItemContainer} onClick={() => onSecondPress('General Offensiveness')}>
                  <p style={reportSupplementText}>General Offensiveness</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={listItemContainer} onClick={() => onSecondPress('Gore/Excessive Blood')}>
                  <p style={reportSupplementText}>Gore / Excessive Blood</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={listItemContainer} onClick={() => onSecondPress('Nudity/NSFW Sexual Content')}>
                  <p style={reportSupplementText}>Nudity / NSFW Sexual Content</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={listItemContainer} onClick={() => onSecondPress('Scammer/Fraudulent User')}>
                  <p style={reportSupplementText}>Scammer / Fraudulent User</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={listItemContainer} onClick={() => onSecondPress('Spam')}>
                  <p style={reportSupplementText}>Spam</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={listItemContainer} onClick={() => onSecondPress('Toxic/Harassment')}>
                  <p style={reportSupplementText}>Toxic / Harassment</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={listItemContainer} onClick={() => onSecondPress('Violent Behavior')}>
                  <p style={reportSupplementText}>Violent Behavior</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={listItemContainer} onClick={() => onSecondPress('Other')}>
                  <p style={reportSupplementText}>Other</p>
                  
                </div> 
                </>
             : 
            <div style={{flex: 1}}>
            <div style={{flex: 1, justifyContent: 'center', marginBottom: '50%'}}>
            <p style={reportThanksContentText}>Thanks for submitting your anonymous response!</p>
            <p style={reportThanksContentText}>User has been notified about the report.</p>
            <p style={reportThanksContentText}>Thanks for keeping NuCliq safe!</p>
            </div>
            </div>
            }
        </div>
        <button className="close-button" onClick={() => setReportModal(false)}>
        <XMarkIcon className='btn'/>
            </button>
      </ReactModal>
      <ReactModal isOpen={repostModal} style={{content: {width: '40%',
      left: '50%',
      right: 'auto',
      borderRadius: 10,
      transform: 'translate(-50%, 0)',
      backgroundColor: "#121212",
      marginRight: '-50%',}}}>
              {repostItem ? <div style={{justifyContent: 'center', marginTop: '15%'}}>
                <textarea maxLength={200} value={repostComment} onChange={handleRepostComment} placeholder='Add a comment...' color='#fafafa' style={repostCommentStyle}/>
              {/* <pInput multiline maxLength={200} value={repostComment} onKeyPress={handleKeyPress} onChangeText={handleRepostComment} placeholder='Add a comment...' placeholderTextColor={"#fafafa"} style={[styles.repost, {fontSize: 19.20, maxHeight: 200, paddingBottom: 20}]}/> */}
              <p style={{textAlign: 'right', marginRight: '5%', marginBottom: '5%', fontSize: 12.29, color: "#fafafa"}}>{repostComment.length}/200</p>
              <div style={repostContainer}>
                <div style={postRepostHeader}>
            {repostItem.pfp ? <img src={repostItem.pfp} style={{height: 33, width: 33, borderRadius: 8}}/> : 
          <UserCircleIcon style={{height: 33, width: 33, borderRadius: 8}}/>
          }
            <div className='cursor-pointer' onClick={repostItem.userId != user.uid ? () => router.push('ViewingProfile', {name: repostItem.userId, viewing: true}) : () => router.push('Profile', {screen: 'ProfileScreen', params: {name: user.uid, preview: false, viewing: false, previewImage: null, previewMade: false, applying: false}})}>
              <p style={addRepostText}>@{repostItem.username}</p>
            </div>
          </div> 
                <p style={repost}>{repostItem.post[0].value}</p>
              </div>
              </div> 
              : <p>Sorry, something went wrong, please try again.</p>}
              

              <div style={{flex: 1, alignItems: 'flex-end', marginRight: '5%', marginTop: '5%'}}>
                {repostLoading ? <BeatLoader color={"9edaff"}/> : 
                <div className='flex justify-end mt-5'>
                <NextButton text={"Re-vibe"} onClick={rePostFunction}/> 
                </div>}
              </div>
              <button className="close-button" onClick={() => setRepostModal(false)}>
        <XMarkIcon className='btn'/>
            </button>
      </ReactModal>
      <ReactModal isOpen={likesModal} style={{content: {width: '40%',
      left: '50%',
      right: 'auto',
      borderRadius: 10,
      transform: 'translate(-50%, 0)',
      backgroundColor: "#121212",
      marginRight: '-50%',}}}>
        <div>
       <div style={{}}>
            <p style={header}>Likes: </p>
        </div>
      <div className='divider'/>
      {likesInfo.length == 0 && !likesLoading ? 
        <div style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <p style={{fontSize: 24, color: "#fafafa"}}>No Likes Yet!</p>
          </div> 
          :
          <>
      {!likesLoading ?
      likesInfo.map((item, index) => {
        return (
           <div key={index}>
            <div className='cursor-pointer' style={friendsContainer} onClick={item.id !== user.uid ? () => router.push('ViewingProfile', {name: item.id, viewing: true}) : () => navigation.navigate('Profile', {screen: 'ProfileScreen', params: {name: user.uid, preview: false, viewing: false, previewImage: null, previewMade: false, applying: false}})}>
                <div style={{flexDirection: 'row', display: 'flex'}}>
                  {item.pfp ? 
                  <img src={item.pfp} style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}}/> :
                  <UserCircleIcon style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}}/>
                  }
                    
                 <div style={{paddingLeft: 20, width: '70%', justifyContent: 'center'}}>
                    <p className='numberOfLines1' style={name}>{item.firstName} {item.lastName}</p>
                    <p className='numberOfLines1' style={message}>@{item.userName}</p>
                </div>
                </div>

            </div>
          </div>
        )
      })
      : likesLoading ? <div style={{flex: 1, alignItems: 'center', justifyContent:'center', marginBottom: '50%'}}>
        <BeatLoader color='#9edaff'/>
        </div> : null}
        </>
}
    </div>
    <button className="close-button" onClick={() => setLikesModal(false)}>
        <XMarkIcon className='btn'/>
            </button>
      </ReactModal>
      <ReactModal isOpen={sendingModal} style={{content: {width: '40%',
      left: '50%',
      right: 'auto',
      borderRadius: 10,
      transform: 'translate(-50%, 0)',
      backgroundColor: "#121212",
      marginRight: '-50%',}}}>
         <div className='flex flex-col'>
        <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-between', marginHorizontal: '5%'}}>
            <p style={header}>Send To: </p>
            <XMarkIcon className='btn' onClick={() => setSendingModal(false)}/>
        </div>
        <div className='flex flex-row flex-wrap'>
        {friendsInfo.map((item, index) => {
            return (
                <div key={index} style={{width: '30%', margin: 5, alignItems: 'center', justifyContent: 'center'}}>
            <div className='cursor-pointer items-center flex flex-col'  onClick={() => renderChecked(item)}>
              {item.pfp ? <img src={item.pfp ? item.pfp : require('../public/defaultpfp.jpg')} style={{height: 55, width: 55, borderRadius: 55, alignSelf: 'center'}}/> : 
              <UserCircleIcon className='userBtn' style={{height: 55, width: 55, borderRadius: 55, alignSelf: 'center'}}/>}
                
                {item.checked ? <CheckIcon color='#9edaff' className='btn' style={{position: 'relative', bottom: 20, left: 80}}/> : null}
                {!item.checked ? <p style={usernameTextSending} className='numberOfLines1'>{item.userName}</p> 
                : <p style={usernameTextSendingChecked} className='numberOfLines1'>{item.userName}</p>}
                
            </div>
            
            </div>
            )
        })}
        </div>
      {actuallySending ?
      <div style={addCommentSecondContainer} className='bg-black flex flex-col items-center absolute bottom-0 w-full'>
            <textarea style={input} placeholder='Add Message...' className='text-white' maxLength={200} value={caption} onChange={handleCaption}/>
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
      <ReactModal isOpen={commentModal} style={{content: {width: '60%',
      left: '50%',
      borderRadius: 15,
      right: 'auto',
      backgroundColor: "#121212",
      transform: 'translate(-50%, 0)',
      marginRight: '-50%',}}} preventScroll={true} onRequestClose={() => {setCommentModal(false); setComments([])}}>
        <div className='swipe-container' {...swipeHandlers} style={{flex: 1, display: 'flex', flexDirection: 'row', height: '100%'}}>
            {focusedItem != null && focusedItem.post != null ?
    <div className='border-rounded-sm' style={{ 
    backgroundColor: "#121212",
    backgroundImage: `url(${focusedItem.background})`, // Add background image URL here
    backgroundSize: 'cover',  // Or 'contain', depending on desired behavior
    backgroundPosition: 'center',
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    width: '50%',
    justifyContent: 'center'
}}>
  <div className='flex flex-col items-center justify-center' style={{display: 'flex', height: '100%'}}>
  <div className='bg-[#121212] items-center justify-center rounded-xl pb-5' style={{width: '75%', marginLeft: '10%'}}>
    <div className='flex p-5 py-3 items-center border-rounded-sm'>
         {focusedItem.pfp ? <img src={focusedItem.pfp} className='rounded-xl h-12 w-12 object-fill p-1 mr-3'/> : 
          <img src='../public/defaultpfp.jpg' height={44} width={44} style={{borderRadius: 8}}/>
          }
        <p className='flex-1 font-bold' style={{color: "#fafafa"}}>{focusedItem.username}</p>
        <button onClick={user.uid != null ? friends.filter(e => e.id === focusedItem.userId).length > 0 ? () => removeFriend(focusedItem.userId) : focusedItem.userId == user.uid || requests.filter(e => e.id === focusedItem.userId).length > 0 ? null : () => addFriend(focusedItem): null}>
              {requests.filter(e => e.id === focusedItem.userId).length > 0 ? <RequestedIcon color={"#9EDAFF"} width={65} height={32} /> : 
              friends.filter(e => e.id === focusedItem.userId).length > 0 ? <FollowingIcon color={"#9EDAFF"} width={70} height={32} />
              : focusedItem.userId == user.uid ? null : <FollowIcon color={"#9EDAFF"}  width={50} height={32}/>}
              
            </button>
    </div>
    {focusedItem.post.length > 1 ? 
    <Carousel responsive={responsive}
    swipeable
    draggable={false}
    showDots={true}
    customDot={<CustomDot post={focusedItem.post}/>}
    ssr={true}
    transitionDuration={500}
    >
      {focusedItem.post.map((e) => {
        return (
           <div className='px-5 pb-5'>
          <img src={e.post} className='object-cover w-full rounded-md'/>
      </div>
        )
      })}
     
    </Carousel> :
    focusedItem.post[0].image ? 
      <div className='px-5 pb-5'>
          <img src={focusedItem.post[0].post} className='object-cover w-full rounded-md'/>
      </div> : focusedItem.post[0].text ?
       <div style={{marginLeft: '5%'}}> 
          <p style={postText}>{focusedItem.post[0].value}</p>
       </div> : null}
   </div>
   </div>
    </div> : null}
    <div style={{flex: 1}} ref={commentDivRef} className='commentScrollable'>
      <div style={{justifyContent: 'flex-end', display: 'flex'}}>
        </div>
      {focusedItem ? focusedItem.caption.length > 0 && !reportCommentModal ? 
        <>
        <div style={{flexDirection: 'row', display: 'flex', width: '95%', margin: '2.5%'}}>
          <img src={focusedItem.pfp ? focusedItem.pfp : defaultpfp} style={{width: 40, height: 40, borderRadius: 8, marginRight: 5}}/>
          <div style={{flexWrap: 'wrap'}}>
            <p style={usernameText} className='numberOfLines1'>{focusedItem.username}</p>
            <p style={captionText}>{focusedItem.caption}</p>
          </div>
          
        </div>
        <div className='divider' style={{marginTop: -5}}/>
        </>
        : null : null }
      {comments.length == 0 ? 
        <div className='items-center flex justify-center flex-col'>
            <p style={noCommentsText}>No Comments Yet</p>
            <p style={noCommentsTextSupp}>Be the First to Comment!</p>
        </div>
        :
      
      comments.slice().sort((a, b) => b.timestamp - a.timestamp).map((item) => {
        return (
          <div style={{width: 555}}>
          <div style={commentHeader}>
          {item.pfp ? <img src={item.pfp} style={{height: 35, width: 35, borderRadius: 17.5}}/> :
          <img src='../public/defaultpfp.jpg' style={{height: 35, width: 35, borderRadius: 17.5}}/>}
            
            <div style={commentSection}>
              <div onClick={item.user == user.uid ? null : () => {setCommentModal(false); router.push('ViewingProfile', {name: item.user, viewing: true})}}>
                <p style={usernameText}>@{item.username}</p>
              </div>
                
                  <CustomCommentText text={`${item.comment}`}/>
                <div style={commentFooterContainer}>
                    <div style={{flexDirection: 'row', display: 'flex'}}>
                        <p style={dateText}>{getDateAndTime(item.timestamp)}</p>
                        <div className='cursor-pointer' style={replyStyle} onClick={() => {setReplyFocus(true); if (textInputRef.current) {
      textInputRef.current.focus();
    } setTempReplyName(item.username); setTempReplyId(item.id)}}>
                            <p style={replyText}>Reply</p>
                        </div>
                    </div>
                    <div style={{flexDirection: 'row', display: 'flex'}}>
                        <div style={{flexDirection: 'row'}} onClick={item.likedBy.includes(user.uid) == false ? () => {addLike(item)} : () => {removeLike(item)}}>
                            {item.likedBy.includes(user.uid) ? <HeartIcon className='btn' style={{alignSelf: 'center', paddingRight: 3}} color="red"/> : <HeartIcon className='btn' style={{alignSelf: 'center'}} color="#808080"/>}
                        </div>
                        <p style={commentText}>{item.likedBy.length}</p>
                    </div>
                </div>
                {item.replies.length == 1 && item.showReply == false ? <div style={{flexDirection: 'row', display: 'flex'}} onClick={() => toggleShowReply(item)}>
                    <p style={viewRepliesText}>View {item.replies.length} Reply</p>
                    <ChevronDownIcon className='btn' style={{alignSelf: 'center'}}/>
                </div> : item.replies.length > 1 && item.showReply == false ? <div style={{flexDirection: 'row', display: 'flex'}} onClick={() => toggleShowReply(item)}>
                    <p style={viewRepliesText}>View {item.replies.length} Replies</p>
                    <ChevronDownIcon className='btn' style={{alignSelf: 'center'}}/>
                </div> : <></>}
                {item.showReply ? 
                    <div>
                        {item.actualReplies.map((element) => {
                          const closeRow = (index) => {
                              console.log('closerow');
                              if (prevOpenedRow && prevOpenedRow !== row[index]) {
                                prevOpenedRow.close();
                              }
                              prevOpenedRow = row[index];
                            };
                            //console.log(element)
                            const renderRightActions = (progress, dragX, onClick) => {
                              return (
                                <div style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                  {element.user === user.uid ? 
                                    <div
                                  style={{
                                    margin: 0,
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                    width: 70,
                                  }} onClick={() => deleteReply(item, element)}>
                                  <TrashIcon className='btn' color='red'/>
                                </div>  : null}
                                {element.user !== user.uid && !reportedComments.includes(element.id) ? 
                                <div
                                  style={{
                                    margin: 0,
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                    width: 70,
                                  }} onClick={() => {setReportCommentModal(true); setReportComment(item)}}>
                                  <FlagIcon className='btn'/>
                                  <p style={{alignSelf: 'center', color: 'red', fontSize: 12.29}}>Report</p>
                                </div> : null}
                                </div>
                              );
                            };
                            return (
                              !item.loading ? 
                              <>
                                <div style={commentHeader}>
                                     {element.pfp ? <img src={element.pfp} style={{height: 35, width: 35, borderRadius: 17.5}}/> :
          <img src='../public/defaultpfp.jpg' style={{height: 35, width: 35, borderRadius: 17.5}}/>}
                                    <div style={commentSection}>
                                    {element.replyToComment == true ? <div onClick={item.user == user.uid ? null : () => {setCommentModal(false); router.push('ViewingProfile', {name: item.user, viewing: true})}}>
                <p style={usernameText}>@{element.username}</p>
              </div> : <div onClick={item.user == user.uid ? null : () => {setCommentModal(false); router.push('ViewingProfile', {name: item.user, viewing: true})}}>
                                    <p style={usernameText}>@{element.username} {'>'} @{element.replyTo}</p>
                                    </div>}
                                    <CustomCommentText text={`${element.reply}`}/>
                                    <div style={commentFooterContainer}>
                                        <div style={{flexDirection: 'row'}}>
                                            <p style={dateText}>{element.timestamp ? getDateAndTime(element.timestamp) : null}</p>
                                            <div style={replyStyle} className='cursor-pointer' onClick={() => {setReplyToReplyFocus(true); setTempReplyName(element.username); setTempCommentId(item.id); setTempReplyId(element.id)}}>
                                                <p style={replyText}>Reply</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    
                                    </div>
                                </div>
                                {replyLastVisible < item.replies.length && item.actualReplies.indexOf(element) == replyLastVisible - 1 ? <div style={{marginLeft: '7.5%', paddingLeft: 0, padding: 10,}} onClick={() => toggleShowReply(item)}>
                          <p style={{textAlign: 'left', color: "#fafafa"}}>Show more replies</p>
                        </div> : null}
                        </> : <div style={{margin: '2.5%'}}>
            <BeatLoader color="#9edaff" />
          </div>
                            )
                        })}
                        
                        
                    
                    </div> 
                    : 
                    <div>

                    </div>}
                    
            </div>
            
        </div>
        </div>
        )
      })}
      <div style={{position: 'absolute', bottom: 30, width: '100%'}}>
        <div style={{flexDirection: 'row', display: 'flex', alignItems: 'center', borderTopWidth: 1, borderColor: "#fafafa"}}>
      {pfp != undefined ? <img src={pfp} style={{height: 35, width: 35, borderRadius: 25, marginLeft: 5}}/> :
          <img src='../public/defaultpfp.jpg' style={{height: 35, width: 35, borderRadius: 25, marginLeft: 5}}/>}
          {replyToReplyFocus ? 
      <textarea value={reply} maxLength={200}
        onChange={handleReply}
       className='bg-transparent text-white w-full pt-5' style={{fontSize: 15.36, paddingVertical: 10, padding: 5, display: 'flex'}} placeholder={tempReplyName != undefined ? `Reply To ${tempReplyName}` : 'Reply To'} color='#fafafa'/> : replyFocus ? 
       <textarea value={reply} maxLength={200}
        onChange={handleReply}
       className='bg-transparent text-white w-full pt-5' style={{fontSize: 15.36, paddingVertical: 10, padding: 5, display: 'flex'}} placeholder={tempReplyName != undefined ? `Reply To ${tempReplyName}` : 'Reply To'} color='#fafafa'/> : <textarea value={comment}
        onChange={handleComment} maxLength={200}
       className='bg-transparent text-white' style={{fontSize: 15.36, paddingLeft: 5, paddingTop: 20, width: '45%'}} placeholder='Add Comment...' color='#fafafa'/>}
       <div className='justify-end flex items-end ml-3'>
      <button style={{borderRadius: 10, borderWidth: 1, height: 40, borderColor: "#9EDAFF", marginTop: 10, backgroundColor: "#9EDAFF"}}>
        <p style={{fontSize: 12.29,
        color: "#121212",
        padding: 6,
        paddingLeft: 12.5,
        paddingRight: 12.5,
        textAlign: 'center'}}>Send</p>
    </button>
    </div>
      </div>
      </div>
    </div>
          
          
        </div>
      <button className="close-button" onClick={() => setCommentModal(false)}>
        <XMarkIcon className='btn'/>
            </button>
      </ReactModal>
    </div>
    </body>
  )
}

export default Post