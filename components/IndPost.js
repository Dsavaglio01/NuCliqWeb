import React, { useState, useEffect } from 'react'
import { styles } from '@/styles/styles';
import FollowButtons from './FollowButtons';
import CarouselComponent from './Carousel';
import LikeButton from './LikeButton';
import { ChatBubbleBottomCenterIcon, ArrowUturnRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import {EllipsisVerticalIcon} from '@heroicons/react/24/solid';
import SaveButton from './SaveButton';
function IndPost({item, user, likesModal, commentModal, sendingModal, reportModal, repostModal, focusedItem, repostItem}) {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedLikedItem, setFocusedLikedItem] = useState(null);
    useEffect(() => {
    if (focusedLikedItem != null) {
        likesModal();
    }
  }, [focusedLikedItem])
    const handleComments = (item) => {
        focusedItem(item)
        commentModal();
    }
    const handleSending = () => {
        sendingModal();
    }
    const handleRepost = (item) => {
        repostItem(item)
        repostModal();
    }
    const handleReport = () => {
        reportModal();
    }
    async function addHomeSave(item) {
        await addHomeSaveFunction(item, user, tempPosts, setTempPosts)
    }
    async function removeHomeSave(item) {
        await removeHomeSaveFunction(item, user, tempPosts, setTempPosts)
    }
    async function addHomeLike(item, likedBy) {
        await addHomeLikeFunction(item, likedBy, user, tempPosts, setTempPosts, schedulePushLikeNotification, username)
    }
    async function removeHomeLike(item) {
        await removeLikeFunction(item, user, tempPosts, setTempPosts)
    }
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };
  return (
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
                        <img src='../public/defaultpfp.jpg' height={44} width={44} style={styles.pfpBorder}/>
                    }
                    <p className='flex-1 font-bold' style={{color: "#fafafa"}}>{item.username}</p>
                    <FollowButtons user={user} item={item}/>
                </div>
                {item.post != null && item.post.length > 1 ? <CarouselComponent itemPost={item.post}/> : item.post != null && 
                item.post.length == 1 ? item.post[0].image ? 
                <div className='px-5 pb-5'>
                    <img src={item.post[0].post} className='object-cover w-full rounded-md'/>
                </div> : item.post[0].text ?
                <div style={{marginLeft: '5%'}}> 
                    <p style={styles.postText}>{item.post[0].value}</p>
                </div> : 
                <div>
                    <p style={styles.rePostText}>{item.caption}</p>
                    <button className='mb-5' onClick={() => router.push('Repost', {post: item.post.id, requests: requests, name: user.uid, groupId: null, video: false})} style={styles.repostContainer}>
                        <div style={styles.postHeader}>
                            {item.post.pfp ? <img src={item.post.pfp} height={44} width={44} style={styles.pfpBorder}/> : 
                            <UserCircleIcon height={44} width={44} style={styles.pfpBorder}/>
                            }
                            <button className='mt-0 pt-0'>
                                <span style={styles.addText}>@{item.post.username}</span>
                            </button>
                            <span style={styles.timeText}>{getDateAndTime(item.post.timestamp)}</span>
                        </div> 
                        <p style={styles.actualrepostText} className=''>{item.post.post[0].value}</p>
                    </button>
                </div> : null}
            </div>
        </div>
        <div className='bg-[#121212] rounded-xl m-5 mb-16 mt-0 relative'>
            <div className='flex justify-between pt-4 px-4'>
                <div className='flex space-x-4'>
                    <LikeButton key={item.id} item={item} user={user} updateTempPostsAddLike={addHomeLike} updateTempPostsRemoveLike={removeHomeLike} updateTempPostsFocusedLike={setFocusedLikedItem}/>
                    <div className='flex flex-row' onClick={() => handleComments(item)}>
                        <ChatBubbleBottomCenterIcon className='btn'/>
                        <span style={styles.numberCommentText}>{item.comments}</span>
                    </div>
                    <SaveButton key={item.id} item={item} user={user} updateTempPostsAddSave={addHomeSave} updateTempPostsRemoveSave={removeHomeSave}/>
                    {!item.private ? 
                        <ArrowUturnRightIcon className='btn' onClick={() => handleSending()}/> : null}
                    {item.post[0].text && item.userId != user.uid && !item.private ? 
                        <div style={styles.repostButtonContainer}>
                        <div className='cursor-pointer' onClick={() => handleRepost(item)}>
                            <ArrowPathIcon className='btn' color='#fafafa'/>
                        </div>
                        {item.reposts ?
                            <div>
                                <p style={styles.postFooterText}>{item.reposts > 999 && item.reposts < 1000000 ? `${item.reposts / 1000}k` 
                                    : item.reposts > 999999 ? `${item.reposts / 1000000}m` : item.reposts}</p>
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
                        <li className='reportList' style={styles.reportText} onClick={() => handleReport()}>Report</li>
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
}

export default IndPost;