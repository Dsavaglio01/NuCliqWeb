import React from 'react'
import { useState, useEffect } from 'react';
import { onSnapshot, query, doc, collection, getCountFromServer, where, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { BeatLoader } from 'react-spinners';
import { ChevronDownIcon, ChevronUpIcon, PauseIcon, PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import NextButton from '@/components/NextButton';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute'
import Head from 'next/head';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import Edit from './Edit';
import Settings from './Settings';
import { fetchPosts, fetchReposts, getProfileDetails} from '@/firebaseUtils';
import { styles } from '@/styles/styles';
import MiniPost from '@/components/MiniPost';
function Profile() {
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [background, setBackground] = useState(null);
  const [settingsShown, setSettingsShown] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [numberOfReposts, setNumberOfReposts] = useState(0);
  const [edit, setEdit] = useState(false);
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [reposts, setReposts] = useState(0);
  const [posts, setPosts] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [postSetting, setPostSetting] = useState(true);
  const [repostSetting, setRepostSetting] = useState(false);
  const [uploading, setUploading] = useState(false)
  const [lastName, setLastName] = useState('');
  const [additionalInfoMode, setAdditionalInfoMode] = useState(false);
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState(null);
  const [song, setSong] = useState(null);
  const [forSale, setForSale] = useState(false);
  const [bio, setBio] = useState('');
  const [groupsJoined, setGroupsJoined] = useState([]);
  const [notificationToken, setNotificationToken] = useState(null);
  const {user} = useAuth();
  const router = useRouter();
  function fetchMoreRepostData () {
    if (lastVisible != undefined) {
    
    let unsub;

      const fetchCards = async () => {
  
        unsub = onSnapshot(query(collection(db, 'profiles', name, 'posts'), where('repost', '==', true), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(9)), (snapshot) => {
          const newData = [];
          snapshot.docs.map((doc) => {
            newData.push({
              id: doc.id,
              ...doc.data()
            })
          })
          setReposts([...reposts, ...newData])
          setLastVisible(snapshot.docs[snapshot.docs.length-1])
        })
      }
      fetchCards();
      return unsub;
    }
  }
  function fetchMoreData () {
    if (lastVisible != undefined) {
    
    let unsub;

      const fetchCards = async () => {
  
        unsub = onSnapshot(query(collection(db, 'profiles', name, 'posts'), where('repost', '==', false), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(9)), (snapshot) => {
          const newData = [];
          snapshot.docs.map((doc) => {
            newData.push({
              id: doc.id,
              ...doc.data()
            })
          })
          setPosts([...posts, ...newData])
          setLastVisible(snapshot.docs[snapshot.docs.length-1])
        })
      }
      fetchCards();
      return unsub;
    }
  }

  useEffect(() => {
    let unsubscribe;

    if (user.uid && postSetting) {
      // Call the utility function and pass state setters as callbacks
      unsubscribe = fetchPosts(user.uid, setPosts, setLastVisible);

      // Handle loading state
      setLoading(false);
    }

    // Clean up the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        return unsubscribe;
      }
    };
  }, [user?.uid, postSetting]);
  useEffect(() => {
    let unsubscribe;

    if (user.uid && repostSetting) {
      // Call the utility function and pass state setters as callbacks
      unsubscribe = fetchReposts(user.uid, setReposts, setLastVisible);

      // Handle loading state
      setLoading(false);
    }

    // Clean up the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        return unsubscribe;
      }
    };
  }, [user?.uid, repostSetting]);
  
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
  useEffect(() => {
    if (user?.uid) {
      // Fetch count of all posts
      fetchCount(user.uid, 'posts', [where('repost', '==', false)], setNumberOfPosts);

      // Fetch count of reposts
      fetchCount(user.uid, 'posts', [where('repost', '==', true)], setNumberOfReposts);
    }
  }, [user?.uid]);
