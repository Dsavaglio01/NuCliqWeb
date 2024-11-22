import { db } from '@/firebase'
import { getDoc, doc, query, collection, where, onSnapshot, setDoc, getDocs, startAfter, arrayUnion, 
  serverTimestamp, updateDoc, arrayRemove, increment, orderBy, limit, startAt, endAt} from 'firebase/firestore';
export const ableToShareFunction = async (itemId) => {
    if (!itemId) {
        throw new Error("Error: 'itemId' is undefined.");
    }
    const docRef = doc(db, 'posts', itemId);
    const docSnap = await getDoc(docRef);
    
    return docSnap.exists();
}
export const ableToShareVideoFunction = async (itemId) => {
    if (!itemId) {
        throw new Error("Error: 'itemId' is undefined.");
    }
    const docRef = doc(db, 'videos', itemId);
    const docSnap = await getDoc(docRef);
    
    return docSnap.exists();
}
export const getRequests = async (userId, callback) => {
    if (!userId) {
        throw new Error("Error: 'userId' is undefined.");
    }
    const q = query(
    collection(db, 'profiles', userId, 'requests'),
    where('actualRequest', '==', true)
  );

  // Set up the onSnapshot listener
  const unsub = onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(requests); // Pass the data to the callback function
  });
  return unsub;
}
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
export const removeHomeSaveVideoFunction = async (item, user, tempPosts, setTempPosts) => {
  if (!item || !user) {
        throw new Error("Error: 'item' or 'user' is undefined.");
    }
    const updatedObject = { ...item };
    updatedObject.savedBy = item.savedBy.filter((e) => e != user.uid)
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
      savedBy: arrayRemove(user.uid)
    })
    await deleteDoc(doc(db, 'profiles', user.uid, 'saves', item.id))
    } catch (e) {
        console.error("Error updating document:", e);
    }
}
export const removeHomeSaveFunction = async (item, user, tempPosts, setTempPosts) => {
    if (!item || !user) {
        throw new Error("Error: 'item' or 'user' is undefined.");
    }
    const updatedObject = { ...item };
    updatedObject.savedBy = item.savedBy.filter((e) => e != user.uid)
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
      savedBy: arrayRemove(user.uid)
    })
    await deleteDoc(doc(db, 'profiles', user.uid, 'saves', item.id))
    } catch (e) {
        console.error("Error updating document:", e);
    }
}
export const addHomeLikeVideoFunction = async (item, likedBy, user, tempPosts, setTempPosts, schedulePushLikeNotification, username) => {
    if (!item || !user) {
    throw new Error("Error: 'item' or 'user' is undefined.");
  }
    const updatedObject = { ...item };
      if (item.username == username && !likedBy.includes(user.uid)&& !updatedObject.likedBy.includes(user.uid) ) {
        updatedObject.likedBy = [...item.likedBy, user.uid];
      const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      // Set the new array as the state
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
      // Create a new array with the replaced object
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      // Set the new array as the state
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
    } catch (error) {
        console.error(error)
    }
        
    }
}
export const addHomeLikeFunction = async (item, likedBy, user, tempPosts, setTempPosts, schedulePushLikeNotification, username) => {
    if (!item || !user) {
    throw new Error("Error: 'item' or 'user' is undefined.");
  }
    const updatedObject = { ...item };
      if (item.username == username && !likedBy.includes(user.uid)&& !updatedObject.likedBy.includes(user.uid) ) {
        updatedObject.likedBy = [...item.likedBy, user.uid];
      const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      // Set the new array as the state
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
      // Create a new array with the replaced object
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      // Set the new array as the state
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
    } catch (error) {
        console.error(error)
    }
        
    }
}
export const addHomeSaveVideoFunction = async (item, user, tempPosts, setTempPosts) => {
   if (!item || !user) {
    throw new Error("Error: 'item' or 'user' is undefined.");
  }
   const updatedObject = { ...item };
    updatedObject.savedBy = [...item.savedBy, user.uid];
      const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      // Set the new array as the state
      setTempPosts(updatedData);
  try {
    await updateDoc(doc(db, 'videos', item.id), {
      savedBy: arrayUnion(user.uid)
    });
    await setDoc(doc(db, 'profiles', user.uid, 'saves', item.id), {
      post: item,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating document:", error);
  }
}
}
export const addHomeSaveFunction = async (item, user, tempPosts, setTempPosts) => {
    if (!item || !user) {
    throw new Error("Error: 'item' or 'user' is undefined.");
  }
   const updatedObject = { ...item };
    updatedObject.savedBy = [...item.savedBy, user.uid];
      const objectIndex = tempPosts.findIndex(obj => obj.id === item.id);
    if (objectIndex !== -1) {
      // Create a new array with the replaced object
      const updatedData = [...tempPosts];
      updatedData[objectIndex] = updatedObject;
      // Set the new array as the state
      setTempPosts(updatedData);
  try {
    await updateDoc(doc(db, 'posts', item.id), {
      savedBy: arrayUnion(user.uid)
    });
    await setDoc(doc(db, 'profiles', user.uid, 'saves', item.id), {
      post: item,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

}
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
  } catch (error) {
    console.error("Error deleting reply:", error);
  }
};
export const repostFunction = async (user, blockedUsers, repostComment, forSale, notificationToken, 
    username, background, pfp, repostItem, setRepostLoading, handleClose, schedulePushRepostNotification) => {
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
export const removeLikeVideoFunction = async (item, user, tempPosts, setTempPosts) => {
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
} catch (error) {
    console.error(error)
}
}
export const removeLikeFunction = async (item, user, tempPosts, setTempPosts) => {
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
} catch (error) {
    console.error(error)
}
}
export const fetchComments = async(focusedItem, blockedUsers, comments, setComments) => {
    let unsub;
     let fetchedCount = 0;
      const fetchCards = async () => {
        const q = query(collection(db, 'posts', focusedItem.id, 'comments'), orderBy('timestamp', 'desc'), limit(10));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              if (blockedUsers.includes(doc.data().userId)) {
                fetchedCount++;
                
              }
              else {
                setComments(prevState => [...prevState, {id: doc.id, revealed: false, translateX: 0, loading: false, showReply: false, ...doc.data()}])
              }
            });
            if (fetchedCount === 10 && comments.length === 0) {
              // All 3 posts were blocked, fetch more
              const nextQuery = query(
                collection(db, 'posts', focusedItem.id, 'comments'),
                orderBy('timestamp', 'desc'),
                startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]), // Start after last doc
                limit(10)
              );
              const nextSnapshot = await getDocs(nextQuery);
              nextSnapshot.forEach((doc) => {
                setComments(prevState => [...prevState, {id: doc.id, revealed: false, translateX: 0, loading: false, showReply: false, ...doc.data()}])
              })
            }
      } 
      fetchCards();
      return unsub;
}
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
        followers: data.followers,
        following: data.following,
        forSale: data.forSale,
        firstName: data.firstName, 
        lastName: data.lastName,
        postBackground: data.postBackground,
        background: data.background,
        blockedUsers: data.blockedUsers,
        notificationToken: data.notificationToken,
      };
    } else {
      console.warn("Profile does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile details:", error);
    return null;
  }
}
export const fetchUserSearchesSmall = async (specificSearch) => {
  const userSearches = [];
  const q = query(collection(db, "profiles"), where('smallKeywords', 'array-contains', specificSearch.toLowerCase()), limit(10))
  const firstQuerySnapshot = await getDocs(q)

  firstQuerySnapshot.forEach((doc) => {
    userSearches.push({id: doc.id, ...doc.data()})
      //setHomeSearches(prevState => [...prevState, {id: doc.id, ...doc.data()}])
    
  })
  return {userSearches}
}
export const fetchUserSearchesLarge = async (specificSearch) => {
  const userSearches = [];
  const q = query(collection(db, "profiles"), where('largeKeywords', 'array-contains', specificSearch.toLowerCase()), limit(10))
  const firstQuerySnapshot = await getDocs(q)

  firstQuerySnapshot.forEach((doc) => {
    userSearches.push({id: doc.id, ...doc.data()})
      //setHomeSearches(prevState => [...prevState, {id: doc.id, ...doc.data()}])
    
  })
  return {userSearches}
}
export const fetchPublicPostsExcludingBlockedUsersVideo = async (blockedUsers) => {
  const posts = [];
  let fetchedCount = 0;

  const q = query(
    collection(db, 'videos'),
    where('private', '==', false),
    orderBy('timestamp', 'desc'),
    limit(7)
  );

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
    const nextQuery = query(
      collection(db, 'videos'),
      where('private', '==', false),
      orderBy('timestamp', 'desc'),
      startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]),
      limit(3)
    );
    const nextSnapshot = await getDocs(nextQuery);
    nextSnapshot.forEach((doc) => {
      posts.push({ id: doc.id, loading: false, postIndex: 0, ...doc.data() });
    });
  }

  return { posts, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] };
};
export const fetchPublicPostsExcludingBlockedUsers = async (blockedUsers) => {
  const posts = [];
  let fetchedCount = 0;

  const q = query(
    collection(db, 'posts'),
    where('private', '==', false),
    orderBy('timestamp', 'desc'),
    limit(7)
  );

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
    const nextQuery = query(
      collection(db, 'posts'),
      where('private', '==', false),
      orderBy('timestamp', 'desc'),
      startAfter(querySnapshot.docs[querySnapshot.docs.length - 1]),
      limit(3)
    );
    const nextSnapshot = await getDocs(nextQuery);
    nextSnapshot.forEach((doc) => {
      posts.push({ id: doc.id, loading: false, postIndex: 0, ...doc.data() });
    });
  }

  return { posts, lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] };
};
export const fetchMorePublicPostsExcludingBlockedUsersVideo = async (blockedUsers, lastVisible) => {
  const posts = [];
  let fetchedCount = 0;
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
export const fetchMorePublicPostsExcludingBlockedUsers = async (blockedUsers, lastVisible) => {
  const posts = [];
  let fetchedCount = 0;
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
export const fetchUserFeedPosts = async (userId, followingCount) => {
  const docRef = doc(db, 'userFeeds', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().posts.slice(followingCount - 7, followingCount);
  }
  return [];
};
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
      //schedulePushCommentLikeNotification(item.user, username, item.notificationToken, item.comment)
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
  } catch (error) {
      console.error(error)
    }
    }
}
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
      likedBy: arrayUnion(user.uid)
    })
  }
  catch (error) {
    console.error(error)
  }
}
export const reportItemOne = async () => {
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
    })).then(reportComment ? async() => await updateDoc(doc(db, 'profiles', user.uid), {
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
export const fetchPosts = (userId, setPosts, setLastVisible) => {
  if (!userId) {
    throw new Error("userId is undefined");
  }
  const q = query(collection(db, 'profiles', user.uid, 'posts'), where('repost', '==', false), orderBy('timestamp', 'desc'), limit(9))
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
export const fetchReposts = (userId, setReposts, setLastVisible) => {
  if (!userId) {
    throw new Error("userId is undefined");
  }
  const q = query(collection(db, 'profiles', user.uid, 'posts'), where('repost', '==', true), orderBy('timestamp', 'desc'), limit(9))
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
export const fetchMoreFreeThemes = (userId, subCollection, order, setFreeThemes, setFreeLastVisible, freeLastVisible) => {
  if (!userId || !subCollection) {
    throw new Error("userId or subcollection is undefined");
  }
  const q = query(collection(db, 'freeThemes'), orderBy(subCollection, order), startAfter(freeLastVisible), limit(10))
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const themes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      transparent: false
    }))
    setFreeThemes(themes);
    if (snapshot.docs.length > 0) {
      setFreeLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    }

  return unsubscribe;
  })
}
export const fetchFreeThemes = (userId, subCollection, order, setFreeThemes, setFreeLastVisible) => {
  if (!userId || !subCollection) {
    throw new Error("userId or subcollection is undefined");
  }
  const q = query(collection(db, 'freeThemes'), orderBy(subCollection, order), limit(10))
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const themes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      transparent: false
    }))
    setFreeThemes(themes);
    if (snapshot.docs.length > 0) {
      setFreeLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    }

  return unsubscribe;
  })

}
export const fetchMyThemes = (userId, subCollection, order, setMyThemes, setMyLastVisible) => {
  if (!userId || !subCollection) {
    throw new Error("userId is undefined");
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
export const fetchThemeSearches = async(collectionName, specificSearch, userId) => {
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
export const fetchReportedPosts = ({userId, callback}) => {
  if (!userId) {
    throw new Error("userId is undefined");
  }

  const userDocRef = doc(db, "profiles", userId);

  // Set up the Firestore listener
  const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      callback(docSnapshot.data().reportedPosts);
    } else {
      console.warn("Document does not exist for user:", userId);
      callback([]); // Fallback to an empty array
    }
  });

  // Return the unsubscribe function
  return unsubscribe;
}
export const fetchReportedThemes = ({userId, callback}) => {
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
  } catch (error) {
    console.error("Error fetching count:", error);
    callback(0); // Fallback to 0 on error
  }
};