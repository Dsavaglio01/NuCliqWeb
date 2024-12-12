import { styles } from '@/styles/styles'
import React, { useState } from 'react'
import ReactModal from 'react-modal'
import { BeatLoader } from 'react-spinners'
import { XMarkIcon } from '@heroicons/react/24/solid'
function ReportModal({reportModal, closeReportModal, post, theme, video}) {
    const [finishedReporting, setFinishedReporting] = useState(false)
    const [loading, setLoading] = useState(false);
    const [reportedContent, setReportedContent] = useState([]);
    const handleClose = () => {
        closeReportModal()
    }
    function onSecondPress(item) {
        setLoading(true)
        if (reportedContent.length < 10) {
      
    }
    else {

      addDoc(collection(db, 'profiles', reportComment.user, 'reportedContent'), {
      content: reportComment.id,
      reason: item,
      post: focusedItem,
      comment: reportComment.comment == undefined ? reportComment.reply : reportComment.comment,
       message: false,
      cliqueMessage: false,
      timestamp: serverTimestamp()
    }).then(() => addDoc(collection(db, 'profiles', reportComment.user, 'notifications'), {
      like: false,
comment: reportComment.comment == undefined ? reportComment.reply : reportComment.comment,
      friend: false,
      item: item,
      request: false,
      acceptRequest: false,
      theme: false,
      report: true,
      postId: focusedItem.id,
      requestUser: reportComment.user,
      requestNotificationToken: reportNotificationToken,
      post: focusedItem,
       message: false,
      cliqueMessage: false,
      likedBy: [],
      timestamp: serverTimestamp()
    })).then(() => addDoc(collection(db, 'profiles', reportComment.user, 'checkNotifications'), {
      userId: reportComment.user
    })).then(reportComment ? async() => await updateDoc(doc(db, 'profiles', user.uid), {
      reportedComments: arrayUnion(reportComment.id)
    }) : null).then(() => schedulePushReportNotification()).then(() => setFinishedReporting(true)).then(() => setReportCommentModal(false))
    }
    setTimeout(() => {
        setLoading(false)
    }, 500);
    }
  return (
    <ReactModal isOpen={reportModal} style={{content: styles.modalContainer}}>
       <div>
                {loading ? <div style={styles.reportLoadingContainer}>
        <BeatLoader color={ "#9EDAFF"}/> 
        </div> : !finishedReporting ? 
        <>
                <p style={styles.reportContentText}>Why Are You Reporting This Content?</p>
                <p style={styles.reportSupplementText} className='mb-10'>Don't Worry Your Response is Anonymous! If it is a Dangerous Emergency, Call the Authorities Right Away!</p>
                <div className='divider'/>
                <div className='cursor-pointer' style={styles.listItemContainer} onClick={() => onSecondPress('Discrimination')}>
                  <p style={styles.reportSupplementText}>Discrimination</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={styles.listItemContainer} onClick={() => onSecondPress('General Offensiveness')}>
                  <p style={styles.reportSupplementText}>General Offensiveness</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={styles.listItemContainer} onClick={() => onSecondPress('Gore/Excessive Blood')}>
                  <p style={styles.reportSupplementText}>Gore / Excessive Blood</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={styles.listItemContainer} onClick={() => onSecondPress('Nudity/NSFW Sexual Content')}>
                  <p style={styles.reportSupplementText}>Nudity / NSFW Sexual Content</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={styles.listItemContainer} onClick={() => onSecondPress('Scammer/Fraudulent User')}>
                  <p style={styles.reportSupplementText}>Scammer / Fraudulent User</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={styles.listItemContainer} onClick={() => onSecondPress('Spam')}>
                  <p style={styles.reportSupplementText}>Spam</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={styles.listItemContainer} onClick={() => onSecondPress('Toxic/Harassment')}>
                  <p style={styles.reportSupplementText}>Toxic / Harassment</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={styles.listItemContainer} onClick={() => onSecondPress('Violent Behavior')}>
                  <p style={styles.reportSupplementText}>Violent Behavior</p>
                  
                </div>
                <div className='divider' />
                <div className='cursor-pointer' style={styles.listItemContainer} onClick={() => onSecondPress('Other')}>
                  <p style={styles.reportSupplementText}>Other</p>
                  
                </div> 
                </>
             : 
            <div style={{flex: 1}}>
            <div style={styles.thanksContainer}>
            <p style={styles.reportThanksContentText}>Thanks for submitting your anonymous response!</p>
            <p style={styles.reportThanksContentText}>User has been notified about the report.</p>
            <p style={styles.reportThanksContentText}>Thanks for keeping NuCliq safe!</p>
            </div>
            </div>
            }
        </div>
        <button className="close-button" onClick={() => handleClose()}>
        <XMarkIcon className='btn'/>
            </button>
      </ReactModal>
  )
}

export default ReportModal