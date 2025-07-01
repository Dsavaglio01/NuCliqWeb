import React, {useRef, useState, useEffect} from 'react'
import ReactModal from 'react-modal'
import { BeatLoader } from 'react-spinners';
import { UserCircleIcon, ChevronDownIcon, XMarkIcon, HeartIcon} from '@heroicons/react/24/solid';
import CarouselComponent from './Carousel';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable';
import getDateAndTime from '@/lib/getDateAndTime';
import FollowButtons from './FollowButtons';
import { styles } from '@/styles/styles';
import { fetchComments, fetchMoreComments, addCommentLike, removeCommentLike, addNewCommentFunction} from '@/firebaseUtils';
function Comments({ commentModal, closeCommentModal, pfp, focusedItem, user, blockedUsers, ableToShare, videoStyling, username, notificationToken, actualData, 
    handleData }) {
    const router = useRouter();
    const [replyToReplyFocus, setReplyToReplyFocus] = useState(false);
    const [tempReplyName, setTempReplyName] = useState();
    const [comments, setComments] = useState([]);
    const [replyFocus, setReplyFocus] = useState(false);
    const [singleCommentLoading, setSingleCommentLoading] = useState(false);
    const [tempReplyId, setTempReplyId] = useState('');
    const [usernames, setUsernames] = useState([]);
    const [reportComment, setReportComment] = useState('');
    const [tempCommentId, setTempCommentId] = useState(null);
    const [reportCommentModal, setReportCommentModal ] = useState(false);
    const [lastCommentVisible, setLastCommentVisible] = useState(null);
    const [replyLastVisible, setReplyLastVisible] = useState(0);
    const [comment, setComment] = useState('');
    const [reply, setReply] = useState('');
    const textInputRef = useRef();
    const commentDivRef = useRef(null);
    const handleClose = () => {
      closeCommentModal()
    }
    const CustomCommentText = (props) => {
      const arr = props.text.split(' ');
      const reducer = (acc, cur, index) => {
        let previousVal = acc[acc.length - 1];
        if (
          previousVal &&
          previousVal.startsWith('@') &&
          previousVal.endsWith('@')
        ) {
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
    async function removeLike(item) {
      await removeCommentLike(item, user, setComments, comments, focusedItem)
    }
    async function addLike(item) {
      await addCommentLike(item, user, setComments, comments, username, focusedItem)
    }
    async function toggleShowReply(e) {
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
      if (focusedItem) {
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
    }, [focusedItem])
    const swipeHandlers = useSwipeable({
      /* onSwipedLeft: handleSwipe('left'),
      onSwipedRight: handleSwipe('right'), */
      trackMouse: true, // Enables mouse tracking for desktop swipes
    })
    const handleReply = (event) => {
      setReply(event.targe.value)
    }
    async function addNewComment(){
      if (!ableToShare) {
        window.alert('Unavailable to comment.')
        setComment('')
        setReply('')
        setReplyFocus(false)
      }
      else {
        console.log('at least here')
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
          <div style={{width: 555}}>
          <div style={styles.commentHeader}>
          {item.pfp ? <img src={item.pfp} style={styles.commentsPfp}/> :
            <UserCircleIcon className='userBtn' style={styles.commentsPfp}/>
          }
            
            <div style={styles.commentSection}>
              <div onClick={item.user == user.uid ? null : () => {handleClose(); router.push('ViewingProfile', {name: item.user, viewing: true})}}>
                <p style={styles.usernameText}>@{item.username}</p>
              </div>
                
                  <CustomCommentText text={`${item.comment}`}/>
                <div style={styles.commentFooterContainer}>
                    <div style={{display: 'flex'}}>
                        <p style={styles.dateText}>{getDateAndTime(item.timestamp)}</p>
                        <div className='cursor-pointer' style={styles.replyStyle} onClick={() => {setReplyFocus(true); if (textInputRef.current) {
      textInputRef.current.focus();
    } setTempReplyName(item.username); setTempReplyId(item.id)}}>
                            <p style={styles.replyText}>Reply</p>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display: 'flex'}} onClick={item.likedBy.includes(user.uid) == false ? () => {addLike(item)} : () => {removeLike(item)}}>
                            {item.likedBy.includes(user.uid) ? <HeartIcon className='btn' style={styles.commentHeart} color="red"/> : <HeartIcon className='btn' style={{alignSelf: 'center'}} color="#808080"/>}
                        </div>
                        <p style={styles.commentText}>{item.likedBy.length}</p>
                    </div>
                </div>
                {item.replies.length == 1 && item.showReply == false ? <div style={{display: 'flex'}} onClick={() => toggleShowReply(item)}>
                    <p style={styles.viewRepliesText}>View {item.replies.length} Reply</p>
                    <ChevronDownIcon className='btn' style={{alignSelf: 'center'}}/>
                </div> : item.replies.length > 1 && item.showReply == false ? <div style={{display: 'flex'}} onClick={() => toggleShowReply(item)}>
                    <p style={styles.viewRepliesText}>View {item.replies.length} Replies</p>
                    <ChevronDownIcon className='btn' style={{alignSelf: 'center'}}/>
                </div> : <></>}
                {item.showReply ? 
                    <div>
                        {item.actualReplies.map((element) => {
                          return (
                              !item.loading ? 
                              <>
                                <div style={styles.commentHeader}>
                                     {element.pfp ? <img src={element.pfp} style={styles.commentsPfp}/> :
          <img src='../public/defaultpfp.jpg' style={styles.commentsPfp}/>}
                                    <div style={styles.commentSection}>
                                    {element.replyToComment == true ? <div onClick={item.user == user.uid ? null : () => {handleClose(); router.push('ViewingProfile', {name: item.user, viewing: true})}}>
                <p style={styles.usernameText}>@{element.username}</p>
              </div> : <div onClick={item.user == user.uid ? null : () => {handleClose(); router.push('ViewingProfile', {name: item.user, viewing: true})}}>
                                    <p style={styles.usernameText}>@{element.username} {'>'} @{element.replyTo}</p>
                                    </div>}
                                    <CustomCommentText text={`${element.reply}`}/>
                                    <div style={styles.commentFooterContainer}>
                                        <div style={{display: 'flex'}}>
                                            <p style={styles.dateText}>{element.timestamp ? getDateAndTime(element.timestamp) : null}</p>
                                            <div style={styles.replyStyle} className='cursor-pointer' onClick={() => {setReplyToReplyFocus(true); setTempReplyName(element.username); setTempCommentId(item.id); setTempReplyId(element.id)}}>
                                                <p style={styles.replyText}>Reply</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    
                                    </div>
                                </div>
                                {replyLastVisible < item.replies.length && item.actualReplies.indexOf(element) == replyLastVisible - 1 ? <div style={styles.replyContainer} onClick={() => toggleShowReply(item)}>
                                  <p style={styles.moreRepliesText}>Show more replies</p>
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
      <div style={styles.commentInputContainer}>
        <div style={styles.commentInput}>
        <div className='flex items-center mt-3' style={{width: '47.5%'}}>
        {pfp != undefined ? <img src={pfp} style={styles.inputPfp}/> :
          <UserCircleIcon className='userBtn' style={styles.inputPfp}/>}
          {replyToReplyFocus ? 
          <textarea value={reply} maxLength={200}
            onChange={handleReply}
          className='bg-transparent text-white w-full pt-5' style={styles.inputComment} placeholder={tempReplyName != undefined ? `Reply To ${tempReplyName}` : 'Reply To'} color='#fafafa'/> : replyFocus ? 
          <textarea value={reply} maxLength={200}
            onChange={handleReply}
          className='bg-transparent text-white w-full pt-5' style={styles.inputComment} placeholder={tempReplyName != undefined ? `Reply To ${tempReplyName}` : 'Reply To'} color='#fafafa'/> : 
          <textarea value={comment}
            onChange={handleNewComment} maxLength={200}
          className='bg-transparent text-white' style={styles.addComment} placeholder='Add Comment...' color='#fafafa'/>}
          <div className='justify-end flex items-end mb-2'>
            {!singleCommentLoading ? 
            <button disabled={comment.length == 0 && reply.length == 0} style={styles.sendButton} onClick={() => addNewComment()}>
              <p style={styles.sendText}>Comment</p>
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