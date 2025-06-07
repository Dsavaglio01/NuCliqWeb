import { ChevronRightIcon } from '@heroicons/react/24/solid'
import React, { useState, useMemo, useContext } from 'react'
import Switch from 'react-switch';
import { doc, getDoc} from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import NextButton from '@/components/NextButton';
import TransactionHistory from './TransactionHistory';
import ProfileContext from '@/context/ProfileContext';
import { styles } from '@/styles/styles';
import { fetchSettingsContent, logOut, unBlock, sendReport, statusFunction, allowNotificationsFunction, privacyFunction } from '@/firebaseUtils';
import MiniPost from '@/components/MiniPost';
function Settings() {
  const profile = useContext(ProfileContext);
    const {user} = useAuth();
    const [activityEnabled, setActivityEnabled] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false); 
    const [lastVisible, setLastVisible] = useState(null);
    const [completePosts, setCompletePosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contentState, setContentState] = useState('My Likes');
    const [postDone, setPostDone] = useState(false);
    const [sentReport, setSentReport] = useState(false);
    const [posts, setPosts] = useState([]);
    const [privacyEnabled, setPrivacyEnabled] = useState(false);
    const [report, setReport] = useState('');
    const [bugChecked, setBugChecked] = useState(false);
    const [uxChecked, setUxChecked] = useState(false);
    const [securityChecked, setSecurityChecked] = useState(false);
    const [messagesChecked, setMessagesChecked] = useState(false);
    const [notificationsChecked, setNotificationsChecked] = useState(false);
    const [themesChecked, setThemesChecked] = useState(false);
    const [postingChecked, setPostingChecked] = useState(false);
    const [addingChecked, setAddingChecked] = useState(false);
    const [othersChecked, setOthersChecked] = useState(false);
    const router = useRouter();
    useMemo(() => {
      setPosts([]);
      if (contentState == 'My Likes') {
        const getLikes = async() => {
          const {posts, lastVisible} = await fetchSettingsContent(user.uid, 'likes')
          setPosts(posts)
          setLastVisible(lastVisible)
        }
        getLikes()
      }
      else if (contentState == 'mentions') {
        const getMentions = async() => {
          const {posts, lastVisible} = await fetchSettingsContent(user.uid, 'mentions')
          setPosts(posts)
          setLastVisible(lastVisible)
        }
        getMentions()
      } 
      else if (contentState == 'saves') {
        const getSaves = async() => {
          const {posts, lastVisible} = await fetchSettingsContent(user.uid, 'saves')
          setPosts(posts)
          setLastVisible(lastVisible)
        }
        getSaves()
      }
    setTimeout(() => {
      setLoading(false)
    }, 1000);
    
    }, [contentState]) // still need to modularize comments, card info and blocked users as well as fetch more data
    useMemo(() => {
      if (postDone && contentState == 'comments') {
    const processPosts = async () => {
      setLoading(true);
      //setCompletePosts([]);  // Only clear if necessary
      
      try {
        // Use Promise.all to handle async fetch for all posts
        const completePostPromises = posts.map(async (item) => {
          let secondSnap;
          if (item.video) {
            secondSnap = await getDoc(doc(db, 'videos', item.postId));
          } else {
            secondSnap = await getDoc(doc(db, 'posts', item.postId));
          }
          
          if (secondSnap.exists()) {
            return { id: item.id, postId: item.postId, comment: item.comment, ...secondSnap.data() };
          }
        });

        const resolvedCompletePosts = await Promise.all(completePostPromises);
        setCompletePosts(prevState => [...prevState, ...resolvedCompletePosts.filter(Boolean)]);  // Batch update
        
      } catch (error) {
        console.error("Error processing posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    processPosts();
  }
    }, [postDone, posts, contentState])
    const handleReport = (inputText) => {
    const sanitizedText = inputText.replace(/\n/g, ''); // Remove all new line characters
    setReport(sanitizedText);
  }
  console.log(completePosts.length)
  return (
     <div className='flex flex-row'>
    <div className='settingsSidebar'>
        <div style={styles.themeHeader}>
            
            <p style={styles.headerText}>Settings</p>
        </div>
       
        <div style={{marginLeft: '5%', marginRight: '5%'}}>
            <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('My Likes')}}>
                <p style={styles.pushNotiText}>My Likes</p>
                <ChevronRightIcon className='btn'/>
            </div>
            <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('comments')}}>
                <p style={styles.pushNotiText}>My Comments</p>
                <ChevronRightIcon className='btn'/>
            </div>
            <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('saves')}}>
                <p style={styles.pushNotiText}>My Bookmarks</p>
                <ChevronRightIcon className='btn'/>
            </div>
            <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('mentions')}}>
                <p style={styles.pushNotiText}>My Mentions</p>
                <ChevronRightIcon className='btn'/>
            </div>
            <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('transaction history')}}>
                <p style={styles.pushNotiText}>Transaction History</p> 
                <ChevronRightIcon className='btn'/>
            </div>
            <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('blocked')}}>
                <p style={styles.pushNotiText}>Blocked Users</p>
                <ChevronRightIcon className='btn'/>
            </div>
            <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('reportProblem')}}>
                <p style={styles.pushNotiText}>Report a Problem</p>
                <ChevronRightIcon className='btn'/>
            </div>
             <div className='cursor-pointer' style={styles.sections}>
                <p style={styles.pushNotiText}>Show Active Status</p>
                <Switch checked={activityEnabled} checkedIcon={false} uncheckedIcon={false}
                 onColor={'#005278'} offColor='#767577' onHandleColor='#f4f3f4' offHandleColor='#f4f3f4' 
                 onChange={() => statusFunction(user.uid, activityEnabled, setActivityEnabled)} value={activityEnabled}/>
            </div>
            <div className='cursor-pointer' style={styles.sections}>
                <p style={styles.pushNotiText}>Push Notifications</p>
                <Switch checked={isEnabled} checkedIcon={false} uncheckedIcon={false}
                 onColor={'#005278'} offColor='#767577' onHandleColor='#f4f3f4' offHandleColor='#f4f3f4' onChange={() => allowNotificationsFunction(user.uid, isEnabled,
                  profile.notificationToken, setIsEnabled)} value={isEnabled}/>
            </div>
            <p style={styles.tapToReceiveText}>Tap to Receive Notifications</p>
            <div className='cursor-pointer' style={styles.sections}>
                <p style={styles.pushNotiText}>Private Account</p>
                <Switch checked={privacyEnabled} checkedIcon={false} uncheckedIcon={false}
                 onColor={'#005278'} offColor='#767577' onHandleColor='#f4f3f4' offHandleColor='#f4f3f4' 
                 onChange={() => privacyFunction(user.uid, privacyEnabled, setPrivacyEnabled)} value={privacyEnabled}/>
            </div>
            <p style={styles.tapToReceiveText}>Tap to Make Account Private</p>
             <div className='cursor-pointer' style={styles.sections}>
                <p style={styles.settingsBottomText}>Data Usage Policy</p>
                <ChevronRightIcon className='btn'/>
            </div>
            <div className='cursor-pointer' style={styles.sections}>
                <p style={styles.settingsBottomText}>Data Retention Policy</p>
                <ChevronRightIcon className='btn'/>
            </div>
            <div className='cursor-pointer' style={styles.sections}>
                <p style={styles.settingsBottomText}>Privacy Policy</p>
                <ChevronRightIcon className='btn'/>
            </div>
            <div className='cursor-pointer' style={styles.sections}>
                <p style={styles.settingsBottomText}>Terms and Conditions</p>
                <ChevronRightIcon className='btn'/>
            </div>
            <div className='cursor-pointer' onClick={() => logOut(user?.uid)}>
                <p style={styles.settingsBottomText}>Log Out</p>
            </div>
            <div className='cursor-pointer'>
                <p style={{...styles.settingsBottomText, ...{color: 'red'}}}>Delete Account</p>
            </div>
        </div>
        
        </div>
        <div style={contentState != 'My Likes' && contentState != 'saves' && contentState != 'mentions' ? { marginLeft: 0, marginTop: 10
        } : styles.contentContainer}>
        {(contentState == 'My Likes' || contentState == 'saves' || contentState == 'mentions') && !loading ? posts.map((item, index) => (
            !item.repost ? <MiniPost item={item} index={index} repost={false} onClick={() => router.push({pathname: 'Post', query: {post: item.id}})}/> 
            : item.repost ? <MiniPost item={item} index={index} repost={true} onClick={() => router.push({pathname: 'Post', query: {post: item.id}})}/> : null
        )) : contentState == 'comments' ? completePosts.map((item, index) => (
        <div style={{margin: '2.5%', width: '63vw', flexDirection: 'row', display: 'flex', borderBottomWidth: 1, borderBottomColor: "#d3d3d3", paddingBottom: 10}}>
        <div style={{flexDirection: 'row', display: 'flex', alignItems: 'center', width: '92.5%', marginLeft: '2.5%'}}>
            {profile.pfp ? <img src={profile.pfp} style={styles.notificationImageBorder}/> : <UserCircleIcon className='userBtn' style={styles.notificationImageBorder}/>}
          <p className='numberofLines2' style={styles.settingsAddText}>You {item.reply != undefined ? 'replied' : 'commented'}: {item.comment} </p>
        </div>
        {!item.repost && item.post[0].image ? 
      <button style={{flex: 1, justifyContent: 'center', alignItems: 'center', }} onClick={!item.repost ? () => navigation.navigate('Post', {post: item.postId, requests: requests, name: item.userId, groupId: null, video: false}) : () => navigation.navigate('Repost', {post: item.postId, requests: requests, name: item.userId, groupId: null})}>
        <img src={item.post[0].post} style={styles.notificationImageBorder}/>
      </button> : item.repost && item.post.post[0].image ? 
      <button style={{flex: 1, justifyContent: 'center', alignItems: 'center', }} onClick={!item.repost ? () => navigation.navigate('Post', {post: item.postId, requests: requests, name: item.userId, groupId: null, video: false}) : () => navigation.navigate('Repost', {post: item.postId, requests: requests, name: item.userId, groupId: null})}>
        <img src={item.post.post[0].post} style={styles.notificationImageBorder}/>
      </button>
      : !item.repost && item.post[0].video ? <button style={{marginLeft: 'auto', flex: 1, justifyContent: 'center', alignItems: 'center', }} onClick={!item.repost ? () => navigation.navigate('Post', {post: item.postId, requests: requests, name: item.userId, groupId: null, video: true}) : () => navigation.navigate('Repost', {post: item.postId, requests: requests, name: item.userId, groupId: null})}>
        <img src={item.post[0].thumbnail} style={styles.notificationImageBorder}/>
      </button> : item.repost && item.post.post[0].video ? <button style={{marginLeft: 'auto', flex: 1, justifyContent: 'center', alignItems: 'center', }} onClick={!item.repost ? () => navigation.navigate('Post', {post: item.postId, requests: requests, name: item.userId, groupId: null, video: true}) : () => navigation.navigate('Repost', {post: item.postId, requests: requests, name: item.userId, groupId: null})}>
        <img src={item.post.post[0].thumbnail} style={styles.notificationImageBorder}/>
      </button> : !item.repost ?
      <button style={{marginLeft: 'auto', flex: 1, justifyContent: 'center', alignItems: 'center', }} onClick={!item.repost ? () => navigation.navigate('Post', {post: item.postId, requests: requests, name: item.userId, groupId: null, video: false}) : () => navigation.navigate('Repost', {post: item.postId, requests: requests, name: item.userId, groupId: null})}>
        <p className='numberofLines1' style={styles.notificationImageBorder}>{item.post[0].value}</p>
      </button> : <button style={{marginLeft: 'auto', flex: 1, justifyContent: 'center', alignItems: 'center', }} onClick={!item.repost ? () => navigation.navigate('Post', {post: item.postId, requests: requests, name: item.userId, groupId: null, video: false}) : () => navigation.navigate('Repost', {post: item.postId, requests: requests, name: item.userId, groupId: null})}>
        <p className='numberofLines1' style={styles.notificationImageBorder}>{item.post.post[0].value}</p>
      </button>}
        </div> 
        ))
        : contentState == 'blocked' ? 
        posts.map((item, index) => (
        <div key={index}>
            <div style={styles.contentListContainer} >
                <div style={{flexDirection: 'row', display: 'flex', marginLeft: '1%'}}>
                  {item.pfp ? 
                  <img src={item.pfp} style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}} /> :
                  <UserCircleIcon className='btn' style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}}/>
                  }
                    
                 <button style={{paddingLeft: 20, width: '100%', justifyContent: 'center'}} onClick={() => router.push('ViewingProfile', {name: item.id, viewing: true})}>
                    <span className='numberofLines1' style={styles.name}>{item.firstName} {item.lastName}</span>
                    <span className='numberofLines1' style={styles.messageContainer}>@{item.userName}</span>
                </button>
                </div>
              <div style={{ marginLeft: 'auto', marginRight: '1%'}}>
                <NextButton text={"Un-Block"} textStyle={{fontSize: 12.29}} onClick={() => unBlock(item.id, user.uid, posts, setPosts)}/>
              </div>
            </div>
          </div> 
        ))
          : contentState == 'transaction history' ? <TransactionHistory /> : contentState == 'reportProblem' ?
             <div style={{width: '63vw'}}>
       <div className='flex justify-center mt-5'>
            <span style={styles.noThemesText}>{"Report a Problem"}</span>
        </div>
        <div className='divider'/>
      {sentReport ? <div style={{alignItems: 'center'}}>
        <span style={headerText}>Report Sent!</span>
        </div> : 
        <div className='flex flex-col justify-center items-center'>
        <span style={headerText}>We will help you as soon as we can if you can describe the problem below!</span>
        <div style={{flexDirection: 'row', display: 'flex', marginLeft: '2.5%', width: '90%', marginBottom: '5%', flexWrap: 'wrap'}}>
            <div className='cursor-pointer ml-9 pt-10' onClick={() => {setBugChecked(!bugChecked)}} style={styles.settingsReportContainer}>
                <label>
                    <input type='checkbox' value={bugChecked} checked={bugChecked} onChange={() => {setBugChecked(!bugChecked)}} color={bugChecked ? "#9EDAFF" : '#fafafa'}/>
                </label>
               <span style={styles.numberCommentText}>Bugs/Errors</span>
            </div>
                <div className='cursor-pointer ml-9 pt-10' onClick={() => {setUxChecked(!uxChecked)}} style={styles.settingsReportContainer}>
                <label>
                    <input type='checkbox' value={uxChecked} checked={uxChecked} onChange={() => {setUxChecked(!uxChecked)}} color={uxChecked ? "#9EDAFF" : '#fafafa'}/>
                </label>
               <span style={styles.numberCommentText}>User Experience</span>
            </div>   
                <div className='cursor-pointer ml-9 pt-10' onClick={() => {setSecurityChecked(!securityChecked)}} style={styles.settingsReportContainer}>
                <label>
                    <input type='checkbox' value={securityChecked} checked={securityChecked} onChange={() => {setSecurityChecked(!securityChecked)}} color={securityChecked ? "#9EDAFF" : '#fafafa'}/>
                </label>
               <span style={styles.numberCommentText}>Security</span>
            </div>  
                <div className='cursor-pointer ml-9 pt-10' onClick={() => {setMessagesChecked(!messagesChecked)}} style={styles.settingsReportContainer}>
                <label>
                    <input type='checkbox' value={messagesChecked} checked={messagesChecked} onChange={() => {setMessagesChecked(!messagesChecked)}} color={messagesChecked ? "#9EDAFF" : '#fafafa'}/>
                </label>
               <span style={styles.numberCommentText}>Messages</span>
            </div> 
                <div className='cursor-pointer ml-9 pt-10' onClick={() => {setNotificationsChecked(!notificationsChecked)}} style={styles.settingsReportContainer}>
                <label>
                    <input type='checkbox' value={notificationsChecked} checked={notificationsChecked} onChange={() => {setNotificationsChecked(!notificationsChecked)}} color={notificationsChecked ? "#9EDAFF" : '#fafafa'}/>
                </label>
               <span style={styles.numberCommentText}>Notifications</span>
            </div> 
                <div className='cursor-pointer ml-9 pt-10' onClick={() => {setThemesChecked(!themesChecked)}} style={styles.settingsReportContainer}>
                <label>
                    <input type='checkbox' value={themesChecked} checked={themesChecked} onChange={() => {setThemesChecked(!themesChecked)}} color={themesChecked ? "#9EDAFF" : '#fafafa'}/>
                </label>
               <span style={styles.numberCommentText}>Themes</span>
            </div>   
                <div className='cursor-pointer ml-9 pt-10' onClick={() => {setPostingChecked(!postingChecked)}} style={styles.settingsReportContainer}>
                <label>
                    <input type='checkbox' value={postingChecked} checked={postingChecked} onChange={() => {setPostingChecked(!postingChecked)}} color={postingChecked ? "#9EDAFF" : '#fafafa'}/>
                </label>
               <span style={styles.numberCommentText}>Posting (Images, Videos, Vibes)</span>
            </div>
                <div className='cursor-pointer ml-9 pt-10' onClick={() => {setAddingChecked(!addingChecked)}} style={styles.settingsReportContainer}>
                <label>
                    <input type='checkbox' value={addingChecked} checked={addingChecked} onChange={() => {setAddingChecked(!addingChecked)}} color={addingChecked ? "#9EDAFF" : '#fafafa'}/>
                </label>
               <span style={styles.numberCommentText}>Adding/Removing Friends</span>
            </div>
                <div className='cursor-pointer ml-9 pt-10' onClick={() => {setOthersChecked(!othersChecked)}} style={styles.settingsReportContainer}>
                <label>
                    <input type='checkbox' value={othersChecked} checked={othersChecked} onChange={() => {setOthersChecked(!othersChecked)}} color={othersChecked ? "#9EDAFF" : '#fafafa'}/>
                </label>
               <span style={styles.numberCommentText}>Others</span>
            </div>    
            </div>
            <textarea maxLength={200} style={{width: '50%', backgroundColor: "#121212", color: "#fafafa", borderWidth: 1, borderRadius: 5, alignSelf: 'center', padding: 5}} placeholder='Add Comment Here...' value={report} onChange={(e) => handleReport(e.target.value)}/>
        <span style={styles.editText}>{report.length}/200</span>
        <div style={{margin: '5%', marginTop: 0}}>
            <NextButton text={"Send Report"} onClick={report.length > 0 && (bugChecked || uxChecked || addingChecked || othersChecked || themesChecked || postingChecked || messagesChecked || securityChecked || notificationsChecked) 
              ? () => sendReport(user.uid, bugChecked, uxChecked, securityChecked, messagesChecked, notificationsChecked, themesChecked, postingChecked, addingChecked,
                othersChecked, report, setSentReport) : null}/>
        </div>
        
        </div>}
      
    </div>
          : null}
        </div>
    </div>
  )
}

export default Settings