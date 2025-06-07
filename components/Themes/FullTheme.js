import React, {useState} from 'react'
import { styles } from '@/styles/styles';
import { BeatLoader } from 'react-spinners';
import NextButton from '../NextButton';
import UseTheme from './UseTheme';
function FullTheme({theme, profile, userId}) {
    const actualTheme = theme[0]
    const [themeLoading, setThemeLoading] = useState(false);
    const [appliedThemeModal, setAppliedThemeModal] = useState(false);
    const [profiles, setProfiles] = useState(false);
    const [posts, setPosts] = useState(false);
    const [both, setBoth] = useState(false);
  return (
    <div className='flex flex-col items-center' style={{flexDirection: 'column'}}>
        <UseTheme actualTheme={actualTheme} profiles={profiles} posts={posts} both={both} appliedThemeModal={appliedThemeModal} userId={userId} closeModal={() => setAppliedThemeModal(false)}/>
        <div className='mt-10'>
            <span className='text-white text-2xl'>{actualTheme.name}</span>
        </div>
        <div className='mt-10' style={{width: '35%', height: '80%'}}>
            <img src={actualTheme.images[0]} style={styles.fullTheme}/>
            <div style={styles.themeOverlay} className='flex-col'>
                <div style={{flexDirection: 'column', display: 'flex'}}>
                    <button style={styles.previewButton} onClick={() => setAppliedThemeModal(true)}>
                        <span style={styles.previewText}>Preview w/ Profile</span>
                    </button>
                    <button style={styles.previewButton} onClick={() => setAppliedThemeModal(true)}>
                        <span style={styles.previewText}>Preview w/ Posts</span>
                    </button>
                    {profile.themeIds && (profile.themeIds.includes(productId) || profile.themeIds.includes(myId)) ? 
                    <>
                        <button style={styles.previewButton} onClick={() => {setAppliedThemeModal(true); setProfiles(true); setPosts(false); setBoth(false)}}>
                            <span style={styles.previewText}>Apply to Profile</span>
                        </button>
                        <button style={styles.previewButton} onClick={() => {setAppliedThemeModal(true); setProfiles(false); setPosts(true); setBoth(false)}}>
                            <span style={styles.previewText}>Apply to Posts</span>
                        </button>
                        <button style={styles.previewButton} onClick={() => {setAppliedThemeModal(true); setProfiles(false); setPosts(false); setBoth(true)}}>
                            <span style={styles.previewText}>Apply to Both Profile & Posts</span>
                        </button>
                    </>
                    : null}
                </div>
            </div>
        </div>
        {themeLoading ? <BeatLoader color={"#9EDAFF"} style={{alignItems: 'center'}}/> : 
            profile.themeIds && (profile.themeIds.includes(productId) || profile.themeIds.includes(myId)) ? <span style={styles.sorryNoThemeText}>You have this theme!</span> 
            : <div style={styles.purchaseButton}>
                <NextButton text={'Get Theme for FREE'} onPress={() => freeTheme()}/>
            </div>}
        
        
    </div>
    
  )
}

export default FullTheme