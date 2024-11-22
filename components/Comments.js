import React, {useCallback, useRef, useState} from 'react'
import ReactModal from 'react-modal'
import RequestedIcon from './RequestedIcon';
import FollowIcon from './FollowIcon';
import FollowingIcon from './FollowingIcon';
import { BeatLoader } from 'react-spinners';
import { UserCircleIcon, ChevronDownIcon, FlagIcon, XMarkIcon} from '@heroicons/react/24/solid';
import CarouselComponent from './Carousel';
import { useRouter } from 'next/router';
import { useSwipeable } from 'react-swipeable';
import getDateAndTime from '@/lib/getDateAndTime';
import FollowButtons from './FollowButtons';
const styles = {
    commentText: {
      fontSize: 15.36,
      color: "#fafafa",
        padding: 5,
        paddingBottom: 0
    },
    postText: {
        fontSize: 12.29,
        padding: 5,
        color: "#fafafa",
        paddingBottom: 10
    },
    rePostText: {
        fontSize: 15.36,
    padding: 5,
    paddingTop: 0,
    paddingLeft: '5%',
    color: "#fafafa",
    paddingBottom: 10
    },
    addText: {
        fontSize: 15.36,
    padding: 7.5,
    paddingTop: 10,
    paddingLeft: 15,
    alignSelf: 'center',
    color: "#fafafa"
    },
    actualrepostText:{
        fontSize: 12.29,
    padding: 5,
    paddingLeft: 0,
    //paddingLeft: 10,
    color: "#fafafa",
    paddingBottom: 10
    },
    usernameText: {
        fontSize: 15.36,
        paddingTop: 0,
        color: "#fafafa",
        padding: 5,
        paddingBottom: 0
    },
    commentSection: {
        marginLeft: '1.5%',
        width: '90%'
    },
    commentHeader: {
        flexDirection: 'row',
        marginTop: 5,
        marginLeft: '5%',
        marginRight: '5%',
        display: 'flex'
    },
    commentFooterContainer: {
      flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        display: 'flex'
    },
    noCommentsText: {
      fontSize: 19.20,
        padding: 10,
        color: "#fafafa"
    },
    noCommentsTextSupp: {
      fontSize: 15.36,
        padding: 10,
        color: "#fafafa"
    },
    dateText: {
      fontSize: 12.29,
        padding: 5,
        width: 100,
        color: "#fff",
        alignSelf: 'center'
    },
    replyStyle: {
      alignSelf: 'center',
        marginLeft: '5%',
    },
    replyText: {
      fontSize: 12.29,
        color: "grey",
    },
    viewRepliesText: {
      fontSize: 12.29,
        padding: 5,
        color: "#fff"
    },
    postHeader: {
      flexDirection: 'row',
    display: 'flex',
    marginTop: 0,
      alignItems: 'center',
      flex: 1,
      margin: '2.5%',
      marginLeft: '3.5%',
    },
    repostContainer: {
       borderWidth: 1,
      borderRadius: 10,
      borderColor: "#fafafa",
      width: '90%',
      marginLeft: '5%'
    },
    captionText: {
      padding: 10,
      fontSize: 15.36,
      color: '#fafafa',
    }

}
function Comments({ commentModal, closeCommentModal, deleteReply, pfp, toggleShowReply, noComments, focusedItem, addLike, removeLike,
  comments, CustomCommentText, handleSwipe, user }) {
    const router = useRouter();
    const [replyToReplyFocus, setReplyToReplyFocus] = useState(false);
    const [tempReplyName, setTempReplyName] = useState();
    const [replyFocus, setReplyFocus] = useState(false);
    const [tempReplyId, setTempReplyId] = useState('');
    const [reportComment, setReportComment] = useState('');
    const [tempCommentId, setTempCommentId] = useState(null);
    const [reportCommentModal, setReportCommentModal ] = useState(false);
    const [comment, setComment] = useState('');
    const [reply, setReply] = useState('');
    const textInputRef = useRef();
      const commentDivRef = useRef(null);
      const handleClose = () => {
        closeCommentModal()
      }
      const handleNoComments = () => {
        noComments()
      }
    const toggleShowReplyFunction = useCallback(
      async (currentItem) => {
        if (currentItem) {
          await toggleShowReply(currentItem);
        } else {
          console.error("Error: 'item' is undefined.");
        }
      },
      [toggleShowReply]
    );
    const addLikeFunction = useCallback(
      async(currentItem) => {
        if (currentItem) {
          await addLike(item)
        }
        else {
           console.error("Error: 'item' is undefined.");
        }
        
      },
      [addLike],
    )
    const removeLikeFunction = useCallback(
      async(currentItem) => {
        if (currentItem) {
          await removeLike(item)
        }
        else {
           console.error("Error: 'item' is undefined.");
        }
        
      },
      [removeLike],
    )
    
    
    const deleteReplyFunction = useCallback(
      async(currentItem, currentElement) => {
        if (currentItem && currentElement) {
          await deleteReply(item, element)
        }
        else {
          console.error("Error: 'item' is undefined.");
        }
        
      },
      [deleteReply],
    )
    
    
    const swipeHandlers = useSwipeable({
    onSwipedLeft: useCallback(
    async() => {await handleSwipe('left')}, [handleSwipe]),
    onSwipedRight: useCallback(
    async() => {await handleSwipe('right')}, [handleSwipe]),
    trackMouse: true, // Enables mouse tracking for desktop swipes
  })
  const handleComment = (event) => {
    setComment(event.target.value)
}
const handleReply = (event) => {
  setReply(event.targe.value)
}
  return (
    <ReactModal isOpen={commentModal} style={{content: {width: '80%',
      left: '50%',
      borderRadius: 15,
      right: 'auto',
      padding: 0,
      backgroundColor: "#121212",
      transform: 'translate(-50%, 0)',
      marginRight: '-50%',}}} preventScroll={true} onRequestClose={() => {handleClose(); handleNoComments()}}>
        <div className='swipe-container' {...swipeHandlers} style={{flex: 1, display: 'flex', flexDirection: 'row', height: '100%'}}>
            {focusedItem != null && focusedItem.post != null && Array.isArray(focusedItem.post) ?
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
  <div className='flex flex-col items-center justify-center' style={{display: 'flex', height: '100%'}}>
  <div className='bg-[#121212] items-center justify-center rounded-xl pb-5' style={{ width: '80%'}}>
    <div className='flex p-5 py-3 items-center border-rounded-sm'>
         {focusedItem.pfp ? <img src={focusedItem.pfp} className='rounded-xl h-12 w-12 object-fill p-1 mr-3'/> : 
          <img src='../public/defaultpfp.jpg' height={44} width={44} style={{borderRadius: 8}}/>
          }
        <p className='flex-1 font-bold' style={{color: "#fafafa"}}>{focusedItem.username}</p>
       <FollowButtons item={focusedItem} user={user}/>
    </div>
    {focusedItem.post.length > 1 ? 
    <div style={{ width: '100%', maxWidth: '800px', height: '100%', overflow: 'hidden' }}>
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
  <div className='flex flex-col items-center justify-center' style={{display: 'flex', height: '100%'}}>
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
            {focusedItem.post.pfp ? <img src={focusedItem.post.pfp} style={{height: 33, width: 33, borderRadius: 8}}/> : 
          <UserCircleIcon style={{height: 33, width: 33, borderRadius: 8}}/>
          }
            <button className='mt-0 pt-0'>
              <span style={styles.addText}>@{focusedItem.post.username}</span>
            </button>
            <span style={{fontSize: 12.29, color: "#fafafa"}}>{getDateAndTime(focusedItem.post.timestamp)}</span>
          </div> 
            <p style={styles.actualrepostText} className=''>{focusedItem.post.post[0].value}</p>
          </button>
    </div>
   </div>
   </div>
    </div> : null}
    <div style={{flex: 1, width: '100%', overflow: 'hidden'}} ref={commentDivRef} className='commentScrollable'>
      {focusedItem ? focusedItem.caption.length > 0 && !reportCommentModal ? 
        <>
        <div style={{flexDirection: 'row', display: 'flex', width: '95%', marginLeft: '2.5%', margin: '2.5%'}}>
          {focusedItem.pfp ? <img src={focusedItem.pfp} style={{width: 40, height: 40, borderRadius: 8, marginRight: 5}}/> :
            <UserCircleIcon className='userBtn' style={{width: 40, height: 40, borderRadius: 8, marginRight: 5}}/>
          }
          
          <div style={{flexWrap: 'wrap'}}>
            <p style={styles.usernameText} className='numberOfLines1'>{focusedItem.username}</p>
            <p style={styles.captionText}>{focusedItem.caption}</p>
          </div>
          
        </div>
        <hr className='divider' style={{marginTop: -5}}/>
        </>
        : <>
        <div style={{flexDirection: 'row', display: 'flex', width: '95%', marginLeft: '2.5%', margin: '2.5%'}}>
          {focusedItem.pfp ? <img src={focusedItem.pfp} style={{width: 40, height: 40, borderRadius: 8, marginRight: 5}}/> :
            <UserCircleIcon className='userBtn' style={{width: 40, height: 40, borderRadius: 8, marginRight: 5}}/>
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
          {item.pfp ? <img src={item.pfp} style={{height: 35, width: 35, borderRadius: 17.5}}/> :
            <UserCircleIcon className='userBtn' style={{width: 35, height: 35, borderRadius: 17.5}}/>
          }
            
            <div style={styles.commentSection}>
              <div onClick={item.user == user.uid ? null : () => {handleClose(); router.push('ViewingProfile', {name: item.user, viewing: true})}}>
                <p style={styles.usernameText}>@{item.username}</p>
              </div>
                
                  <CustomCommentText text={`${item.comment}`}/>
                <div style={styles.commentFooterContainer}>
                    <div style={{flexDirection: 'row', display: 'flex'}}>
                        <p style={styles.dateText}>{getDateAndTime(item.timestamp)}</p>
                        <div className='cursor-pointer' style={styles.replyStyle} onClick={() => {setReplyFocus(true); if (textInputRef.current) {
      textInputRef.current.focus();
    } setTempReplyName(item.username); setTempReplyId(item.id)}}>
                            <p style={styles.replyText}>Reply</p>
                        </div>
                    </div>
                    <div style={{flexDirection: 'row', display: 'flex'}}>
                        <div style={{flexDirection: 'row'}} onClick={item.likedBy.includes(user.uid) == false ? () => {addLikeFunction(item)} : () => {removeLikeFunction(item)}}>
                            {item.likedBy.includes(user.uid) ? <HeartIcon className='btn' style={{alignSelf: 'center', paddingRight: 3}} color="red"/> : <HeartIcon className='btn' style={{alignSelf: 'center'}} color="#808080"/>}
                        </div>
                        <p style={styles.commentText}>{item.likedBy.length}</p>
                    </div>
                </div>
                {item.replies.length == 1 && item.showReply == false ? <div style={{flexDirection: 'row', display: 'flex'}} onClick={() => toggleShowReplyFunction(item)}>
                    <p style={styles.viewRepliesText}>View {item.replies.length} Reply</p>
                    <ChevronDownIcon className='btn' style={{alignSelf: 'center'}}/>
                </div> : item.replies.length > 1 && item.showReply == false ? <div style={{flexDirection: 'row', display: 'flex'}} onClick={() => toggleShowReplyFunction(item)}>
                    <p style={styles.viewRepliesText}>View {item.replies.length} Replies</p>
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
                                  }} onClick={() => deleteReplyFunction(item, element)}>
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
                                <div style={styles.commentHeader}>
                                     {element.pfp ? <img src={element.pfp} style={{height: 35, width: 35, borderRadius: 17.5}}/> :
          <img src='../public/defaultpfp.jpg' style={{height: 35, width: 35, borderRadius: 17.5}}/>}
                                    <div style={styles.commentSection}>
                                    {element.replyToComment == true ? <div onClick={item.user == user.uid ? null : () => {handleClose(); router.push('ViewingProfile', {name: item.user, viewing: true})}}>
                <p style={styles.usernameText}>@{element.username}</p>
              </div> : <div onClick={item.user == user.uid ? null : () => {handleClose(); router.push('ViewingProfile', {name: item.user, viewing: true})}}>
                                    <p style={styles.usernameText}>@{element.username} {'>'} @{element.replyTo}</p>
                                    </div>}
                                    <CustomCommentText text={`${element.reply}`}/>
                                    <div style={styles.commentFooterContainer}>
                                        <div style={{flexDirection: 'row'}}>
                                            <p style={styles.dateText}>{element.timestamp ? getDateAndTime(element.timestamp) : null}</p>
                                            <div style={styles.replyStyle} className='cursor-pointer' onClick={() => {setReplyToReplyFocus(true); setTempReplyName(element.username); setTempCommentId(item.id); setTempReplyId(element.id)}}>
                                                <p style={styles.replyText}>Reply</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    
                                    </div>
                                </div>
                                {replyLastVisible < item.replies.length && item.actualReplies.indexOf(element) == replyLastVisible - 1 ? <div style={{marginLeft: '7.5%', paddingLeft: 0, padding: 10,}} onClick={() => toggleShowReplyFunction(item)}>
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
      <div style={{position: 'absolute', bottom: 30, width: '87.5%'}}>
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
      <button className="close-button" onClick={() => {handleClose(); handleNoComments()}}>
        <XMarkIcon className='btn'/>
            </button>
      </ReactModal>
  )
}

export default Comments