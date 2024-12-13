import React, {useState, useEffect, useMemo} from 'react'
import { useAuth } from '@/context/AuthContext';
import { query, collection, orderBy, doc, getDocs, getDoc, getFirestore, startAt, endAt} from 'firebase/firestore';
import { BeatLoader } from 'react-spinners';
import { useRouter } from 'next/router';
import { ArrowRightEndOnRectangleIcon, ChatBubbleLeftRightIcon, FaceFrownIcon } from '@heroicons/react/24/outline';
import { ChatBubbleLeftIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import PersonalChat from './PersonalChat';
import UserSearchBar from '@/components/UserSearchBar';
import { getMessageNotifications, fetchFriends, getProfileDetails } from '@/firebaseUtils';
import getDateAndTime from '@/lib/getDateAndTime';
import { styles } from '@/styles/styles';
function Chat () {
    //const BACKEND_URL = process.env.BACKEND_URL
    const [searches, setSearches] = useState([]);
    const [friends, setFriends] = useState([]);
    const [specificSearch, setSpecificSearch] = useState('');
    const [username, setUsername] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [routeSending, setRouteSending] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [focusedItem, setFocusedItem] = useState(null);
    const [completeMessages, setCompleteMessages] = useState([]);
    const [messageNotifications, setMessageNotifications] = useState([]);
    const [completeFriends, setCompleteFriends] = useState([]);
    const [filteredGroup, setFilteredGroup] = useState([]);
    const [friendsInfo, setFriendsInfo] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);
    const [searching, setSearching] = useState(false)
    const [moreResults, setMoreResults] = useState(false);
  const [moreResultButton, setMoreResultButton] = useState(false);
    const [lastVisible, setLastVisible] = useState();
    const [loading, setLoading] = useState(true);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const {user} = useAuth()
    const db = getFirestore();
  
    useMemo(() => {
       let unsubscribe;

    if (user.uid) {
      // Call the utility function with the userId and a callback
      unsubscribe = getMessageNotifications(user.uid, (data) => {
        setMessageNotifications(data); // Update the state with the fetched data
      });
    }

    // Clean up the listener on component unmount
    return () => {
      if (unsubscribe) {
        return unsubscribe
      }
    };
    }, [user.uid])
    useEffect(() => {
    const fetchProfileData = async () => {
      const profileData = await getProfileDetails(user.uid);

      if (profileData) {
        setUsername(profileData.username);
        setFirstName(profileData.firstName)
        setLastName(profileData.lastName)
        setBlockedUsers(profileData.blockedUsers);
      }
    };

    fetchProfileData();
  }, [user.uid]);

    useEffect(() => {
    let unsubscribe;

    if (user.uid) {
      // Call the utility function and pass state setters as callbacks
      unsubscribe = fetchFriends(user.uid, blockedUsers, setFriends, setLastVisible);

      // Handle loading state
      setLoading(false);
    }

    // Clean up the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        return unsubscribe;
      }
    };
  }, [user.uid, blockedUsers]);
    
    useMemo(() => {
      if (friends.length > 0) {
        Promise.all(friends.map(async(item) => await getDoc(doc(db, 'profiles', item.id))))
      .then(snapshots => {
        setFriendsInfo(snapshots.map(snapshot => ({id: snapshot.id, ...snapshot.data(), checked: false})))
        //console.log(snapshots.map(snapshot => snapshot.data()))
        //const documents = snapshots.map(snapshot => snapshot.data());
        // Process the fetched documents here
      })
      .catch(error => {
        // Handle errors
      });
      }
    }, [friends])
    useMemo(() => {
      
      Promise.all(friends.map(async(item) => await getDoc(doc(db, 'friends', item.friendId))))
      .then(snapshots => {
        setCompleteFriends(snapshots.map(snapshot => ({id: snapshot.id, ...snapshot.data()})))
        //console.log(snapshots.map(snapshot => snapshot.data()))
        //const documents = snapshots.map(snapshot => snapshot.data());
        // Process the fetched documents here
      })
      .catch(error => {
        // Handle errors
      });
    }, [friends])
    //console.log(friends.length)
    useMemo(()=> {
      if (completeFriends.length > 0){
        Promise.all(completeFriends.map(async(item) => await getDoc(doc(db, 'friends', item.id))))
      .then(snapshots => {
        setLastMessages(snapshots.map(snapshot => ({id: snapshot.id, ...snapshot.data()})))
        //console.log(snapshots.map(snapshot => snapshot.data()))
        //const documents = snapshots.map(snapshot => snapshot.data());
        // Process the fetched documents here
      })
      .catch(error => {
        // Handle errors
      });
  }

    }, [completeFriends]);
    useEffect(() => {
      const updatedArray2 = friendsInfo.map(obj2 => {
        if (lastMessages.find(obj1 => obj1.id.includes(obj2.id))) {
          return { ...obj2, messageActive:lastMessages.find(obj1 => obj1.id.includes(obj2.id)).active, messageId: lastMessages.find(obj1 => obj1.id.includes(obj2.id)).messageId, lastMessage: lastMessages.find(obj1 => obj1.id.includes(obj2.id)).lastMessage,
          lastMessageTimestamp: lastMessages.find(obj1 => obj1.id.includes(obj2.id)).lastMessageTimestamp};
        }
        return obj2;
      });
      setCompleteMessages(updatedArray2.filter((e) => e.lastMessageTimestamp != undefined).slice().sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp));
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }, [lastMessages])
    async function deleteMessageNotifications (item) {
      
    }
    useEffect(() => {
        if (specificSearch.length > 0) {
      setSearching(true)
      setMoreResultButton(false)
      setMoreResults(false)
      const temp = specificSearch.toLowerCase()
      const tempList = Array.from(new Set(searches.map(JSON.stringify))).map(JSON.parse).filter(item => {
        if (item.searchusername.toLowerCase().match(temp)) {
          return item
        } 
      })
      if (tempList.length > 3) {
        setMoreResultButton(true)
      }
      setFiltered(tempList)
    }
    else {
      setFiltered([])
    }
    }, [searches])
    useMemo(() => {
    if (specificSearch.length > 0) {
      console.log(specificSearch)
      setSearches([])
      const getData = async() => {
        const firstQ = query(collection(db, "profiles", user.uid, 'friends'), orderBy('searchusername'), startAt(specificSearch.toLowerCase()), endAt(specificSearch.toLowerCase() + '\uf8ff'));
        const firstQuerySnapshot = await getDocs(firstQ)
        firstQuerySnapshot.forEach(async(document) => {
          const docSnap = await getDoc(doc(db, 'profiles', document.id))
          if (docSnap.exists()) {
          setSearches(prevState => [...prevState, {id: docSnap.id, ...docSnap.data()}])
          }
        })
      }
      
      getData();
    } 
  }, [specificSearch])
