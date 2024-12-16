import React, { useEffect, useState, useMemo } from 'react'
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import ThemeHeader from '@/components/ThemeHeader';
import { db } from '@/firebase';
import { useRouter } from 'next/router';
import { BeatLoader } from 'react-spinners';
import { fetchMoreSettings, fetchSettings, getRequests } from '@/firebaseUtils';
import { styles } from '@/styles/styles';
import ContentComponent from '@/components/ContentComponent';
function ContentList() {
    const {user} = useAuth()
    const [posts, setPosts] = useState([]);
    const [editedCards, setEditedCards] = useState([]);
    const [postDone, setPostDone] = useState(false);
    const [completePosts, setCompletePosts] = useState([]);
    const [requests, setRequests] = useState([]);
    const [lastVisible, setLastVisible] = useState();
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const {likes, comments, saves, archived, cards, blocked, mentions} = router.query;
    useMemo(() => {
      let unsubscribe;
      if (user.uid) {
        // Call the utility function with the userId and a callback
        unsubscribe = getRequests(user.uid, (data) => {
          setRequests(data); // Update the state with the fetched data
        });
      }
      // Clean up the listener on component unmount
      return () => {
        if (unsubscribe) {
          return unsubscribe
        }
      };
    }, [user?.uid])
    useMemo(() => {
      setPosts([])
      const getData = async() => {
        if (mentions) {
          const {data} = await fetchSettings(user.uid, 'mentions')
          setPosts(data)
        }
        else if (comments) {
          const {data} = await fetchSettings(user.uid, 'comments')
          setPosts(data)
        }
        else if (saves) {
          const {data} = await fetchSettings(user.uid, 'saves')
          setPosts(data)
        }
      }
      getData();
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
    
   async function fetchMoreData() {
      if (lastVisible != undefined) {
        if (mentions) {
          const {data} = await fetchMoreSettings(user.uid, 'mentions', lastVisible)
          setPosts([...posts, data])
        }
        else if (comments) {
          const {data} = await fetchMoreSettings(user.uid, 'comments', lastVisible)
          setData([...posts, data])
          setTimeout(() => {
                    setPostDone(true)
                  }, 500);
        }
        else if (saves) {
          const {data} = await fetchMoreSettings(user.uid, 'saves', lastVisible)
          setPosts([...posts, data])
        }
      }
    }
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
        <div style={styles.thanksContainer}>
        <p style={styles.contentListHeaderText}>No Saved Posts Yet!</p> 
        <FaceFrownIcon className='btn'/>
        
        </div>
        : archived && !loading && posts.length == 0 ?  
        <div style={styles.thanksContainer}>
        <p style={styles.contentListHeaderText}>No Archived Posts Yet!</p> 
        <FaceFrownIcon className='btn'/>
        
        </div> :
        likes && !loading && posts.length == 0 ? 
        <div style={styles.thanksContainer}>
        <p style={styles.contentListHeaderText}>No Liked Posts Yet!</p> 
        <FaceFrownIcon className='btn'/>
        
        </div>  : 
        mentions && !loading && posts.length == 0 ?
        <div style={styles.thanksContainer}>
        <p style={styles.contentListHeaderText}>No Mentioned Posts Yet!</p> 
        <FaceFrownIcon className='btn'/>
        </div> :
        blocked && !loading && posts.length == 0 ?
        <div style={styles.thanksContainer}>
        <p style={styles.contentListHeaderText}>No Blocked Users Yet</p> 
        <FaceFrownIcon className='btn'/>
        </div> :
        comments && !loading && completePosts.length == 0 ? 
        <div style={styles.thanksContainer}>
        <p style={styles.contentListHeaderText}>No Commented Posts Yet!</p> 
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
        comments ? completePosts.map((item, index) => (
              <ContentComponent item={item} index={index} comments={true} blocked={false} requests={requests} 
                filterPosts={() => setPosts(posts.filter((e) => e.id != item.id))}/>
          )) : blocked ? posts.map((item, index) => (
              <ContentComponent item={item} index={index} comments={false} blocked={true} requests={requests} 
                filterPosts={() => setPosts(posts.filter((e) => e.id != item.id))}/>
          )) : posts.map((item, index) => (
              <ContentComponent item={item} index={index} comments={false} blocked={false} requests={requests} 
                filterPosts={() => setPosts(posts.filter((e) => e.id != item.id))}/>
          ))
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