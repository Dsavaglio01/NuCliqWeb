import React, {useEffect, useMemo, useState} from 'react'
import FollowIcon from './FollowIcon'
import FollowingIcon from './FollowingIcon'
import RequestedIcon from './RequestedIcon'
import { db } from '@/firebase'
import { onSnapshot, query, collection, where, getDoc, doc } from 'firebase/firestore'
function FollowButtons({user, item}) {
    const [following, setFollowing] = useState([]);
    const [requests, setRequests] = useState([]);
    useMemo(() => {
        const getData = async() => {
            const profileSnap = await getDoc(doc(db, 'profiles', user.uid))
            setFollowing(profileSnap.data().following)
        }
        getData()
    }, [])
    useMemo(()=> {
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
  return (
    <button onClick={user.uid != null ? following.filter(e => e === item.userId).length > 0 ? () => removeFriend(item.userId) : item.userId == user.uid || requests.filter(e => e.id === item.userId).length > 0 ? null : () => addFriend(item): null}>
              {requests.filter(e => e.id === item.userId).length > 0 ? <RequestedIcon color={"#9EDAFF"} width={65} height={32} /> : 
              following.filter(e => e === item.userId).length > 0 ? <FollowingIcon color={"#9EDAFF"} width={70} height={32} />
              : item.userId == user.uid ? null : <FollowIcon color={"#9EDAFF"}  width={50} height={32}/>}
              
            </button>
  )
}

export default FollowButtons