import React, {useRef, useState, useEffect} from 'react'
import { styles } from '@/styles/styles';
import { BeatLoader } from 'react-spinners';
import { UserCircleIcon, ArrowUturnRightIcon, ChatBubbleBottomCenterIcon, AtSymbolIcon} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import {EllipsisHorizontalIcon} from '@heroicons/react/24/solid';
import FollowButtons from './FollowButtons';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';
import ReportModal from './ReportModal';
import Comments from './Comments';
import SendingModal from './SendingModal';
import { addHomeLikeVideoFunction, removeLikeVideoFunction, addHomeSaveVideoFunction, removeHomeSaveVideoFunction, 
    ableToShareVideoFunction} from '@/firebaseUtils';
function IndVidPost({item, user, dropdownRef, pfp, followers, following, username, reportedPosts, tempPosts, setTempPosts}) {
  const videoRef = useRef(null);
  const router = useRouter();
  const [focusedLikedItem, setFocusedLikedItem] = useState(null);
  const [ableToShare, setAbleToShare] = useState(true);
  const [focusedItem, setFocusedItem] = useState(null);
  const [commentModal, setCommentModal] = useState(false);
  const [likesModal, setLikesModal] = useState(false);
  const [sendingModal, setSendingModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Track load state for this specific video
  useEffect(() => {
    if (focusedLikedItem != null) {
        setLikesModal(true)
    }
  }, [focusedLikedItem])
  async function addHomeLike(item, likedBy) {
    await addHomeLikeVideoFunction(item, likedBy, user, tempPosts, setTempPosts, schedulePushLikeNotification, username)
  }
  async function removeHomeLike(item) {
    await removeLikeVideoFunction(item, user, tempPosts, setTempPosts)
  }
  async function addHomeSave(item) {
    await addHomeSaveVideoFunction(item, user, tempPosts, setTempPosts)
  }
  async function removeHomeSave(item) {
    await removeHomeSaveVideoFunction(item, user, tempPosts, setTempPosts)
  }
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
  /* useEffect(() => {
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
  }, []); */
  useEffect(() => {
    if (focusedItem != null) {
      setCommentModal(true)
    }
  }, [focusedItem])
  useEffect(() => {
    if (commentModal) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset'; // or 'auto', depending on your desired default
    }
  }, [commentModal]);
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleCanPlay = () => {
      if (video) {
        console.log(`Video: ${video}`)
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
      <div>
        <div style={{height: '90vh', width: '25vw'}}>
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
                style={styles.video}
            />
          )}
        </div>
        <div style={styles.videoHeader}>
          {item.pfp ? <img src={item.pfp} style={styles.videoPfp}/> : 
              <UserCircleIcon height={100} width={100} style={{ borderRadius: 8}}/>
          }
          <div style={styles.videoInfo}>
              <button onClick={item.userId != user.uid ? () => router.push('ViewingProfile', {name: item.userId, viewing: true}) : () => router.push('Profile', {screen: 'ProfileScreen', params: {name: user.uid, preview: false, viewing: false, previewImage: null, previewMade: false, applying: false}})}>
                  <span className='numberOfLines1' style={styles.addVideoText}>@{item.username}</span>
              </button>
                  {!item.blockedUsers.includes(user.uid) ? item.loading ? 
                      <div className='mr-5'>
                          <BeatLoader color={"#9edaff"}/> 
                      </div> :
                      <FollowButtons user={user} item={item}/> 
                  : null}
          </div>
        </div>
          
      </div>
        <div style={styles.videoButtonContainer}>
            <div className='flex flex-col mb-5'>
                <LikeButton key={item.id} video={true} item={item} user={user} updateTempPostsAddLike={addHomeLike} updateTempPostsRemoveLike={removeHomeLike} updateTempPostsFocusedLike={setFocusedLikedItem}/>
            </div>
            <div className='flex flex-col mb-5' onClick={() => {setCommentModal(true); setFocusedItem(item)}}>
                <ChatBubbleBottomCenterIcon className='btn'/>
                <span style={styles.numberCommentText}>{item.comments}</span>
            </div>
            {!item.private ? 
                <ArrowUturnRightIcon className='btn mb-5' onClick={() => setSendingModal(true)}/>  : null}
                <div className='flex flex-col mb-5'>
                    <SaveButton key={item.id} item={item} video={true} user={user} updateTempPostsAddSave={addHomeSave} updateTempPostsRemoveSave={removeHomeSave}/>
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
        <Comments commentModal={commentModal} videoStyling={true} closeCommentModal={() => setCommentModal(false)} pfp={pfp} user={user}/>
        {/* <ViewLikes likesModal={likesModal} closeLikesModal={() => setLikesModal(false)} focusedLikedItem={focusedLikedItem} user={user}/> */}
        <ReportModal reportModal={reportModal} closeReportModal={() => setReportModal(false)} theme={false} post={true} video={false}/>
        <SendingModal sendingModal={sendingModal} payloadUsername={item.username} payload={item} closeSendingModal={() => setSendingModal(false)} video={false} theme={false} post={true} user={user} followers={followers} following={following}/>
    </div>
  );
};

export default IndVidPost