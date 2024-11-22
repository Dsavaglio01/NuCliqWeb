import React, {useState} from 'react'
import MainButton from '@/components/MainButton';
import NextButton from '@/components/NextButton';
//import {MODERATION_API_SECRET, MODERATION_API_USER, TEXT_MODERATION_URL, BACKEND_URL, IMAGE_MODERATION_URL} from '@env'
import { useAuth } from '@/context/AuthContext';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import axios from 'axios';
import { updateDoc, doc, setDoc, increment, getDocs, query, collection, where, addDoc, serverTimestamp, arrayUnion} from 'firebase/firestore';
import { db } from '../firebase';
import { useRouter } from 'next/router';
import { BeatLoader } from 'react-spinners';
const styles = {
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    itemContainer: {
        flexDirection: 'row',
        display: 'flex'
    },
    header: {
        padding: 10,
        fontSize: 19.20,
        margin: 5,
        marginTop: 0,
        fontFamily: 'Montserrat_600SemiBold',
        textAlign: 'center',
    },
    image: {
        width: 175 / 1.30382570115, height: 175, borderRadius: 5
    },
    calcText: {
      fontFamily: 'Montserrat_500Medium',
      paddingTop: 12.5,
      fontSize: 19.20,
    },
    noPaddingReceiptText: {
    padding: 10,
    paddingLeft: 10,
    fontSize: 15.36,
    color: "#fafafa",
    width: '50%',
    textAlign: 'right',
    paddingTop: 0
  },
    receiptText: {
    padding: 10,
    paddingLeft: 10,
    fontSize: 15.36,
    color: "#fafafa",
    width: '50%',
    textAlign: 'right'
  },
  dataReceiptText: {
    padding: 10,
    paddingLeft: 10,
    fontSize: 15.36,
    paddingBottom: 0,
    color: "#fafafa",
    fontWeight: '600',
    width: '50%',
    textAlign: 'left'
  },
  noPaddingDataReceiptText: {
    padding: 10,
    paddingLeft: 10,
    fontSize: 15.36,
    fontWeight: '600',
    color: "#fafafa",
    width: '50%',
    textAlign: 'left',
    paddingTop: 0
  },
  headerHeader: {
    color: "#fafafa",
        fontSize: 24,
        padding: 10,
        textAlign: 'center'
  }
}
const PriceSummary = ({name, theme, price, keywords, stripeId, profileChecked, postChecked, notificationToken, handleStateChange}) => {
    const [uploading, setUploading] = useState(false);
    const {user} = useAuth();
    const storage = getStorage()
    const router = useRouter();
    const linkUsernameAlert = () => {
      window.alert("Name must not contain link(s)", "Please go back and change name of theme", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ])
      setUploading(false)
    }
    const personalUsernameAlert = () => {
      window.alert("Name must not contain personal info", "Please go back and change name of theme", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ])
      setUploading(false)
    }
    const profanityUsernameAlert = () => {
      window.alert("Name must not contain profanity", "Please go back and change name of theme", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ])
      setUploading(false)
  }
  const linkKeywordsAlert = () => {
      window.alert("Keywords must not contain link(s)", "Please go back and change keywords of theme", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ])
      setUploading(false)
    }
    const personalKeywordsAlert = () => {
      window.alert("Keywords must not contain personal info", "Please go back and change keywords of theme", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ])
      setUploading(false)
    }
    const profanityKeywordsAlert = () => {
      window.alert("Keywords must not contain profanity", "Please go back and change keywords of theme", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ])
      setUploading(false)
  }
  console.log(stripeId)
  const goToAddCard = () => {
    handleStateChange(true)
  }
    async function checkName() {
    
                        if (stripeId == null) {
                        setUploading(false)
                        goToAddCard()
                        /* router.push('AddCard', {name: user.uid, groupsJoined: groupsJoined, themeName: name, price: price, post: theme, keywords: keywords, sellChecked: true,
                        profileChecked: profileChecked, postChecked: postChecked, notificationToken: notificationToken}) */
                    } 
                    else {
                        const response = await fetch(theme)
                        const blob = await response.blob();
                        const filename = `themes/${user.uid}${name}${Date.now()}theme.jpg`
                        var storageRef = ref(storage, filename)
                        try {
                            await storageRef;
                        } catch (error) {
                            console.log(error)
                        }
                        await uploadBytesResumable(storageRef, blob).then(() => getLink(filename))
                    }
                }