const Posts = ({index, item}) => (
    <MiniPost item={item}/>
)
const Reposts = ({index, item}) => (
    <div style={{borderWidth: 1, borderColor: "#121212"}} onClick={() => router.push({pathname: 'Post', query: {post: item.id}})} className='cursor-pointer justify-center flex items-center'>
        <div style={{padding: 0}} className='chat-bubble'>
            <p style={{fontSize: 15.36, height: window.innerHeight / 4, width: (window.innerHeight / 4) * 1.01625, paddingLeft: 5, paddingTop: 2.5}}>{item.post[0].value}</p>
            
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

          {!settingsShown && !edit ? 
          <div style={{width: (window.innerHeight * 0.7) * 1.01625, marginLeft: '20%'}}>
    <div className=''>
        <img src={!loading ? previewImage ? previewImage : background ? background : require('../assets/Default_theme.jpg') : null} 
        style={{width: '100%', height: window.innerHeight * 0.25, objectFit: 'cover'}}/>
        <div style={{flexDirection: 'row', display: 'flex'}}>
            <div style={{width: '77.5%'}}>
                <p className='numberofLines1' style={styles.nameAge}>@{username}</p>
                <p className='numberofLines1' style={styles.nameAge}>{firstName} {lastName}</p>
            </div>
            <div style={{marginTop: '-7.5%', alignItems: 'flex-end', marginLeft: '2.5%', flex: 1}}>
                {uploading || loading ? <BeatLoader color="#9edaff" /> :
                <img src={pfp? pfp : require('../public/defaultpfp.jpg')} className='cursor-pointer' style={styles.profileCircle}/>}
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
        <div className='justify-center items-center self-center flex flex-col'>
        <div style={styles.profileFriendsContainer} className=''>
            <div style={styles.friendsHeader} className='w-52 text-center cursor-pointer' onClick={() => setEdit(true)}>
                <p style={styles.friendsText}>Edit</p>
          </div>
          <div style={styles.friendsHeader} className='w-52 text-center cursor-pointer' onClick={() => setSettingsShown(true)}>
                <p style={styles.friendsText}>Settings</p>
          </div>
        </div>
        </div>
        <div className='justify-between items-center self-center flex'>
        <div style={{display: 'flex', marginTop: '2%', flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginRight: '2%'}}>
            <div style={styles.noOfPosts} className='cursor-pointer' onClick={postSetting ? null : () => {setPostSetting(true); setRepostSetting(false)}}>
                <p style={styles.profileHeaderText}>{numberOfPosts > 999 && numberOfPosts < 1000000 ? `${numberOfPosts / 1000}k` : numberOfPosts > 999999 ? `${numberOfPosts / 1000000}m` : numberOfPosts}</p>
                <p style={styles.headerSupplementText}>{numberOfPosts == 1 ? 'Post' : 'Posts'}</p>
            </div>
            <div style={styles.noOfPosts} className='cursor-pointer' onClick={repostSetting ? null : () => {setRepostSetting(true); setPostSetting(false)}}>
                <p style={styles.profileHeaderText}>{numberOfPosts > 999 && numberOfPosts < 1000000 ? `${numberOfPosts / 1000}k` : numberOfPosts > 999999 ? `${numberOfPosts / 1000000}m` : numberOfPosts}</p>
                <p style={styles.headerSupplementText}>{numberOfReposts == 1 ? 'Repost' : 'Reposts'}</p>
            </div>
            <div style={styles.noOfPosts} className='cursor-pointer'>
                <p style={styles.profileHeaderText}>{following > 999 && following < 1000000 ? `${following / 1000}k` : following > 999999 ? `${following / 1000000}m` : following}</p>
                <p style={styles.headerSupplementText}>{'Following'}</p>
            </div>
            <div style={styles.noOfPosts} className='cursor-pointer'>
                <p style={styles.profileHeaderText}>{followers > 999 && followers < 1000000 ? `${followers / 1000}k` : followers > 999999 ? `${followers / 1000000}m` : followers}</p>
                <p style={styles.headerSupplementText}>{followers == 1 ? 'Follower' : 'Followers'}</p>
            </div>
            
        </div>
        </div>
        <div className='flex flex-row mt-5'>  
          {posts.length > 0 && postSetting ? 
                posts.slice( 0, 2).map((e, index) => (
            <Posts index={index} item={e}/>
            
        )) : reposts.length > 0 && repostSetting ? 
        reposts.slice( 0, 2).map((e, index) => (
            <Reposts index={index} item={e}/>
            
        )): loading ? <div style={{alignItems: 'center', flex: 1, justifyContent: 'center', marginTop: '20%'}}>
          <BeatLoader color={"#9EDAFF"}/> 
        </div>  :
          null}
        </div>
        
    </div>
    </div>
         : settingsShown ?
         <div>
          <Settings />
          </div> :
          <div className='flex flex-row'>
            <section>
            <Edit firstName={firstName} lastName={lastName} bio={bio}/>
            </section>
            </div> }
        </div>
      </div>
      
    </div>
    </ProtectedRoute>
  )
}

export default Profile