import React, { useContext, useEffect, useState, useMemo } from 'react'
import { collection, getDoc, getDocs, getFirestore, onSnapshot, query, where, doc, deleteDoc, updateDoc, arrayRemove, limit, startAfter, orderBy } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import NextButton from '@/components/NextButton';
import ThemeHeader from '@/components/ThemeHeader';
import { db } from '@/firebase';
//import _ from 'lodash'
import { useRouter } from 'next/router';
import { BeatLoader } from 'react-spinners';
function ContentList() {
    const {user} = useAuth()
    const [posts, setPosts] = useState([]);
    const [pfp, setPfp] = useState(null);
    const [editedCards, setEditedCards] = useState([]);
    const [postDone, setPostDone] = useState(false);
    const [completePosts, setCompletePosts] = useState([]);
    const [current, setCurrent] = useState(false)
    const [requests, setRequests] = useState([]);
    const [lastVisible, setLastVisible] = useState();
    
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const {likes, comments, saves, archived, cards, username, blocked, mentions} = router.query;
    useEffect(()=> {
      let unsub;
      const fetchCards = async () => {
        //const passes = await getDocs(collection(db, 'users', user.uid, 'passes')).then((snapshot) => snapshot.docs.map((doc) => doc.id));
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'requests'), where('actualRequest', '==', true)), (snapshot) => {
          setRequests(snapshot.docs.map((doc)=> ( {
            id: doc.id,
            ...doc.data()
            //info: doc.data().info
          })))
        })
      } 
      fetchCards();
      return unsub;
    }, []);
    useMemo(() => {
      if (comments) {
        const getData = async() => {
          const docSnap = await getDoc(doc(db, 'profiles', user.uid))
          setPfp(docSnap.data().pfp)
        }
        getData()
      }
    }, [comments])
    useEffect(() => {
        if (mentions) {
          setPosts([]);
      const getLikes = async() => {
        const first = query(collection(db, "profiles", user.uid, 'mentions'), orderBy('timestamp', 'desc'), limit(10));
        const querySnapshot = await getDocs(first);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
        console.log(querySnapshot.docs.length)
        querySnapshot.forEach(async(document) => {
          //console.log(doc.id)
          const secondSnap = await getDoc(doc(db, 'posts', document.id));
                  if (secondSnap.exists()) {
                    setPosts(prevState => [...prevState, {id: secondSnap.id, ...secondSnap.data()}])
                    // Render the new post here using the data from secondSnap
                  }
        });
      }
      getLikes()
        } 
        else if (comments) {
          setPosts([]);
          const getLikes = async() => {
            const first = query(collection(db, "profiles", user.uid, 'comments'), orderBy('timestamp', 'desc'), limit(10));
            const querySnapshot = await getDocs(first);
            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
            querySnapshot.forEach(async(document) => setPosts(prevState => [...prevState, {id: document.id, ...document.data()}]));
          }
          getLikes()
          setTimeout(() => {
              setPostDone(true)
          }, 1500);
          
        } else if (saves) {
                setPosts([]);
      const getLikes = async() => {
        const first = query(collection(db, "profiles", user.uid, 'saves'), orderBy('timestamp', 'desc'), limit(10));
        const querySnapshot = await getDocs(first);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
        console.log(querySnapshot.docs.length)
        querySnapshot.forEach(async(document) => {
          //console.log(doc.id)
          const secondSnap = await getDoc(doc(db, 'posts', document.id));
                  if (secondSnap.exists()) {
                    setPosts(prevState => [...prevState, {id: secondSnap.id, ...secondSnap.data()}])
                    // Render the new post here using the data from secondSnap
                  }
        });
      }
      getLikes()
        }
        else if (archived) {
          let unsub;
          const getArchivedPosts = async() => {
            unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'posts'), where('archived', '==', true), orderBy('timestamp', 'desc'), limit(10)), (snapshot) => {
              setPosts(snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
              })))
              setLastVisible(snapshot.docs[snapshot.docs.length - 1])
            })
          }
          getArchivedPosts();
          setTimeout(() => {
              setLoading(false)
            }, 1000);
            return unsub;
        }
        else if (cards) {
          const getCards = async() => {
            const docSnap = await getDoc(doc(db, 'profiles', user.uid))
            if (docSnap.exists()) {
              //console.log(docSnap.data().paymentMethodLast4)
              setEditedCards(docSnap.data().paymentMethodLast4)
            }
            /* if (docSnap.exists()) {
              setEditedCards(docSnap)
            } */
            
          }
          getCards()
        }
        else if (blocked) {
          const getUsers = async() => {
            let blockedUsers = (await getDoc(doc(db, 'profiles', user.uid))).data().blockedUsers
            blockedUsers.forEach(async(item) => {
              let user = await getDoc(doc(db, 'profiles', item))
              setPosts(prevState => [...prevState, {id: user.id, ...user.data()}])
            })
            
            //setPosts(blockedUsers)
          } 
          getUsers()
          //await getDoc(doc(db, ))
          //etPosts(await getDoc(doc(db, profiles)))
        }
        
    }, [])
    useEffect(() => {
      if (postDone) {
          setCompletePosts([]);
          if (comments) {
          posts.map(async(item) => {
            
          const secondSnap = await getDoc(doc(db, 'posts', item.postId))
              if (secondSnap.exists()) {
                setCompletePosts(prevState => [...prevState, {id: item.id, postId: item.postId, comment: item.comment, ...secondSnap.data()}])
              }
          
        })
      }
      }
      setTimeout(() => {
        setLoading(false)
       }, 1000); 
    }, [postDone])
    //console.log(posts.length)
    /* useEffect(() => {
      if (done) {
        setPosts([...posts, ...tempPosts])
      }
    }, [done]) */
    //console.log(posts.length)
    
    function fetchMoreData() {
      if (lastVisible != undefined) {
        if (mentions) {
          setLoading(true)
        const getLikes = async() => {
            const first = query(collection(db, "profiles", user.uid, 'mentions'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(10))
        const querySnapshot = await getDocs(first);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
        querySnapshot.forEach(async(document) => {
          //console.log(doc.id)
          const secondSnap = await getDoc(doc(db, 'posts', document.id));
                  if (secondSnap.exists()) {
                    setPosts(prevState => [...prevState, {id: secondSnap.id, ...secondSnap.data()}])
                    // Render the new post here using the data from secondSnap
                  }
        });
      }
          //console.log(tempPosts)
          getLikes();
          setTimeout(() => {
                    setLoading(false)
                  }, 1000);
        }
        else if (comments) {
          setLoading(true)
          setPostDone(false)
          let newData = [];
        const getLikes = async() => {
            const first = query(collection(db, "profiles", user.uid, 'comments'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(10))
        const querySnapshot = await getDocs(first);
        
        querySnapshot.forEach(async(document) => {
          //console.log(doc.id)
          newData.push({
            id: document.id,
            ...document.data()
          })
        });
        if (newData.length > 0) {
          setLoading(true)
          setPosts([...posts, ...newData])
          setCompletePosts([]);
          setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
        }
      }
          getLikes();
          setTimeout(() => {
                    setLoading(false)
                    setPostDone(true)
                  }, 1500);
        }
        else if (saves) {
          setLoading(true)
        const getLikes = async() => {
            const first = query(collection(db, "profiles", user.uid, 'saves'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(10))
        const querySnapshot = await getDocs(first);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
        querySnapshot.forEach(async(document) => {
          //console.log(doc.id)
          const secondSnap = await getDoc(doc(db, 'posts', document.id));
                  if (secondSnap.exists()) {
                    setPosts(prevState => [...prevState, {id: secondSnap.id, ...secondSnap.data()}])
                    // Render the new post here using the data from secondSnap
                  }
        });
      }
          //console.log(tempPosts)
          getLikes();
          setTimeout(() => {
                    setLoading(false)
                  }, 1000);

        }
        else if (archived) {
          let unsub;
          const fetchCards = async () => {
            unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'posts'), where('archived', '==', true), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(10)), (snapshot) => {
              const newData = [];
              setPosts(snapshot.docs.map((doc)=> {
                newData.push({
                  id: doc.id,
                ...doc.data(),
                })
                
              }))
              setPosts([...posts, ...newData])
              setLastVisible(snapshot.docs[snapshot.docs.length-1])
              
            })
          } 
          fetchCards();
          return unsub;
        }
        setTimeout(() => {
          setLoading(false)
        }, 1000);
      }
    }
    const friendsContainer = {
        borderRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#d3d3d3",
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '105%',
        marginLeft: '-2.5%'
    }
    const name = {
        fontSize: 15.36,
        paddingTop: 5,
    }
    const message = {
        fontSize: 15.36,
        paddingBottom: 5,
    }

    //console.log(posts.length)
    const image = {
        width: window.innerHeight / 5.45,
    height: (window.innerHeight / 5.45) / 1.015625,
    borderRadius: 8
    }
    const commentPfpimage = {
        height: 40, width: 40, alignSelf: 'center', borderWidth: 1, borderRadius: 8
    }
    const commentImage = {
        height: 40, width: 40, alignSelf: 'center', borderWidth: 1,
    }
    const addText = {
        fontSize: 15.36,
      padding: 7.5,
      paddingLeft: 15,
      maxWidth: '75%'
    }
    async function unBlock(item) {
      //console.log(item)
      /* await updateDoc(doc(db, 'profiles', user.uid), {
        blockedUsers: arrayRemove(item.id)
      }).then(async() => await updateDoc(doc(db, 'profiles', item.id), {
        
      })) */
      await updateDoc(doc(db, 'profiles', user.uid), {
      blockedUsers: arrayRemove(item.id)
    }).then(async() => await updateDoc(doc(db, 'profiles', item.id), {
      usersThatBlocked: arrayRemove(user.uid)
    })).then(() => setPosts(posts.filter((e) => e.id != item.id)))
    }
    
    //console.log(completePosts)
  const removePaymentMethod = (item) => {
    Alert.alert('Remove Payment Method?', 'If you remove payment method you will have to put in a new one when purchasing', [
      {
        text: 'Cancel',
        onClick: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onClick: async() => {
        console.log(item)
        await updateDoc(doc(db, 'profiles', user.uid), {
          paymentMethodID: null,
          paymentMethodLast4: []
        }).then(() => setEditedCards(editedCards.filter((e) => e != item)))
      }},
    ]);
  }
  const headerText = {
    fontSize: 19.20,
    textAlign: 'center',
    padding: 10,
    margin: '2.5%',
    //marginTop: '8%',
    fontWeight: '700',
    color: "#fff"
  }
  const editText = {
    fontSize: 19.20,
    marginLeft: '5%'
  }
  /* const handleScroll = _.debounce((event) => {
    // Your logic for fetching more data
    fetchMoreData()
  }, 500); */
  console.log(posts.length)
  return (
    <div>
 <>
      <ThemeHeader backButton={true} text={!archived ? "Archived Posts" : !likes ? "Liked Posts" : 
      comments ? "Commented Posts" : !saves ? "Saved Posts" : !mentions ? 'Mentioned Posts' : !cards ? "Payment Methods" : !blocked ? 
      "Blocked Users" : ""}/>
      <div className='divider'/>
      </>
      {<>
       {saves && !loading && posts.length == 0 ? 
       <div style={{flex: 1, justifyContent: 'center', marginBottom: '50%'}}>
      <p style={headerText}>No Saved Posts Yet!</p> 
      <FaceFrownIcon className/>
      
      </div>
      : archived && !loading && posts.length == 0 ?  
      <div style={{flex: 1, justifyContent: 'center', marginBottom: '50%'}}>
      <p style={headerText}>No Archived Posts Yet!</p> 
      <FaceFrownIcon className='btn'/>
      
      </div> :
       likes && !loading && posts.length == 0 ? 
      <div style={{flex: 1, justifyContent: 'center', marginBottom: '50%'}}>
      <p style={headerText}>No Liked Posts Yet!</p> 
      <FaceFrownIcon className='btn'/>
      
      </div>  : 
      mentions && !loading && posts.length == 0 ?
      <div style={{flex: 1, justifyContent: 'center', marginBottom: '50%'}}>
      <p style={headerText}>No Mentioned Posts Yet!</p> 
      <FaceFrownIcon className='btn'/>
      </div> :
      blocked && !loading && posts.length == 0 ?
      <div style={{flex: 1, justifyContent: 'center', marginBottom: '50%'}}>
      <p style={headerText}>No Blocked Users Yet</p> 
      <FaceFrownIcon className='btn'/>
      </div> :
      comments && !loading && completePosts.length == 0 ? 
      <div style={{flex: 1, justifyContent: 'center', marginBottom: '50%'}}>
      <p style={headerText}>No Commented Posts Yet!</p> 
      <FaceFrownIcon className='btn'/>
      
      </div> :
      cards ? 
      <div>
      {/* {editedCards.map((item => {
        return (
          <div>
            <div activeOpacity={1} onClick={() => setCurrent(!current)}  style={{flexDirection: 'row', display: 'flex', alignItems: 'center', marginTop: '5%', marginLeft: '5%'}}>
                    <Checkbox value={current} onValueChange={() => setCurrent(!current)} color={current ? theme.theme != 'light' ? "#9EDAFF" : "#005278" : theme.color} />
                    <p style={editText}>Card Ending in {item}</p>
                </div>
          
      {current ?
      <div style={{margin: '5%'}}>
          <MainButton text={"Remove Payment Method"} onClick={() => removePaymentMethod(item)}/>
        </div>: null} 

          </div>
        )
      }))} */}
      </div> : null}
      {posts.length > 0 ? 
      comments ? completePosts.map((item, index) => {
   
        return (
            <div>
                <div style={{margin: '2.5%', flexDirection: 'row', display: 'flex', marginTop: 0, borderBottomWidth: 1, borderBottomColor: "#d3d3d3", paddingBottom: 10}}>
                <div style={{flexDirection: 'row', display: 'flex', alignItems: 'center', width: '89%'}}>
                <img src={pfp ? pfp : require('../public/defaultpfp.jpg')} style={commentPfpimage}/>
                <p className='numberofLines2' style={addText}>You {item.reply != undefined ? 'replied' : 'commented'}: {item.comment} </p>
                </div>
                {item.post[0].image ? 
            <div style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: '-2.5%'}} onClick={() => router.push('Post', {post: item.postId, requests: requests, name: item.userId, groupId: null})}>
                <img src={item.post[0].post} style={commentImage}/>
            </div> : item.post[0].video ? <div style={{marginLeft: 'auto', flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: '-2.5%'}} onClick={() => router.push('Post', {post: item.id, requests: requests, name: item.userId, groupId: null})}>
                <img src={item.post[0].thumbnail} style={commentImage}/>
            </div> :
            <div style={{marginLeft: 'auto', flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: '-2.5%'}} onClick={() => router.push('Post', {post: item.postId, name: item.userId, requests: requests, groupId: null})}>
                <p style={commentImage}>{item.post[0].value}</p>
            </div>}
                </div>
            </div>
        )
      }) : blocked ? posts.map((item, index) => {
        return (
            <div key={index}>
            <div style={friendsContainer} >
                <div style={{flexDirection: 'row', marginLeft: '1%', display: 'flex'}}>
                  {item.pfp ? 
                  <img src={item.pfp} style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}}/> :
                  <img src={require('../public/defaultpfp.jpg')} style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}}/>
                  }
                    
                 <div style={{paddingLeft: 20, width: '100%', justifyContent: 'center'}} onClick={() => router.push('ViewingProfile', {name: item.id, viewing: true})}>
                    <p className='numberofLines1' style={name}>{item.firstName} {item.lastName}</p>
                    <p className='numberofLines1' style={message}>@{item.userName}</p>
                </div>
                </div>
              <div style={{ marginLeft: 'auto', marginRight: '1%'}}>
                <NextButton text={"Un-Block"} textStyle={{fontSize: 12.29}} onClick={() => unBlock(item)}/>
              </div>
            </div>
          </div>
        )
      }) :  
      posts.map((item, index) => {
        return (
            item.post[0].image ? 
      <div style={{borderRadius: 10, margin: '2.5%', width: 155,
    height: 155 / 1.015625,}} onClick={() => router.push('Post', {post: item.id, requests: requests, name: item.userId, groupId: null})}>
        <img src={item.post[0].post} style={image}/>
      </div> : item.post[0].video ? <div style={{borderRadius: 10, margin: '2.5%', width: 155,
    height: 155 / 1.015625,}} onClick={() => router.push('Post', {post: item.id, requests: requests, name: item.userId, groupId: null})}>
        <img src={item.post[0].thumbnail} style={image}/>
      </div> :
      <div style={{borderRadius: 10, margin: '2.5%', width: 155,
    height: 155 / 1.015625, backgroundColor: "#262626"}} onClick={() => router.push('Post', {post: item.id, name: item.userId, requests: requests, groupId: null})}>
        <p style={image}>{item.post[0].value}</p>
      </div>
        )
      })
     : null}
      {loading ? <div style={{flex: 1, alignItems: 'center', justifyContent:'center', marginTop: '5%'}}>
        <BeatLoader color='#9edaff'/>
        </div> : null}
       </>
      }
      
      
    </div>
  )
}

export default ContentList