function checkKeywords() {
    data = new FormData();
    data.append('text', keywords);
    data.append('lang', 'en');
    data.append('mode', 'rules');
    data.append('api_user', `${MODERATION_API_USER}`);
    data.append('api_secret', `${MODERATION_API_SECRET}`);
    axios({
    url: `${TEXT_MODERATION_URL}`,
    method:'post',
    data: data,
    })
    .then(async function (response) {
        //console.log(response)
      if (response.data) {
                if (response.data.link.matches.length > 0) {
                    linkKeywordsAlert()
                }
               else if (response.data.personal.matches.length > 0) {
                    personalKeywordsAlert()
                }
                else if (response.data.profanity.matches.length > 0 && response.data.profanity.matches.some(obj => obj.intensity === 'high')) {
                  
                    profanityUsernameAlert()
                
                }
                else {
                    if (stripeId == null) {
                      setUploading(false)
                      goToAddCard()
                        /* router.push('AddCard', {name: user.uid, groupsJoined: groupsJoined, themeName: name, price: price, post: theme, keywords: keywords, sellChecked: true,
                        profileChecked: profileChecked, postChecked: postChecked, notificationToken: notificationToken}) */
                    } 
                    else {
                    const response = await fetch(theme)
                        const blob = await response.blob();
                        const filename = `themes/${user.uid}${name}${Date.now()}theme.jpg`
                        var storageRef = ref(storage, filename)
                        try {
                            await storageRef;
                        } catch (error) {
                            console.log(error)
                        }
                        await uploadBytesResumable(storageRef, blob).then(() => getLink(filename))
                }
            }
            }
    })
}
const getLink = (pfp) => {
        const starsRef = ref(storage, pfp);
        getDownloadURL(starsRef).then((url) => checkPfp(url, starsRef))
        /*  */
        
    }
     function containsNumberGreaterThan(array, threshold) {
      return array.some(function(element) {
        return element > threshold;
      });
    }

    const getValuesFromImages = (list) => {
      //console.log(list)
      let newList = filterByType(list, 'object')
      //console.log(newList)
      let tempList = filterByType(list, 'number')
      //console.log(tempList)
      tempList.forEach((obj) => {
        //console.log(obj)
        filterByType(Object.values(obj), 'object').forEach((e) => {
          newList.push(e)
        })
        filterByType(Object.values(obj), 'number').forEach((e) => {
          if (e.hasOwnProperty('none')) {
            delete e['none']
            Object.values(e).forEach((element) => {
              newList.push(element)
            })
          }

        })
        //newList.push(filterByType(Object.values(obj), 'object'))
      })
      //console.log(newList)
      return newList
    }
    //console.log(stripeId)
    function filterByType(arr, type) {
      return arr.filter(function(item) {
        return typeof item !== type;
      });
    }
    const backEndProduct = (url) => {
      fetch(`${BACKEND_URL}/api/productEndpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        keywords: keywords,
    price: Number.parseFloat(price),
    post: [url],
    userId: user.uid,
    stripeId: stripeId,
    notificationToken: notificationToken,
    timestamp: new Date().toLocaleString()
      }),
      })
    .then(response => response.json())
    .then(responseData => {
      // Handle the response from the server
        //console.log(responseData)
        return responseData
    })
    .catch(error => {
      // Handle any errors that occur during the request
      return error
    }).then(() => router.push('All', {name: null, goToMy: true}))
    return url
    }
    const checkPfp = async(url, reference) => {
       //console.log(url)
       await axios.get(`${IMAGE_MODERATION_URL}`, {
            params: {
                'url': url,
                'models': 'nudity-2.0,wad,offensive,scam,gore,qr-content',
                'api_user': `${MODERATION_API_USER}`,
                'api_secret': `${MODERATION_API_SECRET}`,
            }
            })
            .then(async function (response) {
                //console.log(response)
            if(response.data.nudity.hasOwnProperty('none')) {
              delete response.data.nudity['none']
            }
            if (response.data.nudity.hasOwnProperty('context')) {
              delete response.data.nudity.context

            }
            if (response.data.nudity.hasOwnProperty('erotica')) {
              if (response.data.nudity.erotica >= 0.68) {
                window.alert('Unable to Post', `This Theme Goes Against Our Guidelines`, [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => deleteObject(reference).then(() => {setUploading(false)}).catch((error) => {
                  throw error;
                  
                })},
              ]);
              throw null;
              }
              else {
                delete response.data.nudity.erotica
              }
              //console.log(response.data.nudity.suggestive)
            }
            if (response.data.drugs > 0.9 || response.data.gore.prob > 0.9 || containsNumberGreaterThan(getValuesFromImages(Object.values(response.data.nudity)), 0.95)
            || containsNumberGreaterThan(Object.values(response.data.offensive), 0.9) || response.data.recreational_drugs > 0.9 || response.data.medical_drugs > 0.9 || response.data.scam > 0.9 ||
            response.data.skull.prob > 0.9 || response.data.weapon > 0.9 || response.data.weapon_firearm > 0.9 || response.data.weapon_knife > 0.9) {
              window.alert('Unable to Post', 'This Theme Goes Against Our Guidelines', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: () => deleteObject(reference).then(() => setUploading(false)).catch((error) => {
                  console.error(error)
                })},
              ]);
            }
            else {
            if (profileChecked && postChecked) {
              
                    await updateDoc(doc(db, 'profiles', user.uid), {
            background: url,
            postBackground: url,
            free: Number.parseFloat(price) > 0 ? false : true,
            themeName: name.trim(),
            forSale: true,
            credits: increment(-1)
        }).then(async() => await updateDoc(doc(db, 'profiles', user.uid), {
            postBackground: url,
            forSale: true,
        }).then(async() => {(await getDocs(query(collection(db, 'posts'), where('userId', '==', user.uid)))).forEach(async(document) => {
          await updateDoc(doc(db, 'posts', document.id), {
            background: url,
            forSale: true,
          })
        })}).then(() => groupsJoined.map(async(item) => {
          {(await getDocs(query(collection(db, 'groups', item, 'posts'), where('userId', '==', user.uid)))).forEach(async(document) => {
          await updateDoc(doc(db, 'groups', item, 'posts', document.id), {
            background: url,
            forSale: true,
          })
        })}
        }))).then(async() => {const docRef = await addDoc(collection(db, 'profiles', user.uid, 'myThemes'), {
            timestamp: serverTimestamp(),
            images: arrayUnion(url),
            active: true,
            name: name.trim(),
            keywords: keywords,
            bought: false,
            forSale: true,
            price: Number.parseFloat(price),
     
        }).then(async() => 
        Number.parseFloat(price) > 0 ? 
        backEndProduct(url) :
        await setDoc(doc(db, 'freeThemes', docRef.id), {
            timestamp: serverTimestamp(),
                        images: arrayUnion(url),
                        active: true,
                        name: name.trim(),
                        keywords: keywords,
                        bought: false,
                        forSale: true,
                        bought_count: 0,
                        userId: user.uid,
                        stripe_metadata_price: 0
        }))}).then(() => router.push('All', {name: null, goToMy: true}))
                }
                else if (profileChecked && !postChecked) {
                     await updateDoc(doc(db, 'profiles', user.uid), {
            background: url,
            free: Number.parseFloat(price) > 0 ? false : true,
            forSale: true,
            credits: increment(-1)
        }).then(async() => {const docRef = await addDoc(collection(db, 'profiles', user.uid, 'myThemes'), {
            timestamp: serverTimestamp(),
            images: arrayUnion(url),
            active: true,
            name: name.trim(),
            keywords: keywords,
            bought: false,
            price: Number.parseFloat(price),
            forSale: true,
        })
        Number.parseFloat(price) > 0 ? backEndProduct(url) :
        await setDoc(doc(db, 'freeThemes', docRef.id), {
            timestamp: serverTimestamp(),
                        images: arrayUnion(url),
                        active: true,
                        name: name.trim(),
                        keywords: keywords,
                        bought: false,
                        forSale: true,
                        bought_count: 0,
                        userId: user.uid,
                        stripe_metadata_price: 0
        }).then(() => router.push('All', {name: null, goToMy: true}))})
                }
                else if (postChecked && !profileChecked) {
                  await updateDoc(doc(db, 'profiles', user.uid), {
            postBackground: url,
            forSale: true,
            credits: increment(-1)
        }).then(async() => {(await getDocs(query(collection(db, 'posts'), where('userId', '==', user.uid)))).forEach(async(document) => {
          await updateDoc(doc(db, 'posts', document.id), {
            background: url,
            forSale: true,
          })
        })}).then(() => groupsJoined.map(async(item) => {
          {(await getDocs(query(collection(db, 'groups', item, 'posts'), where('userId', '==', user.uid)))).forEach(async(document) => {
          await updateDoc(doc(db, 'groups', item, 'posts', document.id), {
            background: url,
            forSale: true,
          })
        })}
        })).then(async() => {
        const docRef = await addDoc(collection(db, 'profiles', user.uid, 'myThemes'), {
            timestamp: serverTimestamp(),
            images: arrayUnion(url),
            keywords: keywords,
            active: true,
            name: name.trim(),
            bought: false,
            price: Number.parseFloat(price),
            forSale: true,
        })
        Number.parseFloat(price) > 0 ? await updateDoc(doc(db, 'profiles', user.uid), {
                postBackground: url,
                free: Number.parseFloat(price) > 0 ? false : true,
                themeName: name.trim(),
                forSale: true
            }).then(() => backEndProduct(url)).then(() => router.push('All', {name: null, goToMy: true})) : 
        await setDoc(doc(db, 'freeThemes', docRef.id), {
            timestamp: serverTimestamp(),
                        images: arrayUnion(url),
                        active: true,
                        userId: user.uid,
                        name: name.trim(),
                        keywords: keywords,
                        bought: false,
                        forSale: true,
                        bought_count: 0,
                        stripe_metadata_price: 0
        }).then(async() => await updateDoc(doc(db, 'profiles', user.uid), {
                postBackground: url,
                free: Number.parseFloat(price) > 0 ? false : true,
                themeName: name.trim(),
                forSale: true,
            })).then(() => router.push('All', {name: null, goToMy: true}))})
                }
                else if (!profileChecked && !postChecked) {
                    if (Number.parseFloat(price) > 0) {
                      addDoc(collection(db, 'profiles', user.uid, 'myThemes'), {
                    timestamp: serverTimestamp(),
                    images: arrayUnion(url),
                    active: true,
                    name: name.trim(),
                    keywords: keywords,
                    bought: false,
                    price: Number.parseFloat(price),
                    forSale: true
                }).then(() => backEndProduct(url)).then(async() => await updateDoc(doc(db, 'profiles', user.uid), {
            credits: increment(-1)
        })).then(() => router.push('All', {name: null, goToMy: true}))
                        
                    } 
                    else {
                        addDoc(collection(db, 'freeThemes'), {
            timestamp: serverTimestamp(),
                        images: arrayUnion(url),
                        userId: user.uid,
                        active: true,
                        name: name.trim(),
                        keywords: keywords,
                        bought: false,
                        forSale: true,
                        bought_count: 0,
                        stripe_metadata_price: 0
        }).then(() => addDoc(collection(db, 'profiles', user.uid, 'myThemes'), {
                    timestamp: serverTimestamp(),
                    images: arrayUnion(url),
                    active: true,
                    name: name.trim(),
                    keywords: keywords,
                    bought: false,
                    price: Number.parseFloat(price),
                    forSale: true
                })).then(async() => await updateDoc(doc(db, 'profiles', user.uid), {
            credits: increment(-1)
        })).then(() => router.push('All', {name: null, goToMy: true}))
                    }            
                }
                
                    }
                    
                
                })
            .catch(function (error) {
            // handle error
            if (error.response) console.log(error.response.data);
            else console.log(error.message);
            });
    }
  return (
    <div>
       <div className='flex justify-center mt-5'>
            <span style={styles.headerHeader}>{"Price Summary"}</span>
        </div>
     <div className='divider'/>
      {/* <span className='numberofLines1' style={styles.header}>{name}</span> */}
      <div style={{alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '5%'}}>
        <img src={theme} style={styles.image}/>
      </div>
      <div style={{width: '70%', marginLeft: '15%', borderWidth: 1, marginTop: '5%'}}>
        <div style={{ borderTopWidth: 1, borderBottomWidth: 1, padding: 5}}>
                <span style={styles.dataReceiptText}>Theme Price Summary</span>
                </div>
                <div>
                  <div style={styles.itemContainer}>
                      <span style={styles.receiptText}>Selling Item:</span>
                      <span className='numberofLines1' style={styles.dataReceiptText}>{name}</span>
                  </div>
                  </div>
                  <div>
                  <div style={styles.itemContainer}>
                      <span style={styles.receiptText}>Theme Price:</span>
                      <span style={styles.dataReceiptText}>${(price / 100).toFixed(2)}</span>
                  </div>
                  <div style={styles.itemContainer}>
                      <span style={styles.noPaddingReceiptText}>Tax:</span>
                      <span style={styles.noPaddingDataReceiptText}>$-.-- (-%)*</span>
                  </div>
                  <div style={styles.itemContainer}>
                      <span style={styles.noPaddingReceiptText}>Processing Fee:</span>
                      <span style={styles.noPaddingDataReceiptText}>${(((price * 0.03) / 100) + 0.3).toFixed(2)} (3% + 30&#162;)</span>
                  </div>
                  <div style={styles.itemContainer}>
                      <span style={styles.noPaddingReceiptText}>Total Amount:</span>
                      <span style={styles.noPaddingDataReceiptText}>${((price / 100) + ((price * 0.06) / 100)+ ((price * 0.03) / 100) + 0.3).toFixed(2)}</span>
                  </div>
                  </div>
                  <div style={{ borderTopWidth: 1, borderBottomWidth: 1, padding: 5}}>
                    <span style={styles.dataReceiptText}>Transaction Summary</span>
                  </div>
                  <div>
                    <div style={styles.itemContainer}>
                      <span style={styles.receiptText}>Theme Price:</span>
                      <span style={styles.dataReceiptText}>${(price / 100).toFixed(2)}</span>
                  </div>
                  <div style={styles.itemContainer}>
                      <span style={styles.noPaddingReceiptText}>NuCliq Fee:</span>
                      <span style={styles.noPaddingDataReceiptText}>${(price * 0.3 / 100).toFixed(2)} (30%)</span>
                  </div>
                  <div className='priceDivider'/>
                  <div style={styles.itemContainer}>
                      <span style={styles.receiptText}>$$$ Paid To You:</span>
                      <span style={styles.dataReceiptText}>${(price / 100 - (price * 0.3 / 100)).toFixed(2)}</span>
                  </div>
                  </div>
              </div>
              <div className='flex flex-col justify-end items-end' style={{marginRight: '15%'}}>
          <span style={styles.receiptText}>* State Sales Tax may apply to total amount.</span>
          </div>
      <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-between', width: '90%', marginTop: '2.5%', marginLeft: '5%'}}>
          <MainButton text={"CANCEL"} onPress={uploading ? null : () => router.push('All', {name: null})}/>
          {uploading ? <BeatLoader color={"#9EDAFF"} style={{marginRight: '10%'}} /> : <NextButton text={"FINISH"} onClick={() => checkName()}/> }
          
      </div>
    </div>

  )
}

export default PriceSummary