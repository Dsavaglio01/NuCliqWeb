
import { Inter } from 'next/font/google'
import Head from 'next/head'
import useStore from '@/components/store'
import ProtectedRoute from '@/components/ProtectedRoute'
import Posts from '@/components/Posts'
import { useRouter } from 'next/router'
import { useState, useEffect, useMemo } from 'react'
import { onSnapshot, query, collection, where, orderBy, deleteDoc, setDoc, limit, updateDoc, serverTimestamp, addDoc, getDoc, doc, getDocs, documentId} from 'firebase/firestore'
import { db } from '@/firebase'
import { useAuth } from '@/context/AuthContext'
import SearchInput from '@/components/SearchInput'
import { ArrowUpLeftIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import RecentSearches from '@/components/RecentSearches'
import Sidebar from '@/components/Sidebar'
import { BeatLoader } from 'react-spinners'
import FollowIcon from '@/components/FollowIcon'
import RequestedIcon from '@/components/RequestedIcon'
import FollowingIcon from '@/components/FollowingIcon'
import VidPosts from '@/components/VidPosts'

export default function Vidz() {
  const router = useRouter();
  const [searching, setSearching] = useState(false);
  const [searches, setSearches] = useState([]);
  const [tempSearches, setTempSearches] = useState([]);
  const [specificSearch, setSpecificSearch] = useState('');
  const [list, setList] = useState([]);
  const [actualList, setActualList] = useState([]);
  const [friendsDone, setFriendsDone] = useState(false);
  const [listDone, setListDone] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const sidebarValue = useStore((state) => state.sidebarValue);
  const [homeSearches, setHomeSearches] = useState([]);
  const [moreResultButton, setMoreResultButton] = useState(false);
  const [moreResults, setMoreResults] = useState(false);
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState('');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [notificationToken, setNotificationToken] = useState(null);
  const [requests, setRequests] = useState([]);
  const [searchKeywords, setSearchKeywords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const {user} = useAuth();
  const [recentSearches, setRecentSearches] = useState(false);
 
  useMemo(() => {
        if (specificSearch.length > 0) {
      setSearching(true)
      setMoreResultButton(false)
      setMoreResults(false)
      setRecentSearches(true)
      const temp = specificSearch.toLowerCase()
      const tempList = Array.from(new Set(homeSearches.map(JSON.stringify))).map(JSON.parse).filter(item => {
        if (item.userName.toLowerCase().match(temp)) {
          return item
        } 
      })
      if (tempList.length > 3) {
        setMoreResultButton(true)
      }
      setFiltered(tempList)
    }
    else {
      setSearching(false)
      setFiltered([])
    }
    }, [homeSearches])

    useEffect(() => {

      let unsub;
      const fetchSearches = async() => {
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'recentSearches'), where('user', '==', true), orderBy('timestamp', 'desc'), limit(3)), (snapshot) => {
          setSearches(snapshot.docs.map((doc) => ({
            id: doc.data().element.id,
            searchId: doc.id
          })))
        })
      }
      fetchSearches();
      return unsub;
  }, [onSnapshot])
  useEffect(() => {
    if (searches.length > 0) {
      searches.map(async(item) => {
        //console.log(item.id)
        const docSnap = await getDoc(doc(db, 'profiles', item.id))
        if(docSnap.exists()) {
        setTempSearches(prevState => [...prevState, {id: docSnap.id, searchId: item.searchId, ...docSnap.data()}])
        }
      })
    }
  }, [searches])
  useEffect(() => { 
    const getProfileDetails = async() => {
    const docSnap = await getDoc(doc(db, 'profiles', user.uid)); 
      
    if (docSnap.exists()) {
      const profileVariables = {
        username: await(await getDoc(doc(db, 'profiles', user.uid))).data().userName,
        pfp: await(await getDoc(doc(db, 'profiles', user.uid))).data().pfp,
        blockedUsers: await (await getDoc(doc(db, 'profiles', user.uid))).data().blockedUsers,
        notificationToken: await (await getDoc(doc(db, 'profiles', user.uid))).data().notificationToken,
        searchKeywords: await (await getDoc(doc(db, 'profiles', user.uid))).data().searchKeywords
      };
      setUsername(profileVariables.username);
      setPfp(profileVariables.pfp)
      setBlockedUsers(profileVariables.blockedUsers)
      setNotificationToken(profileVariables.notificationToken)
      setSearchKeywords(profileVariables.searchKeywords)
    } 
  }
  getProfileDetails();
  }, [])
   useMemo(() => {
    if (specificSearch.length > 0) {
      setHomeSearches([])
      const getData = async() => {
        if (specificSearch.length < 4) {
        const firstQ = query(collection(db, "profiles"), where('smallKeywords', 'array-contains', specificSearch.toLowerCase()), limit(10));
        const firstQuerySnapshot = await getDocs(firstQ)

        firstQuerySnapshot.forEach((doc) => {
            setHomeSearches(prevState => [...prevState, {id: doc.id, ...doc.data()}])
          
        })
      }
      else {
        const firstQ = query(collection(db, "profiles"), where('largeKeywords', 'array-contains', specificSearch.toLowerCase()), limit(10));
        const firstQuerySnapshot = await getDocs(firstQ)
    
        firstQuerySnapshot.forEach((doc) => {
     
            setHomeSearches(prevState => [...prevState, {id: doc.id, ...doc.data()}])
        })
      }
    }
      
      getData();
    } 
  }, [specificSearch])
  const renderSearches = ({item}) => {
    console.log(item)
    return (
      <div style={categoriesContainer} onClick={() => recentSearchFunction(item)}>
        {item.pfp ? <img src={item.pfp} style={{height: 40, width: 40, borderRadius: 8}}/> :
              <UserCircleIcon style={{height: 40, width: 40, borderRadius: 8}}/>
              }
            <p className='numberofLines1' style={categories}>{item.firstName} {item.lastName} | @{item.username ? item.username : item.userName}</p>
                <XMarkIcon className='btn' onClick={() => removeSearch(item)} style={{alignSelf: 'center', marginLeft: "auto"}}/>
        </div>
    )
  }
  function recentSearchFunction(item) {
    if (item.id != user.uid) {
        {router.push({pathname: '/ViewingProfile', query: {name: item.id, viewing: true}})}
     }
     else {
      navigation.navigate('Profile', {screen: 'ProfileScreen', params: {name: user.uid, preview: false, viewing: false, previewImage: null, previewMade: false, applying: false}})
     }
  }
  function searchFunction(item) {
    console.log(item)
     if (item.id != user.uid) {
     // router.push('/ViewingProfile')
      //router.push({pathname: '/ViewingProfile', query: {name: item.id, viewing: true}})
      {router.push({pathname: '/ViewingProfile', query: {name: item.id, viewing: true}}); addToRecentSearches(item)}
     }
     else {
      navigation.navigate('Profile', {screen: 'ProfileScreen', params: {name: user.uid, preview: false, viewing: false, previewImage: null, previewMade: false, applying: false}})
     }
    
  }
  
  function addToRecentSearches(item) {
    var element = item
        if (tempSearches.filter(e => e.id == item.id).length > 0) {
      
      tempSearches.map(async(e) => {
        if (e.id == e.id) {
          //setTempId(element.id)
          await setDoc(doc(db, 'profiles', user.uid, 'recentSearches', e.id), {
            group: false,
            event: false,
            element,
            user: true,
            ai: false,
            theme: false,
            friend: false,
            timestamp: serverTimestamp()
          })
        }
      })
    } 
    else {
        addDoc(collection(db, 'profiles', user.uid, 'recentSearches'), {
        group: false,
        event: false,
        element,
        user: true,
        ai: false,
        friend: false,
        theme: false,
        timestamp: serverTimestamp()
      })
    }
  }
  useEffect(() => {
    const fetchData = async () => {
         setListDone(false);
        setList([]);
        setActualList([]);
      try {
        const docSnap = await getDocs(query(collection(db, 'profiles'), orderBy(documentId()), limit(10)));
        const tempList = [];
        let lastDocument = null;
        docSnap.forEach((item) => {
            tempList.push({ id: item.id, ...item.data(), loading: false });
            lastDocument = item; // Update the last document in each iteration
        });

        setList(prevState => [...prevState, ...tempList]);
        //setLastVisible(lastDocument);
      } catch (error) {
        console.error("Error fetching data:", error); 
      } 
    };
      fetchData(); 
      setListDone(true)

  }, []);
  useEffect(() => {
    if (listDone && list.length != 0) {
        setFriendsDone(false)
        const getData = async() => {
         const newList = await Promise.all(list.map(async (item) => {
        const snapshot = await getDoc(doc(db, 'profiles', user.uid, 'friends', item.id));
        const requestSnapshot = await getDoc(doc(db, 'profiles', user.uid, 'requests', item.id));
        
        if (!snapshot.exists() && !requestSnapshot.exists() && item.id != user.uid) {
          //list.push(item)
            return item;
            
        }
        return null;
    }));
    //.log(newList.length)

    // Filter out null values and update the state
    setActualList(newList.filter(item => item !== null));
}
getData()
        setTimeout(() => {
                setFriendsDone(true)
        }, 1000);
        
        
    }
  }, [listDone, list])
  
  useEffect(()=> {
      let unsub;
      const fetchCards = async () => {
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'friends'), where('actualFriend', '==', true)), (snapshot) => {
          setFriends(snapshot.docs.map((doc)=> ( {
            id: doc.id,
            //info: doc.data().info
          })))
          snapshot.docs.map((doc) => {
            setFriendList(prevState=> [...prevState, doc.id])
          })
          /* setFriendList(prevState => [...prevState, snapshot.docs.map((doc) => (
            doc.id
          ))]) */
        })
      } 
      fetchCards();
      return unsub;
    }, []);
    const handleRecentSearches = () => {
    setRecentSearches([]);
  };
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
  async function removeSearch(item) {
    setTempSearches(tempSearches.filter((e) => e.searchId !== item.searchId))
            await deleteDoc(doc(db, 'profiles', user.uid, 'recentSearches', item.searchId))
            
  }
  function specificSearchFunction(event) {
    setSpecificSearch(event.target.value)
  }

    const categoriesContainer = {
      borderRadius: 5,
    flexDirection: 'row',
    display: 'flex',
    //marginRight: '5%',
    marginTop: 5,
    padding: 5,
    alignItems: 'center',
    //justifyContent: 'space-between',
    width: '95%',
    }
    const categories = {
      fontSize: 15.36,
    padding: 10,
    width: '80%',
    color: "#fff"
    }
    const friendsContainer = {
       borderRadius: 10,
        borderBottomColor: "#d3d3d3",
        padding: 10,
        flexDirection: 'row',
        display: 'flex',
        //paddingRight: 20,
        alignItems: 'center',
    }

    const userTitle = {
      fontSize: 15.36,
      color: "#fff",
      fontWeight: '700'
    }
    const userHeading = {
      fontSize: 12.29,
      color: "#fff",
    }

  return (
    <ProtectedRoute>
    <div className='app-container'>
      <Head>
        <title>NuCliq</title>
        <link rel="icon" href='/favicon.icon' />
      </Head>
      <div style={{height: '100vh', display: 'flex', flexDirection: 'column', position: 'sticky'}}>
        
      <div className='flex'>
          <Sidebar />
          
          <div className=''>
            
            {sidebarValue ? null :
          <div className='flex flex-row'>
            <section className=''>
              <VidPosts />
            </section>
             
             
          </div>}
          </div>
         
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
