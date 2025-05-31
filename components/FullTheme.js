import React, {useState} from 'react'
import { styles } from '@/styles/styles';
import { BeatLoader } from 'react-spinners';
import NextButton from './NextButton';
import ReactModal from 'react-modal';
import { XMarkIcon } from '@heroicons/react/24/solid';
function FullTheme({theme, profile}) {
    const actualTheme = theme[0]
    const [themeLoading, setThemeLoading] = useState(false);
    const [appliedThemeModal, setAppliedThemeModal] = useState(false);
  return (
    <div className='flex flex-col items-center' style={{flexDirection: 'column'}}>
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
                <button className="close-button" onClick={() => setAppliedThemeModal(false)}>
                    <XMarkIcon className='btn'/>
                </button>
            </div>
           
        </ReactModal>
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
                    <button style={styles.previewButton} onClick={() => setAppliedThemeModal(true)}>
                        <span style={styles.previewText}>Apply to Profile</span>
                    </button>
                    <button style={styles.previewButton} onClick={() => setAppliedThemeModal(true)}>
                        <span style={styles.previewText}>Apply to Posts</span>
                    </button>
                    <button style={styles.previewButton} onClick={() => setAppliedThemeModal(true)}>
                        <span style={styles.previewText}>Apply to Both Profile & Posts</span>
                    </button>
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