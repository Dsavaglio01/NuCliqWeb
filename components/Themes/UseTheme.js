import React, {useState} from 'react'
import ReactModal from 'react-modal'
import { XMarkIcon } from '@heroicons/react/24/solid';
import { styles } from '@/styles/styles';
import NextButton from '../NextButton';
import { BeatLoader } from 'react-spinners';
import { applyUseTheme } from '@/firebaseUtils';
import MainButton from '../MainButton';
function UseTheme({actualTheme, appliedThemeModal, closeModal, userId, profiles, posts, both}) {
    const [profileDoneApplying, setProfileDoneApplying] = useState(false);
    const [postDoneApplying, setPostDoneApplying] = useState(false);
    const [bothDoneApplying, setBothDoneApplying] = useState(false);
    const [useThemeModalLoading, setUseThemeModalLoading] = useState(false);
    const [applyLoading, setApplyLoading] = useState(false);
    const [current, setCurrent] = useState('');
    const handleClose = () => {
        closeModal()
    }
    async function applyToUser() {
      setApplyLoading(true);
      applyUseTheme(current === 'Posts', current === 'Profile', current === 'Both', userId, actualTheme, setApplyLoading, setUseThemeModalLoading, setPostDoneApplying,
        setProfileDoneApplying, setBothDoneApplying)
    }
  return (
    <ReactModal isOpen={appliedThemeModal} style={{content: {
        width: '20%',
        left: '68%',
        marginTop: '15%',
        right: 'auto',
        borderRadius: 10,
        height: '30%',
        transform: 'translate(-50%, 0)',
        backgroundColor: "#121212",
        marginRight: '-50%',}}}>
        <div className='flex flex-row'>
            <span className='text-white'>Use Theme</span>
            <button className="close-button" onClick={() => handleClose()}>
                <XMarkIcon className='btn'/>
            </button>
        </div>
        <div className='divider'/>
        {profileDoneApplying || postDoneApplying || bothDoneApplying ? null : 
        <p style={styles.questionText}>Do you want to apply the "{actualTheme != null ? actualTheme.name : null}" theme to <b>{profiles ? 'your Profile' : posts ? 'your Posts' :
        both ? 'Both your Profile and Posts' : null}</b>?</p>}
        {useThemeModalLoading ? 
        <div style={{marginTop: '5%'}}> 
            <BeatLoader color={"#9EDAFF"}/> 
        </div> : profileDoneApplying ? 
            <div style={{marginTop: '5%'}}>
                <span style={styles.postText}>Your profile is now updated with this theme. You can check by going to your profile!</span>
            </div> : postDoneApplying ? 
            <div style={{marginTop: '5%'}}>
                <span style={styles.postText}>Your posts are now updated with this theme. You can check by clicking on your posts on your profile!</span>
            </div> : bothDoneApplying ? 
            <div>
                <span style={styles.postText}>Your profile and posts are now updated with this theme. You can check by going to your profile and clicking on your posts on your profile!</span>
            </div> : 
            <div className='flex flex-col'>
                <div style={styles.useThemeLoadingContainer}> 
                    {applyLoading ? <BeatLoader color={"#9EDAFF"}/> : 
                    <div className='flex justify-evenly'>
                        <MainButton text={"NO"} onClick={() => handleClose()}/>
                        <NextButton text={"YES"} onPress={profileDoneApplying || postDoneApplying || bothDoneApplying ? 
                        () => {handleClose(); setProfileDoneApplying(false); setBothDoneApplying(false); setPostDoneApplying(false)} 
                        : () => applyToUser()}/>
                    </div>
                   
                    }
                </div>
            </div>
        }

    </ReactModal>
  )
}

export default UseTheme