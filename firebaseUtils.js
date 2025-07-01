import { db } from '@/firebase'
import { getDoc, doc, collection, where, onSnapshot, setDoc, getDocs, startAfter, arrayUnion, serverTimestamp, documentId, updateDoc, 
  arrayRemove, increment, orderBy, limit, startAt, endAt, query, getCountFromServer, addDoc, Timestamp,
  writeBatch} from 'firebase/firestore';
import { schedulePushLikeNotification } from './notificationFunctions';
import { getAuth, signOut } from 'firebase/auth';
import { linkUsernameAlert, profanityUsernameAlert } from './lib/alert';
import { schedulePushCommentNotification } from './notificationFunctions';
const TEXT_MODERATION_URL='https://api.sightengine.com/1.0/text/check.json'
const auth = getAuth();
/**
 * Applies theme to a user's Posts, Profiles or Both
 * @param {string} posts - If Posts is true, apply to Posts.
 * @param {string} profile - If Profile is true, apply to Profile.
 * @param {string} both - If Both is true, apply to Both.
 * @param {string} userId - The id of the user.
 * @param {Object} chosenTheme - The Theme being applied.
*/
export const applyUseTheme = async(posts, profile, both, userId, chosenTheme, setApplyLoading, setUseThemeModalLoading, setPostDoneApplying, setProfileDoneApplying, 
  setBothDoneApplying) => {
    if (posts) {
      await updateDoc(doc(db, 'profiles', userId), {
        postBackground: chosenTheme.images[0],
        postBought: chosenTheme.selling != undefined && chosenTheme.selling == true ? true : chosenTheme.forSale != undefined && chosenTheme.forSale == true ? true : false,
        postBought: chosenTheme.selling != undefined && chosenTheme.selling == true ? true : chosenTheme.forSale != undefined && chosenTheme.forSale == true ? true : false,
      }).then(() => {setTimeout(() => {
        setApplyLoading(false); setUseThemeModalLoading(false); setPostDoneApplying(true);
      }, 1000); 
      })
    }
    else if (profile) {
      await updateDoc(doc(db, 'profiles', userId), {
        background: chosenTheme.images[0],
        forSale: chosenTheme.selling != undefined && chosenTheme.selling == true ? true : chosenTheme.forSale != undefined && chosenTheme.forSale == true ? true : false,
      }).then(() => { setTimeout(() => {
        setApplyLoading(false); setUseThemeModalLoading(false); setProfileDoneApplying(true)
      }, 1000);
      })
    }
    else if (both) {
      await updateDoc(doc(db, 'profiles', userId), {
        background: chosenTheme.images[0],
        postBackground: chosenTheme.images[0],
        postBought: chosenTheme.selling != undefined && chosenTheme.selling == true ? true : chosenTheme.forSale != undefined && chosenTheme.forSale == true ? true : false,
      }).then(() => {setTimeout(() => {
        setApplyLoading(false); setUseThemeModalLoading(false); setBothDoneApplying(true)
      }, 1000);
      })
    }
}
/**
 * Determines if user is active
 * @param {string} personId - id of user.
 * @returns {Promise<DocumentData>} - the data document of the user id to determine activity.
 * @throws {Error} - If `personId` is not provided.
*/
export const activePerson = async(personId) => {
  if (!personId) {
    throw new Error("personId is undefined")
  }
  const docSnap = await getDoc(doc(db, 'profiles', personId))
  return docSnap.data()
}
export const addNewCommentFunction = async(endpoint, username, comment, blockedUsers, pfp, notificationToken, userId, focusedPost, setComment, setSingleCommentLoading, 
  setReply, setComments, comments, actualData, handleData) => {
    console.log(endpoint)
   const response = await fetch(`http://localhost:4000/api/${endpoint}`, {
    method: 'POST', // Use appropriate HTTP method (GET, POST, etc.)
    headers: {
      'Content-Type': 'application/json', // Set content type as needed
    },
    body: JSON.stringify({ data: {newComment: comment, textModerationURL: TEXT_MODERATION_URL, blockedUsers: blockedUsers, pfp: pfp, 
      notificationToken: notificationToken, userId: userId, focusedPost: focusedPost, username: username}}), // Send data as needed
  })
  const data = await response.json();
  if (data.link) {
    linkUsernameAlert('Comment', () => {setComment(''); setSingleCommentLoading(false); setReply('')})
  }
  else if (data.profanity) {
    profanityUsernameAlert('Comment', () => {setComment(''); setSingleCommentLoading(false); setReply('')})
  }
  else if (data.done) {
    setComments([...comments, {id: data.docRef, comment: comment, showReply: false, loading: false,
      pfp: pfp,
      notificationToken: notificationToken,
      username: username,
      timestamp: Timestamp.fromDate(new Date()),
      likedBy: [],
      replies: [],
      user: userId,
      postId: focusedPost.id}])
    const updatedObject = { ...focusedPost };
    // Update the array in the copied object
    updatedObject.comments = updatedObject.comments + 1;
    const objectIndex = actualData.findIndex(obj => obj.id === focusedPost.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...actualData];
      updatedData[objectIndex] = updatedObject;
      // Set the new array as the state
      handleData(updatedData);
    }
    setComment('')
    setSingleCommentLoading(false)
    if (username != focusedPost.username) {
      schedulePushCommentNotification(focusedPost.userId, username, focusedPost.notificationToken, comment)
    }
    
  }
}
export const allowNotificationsFunction = async(userId, isEnabled, notificationToken, setIsEnabled) => {
  if (notificationToken != null) {
    await updateDoc(doc(db, 'profiles', userId), {
      allowNotifications: !isEnabled
    }).then(() => setIsEnabled(previousState => !previousState))
  }
}
export const privacyFunction = async(userId, privacyEnabled, setPrivacyEnabled) => {
  await updateDoc(doc(db, 'profiles', userId), {
    private: !privacyEnabled
  }).then(() => setPrivacyEnabled(previousState => !previousState))
}
export const statusFunction = async(userId, activityEnabled, setActivityEnabled) => {
  await updateDoc(doc(db, 'profiles', userId), {
    showStatus: !activityEnabled
  }).then(() => setActivityEnabled(previousState => !previousState))
}
export const sendReport = (userId, bugChecked, uxChecked, securityChecked, messagesChecked, notificationsChecked, themesChecked, postingChecked, 
  addingChecked, othersChecked, report, setSentReport) => {
  addDoc(collection(db, 'feedback'), {
    userId: userId,
    timestamp: serverTimestamp(),
    category: bugChecked ? 'Bugs/Errors' : uxChecked ? 'User Experience' : securityChecked ? 'Security' : messagesChecked ? 'Messages' 
    : notificationsChecked ? 'Notifications' : themesChecked ? 'Themes' : postingChecked ? 'Posting(Images, Videos, Vibes)' 
    : addingChecked ? 'Adding/Removing Friends' : othersChecked ? 'Other' : null,
    feedback: report
  }).then(() => setSentReport(true))
}
export const fetchSettingsContent = async(userId, collectionName) => {
  if (!userId) {
    throw new Error("Error: 'userId' or 'collectionName' is undefined.")
  }
  const first = query(collection(db, "profiles", userId, collectionName), orderBy('timestamp', 'desc'), limit(10));
  const querySnapshot = await getDocs(first);
  const posts = []
  querySnapshot.forEach(async(document) => {
    if (document.data().video) {
      const secondSnap = await getDoc(doc(db, 'videos', document.id));
      if (secondSnap.exists()) {
        posts.push({id: secondSnap.id, ...secondSnap.data()})
      }
    }
    else {
      const secondSnap = await getDoc(doc(db, 'posts', document.id));
      if (secondSnap.exists()) {
        posts.push({id: secondSnap.id, ...secondSnap.data()})
      }
    }
  });
  return {posts: posts, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1]}
}
export const unBlock = async(itemId, userId, posts, setPosts) => {
  if (!itemId || !userId) {
    throw new Error("Error: 'userId' or 'itemId' is undefined.")
  }
  try {
    const batch = writeBatch(db);
    const userRef = doc(db, 'profiles', userId);
    const itemRef = doc(db, 'profiles', itemId);
    batch.update(userRef, {blockedUsers: arrayRemove(itemId)})
    batch.update(itemRef, {usersThatBlocked: arrayRemove(userId)})
    await batch.commit();
    setPosts(posts.filter((e) => e.id != itemId))
  }
  catch (error) {
    console.error(error)
  }
} 
/**
 * Checks if a post can be shared
 * @param {string} itemId - The id of the post to check.
 * @returns {Promise<boolean>} - True if the id exists, false otherwise.
 * @throws {Error} - If `itemId` is not provided.
*/
export const ableToShareFunction = async (itemId) => {
    if (!itemId) {
        throw new Error("Error: 'itemId' is undefined.");
    }
    const docRef = doc(db, 'posts', itemId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
}
/**
 * Checks if a video can be shared
 * @param {string} itemId - The id of the video to check.
 * @returns {Promise<boolean>} - True if the id exists, false otherwise.
 * @throws {Error} - If `itemId` is not provided.
*/
export const ableToShareVideoFunction = async (itemId) => {
    if (!itemId) {
      throw new Error("Error: 'itemId' is undefined.");
    }
    const docRef = doc(db, 'videos', itemId);
    const docSnap = await getDoc(docRef);
    
    return docSnap.exists();
}
/**
 * Checks if a friend can be messaged (friends are mutual)
 * @param {string} friendId - The id of the friends to check.
 * @param {function} callback - A callback function that receives the "active" status of the friend.
 * @returns {function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `friendId` is not provided.
*/
export const activeFunction = async (friendId, callback) => {
  if (!friendId) {
    throw new Error("Error: 'friendId' is undefined.");
  }
  return onSnapshot(doc(db, "friends", friendId), (document) => {
    callback(document.data().active);
  });
}
/**
 * Gets requests where user requested to follow/friend another user
 * @param {string} userId - The id of the user to check.
 * @param {function} callback - A callback function that receives the list of requests a user has
 * @returns {function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `userId` is not provided.
*/
export const getRequests = async (userId, callback) => {
  if (!userId) {
      throw new Error("Error: 'userId' is undefined.");
  }
  const q = query(
    collection(db, 'profiles', userId, 'requests'),
    where('actualRequest', '==', true)
  );
  const unsub = onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(requests);
  });
  return unsub;
}
/**
 * Gets non-message notifications for user
 * @param {string} userId - The id of the user to check.
 * @param {function} callback - A callback function that receives the list of non-message notifications a user has
 * @returns {function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `userId` is not provided.
*/
export const getNonMessageNotifications = async (userId, callback) => {
  if (!userId) {
    throw new Error("userId is undefined");
  }
  const q = query(collection(db, "profiles", userId, 'checkNotifications'));
  const unsub = onSnapshot(q, (snapshot) => {
    const nonMessageNotifications = snapshot.docs.map((doc) => ({
      ...doc.id,
    }));
    callback(nonMessageNotifications);
  });
  return unsub;
}
/**
 * Gets message notifications for user
 * @param {string} userId - The id of the user to check.
 * @param {function} callback - A callback function that receives the list of message notifications a user has
 * @returns {function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `userId` is not provided.
*/
export const getMessageNotifications = async (userId, callback) => {
  if (!userId) {
    throw new Error("userId is undefined");
  }
  const q = query(collection(db, 'friends'), where('toUser', '==', userId))
  const unsub = onSnapshot(q, (snapshot) => {
    const messageNotifications = snapshot.docs.map((doc) => ({
      id: doc.data().messageId,
    }));
    callback(messageNotifications);
  });
  return unsub;
}
/**
 * Removes a saved video from the user's saved list and updates both the local state and Firestore database.
 * @param {Object} item - The video object to be removed.
 * @param {Object} user - The user object performing the action.
 * @param {Array} tempPosts - The current array of posts displayed in the video feed.
 * @param {function} setTempPosts - State setter function for updating `tempPosts` after the item is removed.
 * @throws {Error} - If `item` or `user` is undefined.
 * @returns {Promise<void>} - A promise that resolves when the Firestore update is complete.
*/
export const removeHomeSaveVideoFunction = async (item, user, tempPosts, setTempPosts) => {
  if (!item || !user) {
    throw new Error("Error: 'item' or 'user' is undefined.");
  }
  const updatedObject = { ...item };
  updatedObject.savedBy = item.savedBy.filter((e) => e != user.uid)
  const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
  if (objectIndex !== -1) {
    const updatedData = [...tempPosts];
    updatedData[objectIndex] = updatedObject;
    setTempPosts(updatedData);
  }
  try {
    await updateDoc(doc(db, 'videos', item.id), {
      savedBy: arrayRemove(user.uid)
    })
    await deleteDoc(doc(db, 'profiles', user.uid, 'saves', item.id))
  } 
  catch (e) {
    console.error("Error updating document:", e);
  }
}
/**
 * Removes a saved post from the user's saved list and updates both the local state and Firestore database.
 * @param {Object} item - The post object to be removed.
 * @param {Object} user - The user object performing the action.
 * @param {Array} tempPosts - The current array of posts displayed in the home feed.
 * @param {function} setTempPosts - State setter function for updating `tempPosts` after the item is removed.
 * @throws {Error} - If `item` or `user` is undefined.
 * @returns {Promise<void>} - A promise that resolves when the Firestore update is complete.
*/
export const removeHomeSaveFunction = async (item, user, tempPosts, setTempPosts) => {
  if (!item || !user) {
    throw new Error("Error: 'item' or 'user' is undefined.");
  }
  const updatedObject = { ...item };
  updatedObject.savedBy = item.savedBy.filter((e) => e != user.uid)
  const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
  if (objectIndex !== -1) {
    const updatedData = [...tempPosts];
    updatedData[objectIndex] = updatedObject;
    setTempPosts(updatedData);
  }
  try {
    await updateDoc(doc(db, 'posts', item.id), {
      savedBy: arrayRemove(user.uid)
    })
    await deleteDoc(doc(db, 'profiles', user.uid, 'saves', item.id))
  } 
  catch (e) {
    console.error("Error updating document:", e);
  }
}
/**
 * Adds a liked video from the user's liked list and updates both the local state and Firestore database.
 * @param {Object} item - The video object to be removed.
 * @param {Object} user - The user object performing the action.
 * @param {Object} username - The username object to be applied as a parameter to the like notification.
 * @param {Array} tempPosts - The current array of posts displayed in the video feed.
 * @param {function} setTempPosts - State setter function for updating `tempPosts` after the item is removed.
 * @param {function} schedulePushLikeNotification - Notification function to send to user who received the like 
 * after local state and Firestore database is properly updated.
 * @throws {Error} - If `item` or `user` is undefined.
 * @returns {Promise<void>} - A promise that resolves when the Firestore update is complete.
*/
export const addHomeLikeVideoFunction = async (item, likedBy, user, tempPosts, setTempPosts, schedulePushLikeNotification, username) => {
  if (!item || !user) {
    throw new Error("Error: 'item' or 'user' is undefined.");
  }
  const updatedObject = { ...item };
  if (item.username == username && !likedBy.includes(user.uid)&& !updatedObject.likedBy.includes(user.uid)) {
    updatedObject.likedBy = [...item.likedBy, user.uid];
    const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
    if (objectIndex !== -1) {
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      setTempPosts(updatedData);
    }
    try {  
      await setDoc(doc(db, 'profiles', user.uid, 'likes', item.id), {
        post: item.id,
        timestamp: serverTimestamp()
      })
      await updateDoc(doc(db, 'videos', item.id), {
        likedBy: arrayUnion(user.uid)
      })
    }
    catch (error) {
      console.error(error)
    }
  }
  else if (!likedBy.includes(user.uid) && !updatedObject.likedBy.includes(user.uid)) {
    updatedObject.likedBy = [...item.likedBy, user.uid];
    const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
    if (objectIndex !== -1) {
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      setTempPosts(updatedData);
    }
    try {
      await updateDoc(doc(db, 'videos', item.id), {
        likedBy: arrayUnion(user.uid)
      })
      await setDoc(doc(db, 'profiles', user.uid, 'likes', item.id), {
        post: item.id,
        timestamp: serverTimestamp()
      }) 
      await addDoc(collection(db, 'profiles', item.userId, 'notifications'), {
        like: true,
        comment: false,
        friend: false,
        item: item.id,
        request: false,
        acceptRequest: false,
        theme: false,
        report: false,
        postId: item.id,
        requestUser: user.uid,
        requestNotificationToken: item.notificationToken,
        likedBy: [],
        timestamp: serverTimestamp()
      })
      await addDoc(collection(db, 'profiles', item.userId, 'checkNotifications'), {
        userId: item.userId
      })
      schedulePushLikeNotification(item.userId, username, item.notificationToken)
    } 
    catch (error) {
      console.error(error)
    }
      
  }
}
/**
 * Adds a liked post from the user's liked list and updates both the local state and Firestore database.
 * @param {Object} item - The post object to be removed.
 * @param {Object} user - The user object performing the action.
 * @param {Object} username - The username object to be applied as a parameter to the like notification.
 * @param {Array} tempPosts - The current array of posts displayed in the home feed.
 * @param {function} setTempPosts - State setter function for updating `tempPosts` after the item is removed.
 * @param {function} schedulePushLikeNotification - Notification function to send to user who received the like 
 * after local state and Firestore database is properly updated.
 * @throws {Error} - If `item` or `user` is undefined.
 * @returns {Promise<void>} - A promise that resolves when the Firestore update is complete.
*/
export const addHomeLikeFunction = async (item, likedBy, user, tempPosts, setTempPosts, username) => {
  if (!item || !user) {
    throw new Error("Error: 'item' or 'user' is undefined.");
  }
  const updatedObject = { ...item };
  if (item.username == username && !likedBy.includes(user.uid)&& !updatedObject.likedBy.includes(user.uid) ) {
    updatedObject.likedBy = [...item.likedBy, user.uid];
    const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
    if (objectIndex !== -1) {
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      setTempPosts(updatedData);
    }
    try {  
      await setDoc(doc(db, 'profiles', user.uid, 'likes', item.id), {
        post: item.id,
        timestamp: serverTimestamp()
      })
      await updateDoc(doc(db, 'posts', item.id), {
        likedBy: arrayUnion(user.uid)
      })
    }
    catch (error) {
      console.error(error)
    }
  }
  else if (!likedBy.includes(user.uid) && !updatedObject.likedBy.includes(user.uid)) {
    updatedObject.likedBy = [...item.likedBy, user.uid];
    const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
    if (objectIndex !== -1) {
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      setTempPosts(updatedData);
    }
    try {
      await updateDoc(doc(db, 'posts', item.id), {
        likedBy: arrayUnion(user.uid)
      })
      await setDoc(doc(db, 'profiles', user.uid, 'likes', item.id), {
        post: item.id,
        timestamp: serverTimestamp()
      }) 
      await addDoc(collection(db, 'profiles', item.userId, 'notifications'), {
        like: true,
        comment: false,
        friend: false,
        item: item.id,
        request: false,
        acceptRequest: false,
        theme: false,
        report: false,
        postId: item.id,
        requestUser: user.uid,
        requestNotificationToken: item.notificationToken,
        likedBy: [],
        timestamp: serverTimestamp()
      })
      await addDoc(collection(db, 'profiles', item.userId, 'checkNotifications'), {
        userId: item.userId
      })
      schedulePushLikeNotification(item.userId, username, item.notificationToken)
    } 
    catch (error) {
      console.error(error)
    }
  }
}
/**
 * Adds a saved video from the user's saved list and updates both the local state and Firestore database.
 * @param {Object} item - The video object to be removed.
 * @param {Object} user - The user object performing the action.
 * @param {Array} tempPosts - The current array of posts displayed in the video feed.
 * @param {function} setTempPosts - State setter function for updating `tempPosts` after the item is removed.
 * @throws {Error} - If `item` or `user` is undefined.
 * @returns {Promise<void>} - A promise that resolves when the Firestore update is complete.
*/
export const addHomeSaveVideoFunction = async (item, user, tempPosts, setTempPosts) => {
  if (!item || !user) {
    throw new Error("Error: 'item' or 'user' is undefined.");
  }
  const updatedObject = { ...item };
  updatedObject.savedBy = [...item.savedBy, user.uid];
  const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
  if (objectIndex !== -1) {
    const updatedData = [...tempPosts];
    updatedData[objectIndex] = updatedObject;
    setTempPosts(updatedData);
    try {
      await updateDoc(doc(db, 'videos', item.id), {
        savedBy: arrayUnion(user.uid)
      });
      await setDoc(doc(db, 'profiles', user.uid, 'saves', item.id), {
        post: item,
        timestamp: serverTimestamp()
      });
    } 
    catch (error) {
      console.error("Error updating document:", error);
    }
  }
}
/**
 * Adds a saved post from the user's saved list and updates both the local state and Firestore database.
 * @param {Object} item - The post object to be removed.
 * @param {Object} user - The user object performing the action.
 * @param {Array} tempPosts - The current array of posts displayed in the home feed.
 * @param {function} setTempPosts - State setter function for updating `tempPosts` after the item is removed.
 * @throws {Error} - If `item` or `user` is undefined.
 * @returns {Promise<void>} - A promise that resolves when the Firestore update is complete.
*/
export const addHomeSaveFunction = async (item, user, tempPosts, setTempPosts) => {
  if (!item || !user) {
    throw new Error("Error: 'item' or 'user' is undefined.");
  }
  const updatedObject = { ...item };
  updatedObject.savedBy = [...item.savedBy, user.uid];
  const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
  if (objectIndex !== -1) {
    const updatedData = [...tempPosts];
    updatedData[objectIndex] = updatedObject;
    setTempPosts(updatedData);
    try {
      await updateDoc(doc(db, 'posts', item.id), {
        savedBy: arrayUnion(user.uid)
      });
      await setDoc(doc(db, 'profiles', user.uid, 'saves', item.id), {
        post: item,
        timestamp: serverTimestamp()
      });
    } 
    catch (error) {
      console.error("Error updating document:", error);
    }
  }
}
/**
 * Deletes a reply from a comment and updates both the local state and Firestore database.
 * @param {Object} item - The commentId to be updated.
 * @param {Object} reply - The reply object to be removed.
 * @param {Object} focusedItem - The post object where the comment/reply is located.
 * @param {Array} comments - The current array of comments displayed.
 * @param {function} setComments - State setter function for updating `tempComments` after the reply is removed.
 * @param {Array} tempPosts - The current array of posts displayed in the home/video feed.
 * @param {function} setTempPosts - State setter function for updating `tempPosts` after the comments are updated.
 * @throws {Error} - If `item` or `reply` or `focusedItem` is undefined.
 * @returns {Promise<void>} - A promise that resolves when the Firestore update is complete.
*/
export const deleteReplyFunction = async (item, reply, focusedItem, comments, setComments, tempPosts, setTempPosts) => {
  if (!item || !reply || !focusedItem) {
    throw new Error("Error: Missing required parameters.");
  }
  try {
    // Remove reply from the specific comment in Firebase
    await updateDoc(doc(db, 'posts', focusedItem.id, 'comments', item.id), {
      replies: arrayRemove(reply)
    });
    // Decrement the comment count in the main post document
    await updateDoc(doc(db, 'posts', focusedItem.id), {
      comments: increment(-1)
    });
    // Update the `comments` state locally
    const updatedCommentObject = { ...item };
    updatedCommentObject.actualReplies = item.actualReplies.filter((e) => e !== reply);
    const commentIndex = comments.findIndex((obj) => obj.id === item.id);
    if (commentIndex !== -1) {
      const updatedComments = [...comments];
      updatedComments[commentIndex] = updatedCommentObject;
      setComments(updatedComments);
    }
    // Update the `tempPosts` state locally
    const updatedFocusedObject = { ...focusedItem };
    updatedFocusedObject.comments = updatedFocusedObject.comments - 1;
    const postIndex = tempPosts.findIndex((obj) => obj.id === focusedItem.id);
    if (postIndex !== -1) {
      const updatedPosts = [...tempPosts];
      updatedPosts[postIndex] = updatedFocusedObject;
      setTempPosts(updatedPosts);
    }
  } 
  catch (error) {
    console.error("Error deleting reply:", error);
  }
};
/**
 * Reposts a text post and updates both the local state and Firestore database.
 * @param {Object} user - The user object performing the action.
 * @param {Object} blockedUsers - The blockedUsers object to be applied as a fieldValue to the document in Firestore database.
 * @param {Object} repostComment - The repostComment object to be applied as a fieldValue to the document in Firestore database.
 * @param {Object} forSale - The forSale object to be applied as a fieldValue to the document in Firestore database.
 * @param {Object} notificationToken - The notificationToken object to be applied as a fieldValue to the document in Firestore database.
 * @param {Object} username - The username object to be applied as a fieldValue to the document in Firestore database.
 * @param {Object} background - The background object to be applied as a fieldValue to the document in Firestore database.
 * @param {Object} pfp - The pfp object to be applied as a fieldValue to the document in Firestore database.
 * @param {Object} repostItem - The repostItem object to be applied as a fieldValue to the document in Firestore database.
 * @param {function} setRepostLoading - State setter function for updating `repostLoading` after the repost is added to the Firestore database.
 * @param {function} handleClose - Function to close the 'repostModal' once the repost is added to the Firestore database.
 * @param {function} schedulePushRepostNotification - Notification function to send to user whose content was reposted
 * after local state and Firestore database is properly updated.
 * @returns {Promise<void>} - A promise that resolves when the Firestore update is complete.
*/
export const repostFunction = async (user, blockedUsers, repostComment, forSale, notificationToken, username, background, pfp, repostItem, 
  setRepostLoading, handleClose, schedulePushRepostNotification) => {
    const docRef = await addDoc(collection(db, 'posts'), {
      userId: user.uid,
      repost: true,
      blockedUsers: blockedUsers,
      caption: repostComment,
      post: repostItem,
      forSale: forSale,
      postIndex: 0,
      mentions: [],
      pfp: pfp,
      likedBy: [],
      comments: 0,
      shares: 0,
      usersSeen: [],
      commentsHidden: false,
      likesHidden: false,
      archived: false,
      savedBy: [],
      multiPost: true,
      timestamp: serverTimestamp(),
      notificationToken: notificationToken,
      username: username,
      reportVisible: false,
      background: background
    })
    await setDoc(doc(db, 'profiles', user.uid, 'posts', docRef.id), {
      userId: user.uid,
      repost: true,
      caption: repostComment,
      post: repostItem,
      forSale: forSale,
      postIndex: 0,
      likedBy: [],
      mentions: [],
      comments: 0,
      shares: 0,
      usersSeen: [],
      commentsHidden: false,
      likesHidden: false,
      archived: false,
      savedBy: [],
      multiPost: true,
      timestamp: serverTimestamp(),
      notificationToken: notificationToken,
      username: username,
      pfp: pfp,
      reportVisible: false,
    })
    await updateDoc(doc(db, 'posts', repostItem.id), {
      reposts: increment(1)
    })
    await addDoc(collection(db, 'profiles', repostItem.userId, 'notifications'), {
      like: true,
      comment: false,
      friend: false,
      item: repostItem.id,
      repost: true,
      request: false,
      acceptRequest: false,
      theme: false,
      report: false,
      postId: repostItem.id,
      requestUser: user.uid,
      requestNotificationToken: repostItem.notificationToken,
      likedBy: [],
      timestamp: serverTimestamp()
    })
    await addDoc(collection(db, 'profiles', repostItem.userId, 'checkNotifications'), {
      userId: repostItem.userId
    })
    setRepostLoading(false)
    handleClose()
    schedulePushRepostNotification(repostItem.userId, username, repostItem.notificationToken)
}
/**
 * Removes a liked video from the user's liked list and updates both the local state and Firestore database.
 * @param {Object} item - The video object to be removed.
 * @param {Object} user - The user object performing the action.
 * @param {Array} tempPosts - The current array of posts displayed in the video feed.
 * @param {function} setTempPosts - State setter function for updating `tempPosts` after the item is removed.
 * @throws {Error} - If `item` or `user` is undefined.
 * @returns {Promise<void>} - A promise that resolves when the Firestore update is complete.
*/
export const removeLikeVideoFunction = async (item, user, tempPosts, setTempPosts) => {
  if (!item || !user) {
    throw new Error("Error: 'item' or 'user' is undefined.");
  }
  const updatedObject = { ...item };
  // Update the array in the copied object
  updatedObject.likedBy = item.likedBy.filter((e) => e != user.uid)
  const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
  if (objectIndex !== -1) {
    // Create a new array with the replaced object
    const updatedData = [...tempPosts];
    updatedData[objectIndex] = updatedObject;
    // Set the new array as the state
    setTempPosts(updatedData);
  }
  try {
    await updateDoc(doc(db, 'videos', item.id), {
      likedBy: arrayRemove(user.uid)
    })
    await deleteDoc(doc(db, 'profiles', user.uid, 'likes', item.id))
  } 
  catch (error) {
    console.error(error)
  }
}
/**
 * Removes a liked post from the user's liked list and updates both the local state and Firestore database.
 * @param {Object} item - The post object to be removed.
 * @param {Object} user - The user object performing the action.
 * @param {Array} tempPosts - The current array of posts displayed in the home feed.
 * @param {function} setTempPosts - State setter function for updating `tempPosts` after the item is removed.
 * @throws {Error} - If `item` or `user` is undefined.
 * @returns {Promise<void>} - A promise that resolves when the Firestore update is complete.
*/
export const removeLikeFunction = async (item, user, tempPosts, setTempPosts) => {
  if (!item || !user) {
    throw new Error("Error: 'item' or 'user' is undefined.");
  }
  const updatedObject = { ...item };
  // Update the array in the copied object
  updatedObject.likedBy = item.likedBy.filter((e) => e != user.uid)
  const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
  if (objectIndex !== -1) {
    // Create a new array with the replaced object
    const updatedData = [...tempPosts];
    updatedData[objectIndex] = updatedObject;
    // Set the new array as the state
    setTempPosts(updatedData);
  }
  try {
    await updateDoc(doc(db, 'posts', item.id), {
      likedBy: arrayRemove(user.uid)
    })
    await deleteDoc(doc(db, 'profiles', user.uid, 'likes', item.id))
  } 
  catch (error) {
    console.error(error)
  }
}
/**
 * Gets a user's profile details provided by the fieldValues from their user document via the Firestore database.
 * @param {Object} userId - The userId performing the action.
 * @throws {Error} - If `userId` is undefined.
 * @returns {Promise<void>} - A promise that resolves when the Firestore update is complete.
*/
export const getProfileDetails = async(userId) => {
  if (!userId) {
    throw new Error("Error: 'userId' is undefined.");
  }
  try {
    const docRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        username: data.userName,
        pfp: data.pfp,
        bio: data.bio,
        id: docSnap.id,
        followers: data.followers,
        following: data.following,
        forSale: data.forSale,
        firstName: data.firstName, 
        paymentMethodLast4: data.paymentMethodLast4,
        lastName: data.lastName,
        postBackground: data.postBackground,
        background: data.background,
        bannedFrom: data.bannedFrom,
        blockedUsers: data.blockedUsers,
        private: data.private,
        userName: data.userName,
        notificationToken: data.notificationToken,
      };
    } else {
      console.warn("Profile does not exist.");
      return null;
    }
  } 
  catch (error) {
    console.error("Error fetching profile details:", error);
    return null;
  }
}
/**
 * Fetches a list of up to 10 user profiles from Firestore, ordered by their document ID.
 * This list can be shown to the user for suggestions to follow or friend new users.
 * @returns {Promise<Object>} - A promise that resolves with an object containing a `tempList` array of profile objects. 
 * Each profile object includes the document ID, profile data, and a `loading` property.
 * @throws {Error} - If the Firestore query fails.
*/
export const fetchNewFriendsList = async() => {
  try {
    const docSnap = await getDocs(query(collection(db, 'profiles'), orderBy(documentId()), limit(10)));
    const tempList = [];
    docSnap.forEach((item) => {
      tempList.push({ id: item.id, ...item.data(), loading: false });
    });
    return { tempList };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
/**
 * Fetches a list of up to 10 user profiles from Firestore, where specificSearch (search typed by user) is contained 
 * in the smallKeywords array on Firestore database to see if there is a search match.
 * @param {String} specificSearch - The search that is being performed by the user.
 * @returns {Promise<Object>} - A promise that resolves with an object containing a `userSearches` array of profile objects. 
 * Each profile object includes the document ID, and profile data.
 * @throws {Error} - If the Firestore query fails.
*/
export const fetchUserSearchesSmall = async (specificSearch) => {
  try {
    const userSearches = [];
    const q = query(collection(db, "profiles"), where('smallKeywords', 'array-contains', specificSearch.toLowerCase()), limit(10))
    const firstQuerySnapshot = await getDocs(q)
    firstQuerySnapshot.forEach((doc) => {
      userSearches.push({id: doc.id, ...doc.data()})
    })
    return {userSearches}
  } 
  catch (error) {
    // Log an error message if the Firestore query fails.
    console.error("Error fetching data:", error);
  }

}
/**
 * Fetches a list of up to 10 user profiles from Firestore, where specificSearch (search typed by user) is contained 
 * in the largeKeywords array on Firestore database to see if there is a search match.
 * @param {String} specificSearch - The search that is being performed by the user.
 * @returns {Promise<Object>} - A promise that resolves with an object containing a `userSearches` array of profile objects. 
 * Each profile object includes the document ID, and profile data.
 * @throws {Error} - If the Firestore query fails.
*/
export const fetchUserSearchesLarge = async (specificSearch) => {
  try {
    const userSearches = [];
    const q = query(collection(db, "profiles"), where('largeKeywords', 'array-contains', specificSearch.toLowerCase()), limit(10))
    const firstQuerySnapshot = await getDocs(q)
    firstQuerySnapshot.forEach((doc) => {
      userSearches.push({id: doc.id, ...doc.data()})
    })
    return {userSearches}
  } 
  catch (error) {
    // Log an error message if the Firestore query fails.
    console.error("Error fetching data:", error);
  }
}
/**
 * Fetches a list of up to 10 'public' video posts from Firestore with the newest ones appearing first.
 * If fetchedCount reaches 3 (3 blockedUserIds found in blockedUsers), it fetches a second batch.
 * @param {String} blockedUsers - The blockedUsers object that is conditional based on if 3 of the first batch of posts fetched contain a blockedUserId.
 * @returns {Promise<Object>} - A promise that resolves with an object containing a `posts` array of post objects. 
 * Each post object includes the document ID, the post data, a loading value (initially to false).
 * Also resolves with a `lastVisible` object with the last Firestore document to fetch more posts if applicable.
 * @throws {Error} - If the Firestore query fails.
*/
export const fetchPublicPostsExcludingBlockedUsersVideo = async (blockedUsers) => {
  const posts = [];
  let fetchedCount = 0;
  try {
    const q = query(collection(db, 'videos'), where('private', '==', false), orderBy('timestamp', 'desc'), limit(7));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (!blockedUsers.includes(doc.data().userId)) {
        posts.push({ id: doc.id, loading: false, ...doc.data() });
      } else {
        fetchedCount++;
      }
    });
    // Fetch more posts if all initial ones are blocked
    if (fetchedCount === 3 && posts.length === 0) {
      const nextQuery = query(collection(db, 'videos'), where('private', '==', false), orderBy('timestamp', 'desc'), 
      startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]), limit(3)
      );
      const nextSnapshot = await getDocs(nextQuery);
      nextSnapshot.forEach((doc) => {
        posts.push({ id: doc.id, loading: false, ...doc.data() });
      });
    }
    console.log(`Posts: ${posts}`)
    return { posts, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] };
  }
  catch (e) {
    console.error(e)
  }
};
/**
 * Fetches a list of up to 10 'public' posts from Firestore with the newest ones appearing first.
 * If fetchedCount reaches 3 (3 blockedUserIds found in blockedUsers), it fetches a second batch.
 * @param {String} blockedUsers - The blockedUsers object that is conditional based on if 3 of the first batch of posts fetched contain a blockedUserId.
 * @returns {Promise<Object>} - A promise that resolves with an object containing a `posts` array of post objects. 
 * Each post object includes the document ID, the post data, a loading value (initially to false) and a postIndex to 0 (for multi-posts).
 * Also resolves with a `lastVisible` object with the last Firestore document to fetch more posts if applicable.
 * @throws {Error} - If the Firestore query fails.
*/
export const fetchPublicPostsExcludingBlockedUsers = async (blockedUsers) => {
  const posts = [];
  let fetchedCount = 0;
  try {
    const q = query(collection(db, 'posts'), where('private', '==', false), orderBy('timestamp', 'desc'), limit(7));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (!blockedUsers.includes(doc.data().userId)) {
        posts.push({ id: doc.id, loading: false, postIndex: 0, ...doc.data() });
      } else {
        fetchedCount++;
      }
    });
    // Fetch more posts if all initial ones are blocked
    if (fetchedCount === 3 && posts.length === 0) {
      const nextQuery = query(collection(db, 'posts'), where('private', '==', false), orderBy('timestamp', 'desc'), 
      startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]), limit(3));
      const nextSnapshot = await getDocs(nextQuery);
      nextSnapshot.forEach((doc) => {
        posts.push({ id: doc.id, loading: false, postIndex: 0, ...doc.data() });
      });
    }
    return { posts, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] };
  }
  catch (e) {
    console.error(e)
  }
};
/**
 * Fetches a list of up to 10 'public' video posts from Firestore with the newest ones appearing first.
 * If fetchedCount reaches 3 (3 blockedUserIds found in blockedUsers), it fetches a second batch.
 * @param {Array} blockedUsers - The blockedUsers object that is conditional based on if 3 of the first batch of posts fetched contain a blockedUserId.
 * @param {Object} lastVisible - The Firestore document object to `startAfter` when fetching more data.
 * @returns {Promise<Object>} - A promise that resolves with an object containing a `posts` array of post objects. 
 * Each post object includes the document ID, the post data, a loading value (initially to false).
 * Also resolves with a `lastVisible` object with the last Firestore document to fetch more posts if applicable.
 * @throws {Error} - If the Firestore query fails.
*/
export const fetchMorePublicPostsExcludingBlockedUsersVideo = async (blockedUsers, lastVisible) => {
  const posts = [];
  let fetchedCount = 0;
  try {
    const q = query(
      collection(db, 'videos'),
      where('private', '==', false),
      orderBy('timestamp', 'desc'),
      startAfter(lastVisible),
      limit(4)
    );
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      if (!blockedUsers.includes(doc.data().userId)) {
        posts.push({ id: doc.id, loading: false, postIndex: 0, ...doc.data() });
      } else {
        fetchedCount++;
      }
    });
    if (fetchedCount === 4 && posts.length === 0) {
      const nextQuery = query(
        collection(db, 'videos'),
        where('private', '==', false),
        orderBy('timestamp', 'desc'),
        startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]),
        limit(4)
      );
      const nextSnapshot = await getDocs(nextQuery);
      nextSnapshot.forEach((doc) => {
        posts.push({ id: doc.id, loading: false, postIndex: 0, ...doc.data() });
      });
    }
    return { posts, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] };
  }
  catch (e) {
    console.error(e)
  }
}
/**
 * Fetches a list of up to 10 'public' posts from Firestore with the newest ones appearing first.
 * If fetchedCount reaches 3 (3 blockedUserIds found in blockedUsers), it fetches a second batch.
 * @param {Array} blockedUsers - The blockedUsers object that is conditional based on if 3 of the first batch of posts fetched contain a blockedUserId.
 * @param {Object} lastVisible - The Firestore document object to `startAfter` when fetching more data.
 * @returns {Promise<Object>} - A promise that resolves with an object containing a `posts` array of post objects. 
 * Each post object includes the document ID, the post data, a loading value (initially to false).
 * Also resolves with a `lastVisible` object with the last Firestore document to fetch more posts if applicable.
 * @throws {Error} - If the Firestore query fails.
*/
export const fetchMorePublicPostsExcludingBlockedUsers = async (blockedUsers, lastVisible) => {
  const posts = [];
  let fetchedCount = 0;
  try {
    const q = query(
      collection(db, 'posts'),
      where('private', '==', false),
      orderBy('timestamp', 'desc'),
      startAfter(lastVisible),
      limit(4)
    );
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      if (!blockedUsers.includes(doc.data().userId)) {
        posts.push({ id: doc.id, loading: false, postIndex: 0, ...doc.data() });
      } else {
        fetchedCount++;
      }
    });
    if (fetchedCount === 4 && posts.length === 0) {
      const nextQuery = query(
        collection(db, 'posts'),
        where('private', '==', false),
        orderBy('timestamp', 'desc'),
        startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]),
        limit(4)
      );
      const nextSnapshot = await getDocs(nextQuery);
      nextSnapshot.forEach((doc) => {
        posts.push({ id: doc.id, loading: false, postIndex: 0, ...doc.data() });
      });
    }
    return { posts, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] };
  }
  catch (e) {
    console.error(e)
  }
}
/**
 * Fetches a list of up to 7 posts from friends (users that the user follows) from Firestore.
 * @param {String} userId - The userId that performs the action.
 * @param {Float32Array} followingCount - The number of posts that have been fetched so far. (Starts with 7 and then increments by 7 for each fetch).
 * @returns {Promise<Object>} - A promise that resolves with an object containing an array of post objects. 
 * @throws {Error} - If the Firestore query fails.
*/
export const fetchUserFeedPosts = async (userId, followingCount) => {
  const docRef = doc(db, 'userFeeds', userId);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().posts.slice(followingCount - 7, followingCount);
    }
    return [];
  }
  catch (e) {
    console.error(e)
  }
  
};
/**
 * Adds a like to a comment updates both the local state and Firestore database.
 * @param {Object} item - The comment object to be liked.
 * @param {Object} user - The user object performing the action.
 * @param {Object} username - The username object to determine to send a notification based on a username being unique to the user who liked it.
 * @param {Array} comments - The current array of comments displayed in the feed.
 * @param {function} setComments - State setter function for updating `comments` after the like is added to the comment.
 * @param {Object} focusedItem - The post object that contains the comment to be liked.
 * @throws {Error} - If `item` or `user` is undefined.
 * @returns {Promise<void>} - A promise that resolves when the Firestore update is complete.
*/
export const addCommentLike = async(item, user, setComments, comments, username, focusedItem) => {
  const updatedObject = { ...item };
    // Update the array in the copied object
  updatedObject.likedBy = [...item.likedBy, user.uid];
  const objectIndex = comments.findIndex(obj => obj.id === item.id);
  if (objectIndex !== -1) {
    // Create a new array with the replaced object
    const updatedData = [...comments];
    updatedData[objectIndex] = updatedObject;
    // Set the new array as the state
    setComments(updatedData);
  }
  if (username != focusedItem.username) {
    try {
      await updateDoc(doc(db, 'posts', focusedItem.id, 'comments', item.id), {
        likedBy: arrayUnion(user.uid)
      })
      await addDoc(collection(db, 'profiles', item.user, 'notifications'), {
        like: false,
        comment: true,
        likedComment: true,
        friend: false,
        item: item.comment,
        request: false,
        acceptRequest: false,
        postId: focusedItem.id,
        theme: false,
        report: false,
        requestUser: user.uid,
        requestNotificationToken: item.notificationToken,
        likedBy: item.username,
        timestamp: serverTimestamp()
      })
    }
    catch (error) {
      console.error(error)
    }
  }
  else {
    try {
      await updateDoc(doc(db, 'posts', focusedItem.id, 'comments', item.id), {
        likedBy: arrayUnion(user.uid)
      })
    } 
    catch (error) {
      console.error(error)
    }
  }
}
/**
 * Removes a like to a comment and updates both the local state and Firestore database.
 * @param {Object} item - The comment object to be liked.
 * @param {Object} user - The user object performing the action.
 * @param {Array} comments - The current array of comments displayed in the feed.
 * @param {function} setComments - State setter function for updating `comments` after the like is added to the comment.
 * @param {Object} focusedItem - The post object that contains the comment to be liked.
 * @throws {Error} - If `item` or `user` is undefined.
 * @returns {Promise<void>} - A promise that resolves when the Firestore update is complete.
*/
export const removeCommentLike = async(item, user, setComments, comments, focusedItem) => {
  const updatedObject = { ...item };
  // Update the array in the copied object
  updatedObject.likedBy = item.likedBy.filter((e) => e != user.uid)
  const objectIndex = comments.findIndex(obj => obj.id === item.id);
  if (objectIndex !== -1) {
    // Create a new array with the replaced object
    const updatedData = [...comments];
    updatedData[objectIndex] = updatedObject;
    // Set the new array as the state
    setComments(updatedData);
  }
  try {
    await updateDoc(doc(db, 'posts', focusedItem.id, 'comments', item.id), {
      likedBy: arrayRemove(user.uid)
    })
  }
  catch (error) {
    console.error(error)
  }
}
/**
 * Fetches a list of up to 7 posts from friends (users that the user follows) from Firestore.
 * @param {String} userId - The userId that performs the action.
 * @param {String} item - The reason as to why the item is being reported.
 * @param {Object} reportComment - The comment that is being reported.
 * @param {Object} focusedItem - The post that the comment is one that is being reported.
 * @param {String} reportNotificationToken - The notification token of the user who has content has been reported.
 * @param {Array} comments - Useful for comments fieldValue.
 * @param {Float32Array} followingCount - The number of posts that have been fetched so far. (Starts with 7 and then increments by 7 for each fetch).
 * @returns {Promise<Object>} - A promise that resolves with an object containing an array of post objects. 
 * @throws {Error} - If the Firestore query fails.
*/
export const reportItemOne = async ({reportComment, item, focusedItem, reportNotificationToken, comments, userId}) => {
  if (!userId || !reportComment) {
    throw new Error("userId and/or reportComment is undefined");
  }
  addDoc(collection(db, 'profiles', reportComment.user, 'reportedContent'), {
      content: reportComment.id,
      reason: item,
      post: focusedItem,
      comment: reportComment.comment == undefined ? reportComment.reply : reportComment.comment,
      message: false,
      cliqueMessage: false,
      timestamp: serverTimestamp()
    }).then(() => addDoc(collection(db, 'profiles', reportComment.user, 'notifications'), {
      like: false,
      comment: reportComment.comment == undefined ? reportComment.reply : reportComment.comment,
      friend: false,
      item: item,
      request: false,
      acceptRequest: false,
      theme: false,
      report: true,
      postId: focusedItem.id,
      requestUser: reportComment.user,
      requestNotificationToken: reportNotificationToken,
      post: focusedItem,
      comments: comments,
       message: false,
      cliqueMessage: false,
      likedBy: [],
      timestamp: serverTimestamp()
    })).then(() => addDoc(collection(db, 'profiles', reportComment.user, 'checkNotifications'), {
      userId: reportComment.user
    })).then(reportComment ? async() => await updateDoc(doc(db, 'profiles', userId), {
      reportedComments: arrayUnion(reportComment.id)
    }) : null).then(() => schedulePushReportNotification()).then(() => setFinishedReporting(true)).then(() => setReportCommentModal(false))
}
/* export const fetchLikes = async ({focusedLikedItem, user}) => {
  const likesInfo = [];

  if (focusedLikedItem.likedBy.length > 0) {
    const fetchPromises = focusedLikedItem.likedBy.slice(0, 100).map(async (item) => {
      try {
        const userSnap = await getDoc(doc(db, 'profiles', user.uid));
        if (userSnap.exists() && !userSnap.data().blockedUsers.includes(item)) {
          const docSnap = await getDoc(doc(db, 'profiles', item));
          if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
          }
        }
      } catch (error) {
        console.error(`Error fetching data for user: ${item}`, error);
      }
      return null;
    });

    const results = await Promise.all(fetchPromises);
    return results.filter((result) => result !== null);
  }

  return likesInfo;

} */
export const fetchUsernames = async () => {
  try {
    const usernames = [];
    const querySnapshot = await getDocs(collection(db, 'usernames'));
    querySnapshot.forEach((doc) => {
      usernames.push(doc.data().username);
    });
    return usernames;
  } catch (error) {
    console.error("Error fetching usernames:", error);
    return []; // Return an empty array if there's an error
  }
}
export const fetchLimitedFriendsInfo = async(friends) => {
  const completeFriendsArray = [];
  friends.map(async(item) => await getDoc(doc(db, 'friends', item.friendId))
    .then(snapshot => {
      completeFriendsArray.push({id: snapshot.id, ...snapshot.data()})
    })
    .catch(error => {
      console.error(error)
    }))
  return completeFriendsArray;
}
/**
 * Gets first 20 mutual (first user follows and second user is a follower of the first user) friends of user by lastMessageTimestamp
 * @param {String} userId - The id of the user to check.
 * @param {String} blockedUsers - The blockedUsers object to make sure that even if they were once mutual friends, one user is not blocked.
 * @param {Function} setFriends - State setter function for updating `friends` after fetching the first 20 mutual friends.
 * @param {Function} setLastVisible - State setter function for updating `lastVisible` after fetching the first 20 mutual friends to fetch the next 20 when applicable.
 * @returns {Function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `userId` is not provided.
*/
export const fetchFriends = (userId, blockedUsers, setFriends, setLastVisible) => {
  if (!userId) {
    throw new Error("userId is undefined");
  }

  const friendsQuery = query(
    collection(db, 'profiles', userId, 'friends'),
    where('actualFriend', '==', true),
    orderBy('lastMessageTimestamp', 'desc'),
    limit(20)
  );

  const unsubscribe = onSnapshot(friendsQuery, (snapshot) => {
    // Filter out blocked users and map the data
    const friends = snapshot.docs
      .filter((doc) => !blockedUsers.includes(doc.id))
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    // Update the friends state and the last visible document
    setFriends(friends);
    if (snapshot.docs.length > 0) {
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    }
  });

  return unsubscribe; // Return the unsubscribe function
};
/**
 * Gets first 25 messages with a particular friend ordered by latest messages first.
 * @param {String} friendId - The id (combination of both userIds) of the mutual friends to check.
 * @param {Function} setMessages - State setter function for updating `messages` after fetching the first 25 messages.
 * @param {Function} setLastVisible - State setter function for updating `lastVisible` after fetching the first 25 messages to fetch the next 20 when applicable.
 * @returns {Function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `friendId` is not provided.
*/
export const fetchMessages = (friendId, setMessages, setLastVisible) => {
  if (!friendId) {
    throw new Error("friendId is undefined");
  }
  const q = query(collection(db, 'friends', friendId, 'chats'), orderBy('timestamp', 'desc'), limit(25))
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc)=> ({
      id: doc.id,
      ...doc.data(),
      copyModal: false,
      saveModal: false
    }));
    setMessages(messages)
    if (snapshot.docs.length > 0) {
      setLastVisible(snapshot.docs[snapshot.docs.length - 1])
    }
  })
  return unsubscribe;
}
/**
 * Gets first 9 posts that aren't reposts for the profile screen ordered by latest posts first.
 * @param {String} userId - The id of the user whose profile is being viewed.
 * @param {Function} setPosts - State setter function for updating `posts` after fetching the first 9 non-repost posts.
 * @param {Function} setLastVisible - State setter function for updating `lastVisible` after fetching the first 9 posts to fetch the next 9 when applicable.
 * @returns {Function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `userId` is not provided.
*/
export const fetchPosts = (userId, setPosts, setLastVisible) => {
  if (!userId) {
    throw new Error("userId is undefined");
  }
  const q = query(collection(db, 'profiles', userId, 'posts'), where('repost', '==', false), orderBy('timestamp', 'desc'), limit(9))
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setPosts(posts);
    if (snapshot.docs.length > 0) {
      setLastVisible(snapshot.docs[snapshot.docs.length - 1])
    }
  })
  return unsubscribe;
}
/**
 * Gets first 9 posts that are reposts for the profile screen ordered by latest posts first.
 * @param {String} userId - The id of the user whose profile is being viewed.
 * @param {Function} setPosts - State setter function for updating `posts` after fetching the first 9 repost posts.
 * @param {Function} setLastVisible - State setter function for updating `lastVisible` after fetching the first 9 posts to fetch the next 9 when applicable.
 * @returns {Function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `userId` is not provided.
*/
export const fetchReposts = (userId, setReposts, setLastVisible) => {
  if (!userId) {
    throw new Error("userId is undefined");
  }
  const q = query(collection(db, 'profiles', userId, 'posts'), where('repost', '==', true), orderBy('timestamp', 'desc'), limit(9))
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const reposts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setReposts(reposts);
    if (snapshot.docs.length > 0) {
      setLastVisible(snapshot.docs[snapshot.docs.length - 1])
    }
  })
  return unsubscribe;
}
/**
 * Gets the next 10 posts based on subCollection (likes, comments, saves, etc.) that are viewed in a user's settings.
 * @param {String} userId - The id of the user whose profile is being viewed.
 * @param {String} subCollection - The id of the user whose profile is being viewed.
 * @param {String} lastVisible - The Firestore document object to `startAfter` when fetching more data.
 * @returns {Promise<Object>} - A promise that resolves with an object containing a `data` array of post objects based on the subCollection. 
 * Each post object includes the document ID, and post data. These are to view posts that a user commented on, liked, saved, etc.
 * Also resolves with a `lastVisible` object with the last document to fetch more posts based on the subCollection if applicable.
 * @throws {Error} - If `userId` or `subCollection` is not provided.
*/
export const fetchMoreSettings = async(userId, subCollection, lastVisible) => {
  if (!userId || !subCollection) {
    throw new Error("userId is undefined");
  }
  const posts = []
  const query = query(collection(db, 'profiles', userId, subCollection), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(10))
  const querySnapshot = await getDocs(query)
  querySnapshot.forEach((doc) => {
    posts.push({id: doc.id, ...doc.data()})
    
  })
  return {posts, lastVisible: querySnapshot[querySnapshot.docs.length-1]}
}
/**
 * Gets first 10 posts based on subCollection (likes, comments, saves, etc.) that are viewed in a user's settings.
 * @param {String} userId - The id of the user whose profile is being viewed.
 * @param {String} subCollection - The id of the user whose profile is being viewed.
 * @returns {Promise<Object>} - A promise that resolves with an object containing a `data` array of post objects based on the subCollection. 
 * Each post object includes the document ID, and post data. These are to view posts that a user commented on, liked, saved, etc.
 * It also resolves with a `lastVisible` object with the last document to fetch more posts based on the subCollection if applicable.
 * @throws {Error} - If `userId` or `subCollection` is not provided.
*/
export const fetchSettings = async(userId, subCollection) => {
  if (!userId || !subCollection) {
    throw new Error("userId and/or subCollection is undefined");
  }
  const data = []
  const query = query(collection(db, 'profiles', userId, subCollection), orderBy('timestamp', 'desc'), limit(10))
  const querySnapshot = await getDocs(query)
  querySnapshot.forEach((doc) => {
    data.push({id: doc.id, ...doc.data()})
  })
  return {data, lastVisible: querySnapshot[querySnapshot.docs.length-1]}
}
/**
 * Gets first 10 themes based on subCollection (price, date, etc.) and order (ascending, descending) that were collected/purchased by a user.
 * @param {String} userId - The id of the user perfoming this action.
 * @param {String} subCollection - The name of the field/subCollection that we are ordering the query by (price, date, etc.).
 * @param {String} order - The name of the order that we are ordering the query by (ascending, descending, etc.).
 * @param {Function} setPurchasedThemes - State setter function for updating `purchasedThemes` after fetching the first 10 purchased themes.
 * @param {Function} setPurchasedLastVisible - State setter function for updating `purchasedLastVisible` after fetching the first 10 purchasedThemes.
 * Used to get the last document in our query in case user fetches more (separate function).
 * @returns {Function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `userId` or `subCollection` is not provided.
*/
export const fetchPurchasedThemes = (userId, subCollection, order, setPurchasedThemes, setPurchasedLastVisible) => {
  if (!userId || !subCollection) {
    throw new Error("userId is undefined");
  }
  const purchasedQuery = query(collection(db, 'profiles', userId, 'purchased'), orderBy(subCollection, order), limit(10))
  const unsubscribe = onSnapshot(purchasedQuery, (snapshot) => {
    const purchased = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      transparent: false
    }));
    setPurchasedThemes(purchased);
    if (snapshot.docs.length > 0) {
      setPurchasedLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    }

  return unsubscribe;
  });
}
/**
 * Gets next 10 themes based on subCollection (price, date, etc.) and order (ascending, descending) that were collected/purchased by a user.
 * @param {String} userId - The id of the user perfoming this action.
 * @param {String} subCollection - The name of the field/subCollection that we are ordering the query by (price, date, etc.).
 * @param {String} order - The name of the order that we are ordering the query by (ascending, descending, etc.).
 * @param {Object} lastVisible - The Firestore document object (last purchased theme object) to `startAfter` when fetching more data.
 * @returns {Function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `userId` or `subCollection` is not provided.
*/
export const fetchMorePurchasedThemes = async(userId, subCollection, order, lastVisible) => {
  if (!userId || !subCollection) {
    throw new Error("userId is undefined");
  }
  const tempPosts = [];
  try {
    const purchasedQuery = query(collection(db, 'profiles', userId, 'purchased'), orderBy(subCollection, order), startAfter(lastVisible), limit(10))
    const querySnapshot = await getDocs(purchasedQuery)
    querySnapshot.forEach((doc) => {
      tempPosts.push({id: doc.id, ...doc.data(), transparent: false})
    });
    return {tempPosts, lastPurchasedVisible: querySnapshot.docs[querySnapshot.docs.length - 1]}
  } 
  catch (e) {
    console.error(e)
  }
}
export const fetchMoreFreeThemes = async(userId, subCollection, order, freeLastVisible) => {
  if (!userId || !subCollection) {
    throw new Error("userId or subcollection is undefined");
  }
  const tempPosts = []
  try {
    const q = query(collection(db, 'freeThemes'), orderBy(subCollection, order), startAfter(freeLastVisible), limit(10))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      tempPosts.push({id: doc.id, ...doc.data(), transparent: false})
    });
    return {tempPosts, lastFreeVisible: querySnapshot.docs[querySnapshot.docs.length - 1]}
  } 
  catch (e) {
    console.error(e)
  }
}
/**
 * Gets first 10 themes based on subCollection (price, date, etc.) and order (ascending, descending) that are 'free'.
 * @param {String} subCollection - The name of the field/subCollection that we are ordering the query by (date, count, etc.).
 * @param {String} order - The name of the order that we are ordering the query by (ascending, descending, etc.).
 * @returns {Function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `subCollection` is not provided.
*/
export const fetchFreeThemes = async(subCollection, order) => {
  if (!subCollection) {
    throw new Error("subcollection is undefined");
  }
  console.log(subCollection, order)
  const tempPosts = []
  try {
    const q = query(collection(db, 'freeThemes'), orderBy(subCollection, order), limit(10))
    const querySnapshot = await getDocs(q)
    console.log("querySnapshot: " + querySnapshot.docs.length)
    querySnapshot.forEach((doc) => {
      tempPosts.push({id: doc.id, ...doc.data(), transparent: false})
    });
    if (tempPosts) {
      return {tempPosts: tempPosts, lastFreeVisible: querySnapshot.docs[querySnapshot.docs.length - 1]}
    }
    else {
      return {tempPosts: [], lastFreeVisible: null}
    }
    
  } 
  catch (e) {
    console.error(e)
  }

}
/**
 * Gets first 10 themes based on subCollection (price, date, etc.) and order (ascending, descending) that were created by the user.
 * @param {String} userId - The id of the user perfoming this action.
 * @param {String} subCollection - The name of the field/subCollection that we are ordering the query by (date, price, etc.).
 * @param {String} order - The name of the order that we are ordering the query by (ascending, descending, etc.).
 * @param {Function} setMyThemes - State setter function for updating `myThemes` after fetching the first 10 `my` themes.
 * @param {Function} setMyLastVisible - State setter function for updating `myLastVisible` after fetching the first 10 myThemes.
 * Used to get the last document in our query in case user fetches more (separate function).
 * @returns {Function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `myId` or `subCollection` is not provided.
*/
export const fetchMyThemes = (userId, subCollection, order, setMyThemes, setMyLastVisible) => {
  if (!userId || !subCollection) {
    throw new Error("userId and/or subCollection is undefined");
  }
  const myQuery = query(collection(db, 'profiles', userId, 'myThemes'), orderBy(subCollection, order), limit(10))
  const unsubscribe = onSnapshot(myQuery, (snapshot) => {
    const myT = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      transparent: false
    }));
    setMyThemes(myT);
    if (snapshot.docs.length > 0) {
      setMyLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    }

  return unsubscribe;
  });
}
/**
 * Gets first 10 themes based on a search performed by a user categorized by collectionName (if they are searching free themes for instance).
 * @param {String} userId - The id of the user perfoming this action. Useful for queries that require userId.
 * @param {String} collectionname - The name of the collection that we are fetching (products, freeThemes, myThemes, etc.)
 * @param {String} specificSearch - The search being performed by the user.
 * @returns {Promise<Object>} - A promise that resolves with an object containing a `themeSearches` array of theme objects based on the collectionName. 
 * Each post object includes the document ID, and theme data.
 * @throws {Error} - If `userId` or `collectionName` is not provided.
*/
export const fetchThemeSearches = async(collectionName, specificSearch, userId) => {
  if (!userId || !collectionName) {
    throw new Error("userId and/or collectionName is undefined");
  }
  try {
    if (collectionName == 'products') {
      const themeSearches = [];
      const q = query(collection(db, collectionName), orderBy('stripe_metadata_keywords'), startAt(specificSearch), endAt(specificSearch + '\uf8ff'))
      const firstQuerySnapshot = await getDocs(q)
      firstQuerySnapshot.forEach((doc) => {
        themeSearches.push({id: doc.id, ...doc.data()})
      })
      return {themeSearches}
    }
    else if (collectionName == 'freeThemes') {
      const themeSearches = []
      const q = query(collection(db, collectionName), where('searchKeywords', 'array-contains', specificSearch.toLowerCase()), limit(10))
      const firstQuerySnapshot = await getDocs(q)
      firstQuerySnapshot.forEach((doc) => {
        themeSearches.push({id: doc.id, ...doc.data()})
      })
      return {themeSearches}
    }
    else if (collectionName == 'myThemes') {
      const themeSearches = []
      const q = query(collection(db, "profiles", userId, collectionName), where('searchKeywords', 'array-contains', specificSearch.toLowerCase()), limit(10));
      const firstQuerySnapshot = await getDocs(q)
      firstQuerySnapshot.forEach((doc) => {
        themeSearches.push({id: doc.id, ...doc.data()})
      })
      return {themeSearches}
    }
    else if (collectionName == 'purchased') {
      const themeSearches = []
      const q = query(collection(db, "profiles", userId, collectionName), where('searchKeywords', 'array-contains', specificSearch.toLowerCase()), limit(10));
      const firstQuerySnapshot = await getDocs(q)
      firstQuerySnapshot.forEach((doc) => {
        themeSearches.push({id: doc.id, ...doc.data()})
      })
      return {themeSearches}
    }
  }
  catch (e) {
    console.error(e)
  }
}
/**
 * Gets all previous posts reported by the user. Useful for detecting the spam of reporting the same post by the same user.
 * @param {String} userId - The id of the user perfoming this action.
 * @param {function} callback - A callback function that receives the list of the previous posts reported by the user.
 * @returns {function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `userId` is not provided or exists.
*/   
export const fetchReportedPosts = (userId, callback) => {
  if (!userId) {
    throw new Error("userId is undefined");
  }
  const userDocRef = doc(db, "profiles", userId);
  // Set up the Firestore listener
  const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      callback(docSnapshot.data().reportedPosts);
    } 
    else {
      console.warn("Document does not exist for user:", userId);
      callback([]); // Fallback to an empty array
    }
  });
  // Return the unsubscribe function
  return unsubscribe;
}
/**
 * Gets all previous themes reported by the user. Useful for detecting the spam of reporting the same theme by the same user.
 * @param {String} userId - The id of the user perfoming this action.
 * @param {function} callback - A callback function that receives the list of the previous themes reported by the user.
 * @returns {function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `userId` is not provided or exists.
*/     
export const fetchReportedThemes = (userId, callback) => {
  if (!userId) {
    throw new Error("userId is undefined");
  }
  const userDocRef = doc(db, "profiles", userId);
  // Set up the Firestore listener
  const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      callback(docSnapshot.data().reportedThemes);
    } else {
      console.warn("Document does not exist for user:", userId);
      callback([]); // Fallback to an empty array
    }
  });
  // Return the unsubscribe function
  return unsubscribe;
}
/**
 * Gets the number of posts or reposts that a user has. The number is useful to show users on the profile screen.
 * @param {String} userId - The id of the user to perform this action.
 * @param {String} subCollection - The name of the collection we are querying in Firestore (usually `posts`).
 * @param {Array} conditions - The query conditions we specify (`reposts` == false, `reposts` == true, etc.)
 * @param {Function} callback - A callback function that receives the number of posts/reposts a user has.
 * @returns {Function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `userId` or `subCollection` is not provided or exists.
*/   
export const fetchCount = async (userId, subCollection, conditions = [], callback) => {
  if (!userId || !subCollection) {
    throw new Error("Invalid parameters: userId or subCollection is undefined");
  }
  let coll = collection(db, "profiles", userId, subCollection);
  if (conditions.length > 0) {
    coll = query(coll, ...conditions);
  }
  try {
    const snapshot = await getCountFromServer(coll);
    callback(snapshot.data().count);
  } 
  catch (error) {
    console.error("Error fetching count:", error);
    callback(0); // Fallback to 0 on error
  }
};
/**
 * When activated, adds a document to friends chats, the specific friend's message notifications and updates the lastMessage and lastMessageTimestamp.
 * @param {String} userId - The id of the user used to complete the `user` fieldValue in the Firestore documents.
 * @param {String} friendId - The id of the `friends` (combination of both userIds). This is the main friendId in the `chats`.
 * @param {Object} newMessage - The message that was sent from the user to their friend.
 * @param {String} id - The id of the friend that the message is being sent to. 
 * @param {String} firstName - The first name of the friend that the message is being sent to. Used to complete a fieldValue in the Firestore documents.
 * @param {String} lastName - The last name of the friend that the message is being sent to. Used to complete a fieldValue in the Firestore documents.
 * @param {String} pfp - The profile picture of the friend that the message is being sent to. Used to complete a fieldValue in the Firestore documents.
 * @returns {Function} - An unsubscribe function to stop listening to changes.
 * @throws {Error} - If `userId` or `friendId` or `id` is not provided or exists.
*/  
export const sendMessage = async({friendId, newMessage, id, userId, firstName, lastName, pfp}) => {
  if (!userId || !friendId || !id) {
    throw new Error("Invalid parameters: userId and/or friendId and/or id is undefined");
  }
  try {
    const docRef = await addDoc(collection(db, 'friends', friendId, 'chats'), {
      message: newMessage,
      liked: false,
      toUser: id,
      user: userId,
      firstName: firstName,
      lastName: lastName,
      pfp: pfp,
      readBy: [],
      timestamp: serverTimestamp()
    })
    addDoc(collection(db, 'friends', friendId, 'messageNotifications'), {
      id: docRef.id,
      toUser: id,
      readBy: [],
      timestamp: serverTimestamp()
    }).then(async() => await updateDoc(doc(db, 'friends', friendId), {
      lastMessage: newMessage,
      messageId: docRef.id,
      readBy: [],
      active: true,
      toUser: id,
      lastMessageTimestamp: serverTimestamp()
    }
    )).then(async() => await updateDoc(doc(db, 'profiles', userId, 'friends', id), {
      lastMessageTimestamp: serverTimestamp()
    })).then(async() => await updateDoc(doc(db, 'profiles', id, 'friends', userId), {
      lastMessageTimestamp: serverTimestamp()
    }))
  } 
  catch (e) {
    console.error(e)
  }
}
/**
 * Gets first 10 comments of specific post ordered by the latest first.
 * @param {Object} focusedPost - The specific post that we are getting the comments from.
 * @param {Array} blockedUsers - Used to `filter` out comments from users that have blocked the user or from users that are blocked.
 * @param {String} collectionName - The name of the collection that we are querying from Firestore (`posts`, `videos`, etc.)
 * @returns {Promise<Object>} - A promise that resolves with an object containing a `comments` array of comment objects based on the collectionName. 
 * Each comment object includes the document ID, comment data, a loading boolean (initially false), and a showReply boolean (initially false)
 * Also resolves with a `lastVisible` object with the last Firestore document to fetch more posts if applicable.
 * @throws {Error} - If `focusedPost` or `collectionName` is not provided or exists.
*/ 
export const fetchComments = async(focusedPost, blockedUsers, collectionName) => {
  if (!collectionName || !focusedPost ) {
    throw new Error("Invalid parameters: collectionName and/or focusedPost is undefined");
  }
  let fetchedCount = 0;
  const comments = [];
  const q = query(collection(db, collectionName, focusedPost.id, 'comments'), orderBy('timestamp', 'desc'), limit(10))
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if (!blockedUsers.includes(doc.data().userId)) {
            comments.push({id: doc.id, loading: false, showReply: false, ...doc.data()})
        }
        else {
            fetchedCount++;
        }
    });
    if (fetchedCount === 10 && comments.length === 0) {
        const nextQuery = query(
        collection(db, collectionName, focusedPost.id, 'comments'),
        orderBy('timestamp', 'desc'),
        startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]), // Start after last doc
        limit(10)
        );
        const nextSnapshot = await getDocs(nextQuery);
        nextSnapshot.forEach((doc) => {
            comments.push({id: doc.id, loading: false, showReply: false, ...doc.data()})
        })
    }
    return { comments, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] };
  }
  catch (e) {
    console.error(e)
  }
}
/**
 * Gets next 10 comments of specific post ordered by the latest first after the last Firestore document fetched.
 * @param {Object} focusedPost - The specific post that we are getting the comments from.
 * @param {Object} lastCommentVisible - The last Firestore document fetched to `startAfter` to fetch more comments.
 * @param {Array} blockedUsers - Used to `filter` out comments from users that have blocked the user or from users that are blocked.
 * @param {String} collectionName - The name of the collection that we are querying from Firestore (`posts`, `videos`, etc.)
 * @returns {Promise<Object>} - A promise that resolves with an object containing a `comments` array of comment objects based on the collectionName. 
 * Each comment object includes the document ID, comment data, a loading boolean (initially false), and a showReply boolean (initially false)
 * Also resolves with a `lastVisible` object with the last Firestore document to fetch more posts if applicable.
 * @throws {Error} - If `focusedPost` or `collectionName` is not provided or exists.
*/ 
export const fetchMoreComments = async(focusedPost, lastCommentVisible, blockedUsers, collectionName) => {
  if (!collectionName || !focusedPost ) {
    throw new Error("Invalid parameters: collectionName and/or focusedPost is undefined");
  }
  const newComments = [];
  let fetchedCount = 0;
  try {
    const q = query(collection(db, collectionName, focusedPost.id, 'comments'), orderBy('timestamp', 'desc'), startAfter(lastCommentVisible), limit(10));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if (!blockedUsers.includes(doc.data().userId)) {
            newComments.push({
            id: doc.id,
            showReply: false,
            loading: false,
            ...doc.data()
            })
        }
        else {
            fetchedCount++;
        }
        
    });
    if (fetchedCount === 10 && newComments.length === 0) {
        // All 3 posts were blocked, fetch more
        const nextQuery = query(
        collection(db, collectionName, focusedPost.id, 'comments'),
        orderBy('timestamp', 'desc'),
        startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]), // Start after last doc
        limit(10)
        );
        const nextSnapshot = await getDocs(nextQuery);
        nextSnapshot.forEach((doc) => {
        newComments.push({
            id: doc.id,
            showReply: false,
            loading: false,
            ...doc.data()
            })
        })
    }
    return {newComments, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1]}
  }
  catch (e) {
    console.error(e)
  }
}
/**
 * Filters a list of users to exclude those already in the user's friends or requests list.
 * @param {Array} list - Array of user objects to filter.
 * @param {Object} user - The current user object. Must include a `uid` property.
 * @returns {Promise<Array>} - A filtered list of users.
 * @throws {Error} - If an error occurs while fetching data.
 */
