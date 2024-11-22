import React from 'react'
import { useState, useEffect } from 'react'
import { db } from '@/firebase'
import { getDoc, doc, onSnapshot, query, collection } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import { BeatLoader } from 'react-spinners'
import NextButton from '@/components/NextButton'
import { useRouter } from 'next/router'
function SpecificTheme({specificUsername, onStateChange, specificId, specificState}) {
    const {user} = useAuth();
    const [name, setName] = useState('')
    const [price] = useState(0);
    const [applyLoading, setApplyLoading] = useState(false)
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState(null)
    const [themeLoading, setThemeLoading] = useState(false);
    const [userId, setUserId] = useState(null)
    const [purchasedThemes, setPurchasedThemes] = useState([]);
    const [myThemes, setMyThemes] = useState([]);
    const [keywords, setKeywords] = useState('');
    const [searchKeywords, setSearchKeywords] = useState([]);
    const [selling, setSelling] = useState(false);
    const header = {
         padding: 10,
        //paddingTop: 5,
        color: "#fafafa",
        fontSize: 19.20,
        margin: 5,
        marginTop: 0,
        textAlign: 'center',
    }
    const headerHeader = {
        color: "#fafafa",
        fontSize: 24,
        padding: 10,
        textAlign: 'center'
    }
    const headerUsername = {
        margin: 5,
        textAlign: 'center',
        paddingTop: 0, 
        fontSize: 15.36, 
        marginTop: 0
    }
    const purchaseButton =  {
        marginTop: '-15%'
    }
    const router = useRouter();
    const image = {
        width: 335, height: window.innerHeight / 1.78
    }
    const overlay = {
        position: 'relative',
        left: '1.25%',
        bottom: 300
    }
    const imageContainer =  {
        borderWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '5%',
        marginRight: '5%'
    }
    const previewButton ={
         backgroundColor: "#121212",
      marginBottom: 10,
      height: 40,
      borderRadius: 10,
      width: '90%',
      alignItems: 'center'
    }
    const previewText = {
        color: "#9edaff",
        fontSize: 15.36,
      padding: 15,
    }
    useEffect(() => {
      let unsub1;
      let unsub2;
      const getPurchasedThemes = async() => {
        unsub1 = onSnapshot(query(collection(db, 'profiles', user.uid, 'purchased')), (snapshot) => {
          setPurchasedThemes(snapshot.docs.map((doc) => ({
            productId: doc.data().productId
          })))
        })
      }
      const getMyThemes = async() => {
        unsub2 = onSnapshot(query(collection(db, 'profiles', user.uid, 'myThemes')), (snapshot) => {
          setMyThemes(snapshot.docs.map((doc) => ({
            image: doc.data().images[0]
          })))
        })
      }
      getMyThemes()
      getPurchasedThemes()
      return unsub1, unsub2;
    }, [])
    async function freeTheme() {
      setThemeLoading(true)
       try {
                            const response = await fetch(`${BACKEND_URL}/api/getFreeTheme`, {
                          method: 'POST', // Use appropriate HTTP method (GET, POST, etc.)
                          headers: {
                            'Content-Type': 'application/json', // Set content type as needed
                          },
                          body: JSON.stringify({ data: {notificationToken: notificationToken, user: user.uid, keywords: keywords, searchKeywords: searchKeywords, theme: theme, name: name, 
                            productId: productId, themeId: themeId
                          }}), // Send data as needed
                        })
                        const data = await response.json();
                        if (data.done) {
                         /*  console.log(`themeId: ${themeId}`)
                          console.log(`theme: ${theme}`)
                          addDoc(collection(db, 'profiles', userId, 'notifications'), {
          like: false,
          comment: false,
          friend: false,
          item: theme,
          request: false,
          acceptRequest: false,
          postId: themeId,
          theme: true,
          report: false,
          requestUser: user.uid,
          requestNotificationToken: notificationToken,
          likedBy: [],
          timestamp: serverTimestamp()
        }).then(() => addDoc(collection(db, 'profiles', userId, 'checkNotifications'), {
        userId: userId
      })) */
      setThemeLoading(false)
     // schedulePushThemeNotification(userName, notificationToken, name)
      router.push('All', {goToPurchased: true})
                        }
                      } catch (e) {
                        console.error(e);
                        
                      }
      
        
    }
    useEffect(() => {
        if (specificState == 'free') {
            new Promise(resolve => {
            async function fetchData() {
                const themeSnap = (await getDoc(doc(db, 'freeThemes', specificId))).data()
                            
                            setName(themeSnap.name)
                            setTheme(themeSnap.images[0])
                            setUserId(themeSnap.userId)
                            setKeywords(themeSnap.keywords)
                            setSearchKeywords(themeSnap.searchKeywords)
                            setSelling(true)
            }
            fetchData()
            resolve()
        })
        }
        else if (specificState == 'my') {
            new Promise(resolve => {
                async function fetchData() {
                    const themeSnap = (await getDoc(doc(db, 'profiles', user.uid, 'myThemes', specificId))).data()
                            setName(themeSnap.name)
                            setTheme(themeSnap.images[0])
                            setKeywords(themeSnap.keywords)
                            setSearchKeywords(themeSnap.searchKeywords)
                            setSelling(themeSnap.forSale)
                }
                fetchData
                resolve()
            })
        }
        else if (specificState == 'purchased') {
            new Promise(resolve => {
                async function fetchData() {
                    const themeSnap = (await getDoc(doc(db, 'profiles', user.uid, 'purchased', specificId))).data()
                            setName(themeSnap.name)
                            setTheme(themeSnap.images[0])
                            setKeywords(themeSnap.keywords)
                            setSearchKeywords(themeSnap.searchKeywords)
                            setSelling(themeSnap.forSale)
                }
                fetchData
                resolve()
            })
        }
    }, [specificState])
    const handleClick = () => {
      onStateChange(true)
    }
  return (
    <div>
        {loading ? <BeatLoader color={"#9EDAFF"} style={{marginTop: '20%'}}/> :

        <>
        <div className='flex justify-center mt-5'>
        <span style={headerHeader}>{specificState == 'my' ? "My Theme" : specificState == 'purchased' ? "Collected Theme" : "Get Theme"} </span>
        </div>
        <div className='divider'/>
        <span className='numberofLines1' style={header}>{name}</span>
        {specificUsername ? <span className='numberofLines1' style={headerUsername}>Created by @{specificUsername}</span> : null}
        <div style={{alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent:'center' }}>
        <div style={imageContainer}>
            <img src={theme} style={image}/>
        </div>
        <div style={overlay}>
          {applyLoading ? <BeatLoader color={"#9edaff"}/> : <>
          <button style={previewButton} onClick={() => router.push('ViewingProfile', {previewImage: theme, preview: true, name: user.uid, viewing: true})}>
            <span style={previewText}>Preview w/ Profile</span>
          </button>
          <button style={previewButton} onClick={handleClick}>
            <span style={previewText}>Preview w/ Posts</span>
          </button>
          {specificId ? purchasedThemes.filter((e) => e.id === specificId).length > 0 || purchasedThemes.filter((e) => e.productId === specificId).length > 0 || myThemes.filter((e) => e.image === theme).length > 0 ? <>
            <button style={previewButton} onClick={() => {applyToProfile()}}>
            <span style={previewText}>Apply to Profile</span>
          </button>
          <button style={previewButton} onClick={() => applyToPosts()}>
            <span style={previewText}>Apply to Posts</span>
          </button>
          <button style={previewButton} onClick={() => applyToBoth()}>
            <span style={previewText}>Apply to Both Profile & Posts</span>
          </button>
          </> : null : purchasedThemes.filter((e) => e.productId === specificId).length > 0 || myThemes.filter((e) => e.image === theme).length > 0 ? <>
            <button style={previewButton} onClick={() => {applyToProfile()}}>
            <span style={previewText}>Apply to Profile</span>
          </button>
          <button style={previewButton} onClick={() => applyToPosts()}>
            <span style={previewText}>Apply to Posts</span>
          </button>
          <button style={previewButton} onClick={() => applyToBoth()}>
            <span style={previewText}>Apply to Both Profile & Posts</span>
          </button>
          </> : null
        }
        </>}
        </div>
        <div className='justify-center flex items-center'>
        {themeLoading ? <BeatLoader color='#9edaff' style={{alignItems: 'center'}}/> : 
        specificId ? purchasedThemes.filter((e) => e.id === specificId).length > 0 || purchasedThemes.filter((e) => e.productId === specificId).length > 0 || myThemes.filter((e) => e.image === theme).length > 0 ? <span style={header}>You have this theme!</span> : <div style={purchaseButton}>
            <NextButton text={price == 0 ? 'Get Theme for FREE' : `Get Theme For $${(price / 100).toFixed(2)}`} onClick={specificState == 'free' ? () => freeTheme() : () => navigation.navigate('BeforePurchaseSummary', { groupId: groupId,  notificationToken: notificationToken, themeName: name, userId: userId, name: user.uid, keywords: keywords, source: theme, free: price > 0 ? false : true, price: price, userName: userName, product: themeId.length > 0 ? themeId : id, metadata: metadata})}/>
        </div> : purchasedThemes.filter((e) => e.productId === productId).length > 0 || myThemes.filter((e) => e.image === theme).length > 0 ? <span style={[styles.header, {color: modeTheme.color}]}>You have this theme!</span> : <div style={purchaseButton}>
            <NextButton text={price == 0 ? 'Get Theme for FREE' : `Get Theme For $${(price / 100).toFixed(2)}`} onClick={specificState == 'free' ? () => freeTheme() : () => navigation.navigate('BeforePurchaseSummary', { groupId: groupId,  notificationToken: notificationToken, themeName: name, userId: userId, name: user.uid, keywords: keywords, source: theme, free: price > 0 ? false : true, price: price, userName: userName, product: themeId.length > 0 ? themeId : id, metadata: metadata})}/>
        </div>}
        </div>
        
        </div>
        </>
        }
        
    </div>
  )
}

export default SpecificTheme