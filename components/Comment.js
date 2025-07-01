import React, {useState, useRef} from 'react'
import { UserCircleIcon, HeartIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { styles } from '@/styles/styles';
import { db } from '@/firebase';
import { useRouter } from 'next/router';
import getDateAndTime from '@/lib/getDateAndTime';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { addCommentLike, removeCommentLike, } from '@/firebaseUtils';
function Comment({item, user, handleClose, setComments, setTempReplyName, setReplyFocus }) {
    const [tempReplyId, setTempReplyId] = useState('');
    const [usernames, setUsernames] = useState([]);
    //const [reportComment, setReportComment] = useState('');
    const [tempCommentId, setTempCommentId] = useState(null);
    const [replyLastVisible, setReplyLastVisible] = useState(0);
    const textInputRef = useRef();
    const router = useRouter();
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
            <p className='text-white'>
            {text.slice(0).map((text) => {

                if (text.startsWith('@')) {
                return (
                    <p style={text.startsWith('@') ? usernames.some((substring) => text.includes(substring)) ? {fontWeight: '600', color: "#fafafa"} 
                    : {color: "#fafafa"} : {color: "#fafafa"}} onClick={usernames.some((substring) => text.includes(substring)) ? 
                    () => findUser(usernames.find((substring) => text.includes(substring))) : null}>
                        {text.startsWith('@') ? text.replaceAll('@', '@') : null}{' '}
                    </p>
                    
                );
                }
                return `${text} `;
            })}
            </p>
        );
        };
  return (
    <div>
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
                    <p className='comment-time'>{getDateAndTime(item.timestamp)}</p>
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
                                        <p className='comment-time'>{element.timestamp ? getDateAndTime(element.timestamp) : null}</p>
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
}

export default Comment