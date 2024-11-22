import React from 'react'
import { useState, useEffect, useMemo} from 'react';
import { onSnapshot, query, doc, getDoc, collection, addDoc, serverTimestamp, getCountFromServer, or, documentId, where, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { BeatLoader } from 'react-spinners';
import { ChevronDownIcon, ChevronUpIcon, LockClosedIcon, PauseIcon, PhotoIcon, PlayIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import NextButton from '@/components/NextButton';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute'
import Head from 'next/head';
import Image from 'next/image';
import FollowIcon from '@/components/FollowIcon';
import FollowingIcon from '@/components/FollowingIcon';
import RequestedIcon from '@/components/RequestedIcon';
import ThemeHeader from '@/components/ThemeHeader';
import Sidebar from '@/components/Sidebar';
import ThemeMadeProgression from '@/components/ThemeMadeProgression';
function ViewingProfile() {
      const router = useRouter();
    const {name, preview, viewing, previewImage, previewMade, applying}= router.query;
    console.log(name, viewing)
   // console.log(router.query)
  const [loading, setLoading] = useState(true);
  const [background, setBackground] = useState(null);
  const [friends, setFriends] = useState([]);
  const [person, setPerson] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [ableToMessage, setAbleToMessage] = useState([]);
  const [specificFriends, setSpecificFriends] = useState(0);
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [numberOfReposts, setNumberOfReposts] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [posts, setPosts] = useState([]);
  const [reposts, setReposts] = useState([]);
    const [privacy, setPrivacy] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [uploading, setUploading] = useState(false)
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [ogUsername, setOgUsername] = useState('');
  const [repostSetting, setRepostSetting] = useState(false);
  const [postSetting, setPostSetting] = useState(true);
  const [usersThatBlocked, setUsersThatBlocked] = useState([]);
  const [lastName, setLastName] = useState('');
  const [lastVisible, setLastVisible] = useState(null);
  const [additionalInfoMode, setAdditionalInfoMode] = useState(false);
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState(null);
  const [song, setSong] = useState(null);
  const [friendId, setFriendId] = useState(null);
  const [forSale, setForSale] = useState(false);
  const [bio, setBio] = useState('');
  const [groupsJoined, setGroupsJoined] = useState([]);
  const [notificationToken, setNotificationToken] = useState(null);
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
  useMemo(() => {
    if (person != null && postSetting && (!person.blockedUsers.includes(user.uid) && !blockedUsers.includes(person.id))) {
      let unsub;

      const fetchCards = async () => {
  
        unsub = onSnapshot(query(collection(db, 'profiles', name, 'posts'), where('repost', '==', false), orderBy('timestamp', 'desc'), limit(9)), (snapshot) => {
          new Promise(resolve => {
        setPosts(snapshot.docs.map((doc)=> ( {
            id: doc.id,
            reportVisible: false,
            ...doc.data()
          })))
          setLastVisible(snapshot.docs[snapshot.docs.length-1])
          resolve(); // Resolve the Promise after setCompleteMessages is done
      }).finally(() => setLoading(false)); 
          
        })
      } 
      fetchCards();
      return unsub;
    }
      
  }, [person, postSetting])
  useMemo(() => {
    if (person != null && repostSetting && (!person.blockedUsers.includes(user.uid) && !blockedUsers.includes(person.id))) {
      setReposts([]);
    let unsub;
      //console.log(name)
      const fetchCards = async () => {
  
        unsub = onSnapshot(query(collection(db, 'profiles', name, 'posts'), where('repost', '==', true), orderBy('timestamp', 'desc'), limit(9)), (snapshot) => {
          //console.log(snapshot.docs.length)
          new Promise(resolve => {
        setReposts(snapshot.docs.map((doc)=> ( {
            id: doc.id,
            reportVisible: false,
            ...doc.data()
          })))
          setLastVisible(snapshot.docs[snapshot.docs.length-1])
          resolve(); // Resolve the Promise after setCompleteMessages is done
      }).finally(() => setLoading(false)); 
          
        })
      } 
      fetchCards();
      return unsub;
    }
  }, [repostSetting, person])
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
  useEffect(() => {
    const getData = async() => {
      const docSnap = await getDoc(doc(db, 'profiles', user.uid))
      setOgUsername(docSnap.data().userName)
      setBlockedUsers(docSnap.data().blockedUsers)
      setUsersThatBlocked(docSnap.data().usersThatBlocked)
    }
    getData();
  }, [])
  useMemo(() => {
    if( name) {
    const getData = async() => {
      const docSnap = await getDoc(doc(db, 'profiles', name))
      setPerson({id: docSnap.id, ...docSnap.data()})
    }
    getData();
}
  }, [router.query])
  useEffect(() => {
      
          const coll = query(collection(db, "friends"), where('users', 'array-contains', name));
          const getCount = async() => {
            const snapshot = await getCountFromServer(coll);
            setFollowers(snapshot.data().count)
          }
          getCount()
    
    
  }, [])
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
  useEffect(() => {
    if (user.uid) {
    const fetchProfileData = async () => {
      const profileData = await getProfileDetails(user.uid);

      if (profileData) {
        setUsername(profileData.username);
        setFirstName(profileData.firstName);
        setLastName(profileData.lastName);
        setBio(profileData.bio);
        setPfp(profileData.pfp);
        setFollowers(profileData.followers);
        setFollowing(profileData.following);
        setForSale(profileData.forSale);
        setBackground(profileData.postBackground);
        setBlockedUsers(profileData.blockedUsers);
        setNotificationToken(profileData.notificationToken);
      }
    };

    fetchProfileData();
  }
  }, []);
  async function unBlockUser() {
    try {
    const response = await fetch(`${BACKEND_URL}/api/unBlockUser`, {
      method: 'POST', // Use appropriate HTTP method (GET, POST, etc.)
      headers: {
        'Content-Type': 'application/json', // Set content type as needed
      },
      body: JSON.stringify({ data: {name: name, user: user.uid,}}), // Send data as needed
    })
    const data = await response.json();
      if (data.done) {
        router.back();
      }
  } catch (error) {
    console.error('Error:', error);
  }
    }
  async function blockUser() {
      window.alert('Are you sure you want to block this user?', 'If you block them, you will not be able to interact with their content and they will not be able to interact with your content', [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {text: 'OK', onPress: async() => {
    try {
    const response = await fetch(`${BACKEND_URL}/api/blockUser`, {
      method: 'POST', // Use appropriate HTTP method (GET, POST, etc.)
      headers: {
        'Content-Type': 'application/json', // Set content type as needed
      },
      body: JSON.stringify({ data: {name: name, user: user.uid}}), // Send data as needed
    })
    const data = await response.json();
    console.log(data)
      if (data.done) {
        router.back()
      }
  } catch (error) {
    console.error('Error:', error);
  }
      }}
              ]);
    }
  async function messageFriend() {
    //console.log(ableToMessage)
    if (ableToMessage.length > 0 && ableToMessage.filter((e) => e.active == true).length > 0) {
      router.push('PersonalChat', {friendId: friendId, person: person, active: true})
    }
    else {
      window.alert('You must both be following each other first (mutual friends) in order to message!')
    }
  }
  const nameAge = {
    ontSize: 19.20,
    color: "#fff",
    fontWeight: '700',
    padding: 7.5,
    paddingBottom: 0,
  }
  const profileCircle = {
    width: 82.5,
    height: 82.5,
    borderRadius: 8,
    borderWidth: 2,
    marginTop: 7.5,
    borderColor: "#fafafa",
  }
  const bioText = {
    fontSize: 12.29,
    width: '90%',
    paddingLeft: 8.75,
    lineHeight: 14.5
  }
  const friendsContainer = {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    display: 'flex',
    width: '90%',
    }
    const friendsHeader = {
    borderRadius: 5,
    minWidth: 200,
    backgroundColor: "lightblue",
    marginTop: '2.5%',
  }
  const friendsHeaderTwo = {
    paddingLeft: 80, 
    padding: 3,
     borderRadius: 5,
     minWidth: 200,
    backgroundColor: "lightblue",
    marginTop: '2.5%',
  }
  const friendsText = {
    fontSize: 15.36,
    textAlign: 'center',
    padding: 10,
    color: "#000",
  }
  const noPosts = {
    fontSize: 19.20,
    color: "#fafafa",
    textAlign: 'center',
    padding: 20
  }
  const noPostsSupp = {
    fontSize: 19.20,
    color: "#fafafa",
    textAlign: 'center',
    padding: 20,
    paddingTop: 0, fontSize: 15.36
  }
  const noOfPosts = {
    //borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '5%',
    //marginTop: '5%'
  }
  const headerText =  {
    fontSize: 15.36,
    fontWeight: '700',
    color: "#fff",
    padding: 5,
    paddingTop: 0,
    paddingBottom: 0,
    textAlign: 'center'
  }
  const headerSupplementText = {
    fontSize: 15.36,
    color: "#fff",
    padding: 5,
    paddingTop: 0,
    paddingBottom: 0,
    textAlign: 'center'
}
const image = {
    height: window.outerHeight / 4,
    
    width: (window.outerHeight / 4) * 1.01625
}
const Reposts = ({index, item}) => (
        <div style={{borderWidth: 1, borderColor: "#121212"}} className='cursor-pointer justify-center flex items-center'>
        <div style={{padding: 0}} className='chat-bubble'>
            <p style={{fontSize: 15.36, height: window.innerHeight / 4, width: (window.innerHeight / 4) * 1.01625, paddingLeft: 5, paddingTop: 2.5, color: "#121212"}}>{item.post[0].value}</p>
            
        </div>
    </div>
)
const Posts = ({index, item}) => (
    item.post[0].image ? 
    <div style={{borderWidth: 1, borderColor: "#121212"}} className='cursor-pointer'>
        <img src={item.post[0].post} style={image}/>
    </div> : item.post[0].video ? 
    <div style={{borderWidth: 1, borderColor: "#121212"}} className='cursor-pointer'>
        <img src={item.post[0].thumbnail} style={image}/>
    </div>  : <div style={{borderWidth: 1, borderColor: "#121212"}} className='cursor-pointer justify-center flex items-center'>
        <div style={{padding: 0}} className='chat-bubble'>
            <p style={{fontSize: 15.36, height: window.innerHeight / 4, width: (window.innerHeight / 4) * 1.01625, paddingLeft: 5, paddingTop: 2.5, color: "#121212"}}>{item.post[0].value}</p>
            
        </div>
    </div>
)
  return (
    <ProtectedRoute>
    <div className=''>
      <Head>
        <title>NuCliq</title>
        <link rel="icon" href='/favicon.icon' />
      </Head>
      
      <div style={{height: '100vh', display: 'flex', flexDirection: 'column', position: 'sticky'}}>
        
      <div className='flex'>
         <Sidebar />
          
          <div style={{width: (window.innerHeight * 0.7) * 1.01625, marginLeft: '5%'}}>
            {preview ? <div style={{marginTop: '2.5%'}}>
      <ThemeMadeProgression text={"Profile Theme Preview"}/> 
        </div> : previewMade ? 
      <div style={{ marginTop: '2.5%'}}>
      <ThemeMadeProgression text={"Profile Theme Preview"} /> 
        </div> 
       : 
      viewing ? 
      <div style={{backgroundColor: "#121212"}}>
        <ThemeHeader video={false} text={person != null && (person.blockedUsers.includes(user.uid) || blockedUsers.includes(person.id)) ? "User Unavailable" : "Viewing Profile"} backButton={true}/>
      </div> :
       <>
      </>}
    <div className='profileContainer'>
      {!loading && previewImage ?
      <img src={previewImage} style={{width: '100%', height: window.innerHeight * 0.25}}/> : !loading && background ? <img src={background} style={{width: '100%', height: window.innerHeight * 0.25}}/>
        : <PhotoIcon className='btn' style={{width: '100%', height: window.innerHeight * 0.25}}/>
    }
        <div style={{flexDirection: 'row', display: 'flex'}}>
            <div style={{width: '77.5%'}}>
              <div className='flex flex-row' style={{width: '90%'}}>
                <p className='numberofLines1' style={nameAge}>@{username}</p>
                {privacy ? <LockClosedIcon className='btn' color='#fafafa' style={{marginTop: 5}}/> : null}
              </div>
                <p className='numberofLines1' style={nameAge}>{firstName} {lastName}</p>
            </div>
            <div style={{marginTop: '-7.5%', alignItems: 'flex-end', marginLeft: '2.5%', flex: 1}}>
                {uploading || loading ? <BeatLoader color="#9edaff" /> :
                pfp ? <img src={pfp? pfp : require('../public/defaultpfp.jpg')} className='cursor-pointer' style={profileCircle}/> 
              : <UserCircleIcon className='userBtn' style={profileCircle}/>}
                
            </div>
        </div>
        {/* {bio.length > 0 ? 
            <div style={{flexDirection: 'row', display: 'flex'}}>
                <hr className="custom-divider"/>
                {additionalInfoMode ? <ChevronUpIcon className='btn' onClick={() => setAdditionalInfoMode(!additionalInfoMode)}/> : 
                    <ChevronDownIcon className='btn' onClick={() => setAdditionalInfoMode(!additionalInfoMode)}/>}
                <hr className="custom-divider"/>
            </div> 
            : null}
        {(bio != undefined || null) && additionalInfoMode ? 
           <p style={[bioText]}>{bio != undefined || null ? bio : null}</p> 
            : null} */}
            <div style={friendsContainer}>
        <div className='cursor-pointer items-center flex justify-center' style={friendsHeaderTwo} onClick={preview ? null :user.uid != null ? friends.filter(e => e.id === name).length > 0 ? () => removeFriend(name) : name == user.uid || friendRequests.filter(e => e.id === name).length > 0 ? null : () => addFriend(person): null}>
            {friendRequests.filter(e => e.id === name).length > 0 ? <RequestedIcon color={"#121212"} /> : 
              friends.filter(e => e.id === name).length > 0 ? <FollowingIcon color={"#121212"}  />
              : name == user.uid ? null : <FollowIcon color={"#121212"}  />}
          </div>
          {user != null ? name == user.uid ? <div className='cursor-pointer' style={friendsHeader} onClick={preview ? null :() => router.push('Settings', {username: username})}>
            <p style={friendsText}>Settings</p>
          </div> : ableToMessage.filter((e) => e.active == true).length > 0 && friendId && person != null && (!person.blockedUsers.includes(user.uid) && !blockedUsers.includes(person.id)) 
          ? <div className='cursor-pointer' style={friendsHeader} onClick={preview ? null : () => messageFriend()}>
            <p style={friendsText}>Message</p>
          </div> : null : null}
          {user != null && user.uid != name && person != null && (!person.blockedUsers.includes(user.uid) && !blockedUsers.includes(person.id)) ? 
          <div className='cursor-pointer' style={friendsHeader} onClick={preview ? null : () => blockUser()}>
            <p style={friendsText}>Block</p>
          </div>
          : user != null && user.uid != name && person != null && (blockedUsers.includes(person.id)) ? 
          <div className='cursor-pointer' style={friendsHeader} onClick={preview ? null :() => unBlockUser()}>
            <p style={friendsText}>Un-Block</p>

          </div> : null}
          </div>
        <div className='justify-between items-center self-center flex'>
        <div style={{display: 'flex', marginTop: '2%', flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginRight: '2%'}}>
            <div style={noOfPosts} className='cursor-pointer' onClick={person != null && !blockedUsers.includes(person.id) ? postSetting ? null : () => {setPostSetting(true); setRepostSetting(false)} : null}>
                <p style={headerText}>{numberOfPosts > 999 && numberOfPosts < 1000000 ? `${numberOfPosts / 1000}k` : numberOfPosts > 999999 ? `${numberOfPosts / 1000000}m` : numberOfPosts}</p>
                <p style={headerSupplementText}>{numberOfPosts == 1 ? 'Post' : 'Posts'}</p>
            </div>
            <div style={noOfPosts} className='cursor-pointer' onPress={person != null && !blockedUsers.includes(person.id) ? repostSetting ? null : () => {setRepostSetting(true); setPostSetting(false)} : null}>
                <p style={headerText}>{numberOfPosts > 999 && numberOfPosts < 1000000 ? `${numberOfPosts / 1000}k` : numberOfPosts > 999999 ? `${numberOfPosts / 1000000}m` : numberOfPosts}</p>
                <p style={headerSupplementText}>{numberOfPosts == 1 ? 'Repost' : 'Reposts'}</p>
            </div>
            <div style={noOfPosts} className='cursor-pointer'>
                <p style={headerText}>{specificFriends > 999 && specificFriends < 1000000 ? `${specificFriends / 1000}k` : specificFriends > 999999 ? `${specificFriends / 1000000}m` : specificFriends}</p>
                <p style={headerSupplementText}>{'Following'}</p>
            </div>
            <div style={noOfPosts} className='cursor-pointer'>
                <p style={headerText}>{followers > 999 && followers < 1000000 ? `${followers / 1000}k` : followers > 999999 ? `${followers / 1000000}m` : followers}</p>
                <p style={headerSupplementText}>{followers == 1 ? 'Follower' : 'Followers'}</p>
            </div>
            
        </div>
        </div>
        <div className='profileGrid'>  
          {posts.length > 0 && (friends.filter(e => e.id === name).length > 0 || !privacy) && postSetting ? 
          additionalInfoMode ? posts.slice(0, 6).map((e, index) => (
            <Posts index={index} item={e}/>
            
        )) : previewMade | preview | applying ? posts.slice(0, 6).map((e, index) => (
            <Posts index={index} item={e}/>
            
        )) : posts.filter((item, index, self) => 
  index === self.findIndex((obj) => JSON.stringify(obj) === JSON.stringify(item))
).map((e, index) => (
            <Posts index={index} item={e}/>
            
        )) : reposts.length > 0 && repostSetting && (friends.filter(e => e.id === name).length > 0 || !privacy) ?
        additionalInfoMode ? reposts.slice(0, 6).map((e, index) => (
            <Reposts index={index} item={e}/>
            
        )) : previewMade | preview | applying ? reposts.slice(0, 6).map((e, index) => (
            <Reposts index={index} item={e}/>
            
        )) : reposts.filter((item, index, self) => 
  index === self.findIndex((obj) => JSON.stringify(obj) === JSON.stringify(item))
).map((e, index) => (
            <Reposts index={index} item={e}/>
            
        )) : privacy && !loading && !friends.filter(e => e.id === name).length > 0 ? <div style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
            <p style={noPosts}>Private Account</p>
            <p style={noPostsSupp}>Must follow user in order to see posts</p>
          </div> : loading && person != null && !(person.blockedUsers.includes(user.uid) || blockedUsers.includes(person.id)) ? <div style={{alignItems: 'center', flex: 1, justifyContent: 'center', marginBottom: '30%'}}>
          <BeatLoader color={"#9EDAFF"}/> 
        </div>  :
          <div style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
            <p style={noPosts}>{postSetting ? 'No Posts Yet!' : 'No Reposts Yet!'}</p>
            
          </div>
          }
                {/* {posts.slice( 0, 2).map((e, index) => (
            <Posts index={index} item={e}/>
            
        ))} */}
        </div>
        
    </div>
    </div>
         
        </div>
      </div>
      
    </div>
    </ProtectedRoute>
  )
}

export default ViewingProfile