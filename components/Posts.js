import React from 'react'
import { useEffect, useState, useRef, useCallback } from 'react'
import {collection, getDocs, Timestamp, query, where} from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuth } from '@/context/AuthContext'
import { ArrowUturnRightIcon, ChatBubbleBottomCenterIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import 'reactjs-popup/dist/index.css';
import { useRouter } from 'next/router'
import LikeButton from './LikeButton'
import SaveButton from './SaveButton'
import CarouselComponent from './Carousel'
import Comments from './Comments'
import getDateAndTime from '@/lib/getDateAndTime'
import FollowButtons from './FollowButtons'
import SendingModal from './SendingModal'
import { schedulePushLikeNotification } from '@/notificationFunctions'
import { styles } from '@/styles/styles'
import { ableToShareFunction, addHomeSaveFunction, deleteReplyFunction, removeHomeSaveFunction, fetchUserFeedPosts, addHomeLikeFunction, 
  removeLikeFunction, fetchComments, getProfileDetails, fetchPublicPostsExcludingBlockedUsers, addCommentLike, 
  fetchMorePublicPostsExcludingBlockedUsers, removeCommentLike} from '@/firebaseUtils'
import ReportModal from './ReportModal'
import RepostModal from './RepostModal'
import ViewLikes from './ViewLikes'
import IndPost from './IndPost'
function Posts({changeWidth}) {
  const [meet, setMeet] = useState(true);
  const [reloadPage, setReloadPage] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState(null);
  const [tempPosts, setTempPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const [followers, setFollowers] = useState([]);
  const [marginClassOne, setMarginClassOne] = useState('mx-60')
  const [marginClassTwo, setMarginClassTwo] = useState('mx-42')
  const [likesModal, setLikesModal] = useState(false);
  const [repostModal, setRepostModal] = useState(false);
  const [ableToShare, setAbleToShare] = useState(true);
  const [repostItem, setRepostItem] = useState(null);
  const [reportModal, setReportModal] = useState(false);
  const [tempReplyId, setTempReplyId] = useState('');
  const [lastVisible, setLastVisible] = useState(null);
  const [focusedLikedItem, setFocusedLikedItem] = useState(null);
  const [forSale, setForSale] = useState(false);
  const [background, setBackground] = useState(null);
  const [usernames, setUsernames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postDone, setPostDone] = useState(false);
  const [replyLastVisible, setReplyLastVisible] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [sendingModal, setSendingModal] = useState(false);
  const [followingCount, setFollowingCount] = useState(3);
  const [username, setUsername] = useState('')
  const [reply, setReply] = useState('');
  const [pfp, setPfp] = useState(null);
  const [notificationToken, setNotificationToken] = useState(null); 
  const [focusedItem, setFocusedItem] = useState(null);
  const {user} = useAuth();
  const [isFetching, setIsFetching] = useState(false);
  const [commentModal, setCommentModal] = useState(false)
  const bottomObserver = useRef(null);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const fetchPostExistence = async () => {
      if (focusedItem != null) {
        try {
          const exists = await ableToShareFunction(focusedItem.id);
          setAbleToShare(exists);
        } 
        catch (error) {
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
  const deleteReply = async(item, reply) => {
    await deleteReplyFunction(item, reply, focusedItem, comments, setComments, tempPosts, setTempPosts);
  }
  
  useEffect(() => {
    if (focusedItem != null) {
      setCommentModal(true)
      const getComments = async () => {
        await fetchComments(focusedItem, blockedUsers, comments)
      }
      getComments()
    }
  }, [focusedItem])
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
        const { posts, lastVisible } = await fetchPublicPostsExcludingBlockedUsers(blockedUsers);
        setTempPosts(posts);
        setLastVisible(lastVisible);
      } 
      else if (following && reloadPage) {
        const posts = await fetchUserFeedPosts(user.uid, followingCount);
        setTempPosts(posts);
        setFollowingCount(followingCount + 7);
      }
      setLoading(false);
      setPostDone(true);
    };
    if (reloadPage) {
      loadPosts();
    }
  }, [meet, following, reloadPage, blockedUsers, followingCount]);
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
  async function findUser(text) {
    const getData = async() => {
      const q = query(collection(db, "usernames"), where("username", "==", text));
      const docSnap = await getDocs(q)
      docSnap.forEach((item) => {
        if (item.id != undefined) {
        //console.log('first')
        setCommentModal(false)
        setfocusedItem(null)
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
  return (
      <p>
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
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && lastVisible) {
       // fetchMorePosts();
      }
    },
    {rootMargin: "0px 0px -100px 0px"}
  );
    if (node) observer.current.observe(node);

  }, [loading, lastVisible]);
  async function fetchMorePosts() {
      if (lastVisible != undefined && meet) {
        const { posts, lastVisible: newLastVisible } = await fetchMorePublicPostsExcludingBlockedUsers(blockedUsers, lastVisible);
        setTempPosts([...tempPosts, ...posts]);
        setLastVisible(newLastVisible);
    }
    else if (lastVisible != undefined && following) {
      const posts = await fetchUserFeedPosts(user.uid, followingCount);
        setTempPosts([...tempPosts, ...posts]);
        setFollowingCount(followingCount + 7);
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
async function removeLike(item) {
  await removeCommentLike(item, user, setComments, comments, focusedItem)
  }
async function addLike(item) {
  await addCommentLike(item, user, setComments, comments, username, focusedItem)
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
      //setTranslateX(0); // Swipe right to hide the icon
    //  setRevealed(false);
    }
  };
    useEffect(() => {
    if (commentModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset'; // or 'auto', depending on your desired default
    }
  }, [commentModal]);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) { 
        setMarginClassOne('mx-32');
        setMarginClassTwo('mx-40');
      } else {
        setMarginClassOne('mx-32');
        setMarginClassTwo('mx-40')
      }
    };
    handleResize(); // Set initial margin on component mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <body className={changeWidth ? marginClassOne : marginClassTwo} ref={dropdownRef}>
    <div className='flex-grow' style={styles.homeContainer}>
      {tempPosts.map((e, index) => {
        if (tempPosts.length === index + 1) {      
            return (
          <div ref={lastElementRef} key={e.id}>
            <IndPost user={user} item={e} likesModal={() => setLikesModal(true)} commentModal={() => setCommentModal(true)}
              sendingModal={() => setSendingModal(true)} reportModal={() => setReportModal(true)} repostModal={() => setRepostModal(true)}
              focusedItem={(e) => setFocusedItem(e)} repostItem={(e) => setRepostItem(e)}/>
          </div>
            )
          
          }
          else {
            return (
            <div key={e.id}>
              <IndPost user={user} item={e} likesModal={() => setLikesModal(true)} commentModal={() => setCommentModal(true)}
              sendingModal={() => setSendingModal(true)} reportModal={() => setReportModal(true)} repostModal={() => setRepostModal(true)}
              focusedItem={(e) => setFocusedItem(e)} repostItem={(e) => setRepostItem(e)}/>
            </div>
            )
          }
      })}
      {/* <ViewLikes likesModal={likesModal} closeLikesModal={() => setLikesModal(false)} focusedLikedItem={focusedLikedItem} user={user}/> */}
      <RepostModal repostModal={repostModal} closeRepostModal={() => setRepostModal(false)} user={user} username={username} notificationToken={notificationToken}
        blockedUsers={blockedUsers} forSale={forSale} background={background} pfp={pfp} repostItem={repostItem} ableToShare={ableToShare}/>
      <ReportModal reportModal={reportModal} closeReportModal={() => setReportModal(false)} theme={false} post={true} video={false}/>
      <SendingModal sendingModal={sendingModal} closeSendingModal={() => setSendingModal(false)} video={false} theme={false} post={true} user={user} followers={followers} following={following}/>
      <Comments commentModal={commentModal} deleteReply={deleteReply} closeCommentModal={() => setCommentModal(false)} 
      noComments={() => setComments([])} addLike={addLike} removeLike={removeLike} toggleShowReply={toggleShowReply} pfp={pfp}
      user={user} handleSwipe={handleSwipe} focusedItem={focusedItem} comments={comments} CustomCommentText={CustomCommentText}/>
    </div>
    </body>
  )
}

export default Posts