import { styles } from '@/styles/styles'
import React, { useState } from 'react'
import ReactModal from 'react-modal'
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { BeatLoader } from 'react-spinners';
import NextButton from './NextButton';
import { repostFunction } from '@/firebaseUtils';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { XMarkIcon } from '@heroicons/react/24/solid';
function RepostModal({repostModal, repostItem, closeRepostModal, ableToShare, user, blockedUsers, forSale, notificationToken, username,
    background, pfp,
}) {
    const [repostComment, setRepostComment] = useState('');
    const [repostLoading, setRepostLoading] = useState(false);
    const router = useRouter();
    const handleRepostComment = (event) => {
        setRepostComment(event.target.value)
    }
    const handleClose = () => {
        closeRepostModal()
    }
    async function rePostFunction() {
    if (!ableToShare) {
    window.alert('Post unavailable to reply')
    closeRepostModal()
  }
  else {
    //await updateDoc(doc())
    setRepostLoading(true)
    await repostFunction(user, blockedUsers, repostComment, forSale, notificationToken, username, background, pfp, repostItem, setRepostLoading, 
    handleClose, schedulePushRepostNotification)

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
  return (
    <ReactModal isOpen={repostModal} style={{content: styles.modalContainer}}>
              {repostItem ? <div style={styles.repostItemContainer}>
                <textarea maxLength={200} value={repostComment} onChange={handleRepostComment} placeholder='Add a comment...' color='#fafafa' style={styles.repostCommentStyle}/>
              <p style={styles.repostCommentText}>{repostComment.length}/200</p>
              <div style={styles.repostContainer}>
                <div style={styles.postRepostHeader}>
            {repostItem.pfp ? <img src={repostItem.pfp} style={styles.commentPfp}/> : 
          <UserCircleIcon style={styles.commentPfp}/>
          }
            <div className='cursor-pointer' onClick={repostItem.userId != user.uid ? () => router.push('ViewingProfile', {name: repostItem.userId, viewing: true}) : () => router.push('Profile', {screen: 'ProfileScreen', params: {name: user.uid, preview: false, viewing: false, previewImage: null, previewMade: false, applying: false}})}>
              <p style={styles.addRepostText}>@{repostItem.username}</p>
            </div>
          </div> 
                <p style={styles.repost}>{repostItem.post[0].value}</p>
              </div>
              </div> 
              : <p>Sorry, something went wrong, please try again.</p>}
              

              <div style={styles.repostLoadingContainer}>
                {repostLoading ? <BeatLoader color={"9edaff"}/> : 
                <div className='flex justify-end mt-5'>
                <NextButton text={"Re-vibe"} onClick={rePostFunction}/> 
                </div>}
              </div>
              <button className="close-button" onClick={() => handleClose()}>
        <XMarkIcon className='btn'/>
            </button>
      </ReactModal>
  )
}

export default RepostModal