import { useAuth } from '@/context/AuthContext';
import React from 'react'
import {useState, useEffect, useRef} from 'react'
import { BeatLoader } from 'react-spinners';
import { onSnapshot, getDoc, doc, getDocs, updateDoc, query, collection, arrayUnion, where, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import {HeartIcon as SolidHeart, UserCircleIcon } from '@heroicons/react/24/solid';
import { PhotoIcon} from '@heroicons/react/24/outline';
import { styles } from '@/styles/styles';
import { activeFunction, fetchMessages } from '@/firebaseUtils';
import getDateAndTime from '@/lib/getDateAndTime';
import CopyModal from '@/components/CopyModal';
function PersonalChat({firstName, lastName, pfp, friendId, id, notificationToken}) {
    const [newMessages, setNewMessages] = useState([]);
    const chatContainerRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null);
    const [lastMessageId, setLastMessageId] = useState('');
    const [inputText, setInputText] = useState('');
    const [lastVisible, setLastVisible] = useState(null);
    const [active, setActive] = useState();
    const [reportedContent, setReportedContent] = useState([]);
    const [singleMessageLoading, setSingleMessageLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const {user} = useAuth();
    const [readBy, setReadBy] = useState([]);
    function toggleCopyToTrue(e) {
      const updatedArray = newMessages.map(item => {
        if (item.id === e.id) {
          // Update the "isActive" property from false to true
          return { ...item, copyModal: true, saveModal: false};
        }
          return item;
      });
      setNewMessages(updatedArray) 
    }
  const sendMessage = async() => {
    if (active && inputText.trim() !== '') {
    if (inputText.trim() === '') {
      return;
    }
    const newMessage = {
      text: inputText,
    };
    try {
      setSingleMessageLoading(true)
      schedulePushTextNotification(id, firstName, lastName, newMessage, notificationToken)
      const messageDetails = {
        friendId: friendId, // ID of the friends
        newMessage, // The message text
        id: id, // ID of the recipient
        userId: user.uid, // ID of the sender
        firstName: firstName, // Sender's first name
        lastName: lastName, // Sender's last name
        pfp: pfp // Sender's profile picture
      };
      await sendMessage(messageDetails);
      setInputText('');
      setSingleMessageLoading(false)
      console.log('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
    }
    
  }
  else if (!active && inputText.trim() !== 0) {
    window.alert('You must both be following each other first (mutual friends) in order to message!')
  }
}
    function handleMessagePress(item) {
    setTapCount(tapCount + 1);
    if (tapCount === 0) {
      // Set a timer for the second tap
      timerRef.current = setTimeout(() => {
        // If no second tap occurs within the timer, treat it as a single tap
        setTapCount(0);
      }, 500); // Adjust the time limit according to your requirements
    } 
    else if (tapCount === 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      // If it's the second tap and the timer is still active, treat it as a double tap
      clearTimeout(timerRef.current);
      setTapCount(0);
      renderLiked(item)
    }
  }
  function handlePostPress(item) {
    setTapCount(tapCount + 1);
    if (tapCount === 0) {
      // Set a timer for the second tap
      timerRef.current = setTimeout(() => {
        // If no second tap occurs within the timer, treat it as a single tap
        setTapCount(0);
        if (!item.message.post.repost && !item.message.post.post[0].video) {
          navigation.navigate('Post', {post: item.message.post.id, requests: requests, name: item.message.post.userId, groupId: null, video: false})
        }
        else if (!item.message.post.repost && item.message.post.post[0].video) {
          navigation.navigate('Post', {post: item.message.post.id, requests: requests, name: item.message.post.userId, groupId: null, video: true})
        }
        else {
          navigation.navigate('Repost', {post: item.message.post.id, requests: requests, name: item.message.post.userId, groupId: null, video: false})
        }
      }, 500); // Adjust the time limit according to your requirements
    } else if (tapCount === 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      // If it's the second tap and the timer is still active, treat it as a double tap
      clearTimeout(timerRef.current);
      setTapCount(0);
      renderLiked(item)
    }
  }
    /* useEffect(() => {
      const unsub = activeFunction(friendId, setActive);
      return unsub;
    }, [onSnapshot, friendId]); */
    useEffect(() => {
    let unsub;
    const queryData = async() => {
      unsub = onSnapshot(doc(db, 'friends', friendId), async(doc) => {
          setLastMessageId(doc.data().messageId)
          setReadBy(doc.data().readBy)
      });
      await updateDoc(doc(db, 'friends', friendId), {
        readBy: arrayUnion(user.uid)
      }).then(async() => await updateDoc(doc(db, 'profiles', user.uid), {
        messageNotifications: []
      }))
      const querySnapshot = await getDocs(collection(db, 'friends', friendId, 'messageNotifications'));
      querySnapshot.forEach(async(document) => {
        if (document.data().toUser == user.uid) {
        await deleteDoc(doc(db, 'friends', friendId, 'messageNotifications', document.id)).then(async() => {
          await updateDoc(doc(db, 'friends', friendId), {
            toUser: null
          })
        })
        }
      })
    } 
    queryData()
    return unsub;
  }, [])
    const renderLiked = async(actualId) => {
      if (actualId.liked == true) {
        await updateDoc(doc(db, 'friends', friendId, 'chats', actualId.id), {
        liked: false
      }).then(() => {
        const updatedArray = newMessages.map((item) => {
        if (item.id === actualId.id) {
          return { ...item, liked: false };
        }
        return item;
      });
        setNewMessages(updatedArray) 
      })
      }
      else {
        await updateDoc(doc(db, 'friends', friendId, 'chats', actualId.id), {
        liked: true
      }).then(() => {
        const updatedArray = newMessages.map((item) => {
        if (item.id === actualId.id) {
          return { ...item, liked: true };
        }
        return item;
      });
        setNewMessages(updatedArray) 
      }).then(actualId.user != user.uid ? () => schedulePushLikedMessageNotification(person.id, firstName, lastName, person.notificationToken) : null)
      
      }
    }
    function toggleSaveToTrue(e) {
      const updatedArray = newMessages.map(item => {
        if (item.id === e.id) {
          return { ...item, copyModal: false, saveModal: true };
        }
        return item;
      });
      setNewMessages(updatedArray) 
    }
    function handleThemePress(item) {
      setTapCount(tapCount + 1);
      if (tapCount === 0) {
        // Set a timer for the second tap
        timerRef.current = setTimeout(() => {
          // If no second tap occurs within the timer, treat it as a single tap
          setTapCount(0);
          if (item.message.theme.free) {
            navigation.navigate('SpecificTheme', {productId: item.message.theme.id, free: true, purchased: false})
          } 
        }, 300); // Adjust the time limit according to your requirements
      } else if (tapCount === 1) {
        clearTimeout(timerRef.current);
        setTapCount(0);
        renderLiked(item)
      }
    }
    function handleImagePress(item) {
      setTapCount(tapCount + 1);
      if (tapCount === 0) {
        // Set a timer for the second tap
        timerRef.current = setTimeout(() => {
          // If no second tap occurs within the timer, treat it as a single tap
          setTapCount(0);
          setSelectedImage(item.message.image)
          setImageModal(true)
        }, 300); // Adjust the time limit according to your requirements
      } else if (tapCount === 1) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        // If it's the second tap and the timer is still active, treat it as a double tap
        clearTimeout(timerRef.current);
        setTapCount(0);
        renderLiked(item)
      }
    }
  useEffect(() => {
    let unsubscribe;

    if (friendId) {
      // Call the utility function and pass state setters as callbacks
      unsubscribe = fetchMessages(friendId, setMessages, setLastVisible);
    }

    // Clean up the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        return unsubscribe;
      }
    };
  }, [friendId])
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = 0;
    }
  }, []);
  useEffect(() => {
    if (messages.length > 0) {
      const newArray = [...messages];
      messages.map((item, index) => {
        if (item) {
          if (item.message.post != undefined) {
            if (item.message.post.group != undefined) {
              const getData = async() => {
                newArray[index].message.post = newArray[index].message.post
                setNewMessages(newArray)       
              }
              getData()
            }
            if (item.message.post.group == undefined && item.message.post) {
              console.log(item.message.post)
              const getData = async() => {
                const docSnap = await getDoc(doc(db, 'posts', item.message.post.id))
                if (docSnap.exists()) {
                  newArray[index].message.post = docSnap.data()
                  setNewMessages(newArray)
                }
                else {
                  newArray[index].message.post = null
                  setNewMessages(newArray)
                }
              }
              getData()
            }
          }
          else if (item.message.theme != undefined) {
            const getData = async() => {
              const themeRef = collection(db, 'products')
              const q = query(themeRef, where('images', 'array-contains', item.message.theme.images[0]))
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc) => {
                if (doc.exists()) {
                  newArray[index].message.theme = {...item, id: doc.id, ...doc.data(), purchased: true, free: false}
                  setNewMessages(newArray)
                }
                else {
                  newArray[index].message.theme == null
                  setNewMessages(newArray)
                }
              })
              const freeThemeRef = collection(db, 'freeThemes')
              const freeQ = query(freeThemeRef, where('images', 'array-contains', item.message.theme.images[0]))
              const freeQuerySnapshot = await getDocs(freeQ);
              freeQuerySnapshot.forEach((doc) => {
                if (doc.exists()) {
                  newArray[index].message.theme = {...item, id: doc.id, ...doc.data(), free: true, purchased: false}
                  setNewMessages(newArray)
                }
              }) 
            }
            getData()
          }
          else {
            setNewMessages(newArray)
          }
        }
      })
    }
  }, [messages])
  return (
    <div className='flex flex-col h-screen' style={{marginLeft: '26%'}}>
      {newMessages.length >= 0 ? 
        <div className='chatHeader' style={{display: 'flex'}}>
          {pfp ? <img src={pfp} style={styles.searchPfp}/> :
            <UserCircleIcon className='pfpBtn' style={styles.searchPfp}/>
          }
          <p className='min-w-full' style={styles.chatName}>{firstName} {lastName}</p>
        </div>
      : null}
      <div className='divider chat-header' style={{marginLeft: '-2.5%'}}/>
      <div className=' flex mr-16 overflow-y-auto flex-grow flex-col-reverse' ref={chatContainerRef}>
      {newMessages.length > 0 ? 
        newMessages.sort((a, b) => b.timestamp - a.timestamp).map((item, index) => {
          return (    
            item.message.theme!= undefined ? 
              item.message.theme== null ? 
                <div style={item.user == user.uid ? styles.userNewMessage : styles.newMessage}>
                  {item.user != user.uid && (
                    pfp ? <img src={pfp} style={styles.profileImage} /> : <UserCircleIcon className='userBtn' style={styles.profileImage} />
                  )}
                  <div style={item.user == user.uid ? styles.userBubbleStyle : styles.bubbleStyle}>
                    <p style={item.user == user.uid ? {...styles.postUsername, ...{color: "#121212"}} : {...styles.postUsername, ...{color: "#fafafa"}}}>Theme unavailable</p>
                    <div style={item.user != user.uid ? {...styles.timestampContainer, ...styles.userTimestampContainer} : styles.timestampContainer}>
                      {getDateAndTime(item.timestamp) ?  <p style={item.user == user.uid ? styles.userTimestamp : styles.timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
                    </div>
                  </div>
                  {lastMessageId == item.id && readBy.includes(item.toUser) && item.user == user.uid && <p style={styles.readReceipt}>Read</p>}
              </div> 
              :
              
              <div style={item.user == user.uid ? styles.userNewMessage: styles.newMessage}>
                {item.user != user.uid && ( pfp ? <img src={pfp} style={styles.profileImage} /> 
                  : <UserCircleIcon className='userBtn' style={styles.profileImage} />
                )}
                <div style={styles.postContainer}>
                  <button onClick={() => handleThemePress(item)} onLongPress={() => toggleSaveToTrue(item)}>
                  <div style={styles.repostButtonContainer}>
                    <div style={styles.chatThemeName}>
                      <p style={item.user == user.uid ? {...styles.postUsername, ...{color: "#121212"}} : {...styles.postUsername, ...{color: "#fafafa"}}}>Theme: {item.message.theme.name}</p>
                    </div>
                  </div>
                  <div style={{ marginTop: '5%'}}>
                    {item.message.theme.images[0] ?  
                      <img src={item.message.theme.images[0]} style={styles.personalChatImage}/> :
                      <PhotoIcon className='btn' style={styles.personalChatImage}/>
                    }
                </div>
              </button>
              <div style={item.user != user.uid ? {...styles.timestampContainer, ...styles.userTimestampContainer} : styles.timestampContainer}>
                {getDateAndTime(item.timestamp) ? <p style={item.user == user.uid ? styles.userTimestamp : styles.timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
              </div>
                
              <button style={item.user == user.uid ? styles.userLikeButton : styles.likeButton} onClick={item.user != user.uid ? () => renderLiked(item) : null}>
                {item.liked ? <SolidHeart className='btn' style={{color: 'red'}} /> : <SolidHeart className='btn' style={{color: 'grey'}} />}
              </button>
              </div>
              {item.message.text.length > 0 ? 
              <div style={item.user == user.uid ? styles.userNewMessage: styles.newMessage}>
                  {item.user != user.uid && (pfp ? <img src={pfp} style={styles.profileImage} /> 
                    : <UserCircleIcon className='userBtn' style={styles.profileImage} />
                  )}
                <div style={item.user == user.uid ? styles.userBubbleStyle : styles.bubbleStyle}>
                  <button onClick={() => handleMessagePress(item)} onLongPress={() => {toggleCopyToTrue(item)}}>
                    {item.message.text !== "" ?
                      <p style={item.user == user.uid ? styles.userText : styles.text}>{item.message.text}</p>
                    : null}
                  </button> 
                  <div style={item.user != user.uid ? {...styles.timestampContainer, ...styles.userTimestampContainer} : styles.timestampContainer}>
                      {getDateAndTime(item.timestamp) ?  
                        <p style={item.user == user.uid ? styles.userTimestamp : styles.timestamp}>{getDateAndTime(item.timestamp)}</p> 
                      : null}
                    </div>
                    <button style={item.user == user.uid ? styles.userLikeButton : styles.likeButton} onClick={item.user != user.uid ? () => renderLiked(item) : null}>
                      {item.liked ? <SolidHeart className='btn' style={{color: 'red'}} /> : <SolidHeart className='btn' style={{color: 'grey'}} />}
                    </button>
                </div> 
              </div>
              : null}
              {(item.saveModal && item.user == user.uid) || (item.saveModal && !reportedContent.includes(item.id)) ?  
                <CopyModal item={item} userId={user.uid} reportedContent={reportedContent} copy={false}/>
            : null}
            {lastMessageId == item.id && readBy.includes(item.toUser) && item.user == user.uid && <p style={styles.readReceipt}>Read</p>}
              </div>
              : item.message.post == undefined && item.message.text !== "" ? 
              <div>
                {item.message.text != undefined ?
                <div style={ item.user == user.uid ? styles.userTextMessage : styles.newMessage}>
                  <div style={item.user == user.uid ? {alignSelf: 'flex-end'}: styles.newMessage}>
                    {item.user != user.uid && (pfp ? <img src={pfp} style={styles.profileImage} /> 
                      : <UserCircleIcon className='userBtn' style={styles.profileImage} />
                    )}
                    <div style={item.user == user.uid ? styles.userBubbleStyle : styles.bubbleStyle}>
                      <button style={{alignItems: 'flex-end'}} onClick={() => handleMessagePress(item)}
                        onLongPress={() => {toggleCopyToTrue(item);}}>
                        {item.message.text !== "" ?
                          <p style={item.user == user.uid ? styles.userText : styles.text}>{item.message.text}</p>
                        : null}
                      </button> 
                      <div className='flex'>
                        <div style={item.user != user.uid ? {...styles.timestampContainer, ...styles.userTimestampContainer} : styles.timestampContainer}>
                          {getDateAndTime(item.timestamp) ? <p style={item.user == user.uid ? styles.userTimestamp : styles.timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
                        </div>
                        <button style={item.user == user.uid ? styles.userLikeButton : styles.likeButton} onClick={item.user != user.uid ? () => renderLiked(item) : null}>
                          {item.liked ? <SolidHeart className='btn' style={{color: 'red'}} /> : <SolidHeart className='btn' style={{color: 'grey'}} />}
                        </button>
                      </div>
                    </div>
                    {lastMessageId == item.id && readBy.includes(item.toUser) && item.user == user.uid && <p style={styles.readReceipt}>Read</p>}
                  </div>
                </div> : null}
                {item.copyModal ?
                  <CopyModal copy={true} userId={user.uid} item={item} reportedContent={reportedContent}/> :
                  <div style={{margin: '2.5%'}}>
                    <button activeOpacity={1}  onClick={() => handleImagePress(item)} onLongPress={() => {toggleSaveToTrue(item);}}>
                      {item.message.image != undefined ? 
                        <div style={item.user == user.uid ? styles.userNewMessage: styles.newMessage}>
                          {item.user != user.uid && (pfp ? <img src={pfp} style={styles.profileImage} /> 
                            : <UserCircleIcon className='userBtn' style={styles.profileImage} />
                          )}
                          <img src={item.message.image} style={styles.regImage}/>
                          {lastMessageId == item.id && readBy.includes(item.toUser) && item.user == user.uid && <p style={styles.readReceipt}>Read</p>}
                          {(item.saveModal && item.user == user.uid) || (item.saveModal && !reportedContent.includes(item.id)) ?  
                            <CopyModal copy={false} userId={user.uid} item={item} reportedContent={reportedContent}/>
                        : null}
                        </div>
                      : null}
                    </button>
                  </div>}
              </div> : item.message.post != undefined && item.message.post == null ? 
              <div style={item.user == user.uid ? styles.userNewMessage: styles.newMessage}>
                {item.user != user.uid && (pfp ? <img src={pfp} style={styles.profileImage} /> 
                  : <UserCircleIcon className='userBtn' style={styles.profileImage} />
                )}
                <div style={item.user == user.uid ? styles.userBubbleStyle : styles.bubbleStyle}>
                  <p style={item.user == user.uid ? {...styles.postUsername, ...{color: "#121212"}} : {...styles.postUsername, ...{color: "#fafafa"}}}>Post unavailable</p>
                  <div style={item.user != user.uid ? {...styles.timestampContainer, ...styles.userTimestampContainer} : styles.timestampContainer}>
                    {getDateAndTime(item.timestamp) ? <p style={item.user == user.uid ? styles.userTimestamp : styles.timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
                  </div>
                </div>
                {lastMessageId == item.id && readBy.includes(item.toUser) && item.user == user.uid && <p style={styles.readReceipt}>Read</p>}
              </div> : item.message.post != undefined && item.message.post.multiPost == true  ? 
            <div style={styles.flexColumn}>
              <div style={item.user == user.uid ? styles.userNewMessage: styles.newMessage}>
                {item.user != user.uid && (pfp ? <img src={pfp} style={styles.profileImage} /> 
                  : <UserCircleIcon className='userBtn' style={styles.profileImage} />
                )}
                <div style={styles.postContainer}>
                  <button onClick={() => handlePostPress(item)} onLongPress={() => toggleSaveToTrue(item)}>
                    <div style={{display: 'flex',}}>
                      {item.message.post.pfp ? <img src={item.message.post.pfp} style={styles.imagepfp}/> :
                        <UserCircleIcon className='userBtn' style={styles.imagepfp}/>
                      }
                      <p style={item.user == user.uid ? {...styles.postUsername, ...{color: "#121212"}} : {...styles.postUsername, ...{color: "#fafafa"}}}>@{item.message.post.username}</p>
                    </div>
                    {item.message.post.post[0].image ?
                      <img src={item.message.post.post[0].post} style={styles.personalChatImage}/> : item.message.post.post[0].video ?
                      <img src={item.message.post.post[0].thumbnail} style={styles.personalChatImage}/> : 
                      <div style={{marginTop: -5}}>
                        {/* <ChatBubble bubbleColor='#fff' tailColor='#fff'>
                          <p style={styles.personalChatImage}>{item.message.post.post[0].value}</p>
                        </ChatBubble> */}
                      </div>}
                    {item.message.post.caption.length > 0 ? 
                      <div style={{width: '90%'}}>
                        <p className='numberofLines1' style={item.user == user.uid ? {...styles.captionText, ...{color: "#121212"}}
                          : {...styles.captionText, ...{color: "#fafafa"}}}>{item.message.post.username} - {item.message.post.caption}</p> 
                      </div>
                    : null}
                  </button> 
                  <div style={item.user != user.uid ? {...styles.timestampContainer, ...styles.userTimestampContainer} : styles.timestampContainer}>
                    {getDateAndTime(item.timestamp) ?  <p style={item.user == user.uid ? styles.userTimestamp : styles.timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
                  </div>
                  <button style={item.user == user.uid ? styles.userLikeButton : styles.likeButton} onClick={item.user != user.uid ? () => renderLiked(item) : null}>
                    {item.liked ? <SolidHeart className='btn' style={{color: 'red'}} /> : <SolidHeart className='btn' style={{color: 'grey'}} />}
                  </button>
                </div>
              </div>
              {item.message.text.length > 0 ? 
              <div style={item.user == user.uid ? styles.userNewMessage: styles.newMessage}>
                {item.user != user.uid && (pfp ? <img src={pfp} style={styles.profileImage} /> 
                  : <UserCircleIcon className='userBtn' style={styles.profileImage} />
                )}
                <div style={item.user == user.uid ? styles.userBubbleStyle : styles.bubbleStyle}>
                  <button onClick={() => handleMessagePress(item)} onLongPress={() => {toggleCopyToTrue(item)}}>
                    {item.message.text !== "" ?
                      <p  style={item.user == user.uid ? styles.userText : styles.text}>{item.message.text}</p>
                    : null}
                  </button> 
                  <div style={item.user != user.uid ? {...styles.timestampContainer, ...styles.userTimestampContainer} : styles.timestampContainer}>
                    {getDateAndTime(item.timestamp) ?  <p style={item.user == user.uid ? styles.userTimestamp : styles.timestamp}>{getDateAndTime(item.timestamp)}</p> : null}
                  </div>
                  <button style={item.user == user.uid ? styles.userLikeButton : styles.likeButton} onClick={item.user != user.uid ? () => renderLiked(item) : null}>
                    {item.liked ? <SolidHeart className='btn' style={{color: 'red'}} /> : <SolidHeart className='btn' style={{color: 'grey'}} />}
                  </button>
                </div> 
              </div>
              : null}
              {(item.saveModal && item.user == user.uid) || (item.saveModal && !reportedContent.includes(item.id)) ?  
                <CopyModal copy={false} userId={user.uid} item={item} reportedContent={reportedContent}/>
              : null}
              {lastMessageId == item.id && readBy.includes(item.toUser) && item.user == user.uid && <p style={styles.readReceipt}>Read</p>}
            </div> 
            : null)
        }) : null} 
      </div>
      {!uploading ? 
        <div style={newMessages.length == 0 ? styles.personalChatInputContainer : styles.personalChatInputMessageContainer}>
          <div style={inputText.length > 0 ? {...styles.personalChatInput, width: '80%'} : styles.personalChatInput}>
            <input maxLength={200} ref={inputRef} style={styles.personalChatSendInput} placeholder='Type message...' value={inputText} 
              onChange={async(event) => {
                const text = event.target.value
                const sanitizedText = text.replace(/\n/g, ''); // Remove all new line characters
                setInputText(sanitizedText); 
                if (text.length > 0) {
                  await updateDoc(doc(db, 'profiles', user.uid), {
                    messageTyping: id
                  })
                }
                else {
                  await updateDoc(doc(db, 'profiles', user.uid), {
                    messageTyping: ''
                  })
                }
              }}
            />
            {inputText.length == 0 ? 
            <>
              <PhotoIcon className='btn' style={styles.photoIcon} />
            </> 
            : null }
          </div>
          {!singleMessageLoading || !uploading ?
            inputText.length > 0 ? 
            <button style={styles.chatSendButton} onClick={() => sendMessage()}>
              <span className='text-white font-bold'>Send</span>
            </button> : null : 
            <div style={{ flex: 1, alignItems: 'center', marginTop: '2.5%'}}>
              <BeatLoader style={{alignSelf: 'center'}} color='#9edaff'/>
            </div>}
          </div> 
        :  <BeatLoader color={"#9edaff"}/>}
    </div>
  )
}

export default PersonalChat