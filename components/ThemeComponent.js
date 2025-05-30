import React, { useState } from 'react'
import { styles } from '@/styles/styles';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
function ThemeComponent({item, user, index, get, free, my, purchased, ref, myThemes, setMyThemes, purchasedThemes, setPurchasedThemes, freeTempPosts, setFreeTempPosts,
  specificThemeStateTrue, specificThemeId, specificState, specificUsername, reportedThemes}) {
    const [chosenTheme, setChosenTheme] = useState(null);
    const handleSpecificThemeState = () => {
        specificThemeStateTrue();
    }
    const handleSpecificId = (id) => {
        specificThemeId(id)
    }
    const handleSpecificState = (state) => {
        specificState(state);
    }
    const handleSpecificUsername = (username) => {
        specificUsername();
    }
    function itemToTransparent(item) {
        const updatedMyThemes = [...myThemes];
        const objectIndex = updatedMyThemes.findIndex(obj => obj.id === item.id)
        updatedMyThemes[objectIndex].transparent = true
        setMyThemes(updatedMyThemes)
      }
    function itemPurchaseToTransparent(item) {
      const updatedMyThemes = [...purchasedThemes];
      const objectIndex = updatedMyThemes.findIndex(obj => obj.id === item.id)
      updatedMyThemes[objectIndex].transparent = true
      setPurchasedThemes(updatedMyThemes)
    }
    function itemPurchaseNotToTransparent(item) {
      const updatedMyThemes = [...purchasedThemes];
      const objectIndex = updatedMyThemes.findIndex(obj => obj.id === item.id)
      updatedMyThemes[objectIndex].transparent = false
      setPurchasedThemes(updatedMyThemes)
    }
    function itemNotToTransparent(item) {
      const updatedMyThemes = [...myThemes];
      const objectIndex = updatedMyThemes.findIndex(obj => obj.id === item.id)
      updatedMyThemes[objectIndex].transparent = false
      setMyThemes(updatedMyThemes)
    }
    function itemFreeToTransparent(item) {
    const updatedThemes = [...freeTempPosts];
    const objectIndex = updatedThemes.findIndex(obj => obj.id === item.id)
    updatedThemes[objectIndex].transparent = true
    setFreeTempPosts(updatedThemes)
  }
  function itemFreeNotToTransparent(item) {
    const updatedThemes = [...freeTempPosts];
    const objectIndex = updatedThemes.findIndex(obj => obj.id === item.id)
    updatedThemes[objectIndex].transparent = false
    setFreeTempPosts(updatedThemes)
  }
  return (
      <div ref={ref} key={item.id} style={styles.themeContainer} className='max-w-full'>
      <div className='cursor-pointer' onClick={get ? () => {handleSpecificThemeState(); handleSpecificId(item.id); handleSpecificState('get'); handleSpecificUsername(item.username)} :
       free ? () => {handleSpecificThemeState(); handleSpecificId(item.id); handleSpecificState('free'); handleSpecificUsername(item.username)} 
      : my ? () => {handleSpecificThemeState(); handleSpecificId(item.id); handleSpecificState('my'); handleSpecificUsername(item.username)} :
      purchased ? () => {handleSpecificThemeState(); handleSpecificId(item.id); handleSpecificState('purchased'); handleSpecificUsername(item.username)} : null}>
        <img src={item.images[0]} style={styles.specificTheme}/>
      </div>
      <div style={styles.closeSend}>
          <p className='themeText'>{item.name}</p>
          <div className='cursor-pointer' onClick={get ? () => itemAllToTransparent(item) : free ? () => itemFreeToTransparent(item) 
            : my ? () => itemToTransparent(item) : purchased ? () => itemPurchaseToTransparent(item) : null}>
            <Bars3Icon className='navBtn' color='#fafafa' style={{alignSelf: 'center'}}/>
          </div>
          
        </div>
      {item.transparent ? 
        <div style={styles.overlay}>
          <div style={styles.themeCloseContainer} 
          onClick={get ? () =>{itemAllNotToTransparent(item); setChosenTheme(null)} : free ? () => {itemFreeNotToTransparent(item); setChosenTheme(null)} : my ?
            () => {itemNotToTransparent(item); setChosenTheme(null)} : purchased ? () => {itemPurchaseNotToTransparent(item); setChosenTheme(null)}: null}>
            <p style={styles.closeText}>Close</p>
            <XMarkIcon className='navBtn' color='#fafafa'/>
          </div>
          <div style={styles.themeOptionsContainer}>
            {free || get ? 
            <div className='cursor-pointer' style={styles.applyContainer} onClick={() => {handleSpecificThemeState(); handleSpecificId(item.id); handleSpecificState('free'); handleSpecificUsername(item.username)}}>
                <p style={styles.applyText}>Get Theme</p>
              </div> : null}
              <div className='cursor-pointer' style={styles.applyContainer} onClick={() => setSendingModal(true)}>
                <p style={styles.applyText}>Share Theme</p>
              </div>
              {!free ? item.stripe_metadata_userId && item.stripe_metadata_userId != user.uid && !reportedThemes.includes(item.id) ? 
              <div className='cursor-pointer' style={styles.applyContainer} onClick={() => setReportModal(true)}>
                <p style={styles.applyText}>Report Theme</p>
              </div>
              : null : item.userId && item.userId != user.uid && !reportedThemes.includes(item.id) ? 
              <div className='cursor-pointer' style={styles.applyContainer} onClick={() => setReportModal(true)}>
                <p style={styles.applyText}>Report Theme</p>
              </div>
              : null}
            </div>
        </div>
      : null
      }
      </div>
  )
}

export default ThemeComponent