const MessageItem = ({item, index}) => (
  <div className='cursor-pointer' style={styles.chatContainer} onClick={() => {deleteMessageNotifications(item); setFocusedItem(item)}}>
              {item.pfp ? <img src={item.pfp} style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}}/> :
             <UserCircleIcon className='userBtn' style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}}/>
              }
                
                 <div style={{paddingLeft: 7.5, width: '75%'}}>
                    <p className='numberofLines1' style={{color: '#fff', fontSize: 15.36,
        paddingTop: 5,
        fontWeight: '700'}}>{item.firstName} {item.lastName}</p>
                    {filteredGroup.length > 0 ? <p numberOfLines={1} style={{color: '#fff', fontSize: 15.36,
        paddingBottom: 5,}}>{item.userName}</p> : 
                    <p className='numberofLines1' style={{color: '#fff', fontSize: 15.36,
        paddingBottom: 5,}}>{item.lastMessage == undefined ? 'Start the Conversation!' : item.lastMessage.userSent != undefined ?
                    `Sent a profile`: item.lastMessage.post != undefined ? item.lastMessage.post.group != undefined ? 'Sent a Cliq' : `Sent a post by ${item.lastMessage.userName}` 
                    :  item.lastMessage.theme != undefined ? `Sent a theme` :
                     item.lastMessage.image != undefined ? 'Sent a photo' : 
                    item.lastMessage.image && item.lastMessage.text.length > 0 ? item.lastMessage.text : item.lastMessage.text}</p>}
                </div>
                <div style={{flexDirection: 'column', marginLeft: 'auto', width: 100}}>
                  <p style={{fontSize: 12.29, paddingBottom: 5, color: '#fff'}}>{getDateAndTime(item.lastMessageTimestamp)}</p>
                {
                  messageNotifications.length > 0 ?
                  messageNotifications.filter((element) => element.id == item.messageId).length > 0 ? 
                  <div>
                    <ChatBubbleLeftRightIcon className='btn ml-10'/>
                </div> : 
                 <div>
                 <ChatBubbleLeftIcon className='btn ml-10'/>
                </div> :
                <div>
                 <ChatBubbleLeftIcon className='btn ml-10'/>
                </div> 
                }
                </div>
                
                
            </div>
)
const SendingMessageItem = ({item, index}) => (
  <div className='cursor-pointer' style={{backgroundColor: '#121212', borderRadius: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#d3d3d3",
        padding: 10,
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center'}} onClick={() => renderChecked(item)}>
                {item.pfp ? <img src={item.pfp} style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}}/> :
              <UserCircleIcon className='userBtn' style={{height: 45, width: 45, borderRadius: 8, borderWidth: 1.5}}/>
              }
                 <div style={{paddingLeft: 7.5, width: '75%'}}>
                    <p className='numberofLines1' style={{color: '#fff', fontSize: 15.36,
        paddingTop: 5,
        fontWeight: '700'}}>{item.firstName} {item.lastName}</p>
                    <p className='numberofLines1' style={{color: '#fff', fontSize: 15.36,
        paddingBottom: 5,}}>{item.userName}</p>
                </div>
                {item.checked ? <div style={{marginRight: '10%'}}>
                    <ArrowRightEndOnRectangleIcon className='btn'/>
                </div> : <div style={{marginRight: '10%'}}>
                 <ChatBubbleLeftIcon className='btn'/>
                </div>}
           </div>
)
  return (
    <div className='flex-row flex'>
    <div>
      <div>
      {loading && completeMessages.length == 0 ?  <div style={{alignItems: 'center', flex: 1, display: 'flex', justifyContent: 'center'}}>
         <BeatLoader color="#9edaff" />
        </div> : friendsInfo.filter(obj => completeMessages.some(otherObj => otherObj.id === obj.id)).length > 0 ?
      <>
      {friendsInfo.filter(obj => completeMessages.some(otherObj => otherObj.id === obj.id)).length > 0 ? 
          <div style={{marginVertical: '5%', marginLeft: '11%', width: '100%'}}>
            <div className='cursor-pointer' style={{width: '100%', marginTop: '2.5%', marginBottom: '2.5%', zIndex: 0}}>
            <UserSearchBar searching={searching} noSearchInput={() => setSearching(false)} openSearching={() => setSearching(true)} closeSearching={() => setSearching(false)}/>     
            </div>
              
          </div>
      : null}
        {!searching ? <div style={focusedItem ? {width: '123.25%'} : {width: '100%'}}>
            {filteredGroup.length > 0 ? 
            <ul style={{height: '50%'}}
                  > 
                  {filteredGroup.map((item, index) => {
                    return (
          !routeSending ? 
            <MessageItem index={index} item={item}/>
          : 
           <SendingMessageItem index={index} item={item}/>
        )
                  })}
                  </ul> :
            completeMessages.length > 0 ?
            <ul
                  > 
                  {completeMessages.map((item, index) => {
                    return (
          !routeSending ? 
          <MessageItem index={index} item={item} />
          : 
           <SendingMessageItem index={index} item={item}/>
        )
                  })}
                  </ul> : null
            }
            {loading ? 
            <div>
         <BeatLoader color="#9edaff" />
        </div> : null
            }

            
            
        </div> : null}
      </> : !loading && friendsInfo.filter(obj => completeMessages.some(otherObj => otherObj.id === obj.id)).length == 0 ? 
      <div style={{justifyContent: 'center', flex: 1, display: 'flex', marginBottom: '40%', alignItems: 'center'}}>
        <p style={{color: '#fff', fontSize: 19.20,
    padding: 10,
    textAlign: 'center'}}>Sorry no Friends to Chat With</p>
        <FaceFrownIcon className='userBtn'/>
      </div> : null}
       : <>
      {loading &&!lastVisible ?  <div style={{justifyContent: 'flex-end', flex: 1, display: 'flex',}}>
          <BeatLoader color="#9edaff" />
        </div> :
      null}
          </>  
      </div>
       
      </div>
          {focusedItem ? <PersonalChat firstName={focusedItem.firstName} userName={focusedItem.username} id={focusedItem.id} lastName={focusedItem.lastName} pfp={focusedItem.pfp} friendId={completeFriends.filter((element) => element.id.includes(focusedItem.id))[0].id}/> : null}
              
    </div>
  )
}

export default Chat