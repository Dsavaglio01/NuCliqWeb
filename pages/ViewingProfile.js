import React from 'react'
import { useState, useEffect, useMemo} from 'react';
import { onSnapshot, query, doc, getDoc, collection, getCountFromServer, or, documentId, where, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { useRouter } from 'next/router';
import ProfileComponent from '@/components/ProfileComponent';
function ViewingProfile() {
      const router = useRouter();
    const {name, preview, previewImage, previewMade, applying}= router.query;
  const [friends, setFriends] = useState([]);
  const [person, setPerson] = useState(null);
  const [ableToMessage, setAbleToMessage] = useState([]);
  const [specificFriends, setSpecificFriends] = useState(0);
  const [friendRequests, setFriendRequests] = useState([]);
  const [ogUsername, setOgUsername] = useState('');
  const [usersThatBlocked, setUsersThatBlocked] = useState([]);
  const [friendId, setFriendId] = useState(null);
  const {user} = useAuth();
  //console.log(name)
  useEffect(() => {
    if (name) {
    const getData = async() => {
      const docSnap = await getDoc(doc(db, 'profiles', user.uid, 'friends', name))
      if (docSnap.exists()) {
        setFriendId(docSnap.data().friendId)
      }
      
    }
    getData();
}
  }, [router.query])
  useEffect(() => {
    let unsub;
    const fetchData = () => {
      unsub = onSnapshot(query(collection(db, 'friends'), or(where(documentId(), '==', name + user.uid), where(documentId(), '==', user.uid + name))), (snapshot) => {
          setAbleToMessage(snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })))
        })
      }
    fetchData();
    return unsub;
  }, [])
  useEffect(() => {
    if (user != null) {
      let unsub;
      const fetchRequests = () => {
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'requests'), where('actualRequest', '==', true)), (snapshot) => {
          setFriendRequests(snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })))
        })
      }
      fetchRequests();
      return unsub;
    }
    
  }, [router.query])
  useMemo(() => {
    if (name) {
      const getData = async() => {
        const docSnap = await getDoc(doc(db, 'profiles', name))
        setPerson({id: docSnap.id, ...docSnap.data()})
      }
      getData();
    }
  }, [router.query])
  useEffect(() => {
      let unsub;

      const fetchCards = async () => {
  
        unsub = onSnapshot(query(collection(db, 'profiles', name, 'friends'), where('actualFriend', '==', true)), (snapshot) => {
          setFriends(snapshot.docs.map((doc)=> ( {
            id: doc.id
          })))
          const coll = query(collection(db, "profiles", name, 'friends'), where('actualFriend', '==', true));
          const getCount = async() => {
            const snapshot = await getCountFromServer(coll);
            setSpecificFriends(snapshot.data().count)
          }
          getCount()
        })
      } 
      fetchCards();
      return unsub;
    
    
  }, [])
  return (
    <ProfileComponent viewing={true} friendId={friendId} person={person} preview={preview} previewMade={previewMade} 
    ableToMessage={ableToMessage}/>
  )
}

export default ViewingProfile