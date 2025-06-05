import React, { useEffect, useState} from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { styles } from '@/styles/styles';
import Head from 'next/head';
import Sidebar from './Sidebar';
import ThemeMadeProgression from './Themes/ThemeMadeProgression';
import ThemeHeader from './Themes/ThemeHeader';
import { BeatLoader } from 'react-spinners';
import MiniPost from './MiniPost';
import Settings from '@/pages/Settings';
import { LockClosedIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Edit from '@/pages/Edit';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { fetchPosts, fetchReposts } from '@/firebaseUtils';
function ProfileComponent({person, viewing, friendId, profile, preview, previewMade, ableToMessage}) {
    const name = person.id;
    const router = useRouter();
    const {user} = useAuth();
    const [postSetting, setPostSetting] = useState(true);
    const [repostSetting, setRepostSetting] = useState(false);
    const [posts, setPosts] = useState([]);
    const [privacy, setPrivacy] = useState(false);
    const [numberOfPosts, setNumberOfPosts] = useState(0);
    const [numberOfReposts, setNumberOfReposts] = useState(0);
    const [reposts, setReposts] = useState([]);
    /* const [following, setFollowing] = useState(0);
    const [followers, setFollowers] = useState(0); */
    const [previewImage, setPreviewImage] = useState(null);
    const [background, setBackground] = useState(null);
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settingsShown, setSettingsShown] = useState(false);
    const [edit, setEdit] = useState(false);
    console.log(person)
    useEffect(() => {
        let unsubscribe;
        if (user.uid && postSetting) {
            // Call the utility function and pass state setters as callbacks
            unsubscribe = fetchPosts(user.uid, setPosts, setLastVisible);
            // Handle loading state
            setLoading(false);
        }
        else if (person && postSetting && (!person.blockedUsers.includes(user.uid) && !profile.blockedUsers.includes(person.id))) {
             // Call the utility function and pass state setters as callbacks
            unsubscribe = fetchPosts(person.id, setPosts, setLastVisible);
            // Handle loading state
            setLoading(false);
        }
        // Clean up the listener when the component unmounts
        return () => {
            if (unsubscribe) {
                return unsubscribe;
            }
        };
    }, [user?.uid, postSetting, person, profile.blockedUsers]);
    useEffect(() => {
        let unsubscribe;
        if (user.uid && repostSetting) {
            // Call the utility function and pass state setters as callbacks
            unsubscribe = fetchReposts(user.uid, setReposts, setLastVisible);
            // Handle loading state
            setLoading(false);
        }
        else if (person && repostSetting && (!person.blockedUsers.includes(user.uid) && !profile.blockedUsers.includes(person.id))) {
             // Call the utility function and pass state setters as callbacks
            unsubscribe = fetchReposts(person.id, setPosts, setLastVisible);
            // Handle loading state
            setLoading(false);
        }
        // Clean up the listener when the component unmounts
        return () => {
            if (unsubscribe) {
                return unsubscribe;
            }
        };
    }, [user?.uid, repostSetting, person, profile.blockedUsers]);
    const Posts = ({index, item}) => (
        <MiniPost item={item} index={index} repost={false}/>
    )
    const Reposts = ({index, item}) => (
        <MiniPost item={item} index={index} repost={true}/>
    )
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
                    if (data.done) {
                        router.back()
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }}]);
    }
    async function messageFriend() {
        if (ableToMessage.length > 0 && ableToMessage.filter((e) => e.active == true).length > 0) {
            router.push('PersonalChat', {friendId: friendId, person: person, active: true})
        }
        else {
        window.alert('You must both be following each other first (mutual friends) in order to message!')
        }
    }
    return (
        <ProtectedRoute>
            <div>
                <Head>
                    <title>NuCliq</title>
                    <link rel="icon" href='/favicon.icon' />
                </Head>
                <div style={styles.pageContainer}>
                    <div className='flex'>
                        <Sidebar />

                    {!settingsShown && !edit ? 
                    <div style={{width: (window.innerHeight * 0.75) * 1.01625, marginLeft: '20%'}}>
                        {preview ? 
                            <div style={{marginTop: '2.5%'}}>
                                <ThemeMadeProgression text={"Profile Theme Preview"}/> 
                            </div> : previewMade ? 
                            <div style={{ marginTop: '2.5%'}}>
                                <ThemeMadeProgression text={"Profile Theme Preview"} /> 
                            </div> : viewing ? 
                            <div style={{backgroundColor: "#121212"}}>
                                <ThemeHeader video={false} text={person != null && (person.blockedUsers.includes(user.uid) || profile.blockedUsers.includes(person.id)) ? "User Unavailable" : "Viewing Profile"} backButton={true}/>
                            </div> : 
                        null}
                        <div>
                            <img src={!loading ? previewImage ? previewImage : person.background ? person.background : '/Default_theme.jpg' : null} 
                            style={styles.profileHeaderContainer}/>
                            <div style={{display: 'flex'}}>
                                <div style={{width: '77.5%'}}>
                                    <div className='flex flex-row' style={{width: '90%'}}>
                                        <p className='numberofLines1' style={styles.nameAge}>@{profile.username}</p>
                                        {privacy && viewing ? <LockClosedIcon className='btn' color='#fafafa' style={{marginTop: 5}}/> : null}
                                    </div>
                                    <p className='numberofLines1' style={styles.nameAge}>{profile.firstName} {profile.lastName}</p>
                                </div>
                                <div style={styles.profileLoader}>
                                    {loading ? <BeatLoader color="#9edaff" /> : profile.pfp ?
                                    <img src={profile.pfp} className='cursor-pointer' style={styles.profileCircle}/>
                                    : <UserCircleIcon color='#005278' style={styles.profileCircle}/>}
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
                                <div style={styles.profileFriendsContainer}>
                                    {viewing ? <div className='cursor-pointer items-center flex justify-center' style={styles.friendsHeaderTwo} 
                                    onClick={preview ? null :user.uid != null ? friends.filter(e => e.id === name).length > 0 ? 
                                    () => removeFriend(name) : name == user.uid || friendRequests.filter(e => e.id === name).length > 0 ? null : () => addFriend(person): null}>
                                        {friendRequests.filter(e => e.id === name).length > 0 ? <RequestedIcon color={"#121212"} /> : 
                                        friends.filter(e => e.id === name).length > 0 ? <FollowingIcon color={"#121212"}  />
                                        : name == user.uid ? null : <FollowIcon color={"#121212"}  />}
                                    </div> :
                                    <div style={styles.friendsHeader} className='w-52 text-center cursor-pointer' onClick={() => setEdit(true)}>
                                        <p style={styles.friendsText}>Edit</p>
                                    </div>}
                                    {!viewing ? <div style={styles.friendsHeader} className='w-52 text-center cursor-pointer' onClick={() => setSettingsShown(true)}>
                                        <p style={styles.friendsText}>Settings</p>
                                    </div> : ableToMessage.filter((e) => e.active == true).length > 0 && friendId && person != null && (!person.blockedUsers.includes(user.uid) && !profile.blockedUsers.includes(person.id)) 
                                    ? <div className='cursor-pointer' style={styles.friendsHeader} onClick={preview ? null : () => messageFriend()}>
                                        <p style={styles.friendsText}>Message</p>
                                    </div> : null}
                                    {viewing ? user != null && user.uid != name && person != null && (!person.blockedUsers.includes(user.uid) && !profile.blockedUsers.includes(person.id)) ? 
                                    <div className='cursor-pointer' style={styles.friendsHeader} onClick={preview ? null : () => blockUser()}>
                                        <p style={styles.friendsText}>Block</p>
                                    </div>
                                    : user != null && user.uid != name && person != null && (profile.blockedUsers.includes(person.id)) ? 
                                    <div className='cursor-pointer' style={styles.friendsHeader} onClick={preview ? null :() => unBlockUser()}>
                                        <p style={styles.friendsText}>Un-Block</p>
                                    </div> : null : null}
                                </div>
                            </div>
                            <div className='justify-between items-center self-center'>
                                <div style={styles.profileFriendsContainer}>
                                    <div style={styles.noOfPosts} className='cursor-pointer' onClick={postSetting ? null : () => {setPostSetting(true); setRepostSetting(false)}}>
                                        <p style={styles.profileHeaderText}>{numberOfPosts > 999 && numberOfPosts < 1000000 ? `${numberOfPosts / 1000}k` : numberOfPosts > 999999 ? `${numberOfPosts / 1000000}m` : numberOfPosts}</p>
                                        <p style={styles.headerSupplementText}>{numberOfPosts == 1 ? 'Post' : 'Posts'}</p>
                                    </div>
                                    <div style={styles.noOfPosts} className='cursor-pointer' onClick={repostSetting ? null : () => {setRepostSetting(true); setPostSetting(false)}}>
                                        <p style={styles.profileHeaderText}>{numberOfPosts > 999 && numberOfPosts < 1000000 ? `${numberOfPosts / 1000}k` : numberOfPosts > 999999 ? `${numberOfPosts / 1000000}m` : numberOfPosts}</p>
                                        <p style={styles.headerSupplementText}>{numberOfReposts == 1 ? 'Repost' : 'Reposts'}</p>
                                    </div>
                                    <div style={styles.noOfPosts} className='cursor-pointer'>
                                        <p style={styles.profileHeaderText}>{person.following.length > 999 && person.following.length < 1000000 ? `${person.following.length / 1000}k` : person.following.length > 999999 ? `${person.following.length / 1000000}m` : person.following.length}</p>
                                        <p style={styles.headerSupplementText}>{'Following'}</p>
                                    </div>
                                    <div style={styles.noOfPosts} className='cursor-pointer'>
                                        <p style={styles.profileHeaderText}>{person.followers.length > 999 && person.followers.length < 1000000 ? `${person.followers.length / 1000}k` : person.followers.length > 999999 ? `${person.followers.length / 1000000}m` : person.followers.length}</p>
                                        <p style={styles.headerSupplementText}>{person.followers.length == 1 ? 'Follower' : 'Followers'}</p>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className='flex flex-row mt-5'>  
                                {posts.length > 0 && postSetting ? posts.slice( 0, 3).map((e, index) => (
                                        <Posts index={index} item={e}/>
                                    )) : reposts.length > 0 && repostSetting ? reposts.slice( 0, 3).map((e, index) => (
                                        <Reposts index={index} item={e}/>
                                    )): privacy && !loading && !friends.filter(e => e.id === name).length > 0 ? 
                                    <div style={styles.loadContainer}>
                                        <p style={styles.reportContentText}>Private Account</p>
                                        <p style={styles.noPostsSupp}>Must follow user in order to see posts</p>
                                    </div> : loading && person != null && !(person.blockedUsers.includes(user.uid) || profile.blockedUsers.includes(person.id)) ? 
                                    <div style={styles.reportLoadingContainer}>
                                        <BeatLoader color={"#9EDAFF"}/> 
                                    </div>  :
                                    <div style={styles.loadContainer}>
                                        <p style={styles.reportContentText}>{postSetting ? 'No Posts Yet!' : 'No Reposts Yet!'}</p>
                                    </div>
                                    }
                            </div>
                        </div>
                </div>
                : settingsShown ?
                <div>
                    <Settings />
                </div> :
                <div className='flex flex-row'>
                    <section>
                        <Edit firstName={profile.firstName} lastName={profile.lastName} bio={bio}/>
                    </section>
                </div> }
            </div>
        </div>
            
            </div>
        </ProtectedRoute>
  )
}

export default ProfileComponent