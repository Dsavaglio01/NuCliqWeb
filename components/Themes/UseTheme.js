import React, {useState} from 'react'
import ReactModal from 'react-modal'
import { XMarkIcon } from '@heroicons/react/24/solid';
import { styles } from '@/styles/styles';
import NextButton from '../NextButton';
import { BeatLoader } from 'react-spinners';
import { applyUseTheme } from '@/firebaseUtils';
function UseTheme({actualTheme, appliedThemeModal, closeModal, userId}) {
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
        marginTop: '5%',
        right: 'auto',
        borderRadius: 10,
        height: '40%',
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
        <p style={styles.questionText}>Where do you want to apply the "{actualTheme != null ? actualTheme.name : null}" theme?</p>}
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
            <div className='flex flex-col ml-20'>
                <label className='options'>
                    <input
                        type="radio"
                        value="Posts"
                        checked={current === 'Posts'}
                        onChange={(event) => setCurrent(event.target.value)}
                    />
                    <span className='optionLabel'>My Posts</span>
                </label>
                <label className='options'>
                    <input
                        type="radio"
                        value="Profile"
                        checked={current === 'Profile'}
                        onChange={(event) => setCurrent(event.target.value)}
                    />
                    <span className='optionLabel'>My Profile Page</span>
                </label>
                <label className='options'>
                    <input
                        type="radio"
                        value="Both"
                        checked={current === 'Both'}
                        onChange={(event) => setCurrent(event.target.value)}
                    />
                    <span className='optionLabel'>Both</span>
                </label>
                <div style={styles.useThemeLoadingContainer}> 
                    {applyLoading ? <BeatLoader color={"#9EDAFF"}/> : 
                    <NextButton text={profileDoneApplying || postDoneApplying || bothDoneApplying ? "OK" : "CONTINUE"} button={{width: '45%'}} 
                    onPress={profileDoneApplying || postDoneApplying || bothDoneApplying ? 
                        () => {handleClose(); setProfileDoneApplying(false); setBothDoneApplying(false); setPostDoneApplying(false)} 
                        : applyToUser()}/>
                    }
                </div>
            </div>
        }

    </ReactModal>
  )
}

export default UseTheme