import React from 'react'
import { useEffect, useState, useRef, useCallback } from 'react'
import {collection, getDocs, getDoc, doc, query, orderBy, limit, startAfter, where} from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuth } from '@/context/AuthContext'
import { ArrowUturnRightIcon, ChatBubbleBottomCenterIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon, AtSymbolIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid'
import 'reactjs-popup/dist/index.css';
import ReactModal from 'react-modal'
import { BeatLoader } from 'react-spinners'
import { useRouter } from 'next/router'
import { useSpring } from '@react-spring/web'
import FollowButtons from './FollowButtons'
import ReportModal from './ReportModal'
import Comments from './Comments'
import { ableToShareVideoFunction, addHomeLikeVideoFunction, addHomeSaveVideoFunction, deleteReplyFunction, 
  fetchMorePublicPostsExcludingBlockedUsersVideo, fetchPublicPostsExcludingBlockedUsersVideo, fetchReportedPosts, getProfileDetails, 
  removeHomeSaveVideoFunction, removeLikeVideoFunction, addCommentLike, removeCommentLike } from '@/firebaseUtils'
import SendingModal from './SendingModal'
import { styles } from '@/styles/styles'
import LikeButton from './LikeButton'
function VidPosts() {
  const [meet, setMeet] = useState(true);
  const [reloadPage, setReloadPage] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState(null);
  const [tempPosts, setTempPosts] = useState([]);
  const containerRef = useRef(null);
   const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(0);

  // useEffect to handle the initial fast scroll
  useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const handleWheel = (event) => {
    event.preventDefault();

    if (!isScrolling) {
      setIsScrolling(true);
      const delta = Math.sign(event.deltaY);
      setScrollDirection(delta);

      // Calculate and set the targetIndex
      let newIndex = activeIndex + delta; // Use delta to determine direction
      newIndex = Math.max(0, Math.min(newIndex, 2));

      container.scrollTo({
        top: newIndex * container.offsetHeight,
        behavior: "smooth",
      });
      setTimeout(() => {
        setIsScrolling(false);
        setActiveIndex(newIndex);
      }, 1500);
    }
  };

  container.addEventListener("wheel", handleWheel);
  return () => container.removeEventListener("wheel", handleWheel);
}, [activeIndex, isScrolling, scrollDirection]);
  const [{ scrollY }, set] = useSpring(() => ({ scrollY: 0, 
    config: {clamp: true, mass: 1, tension: 180, friction: 12},
    onRest: ({ value }) => {
    const { scrollY } = value;
    const closestSnapPoint = snapPoints.reduce((prev, curr) => {
      return Math.abs(curr - scrollY) < Math.abs(prev - scrollY) ? curr : prev;
    });
    // Add a small threshold for snapping
    if (Math.abs(scrollY - closestSnapPoint) < 10) { 
      set({ scrollY: closestSnapPoint });
    }
  }
  
  }));
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const [reportedPosts, setReportedPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [likesModal, setLikesModal] = useState(false);
  const [ableToShare, setAbleToShare] = useState(true);
  const [reportModal, setReportModal] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [focusedLikedItem, setFocusedLikedItem] = useState(null);
  const [likesLoading, setLikesLoading] = useState(false);
  const [likesInfo, setLikesInfo] = useState([]);
  const [forSale, setForSale] = useState(false);
  const [background, setBackground] = useState(null);
  const [usernames, setUsernames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postDone, setPostDone] = useState(false);
  const snapPoints = [0, 300, 600, 900];
  const [replyLastVisible, setReplyLastVisible] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [sendingModal, setSendingModal] = useState(false);
  const [username, setUsername] = useState('')
  const [pfp, setPfp] = useState(null);
  const [notificationToken, setNotificationToken] = useState(null); 
  const [focusedItem, setFocusedItem] = useState(null);
  const {user} = useAuth();
  const [isFetching, setIsFetching] = useState(false);
  const [commentModal, setCommentModal] = useState(false)
  const bottomObserver = useRef(null);
  const dropdownRef = useRef(null);
  useEffect(() => {
    let unsubscribe;

    if (user?.uid) {
      // Use the utility function to subscribe to changes
      unsubscribe = fetchReportedPosts(user.uid, setReportedPosts);
    }

    // Cleanup the listener on unmount
    return () => {
      if (unsubscribe) {
        return unsubscribe;
      }
    };
  }, [user?.uid]);
  useEffect(() => {
    const fetchPostExistence = async () => {
      if (focusedItem != null) {
        try {
          const exists = await ableToShareVideoFunction(focusedItem.id);
          setAbleToShare(exists);
        } catch (error) {
          console.error(error.message);
          setAbleToShare(false); // Handle error by setting `ableToShare` to false
        }
      }
    };

    fetchPostExistence();
  }, [focusedItem]);
   
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
    /* useEffect(() => {
      const getUsernames = async() => {
        (await getDocs(collection(db, 'usernames'))).forEach((doc) => {
          setUsernames(prevState  => [...prevState, doc.data().username])
        })
      }
      getUsernames()
    }, []) */
    async function addHomeSave(item) {
    await addHomeSaveVideoFunction(item, user, tempPosts, setTempPosts)
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
    await removeHomeSaveVideoFunction(item, user, tempPosts, setTempPosts)
    
  }
    async function addHomeLike(item, likedBy) {
      await addHomeLikeVideoFunction(item, likedBy, user, tempPosts, setTempPosts, schedulePushLikeNotification, username)
  }
  async function removeHomeLike(item) {
    await removeLikeVideoFunction(item, user, tempPosts, setTempPosts)
  }
  async function removeLike(item) {
  await removeCommentLike(item, user, setComments, comments, focusedItem)
  }
async function addLike(item) {
  await addCommentLike(item, user, setComments, comments, username, focusedItem)
  }
  //console.log(isLoaded)
  const Row = ({ index, item }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false); // Track load state for this specific video

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleCanPlay = () => {
      if (video) {
        video.play(); // Play only when video is ready
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true); // Load the video source when it enters view
          video.addEventListener('canplay', handleCanPlay); // Wait for video to be ready
        } else {
          video.pause();
        }
      },
      {
        root: null, // Default to viewport as root
        rootMargin: '0px',
        threshold: 0.5, // Play when 50% visible
      }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
      video.removeEventListener('canplay', handleCanPlay); // Clean up listener
    };
  }, []);

  return (
    <div className='flex'>
    <div
      className="border-rounded-sm relative flex flex-col justify-center"
      style={{
        backgroundColor: "#121212",
        width: '30vw',
        objectFit: 'contain',
        overflow: 'auto',
      }}
    >
      <div style={{ height: '100%', width: '100%' }} className="bg-black items-center flex">
        {!item.post ? (
          <BeatLoader color="#9edaff" />
        ) : (
          <video
            controls
            className="video"
            ref={videoRef}
            playsInline
            muted
            preload="metadata"
            src={isLoaded ? item.post[0].post : undefined} // Load source only when in view
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
      <div style={{position: 'relative', bottom: 105, flexDirection: 'row', display: 'flex', marginLeft: '2.5%'}}>
            {item.pfp ? <img src={item.pfp} style={{height: window.innerHeight / 30.36, width: window.innerHeight / 30.36, borderRadius: 8}}/> : 
          <UserCircleIcon height={100} width={100} style={{ borderRadius: 8}}/>
          }
          <div style={{flexDirection: 'row', display: 'flex', width: '70%'}}>
            <button onClick={item.userId != user.uid ? () => router.push('ViewingProfile', {name: item.userId, viewing: true}) : () => router.push('Profile', {screen: 'ProfileScreen', params: {name: user.uid, preview: false, viewing: false, previewImage: null, previewMade: false, applying: false}})}>
              <span className='numberOfLines1' style={styles.addVideoText}>@{item.username}</span>
            </button>
            {!item.blockedUsers.includes(user.uid) ? item.loading ? <div className='mr-5'>
            <BeatLoader color={"#9edaff"}/> 
            </div> :
            <FollowButtons user={user} item={item}/> : null
   }
          </div>
          </div>
          
    </div>
    <div style={{flexDirection: 'column', display: 'flex', marginBottom: '10%', width: 100, justifyContent: 'flex-end'} }>
                    <div className='flex flex-col mb-5'>
              <LikeButton key={item.id} item={item} user={user} updateTempPostsAddLike={addHomeLike} updateTempPostsRemoveLike={removeHomeLike} updateTempPostsFocusedLike={setFocusedLikedItem}/>
            </div>
          <div className='flex flex-col mb-5' onClick={() => {setCommentModal(true); setFocusedItem(item)}}>
              <ChatBubbleBottomCenterIcon className='btn'/>
              <span style={{fontSize: 12.29, color: "#fafafa", alignSelf: 'center', paddingLeft: 5}}>{item.comments}</span>
            </div>
          {!item.private ? 
          <ArrowUturnRightIcon className='btn mb-5' onClick={() => setSendingModal(true)}/>  : null}
          <div className='flex flex-col mb-5'>
              <SaveButton key={item.id} item={item} user={user} updateTempPostsAddSave={addHomeSave} updateTempPostsRemoveSave={removeHomeSave}/>
            </div>
          {item.mentions && item.mentions.length > 0 ?
          <div className='flex flex-col mb-5'>
              <AtSymbolIcon className='btn'/>
            </div>
          : null}
          <div className='flex flex-col mb-5'>
            <EllipsisHorizontalIcon className='btn' />
          </div>
          </div>
          </div>
  );
};
  
  
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
                setComments(prevState => [...prevState, {id: doc.id, loading: false, showReply: false, ...doc.data()}])
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
                setComments(prevState => [...prevState, {id: doc.id, loading: false, showReply: false, ...doc.data()}])
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
    if (user.uid) {
    const fetchProfileData = async () => {
      const profileData = await getProfileDetails(user.uid);

      if (profileData) {
        setUsername(profileData.username);
        setPfp(profileData.pfp);
        setFollowers(profileData.followers);
        setFollowing(profileData.following);
        setForSale(profileData.forSale);
        setBackground(profileData.postBackground);
        setBlockedUsers(profileData.blockedUsers);
        setNotificationToken(profileData.notificationToken);
      }
    };

    fetchProfileData();
  }
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setTempPosts([]);
      setPostDone(false);

      if (meet && reloadPage && blockedUsers !== null) {
        const { posts, lastVisible } = await fetchPublicPostsExcludingBlockedUsersVideo(blockedUsers);
        setTempPosts(posts);
        setLastVisible(lastVisible);
      }

      setLoading(false);
      setPostDone(true);
    };

    if (reloadPage) {
      loadPosts();
    }
  }, [meet, reloadPage, blockedUsers]);
    useEffect(() => {
    if (bottomObserver.current) {
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !isFetching) {
          setIsFetching(true);
          Promise.all(fetchMorePosts()).finally(() => setIsFetching(false)); // Fetch more posts
        }
      }, { threshold: 0.5 }); // Trigger at 50% visibility

      observer.observe(bottomObserver.current);
      return () => observer.disconnect();
    }
  }, [isFetching]);
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
      //setTranslateX(0); // Swipe right to hide the icon
    //  setRevealed(false);
    }
  };
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
      <p style={styles.commentText}>
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
    const observer = useRef();
    const textInputRef = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && lastVisible) {
        fetchMorePosts();
      }
    },
    {rootMargin: "0px 0px -100px 0px"}
  );
    if (node) observer.current.observe(node);

  }, [loading, lastVisible]);
  async function fetchMorePosts() {
      if (lastVisible != undefined && meet) {
        const { posts, lastVisible: newLastVisible } = await fetchMorePublicPostsExcludingBlockedUsersVideo(blockedUsers, lastVisible);
        setTempPosts([...tempPosts, ...posts]);
        setLastVisible(newLastVisible);
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
    useEffect(() => {
    if (commentModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset'; // or 'auto', depending on your desired default
    }
  }, [commentModal]);
  const deleteReply = async(item, reply) => {
    //console.log(item.id, reply, focusedItem.id)
    await deleteReplyFunction(item, reply, focusedItem, comments, setComments, tempPosts, setTempPosts);
  }
  return (
    <body className='flex justify-center' style={{marginLeft: '22.5vw'}} ref={dropdownRef}>
    <div style={{height: '100vh', overflowY: 'auto'}} className='vidContainer' ref={containerRef}>
      {tempPosts.map((e, index) => (
        <div key={e.id} className="video-item">
          <Row index={index} item={e} />
        </div>
      ))}
      <ReportModal video={true} post={false} theme={false} reportModal={reportModal} closeReportModal={() => setReportModal(false)}/>
      <ReactModal isOpen={likesModal} style={{content: {width: '40%',
      left: '50%',
      right: 'auto',
      borderRadius: 10,
      transform: 'translate(-50%, 0)',
      backgroundColor: "#121212",
      marginRight: '-50%',}}}>
        <div>
       <div style={{}}>
            <p style={styles.header}>Likes: </p>
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
            <div className='cursor-pointer' style={styles.friendsContainer} onClick={item.id !== user.uid ? () => router.push('ViewingProfile', {name: item.id, viewing: true}) : () => navigation.navigate('Profile', {screen: 'ProfileScreen', params: {name: user.uid, preview: false, viewing: false, previewImage: null, previewMade: false, applying: false}})}>
                <div style={{flexDirection: 'row', display: 'flex'}}>
                  {item.pfp ? 
                  <img src={item.pfp} style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}}/> :
                  <UserCircleIcon style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}}/>
                  }
                    
                 <div style={{paddingLeft: 20, width: '70%', justifyContent: 'center'}}>
                    <p className='numberOfLines1' style={styles.name}>{item.firstName} {item.lastName}</p>
                    <p className='numberOfLines1' style={styles.message}>@{item.userName}</p>
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
      <SendingModal sendingModal={sendingModal} closeSendingModal={() => setSendingModal(false)} theme={false} video={true} post={false} user={user} followers={followers} following={following}/>
      <Comments commentModal={commentModal} deleteReply={deleteReply} closeCommentModal={() => setCommentModal(false)} 
      noComments={() => setComments([])} addLike={addLike} removeLike={removeLike} toggleShowReply={toggleShowReply} pfp={pfp}
      user={user} handleSwipe={handleSwipe} focusedItem={focusedItem} comments={comments} CustomCommentText={CustomCommentText}/>
    </div>
    </body>
  )
}

export default VidPosts