import React, { useState, useEffect } from 'react'
import { styles } from '@/styles/styles';
import FollowButtons from './FollowButtons';
import CarouselComponent from './Carousel';
import LikeButton from './LikeButton';
import { ChatBubbleBottomCenterIcon, ArrowUturnRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import {EllipsisVerticalIcon} from '@heroicons/react/24/solid';
import { ableToShareFunction, addHomeLikeFunction, addHomeSaveFunction, removeLikeFunction, removeHomeSaveFunction } from '@/firebaseUtils';
import SaveButton from './SaveButton';
import getDateAndTime from '@/lib/getDateAndTime';
import Comments from './Comments';
import RepostModal from './RepostModal';
import SendingModal from './SendingModal';
import ReportModal from './ReportModal';
import { useRouter } from 'next/router';
function IndPost({item, user, pfp, username, notificationToken, followers, following, blockedUsers, background, forSale, dropdownRef, tempPosts, setTempPosts}) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [focusedLikedItem, setFocusedLikedItem] = useState(null);
    const [focusedItem, setFocusedItem] = useState(null);
    const [ableToShare, setAbleToShare] = useState(false);
    const [commentModal, setCommentModal] = useState(false);
    const [likesModal, setLikesModal] = useState(false);
    const [repostModal, setRepostModal] = useState(false);
    const [sendingModal, setSendingModal] = useState(false);
    const [repostItem, setRepostItem] = useState(null);
    const [reportModal, setReportModal] = useState(false);
    useEffect(() => {
        if (focusedLikedItem != null) {
            setLikesModal(true)
        }
    }, [focusedLikedItem])
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
    useEffect(() => {
        if (commentModal) {
        document.body.style.overflow = 'hidden';
        } else {
        document.body.style.overflow = 'unset'; // or 'auto', depending on your desired default
        }
    }, [commentModal]);
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
        if (focusedItem != null) {
            setCommentModal(true)
        }
    }, [focusedItem])
    async function addHomeSave(item) {
        await addHomeSaveFunction(item, user, tempPosts, setTempPosts)
    }
    async function removeHomeSave(item) {
        await removeHomeSaveFunction(item, user, tempPosts, setTempPosts)
    }
    async function addHomeLike(item, likedBy) {
        await addHomeLikeFunction(item, likedBy, user, tempPosts, setTempPosts, username)
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
                        <img src='defaultpfp.jpg' height={44} width={44} style={styles.pfpBorder}/>
                    }
                    <p className='flex-1 font-bold pl-5' style={{color: "#fafafa"}}>{item.username}</p>
                    <FollowButtons user={user} item={item}/>
                </div>
                {item.post != null && item.post.length > 1 ? <CarouselComponent itemPost={item.post}/> : item.post != null && 
                item.post.length == 1 ? item.post[0].image ? 
                <div className='px-5 pb-5'>
                    <img src={item.post[0].post} style={{height: 304, width: 304}} className='object-cover w-full rounded-md'/>
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
                    <div className='flex flex-row' onClick={() => setFocusedItem(item)}>
                        <ChatBubbleBottomCenterIcon className='btn'/>
                        <span style={styles.numberCommentText}>{item.comments}</span>
                    </div>
                    <SaveButton key={item.id} item={item} user={user} updateTempPostsAddSave={addHomeSave} updateTempPostsRemoveSave={removeHomeSave}/>
                    {!item.private ? 
                        <ArrowUturnRightIcon className='btn' onClick={() => setSendingModal(true)}/> : null}
                    {item.post[0].text && item.userId != user.uid && !item.private ? 
                        <div style={styles.repostButtonContainer}>
                        <div className='cursor-pointer' onClick={() => {setRepostModal(true); setRepostItem(item)}}>
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
                        <li className='reportList' style={styles.reportText} onClick={() => setReportModal(true)}>Report</li>
                    </ul>
                )}
            </div>
            <p className='p-5 truncate text-white'>
                <span className='font-bold mr-1'>{item.username}</span> {item.caption}
            </p>
        </div>
        <div className='arrow' />
        <Comments commentModal={commentModal} ableToShare={ableToShare} videoStyling={false} username={username} notificationToken={notificationToken} actualData={tempPosts}
        focusedItem={focusedItem} handleData={setTempPosts} closeCommentModal={() => setCommentModal(false)} pfp={pfp} user={user}/>
        {/* <ViewLikes likesModal={likesModal} closeLikesModal={() => setLikesModal(false)} focusedLikedItem={focusedLikedItem} user={user}/> */}
        <RepostModal repostModal={repostModal} closeRepostModal={() => setRepostModal(false)} user={user} username={username} notificationToken={notificationToken}
            blockedUsers={blockedUsers} forSale={forSale} background={background} pfp={pfp} repostItem={repostItem} ableToShare={ableToShare}/>
        <ReportModal reportModal={reportModal} closeReportModal={() => setReportModal(false)} theme={false} post={true} video={false}/>
        <SendingModal sendingModal={sendingModal} payload={item} closeSendingModal={() => setSendingModal(false)} video={false} theme={false} post={true} user={user} 
        followers={followers ? followers : []} following={following ? following : []}/>
    </div>
  )
}

export default IndPost;