export const filterPotentialFriends = async (list, user) => {
  if (!list || !user || !user.uid) {
    throw new Error('Invalid arguments: list and user with a valid uid are required.');
  }

  try {
    const filteredList = await Promise.all(
      list.map(async (item) => {
        const friendRef = doc(db, 'profiles', user.uid, 'friends', item.id);
        const requestRef = doc(db, 'profiles', user.uid, 'requests', item.id);

        const [snapshot, requestSnapshot] = await Promise.all([
          getDoc(friendRef),
          getDoc(requestRef),
        ]);

        // Include the item if it does not exist in friends or requests and is not the current user
        if (!snapshot.exists() && !requestSnapshot.exists() && item.id !== user.uid) {
          return item;
        }
        return null;
      })
    );

    return filteredList.filter((item) => item !== null);
  } catch (error) {
    console.error('Error filtering potential friends:', error);
    throw error;
  }
};
export const fetchActualRecentSearches = (userId, callback) => {
  if (!userId) {
    throw new Error("Error: 'userId' is undefined.");
  }
  const q = query(collection(db, 'profiles', userId, 'recentSearches'), where('user', '==', true), orderBy('timestamp', 'desc'), limit(3))
  const unsub = onSnapshot(q, (snapshot) => {
    const actualRecentSearches = snapshot.docs.map((doc) => ({
      id: doc.data().element.id,
      searchId: doc.id
    }));
    callback(actualRecentSearches)
  });
  return unsub;
}
export const fetchRecentSearches = (actualRecentSearches) => {
  const tempSearches = [];
  actualRecentSearches.map(async(item) => {
    const docSnap = await getDoc(doc(db, 'profiles', item.id))
    if(docSnap.exists()) {
      tempSearches.push({id: docSnap.id, searchId: item.searchId, ...docSnap.data()})
    }
  })
  return tempSearches;
}
export const logOut = async(userId) => {
  if (!userId) {
    throw new Error('userId is not defined')
  }
  await updateDoc(doc(db, 'profiles', userId),{
    notificationToken: null
  }).then(() => signOut(auth).catch((error) => {
    throw error;
  }))
}
export const fetchCliqs = async(bannedFrom) => {
  const posts = [];
  let fetchedCount = 0;
  try {
    const q = query(collection(db, 'groups'), orderBy('timestamp', 'desc'), limit(10 - posts.length));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (!bannedFrom.includes(doc.id)) {
        posts.push({ id: doc.id, transparent: false, ...doc.data() });
      } else {
        fetchedCount++;
      }
    });
    // Fetch more posts if all initial ones are blocked
    if (fetchedCount === 3 && posts.length === 0) {
      const nextQuery = query(collection(db, 'groups'), orderBy('timestamp', 'desc'), 
      startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]), limit(10 - posts.length)
      );
      const nextSnapshot = await getDocs(nextQuery);
      nextSnapshot.forEach((doc) => {
        posts.push({ id: doc.id, transparent: false, ...doc.data() });
      });
    }

    return { posts, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] };
  }
  catch (e) {
    console.error(e)
  }
}