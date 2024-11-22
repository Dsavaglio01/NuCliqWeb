import { styles } from '@/styles/styles'
import { useRouter } from 'next/router';
import React, { useMemo, useState} from 'react'
import ReactModal from 'react-modal'
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { BeatLoader } from 'react-spinners';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { fetchLikes } from '@/firebaseUtils';
function ViewLikes({likesModal, closeLikesModal, focusedLikedItem, user}) {
  const [likesLoading, setLikesLoading] = useState(false);
  const [likesInfo, setLikesInfo] = useState([]);
  const router = useRouter();
  const handleClose = () => {
    closeLikesModal()
  }
  /* const loadLikes = async() => {
    setLikesLoading(true);
    const fetchedLikesInfo = await fetchLikes(focusedLikedItem, user);
    setLikesInfo(fetchedLikesInfo);
    setLikesLoading(false);
  }
  useMemo(() => {
    loadLikes()
  }, []) */
  return (
    <ReactModal isOpen={likesModal} style={{content: styles.modalContainer}}>
        <div>
       <div>
            <p style={styles.header}>Likes: </p>
        </div>
      <div className='divider'/>
      {likesInfo.length == 0 && !likesLoading ? 
        <div style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <p style={{fontSize: 24, color: "#fafafa"}}>No Likes Yet!</p>
          </div> 
          :
          <>
      {!likesLoading ?
      likesInfo.map((item, index) => {
        return (
           <div key={index}>
            <div className='cursor-pointer' style={styles.friendsContainer} onClick={item.id !== user.uid ? () => router.push('ViewingProfile', {name: item.id, viewing: true}) : () => navigation.navigate('Profile', {screen: 'ProfileScreen', params: {name: user.uid, preview: false, viewing: false, previewImage: null, previewMade: false, applying: false}})}>
                <div style={{flexDirection: 'row', display: 'flex'}}>
                  {item.pfp ? 
                  <img src={item.pfp} style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}}/> :
                  <UserCircleIcon style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}}/>
                  }
                    
                 <div style={{paddingLeft: 20, width: '70%', justifyContent: 'center'}}>
                    <p className='numberOfLines1' style={styles.name}>{item.firstName} {item.lastName}</p>
                    <p className='numberOfLines1' style={styles.message}>@{item.userName}</p>
                </div>
                </div>

            </div>
          </div>
        )
      })
      : likesLoading ? <div style={{flex: 1, alignItems: 'center', justifyContent:'center', marginBottom: '50%'}}>
        <BeatLoader color='#9edaff'/>
        </div> : null}
        </>
}
    </div>
    <button className="close-button" onClick={() => handleClose()}>
        <XMarkIcon className='btn'/>
            </button>
      </ReactModal>
  )
}

export default ViewLikes