import React, {useRef, useState, useEffect} from 'react'
import ReactModal from 'react-modal'
import { BeatLoader } from 'react-spinners';
import { UserCircleIcon, XMarkIcon} from '@heroicons/react/24/solid';
import CarouselComponent from './Carousel';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable';
import getDateAndTime from '@/lib/getDateAndTime';
import FollowButtons from './FollowButtons';
import { styles } from '@/styles/styles';
import { fetchComments, addNewCommentFunction, addNewReplyFunction, addNewReplyToReplyFunction} from '@/firebaseUtils';
import Comment from './Comment';
import { db } from '@/firebase';
import { getDoc, doc, Timestamp } from 'firebase/firestore';
function Comments({ commentModal, closeCommentModal, pfp, focusedItem, user, blockedUsers, ableToShare, videoStyling, username, notificationToken, actualData, 
    handleData }) {
    const router = useRouter();
    const [replyToReplyFocus, setReplyToReplyFocus] = useState(false);
    const [tempReplyName, setTempReplyName] = useState();
    const [comments, setComments] = useState([]);
    const [replyFocus, setReplyFocus] = useState(false);
    const [singleCommentLoading, setSingleCommentLoading] = useState(false);
    const [reportCommentModal, setReportCommentModal ] = useState(false);
    const [tempReplyId, setTempReplyId] = useState(null);
    const [tempCommentId, setTempCommentId] = useState(null);
    const [lastCommentVisible, setLastCommentVisible] = useState(null);
    const [comment, setComment] = useState('');
    const [reply, setReply] = useState('');
    
    const commentDivRef = useRef(null);
    const handleClose = () => {
      closeCommentModal()
    }  
    // async function fetchMoreCommentData () {
    //   if (lastCommentVisible != undefined && videoStyling) {
    //     const { newComments, lastVisible: newLastVisible } = await fetchMoreComments(focusedItem, lastCommentVisible, blockedUsers, 'videos')
    //     setComments([...comments, ...newComments]);
    //     setLastCommentVisible(newLastVisible);
    //   }
    //   else if (lastCommentVisible != undefined && !videoStyling) {
    //     const { newComments, lastVisible: newLastVisible } = await fetchMoreComments(focusedItem, lastCommentVisible, blockedUsers, 'posts')
    //     setComments([...comments, ...newComments]);
    //     setLastCommentVisible(newLastVisible);
    //   }
    // }
    const handleNewComment = (inputText) => {
      const sanitizedText = inputText.target.value.replace(/\n/g, ''); // Remove all new line characters
      setComment(sanitizedText);
    }
    
    useEffect(() => {
      if (focusedItem && comments.length == 0) {
      const loadComments = async() => {
        /* if (videoStyling) {
          const { comments, lastVisible } = await fetchComments(focusedItem, blockedUsers, 'videos')
          setComments(comments)
          setLastCommentVisible(lastVisible);
        } */
          const { comments, lastVisible } = await fetchComments(focusedItem, blockedUsers, 'posts')
          setComments(comments)
          setLastCommentVisible(lastVisible);
      }
      loadComments();
    }
    }, [focusedItem, comments])
    console.log(`Comments: ${comments.length}`)
    const swipeHandlers = useSwipeable({
      /* onSwipedLeft: handleSwipe('left'),
      onSwipedRight: handleSwipe('right'), */
      trackMouse: true, // Enables mouse tracking for desktop swipes
    })
    const handleReply = (event) => {
      setReply(event.target.value)
    }
    async function replySecondFunction(item) {
      setReplyFocus(true); 
      setTempReplyName(item.username); 
      setTempReplyId(item.id);
    }
    async function replyFunction(item, element) {
      
      setReplyToReplyFocus(true); 
      
      setTempReplyName(element.username); 
      setTempCommentId(item.id); 
      setTempReplyId(element.id);
      //await addNewReply()
    }
    async function addNewReplyToReply() {
      if (!ableToShare) {
        window.alert('Unavailable to reply.')
        setComment('')
        setReply('')
        setReplyFocus(false)
      }
      else {
        setSingleCommentLoading(true)
        if (!videoStyling) {
          const commentSnap = await getDoc(doc(db, 'posts', focusedItem.id, 'comments', tempCommentId))
          const newReply = {
            reply: reply,
            pfp: pfp,
            notificationToken: notificationToken,
            username: username,
            replyToComment: false,
            replyTo: tempReplyName,
            timestamp: Timestamp.fromDate(new Date()),
            likedBy: [],
            postId: focusedItem.id,
            user: user.uid
          }
          if (commentSnap.exists() && commentSnap.data().username !== username) {
            try {
              addNewReplyToReplyFunction('newReplyToReply', tempCommentId, newReply, commentSnap, reply, user.uid, focusedItem, username, setComment, setSingleCommentLoading, 
                setReply, comments, setComments, actualData, handleData, tempReplyName, setReplyToReplyFocus)
            }
            catch (e) {
              console.error(e);
            }
          }
          else if (commentSnap.exists() && commentSnap.data().username == username) {
            try {
              addNewReplyToReplyFunction('newReplyToReplyUsername', tempCommentId, newReply, commentSnap, reply, user.uid, focusedItem, username, setComment, setSingleCommentLoading, 
                setReply, comments, setComments, actualData, handleData, tempReplyName, setReplyToReplyFocus)
            }
            catch (e) {
              console.error(e);
            }
          }
        }
        else {
          const commentSnap = await getDoc(doc(db, 'videos', focusedItem.id, 'comments', tempCommentId))
          const newReply = {
            reply: reply,
            pfp: pfp,
            notificationToken: notificationToken,
            username: username,
            replyToComment: false,
            replyTo: tempReplyName,
            timestamp: Timestamp.fromDate(new Date()),
            likedBy: [],
            postId: focusedItem.id,
            user: user.uid
          }
          if (commentSnap.exists() && commentSnap.data().username !== username) {
            try {
              addNewReplyToReplyFunction('newReplyToReplyVideo', tempCommentId, newReply, commentSnap, reply, user.uid, focusedItem, username, setComment, setSingleCommentLoading, 
                setReply, comments, setComments, actualData, handleData, tempReplyName, setReplyToReplyFocus)
            }
            catch (e) {
              console.error(e);
            }
          }
          else if (commentSnap.exists() && commentSnap.data().username == username) {
            try {
              addNewReplyToReplyFunction('newReplyToReplyVideoUsername', tempCommentId, newReply, commentSnap, reply, user.uid, focusedItem, username, setComment, setSingleCommentLoading, 
                setReply, comments, setComments, actualData, handleData, tempReplyName, setReplyToReplyFocus)
            }
            catch (e) {
              console.error(e);
            }
          }
        }

      }
    }
    async function addNewReply() {
      if (!ableToShare) {
        window.alert('Unavailable to reply.')
        setComment('')
        setReply('')
        setReplyFocus(false)
      }
      else {
        setSingleCommentLoading(true)
        if (!videoStyling) {
          const commentSnap = await getDoc(doc(db, 'posts', focusedItem.id, 'comments', tempReplyId))
          const newReply = {
            reply: reply,
            pfp: pfp,
            notificationToken: notificationToken,
            username: username,
            replyToComment: true,
            timestamp: Timestamp.fromDate(new Date()),
            likedBy: [],
            postId: focusedItem.id,
            user: user.uid
          }
          if (commentSnap.exists() && commentSnap.data().username !== username) {
            try {
              addNewReplyFunction('newReply', tempReplyId, username, user.uid, reply, newReply, focusedItem, commentSnap, comments, setComments, notificationToken, 
                pfp, actualData, handleData, setComment, setReply, setSingleCommentLoading
              )
            }
            catch (e) {
              console.error(e);
            }
          }
          else if (commentSnap.exists() && commentSnap.data().username == username) {
            try {
              addNewReplyFunction('newReplyUsername', tempReplyId, username, user.uid, reply, newReply, focusedItem, commentSnap, comments, setComments, notificationToken, 
                pfp, actualData, handleData, setComment, setReply, setSingleCommentLoading
              )
            }
            catch (e) {
              console.error(e);
            }
          }
        }
        else {
          const commentSnap = await getDoc(doc(db, 'videos', focusedItem.id, 'comments', tempReplyId))
          const newReply = {reply: reply,
            pfp: pfp,
            notificationToken: notificationToken,
            username: username,
            replyToComment: true,
            timestamp: Timestamp.fromDate(new Date()),
            likedBy: [],
            postId: focusedItem.id,
            user: user.uid
          }
          if (commentSnap.exists() && commentSnap.data().username !== username) {
            try {
              addNewReplyFunction('newReplyVideo', tempReplyId, username, user.uid, reply, newReply, focusedItem, commentSnap, comments, setComments, notificationToken, 
                pfp, actualData, handleData, setComment, setReply, setSingleCommentLoading
              )
            }
            catch (e) {
              console.error(e);
            }
          }
          else if (commentSnap.exists() && commentSnap.data().username == username) {
            try {
              addNewReplyFunction('newReplyVideoUsername', tempReplyId, username, user.uid, reply, newReply, focusedItem, commentSnap, comments, setComments, notificationToken, 
                pfp, actualData, handleData, setComment, setReply, setSingleCommentLoading)
            }
            catch (e) {
              console.error(e);
            }
          }
        }
      }
    }
    async function addNewComment(){
      if (!ableToShare) {
        window.alert('Unavailable to comment.')
        setComment('')
        setReply('')
        setReplyFocus(false)
      }
      else {
        setSingleCommentLoading(true)
        if (!videoStyling) {
          if (username == focusedItem.username) {
            try {
              addNewCommentFunction('newCommentUsername', username, comment, blockedUsers, pfp, notificationToken, user.uid, focusedItem, setComment, 
                setSingleCommentLoading, setReply, setComments, comments, actualData, handleData
              )
            }
            catch (e) {
              console.error(e);
            }
          }
          else {
            try {
              addNewCommentFunction('newComment', username, comment, blockedUsers, pfp, notificationToken, user.uid, focusedItem, setComment, 
                setSingleCommentLoading, setReply, setComments, comments, actualData, handleData
              )
            }
            catch (e) {
              console.error(e);
            }
          }
        }
        else {
          if (username == focusedItem.username) {
            try {
              addNewCommentFunction('newCommentVideoUsername', username, comment, blockedUsers, pfp, notificationToken, user.uid, focusedItem, setComment, 
                setSingleCommentLoading, setReply, setComments, comments, actualData, handleData
              )
            }
            catch (e) {
              console.error(e);
            }
          }
          else {
            try {
              addNewCommentFunction('newCommentVideo', username, comment, blockedUsers, pfp, notificationToken, user.uid, focusedItem, setComment, 
                setSingleCommentLoading, setReply, setComments, comments, actualData, handleData
              )
            }
            catch (e) {
              console.error(e);
            }
          }
        }
      }
    }
  return (
    <ReactModal isOpen={commentModal} style={{content: videoStyling ? styles.videoCommmentModalContainer : styles.commentModalContainer}} preventScroll={true} onRequestClose={() => {handleClose(); setComments([])}}>
        <div className='swipe-container' {...swipeHandlers} style={styles.swipeContainer}>
            {focusedItem != null && focusedItem.post != null && !videoStyling && Array.isArray(focusedItem.post) ?
    <div className='border-rounded-sm' style={{ 
    backgroundColor: "#121212",
    backgroundImage: `url(${focusedItem.background})`, // Add background image URL here
    backgroundSize: 'cover',  // Or 'contain', depending on desired behavior
    backgroundPosition: 'center',
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    width: '80%',
    justifyContent: 'center'
}}>
  <div className='flex flex-col items-center justify-center' style={styles.commentsContainer}>
  <div className='bg-[#121212] items-center justify-center rounded-xl pb-5' style={{ width: '80%'}}>
    <div className='flex p-5 py-3 items-center border-rounded-sm'>
         {focusedItem.pfp ? <img src={focusedItem.pfp} className='rounded-xl h-12 w-12 object-fill p-1 mr-3'/> : 
          <img src='../public/defaultpfp.jpg' height={44} width={44} style={{borderRadius: 8}}/>
          }
        <p className='flex-1 font-bold' style={{color: "#fafafa"}}>{focusedItem.username}</p>
       <FollowButtons item={focusedItem} user={user}/>
    </div>
    {focusedItem.post.length > 1 ? 
    <div style={styles.commentCarousel}>
  <CarouselComponent itemPost={focusedItem.post}/>
</div>
 :
    focusedItem.post[0].image ? 
      <div className='px-5 pb-5'>
          <img src={focusedItem.post[0].post} className='object-cover w-full rounded-md'/>
      </div> : focusedItem.post[0].text ?
       <div style={{marginLeft: '5%'}}> 
          <p style={styles.postText}>{focusedItem.post[0].value}</p>
       </div> : null}
   </div>
   </div>
    </div> 
    : focusedItem != null && focusedItem.post != null  ? <div className='border-rounded-sm' style={{ 
    backgroundColor: "#121212",
    backgroundImage: `url(${focusedItem.background})`, // Add background image URL here
    backgroundSize: 'cover',  // Or 'contain', depending on desired behavior
    backgroundPosition: 'center',
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    width: '80%',
    justifyContent: 'center'
}}>
  <div className='flex flex-col items-center justify-center' style={styles.commentsContainer}>
  <div className='bg-[#121212] items-center justify-center rounded-xl pb-5' style={{ width: '80%'}}>
    <div className='flex p-5 py-3 items-center border-rounded-sm'>
         {focusedItem.pfp ? <img src={focusedItem.pfp} className='rounded-xl h-12 w-12 object-fill p-1 mr-3'/> : 
          <UserCircleIcon className='userBtn' height={44} width={44} style={{borderRadius: 8}}/>
          }
        <p className='flex-1 font-bold' style={{color: "#fafafa"}}>{focusedItem.username}</p>
        <FollowButtons user={user} item={focusedItem}/>
    </div>
       <div>
       <p style={styles.rePostText}>{focusedItem.caption}</p>
          <button className='mb-5' onClick={() => router.push('Repost', {post: focusedItem.post.id, requests: requests, name: user.uid, groupId: null, video: false})} style={styles.repostContainer}>
            <div style={styles.postHeader}>
            {focusedItem.post.pfp ? <img src={focusedItem.post.pfp} style={styles.commentPfp}/> : 
          <UserCircleIcon style={styles.commentPfp}/>
          }
            <button className='mt-0 pt-0'>
              <span style={styles.addText}>@{focusedItem.post.username}</span>
            </button>
            <span style={styles.timeText}>{getDateAndTime(focusedItem.post.timestamp)}</span>
          </div> 
            <p style={styles.actualrepostText} className=''>{focusedItem.post.post[0].value}</p>
          </button>
    </div>
   </div>
   </div>
    </div> : null}
    <div style={styles.commentScrollable} ref={commentDivRef} className='commentScrollable'>
      {focusedItem ? focusedItem.caption.length > 0 && !reportCommentModal ? 
        <>
        <div style={styles.commentHeaderContainer}>
          {focusedItem.pfp ? <img src={focusedItem.pfp} style={styles.commentContainerPfp}/> :
            <UserCircleIcon className='userBtn' style={styles.commentContainerPfp}/>
          }
          
          <div style={{flexWrap: 'wrap'}}>
            <p style={styles.usernameText} className='numberOfLines1'>{focusedItem.username}</p>
            <p style={{...styles.captionText, ...{paddingTop: 0}}}>{focusedItem.caption}</p>
          </div>
          
        </div>
        <hr className='divider' style={{marginTop: -5}}/>
        </>
        : <>
        <div style={styles.commentHeaderContainer}>
          {focusedItem.pfp ? <img src={focusedItem.pfp} style={styles.commentContainerPfp}/> :
            <UserCircleIcon className='userBtn' style={styles.commentContainerPfp}/>
          }
          <div style={{flexWrap: 'wrap'}}>
            <p style={styles.usernameText} className='numberOfLines1'>{focusedItem.username}</p>
          </div>
          
        </div>
        <hr className='divider' style={{marginTop: -5}}/>
        </> : null }
      {comments.length == 0 ? 
        <div className='items-center flex justify-center flex-col'>
            <p style={styles.noCommentsText}>No Comments Yet</p>
            <p style={styles.noCommentsTextSupp}>Be the First to Comment!</p>
        </div>
        :
      
      comments.slice().sort((a, b) => b.timestamp - a.timestamp).map((item) => {
        return (
          <Comment item={item} user={user} handleClose={handleClose} setComments={setComments} setTempReplyName={setTempReplyName} setReplyFocus={setReplyFocus} 
          replyFunction={replyFunction} replySecondFunction={replySecondFunction} comments={comments}/>
        )
      })}
      <div style={styles.commentInputContainer}>
        <div style={styles.commentInput}>
        <div className='flex items-center mt-3' style={{width: '47.5%'}}>
        {pfp != undefined ? <img src={pfp} style={styles.inputPfp}/> :
          <UserCircleIcon className='userBtn' style={styles.inputPfp}/>}
          {replyToReplyFocus ? 
          <textarea value={reply} maxLength={200}
            onChange={handleReply}
          className='bg-transparent text-white' style={styles.addComment} placeholder={tempReplyName != undefined ? `Reply To ${tempReplyName}` : 'Reply To'} color='#fafafa'/> : replyFocus ? 
          <textarea value={reply} maxLength={200}
            onChange={handleReply}
          className='bg-transparent text-white' style={styles.addComment} placeholder={tempReplyName != undefined ? `Reply To ${tempReplyName}` : 'Reply To'} color='#fafafa'/> : 
          <textarea value={comment}
            onChange={handleNewComment} maxLength={200}
          className='bg-transparent text-white' style={styles.addComment} placeholder='Add Comment...' color='#fafafa'/>}
          <div className='justify-end flex items-end mb-2'>
            {!singleCommentLoading ? 
            <button disabled={comment.length == 0 && reply.length == 0} style={styles.sendButton} onClick={replyToReplyFocus ? () => addNewReplyToReply() :
              replyFocus ? () => addNewReply() : () => addNewComment()}>
              <p style={styles.sendText}>{replyFocus || replyToReplyFocus ? 'Reply' : 'Comment'}</p>
            </button> : 
            <BeatLoader color='#9edaff'/>}
          </div>
          </div>
        </div>
      </div>
    </div>
          
    <button className="close-button" onClick={() => {handleClose(); setComments([])}}>
        <XMarkIcon className='btn'/>
      </button>    
    </div>
      
      </ReactModal>
  )
}

export default Comments