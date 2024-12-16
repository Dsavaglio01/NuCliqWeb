import React from 'react'
import { useState, useEffect } from 'react';
import { onSnapshot, query, collection, where, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
import { useRouter } from 'next/router';
import { fetchPosts, fetchReposts,fetchCount} from '@/firebaseUtils';
import ProfileComponent from '@/components/ProfileComponent';
function Profile() {
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [numberOfReposts, setNumberOfReposts] = useState(0);
  const [numberOfPosts, setNumberOfPosts] = useState(0);
  const [reposts, setReposts] = useState(0);
  const [posts, setPosts] = useState([]);
  const [postSetting, setPostSetting] = useState(true);
  const [repostSetting, setRepostSetting] = useState(false);
  const {user} = useAuth();
  const router = useRouter();

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
    if (user?.uid) {
      fetchCount(user.uid, 'posts', [where('repost', '==', false)], setNumberOfPosts);
      fetchCount(user.uid, 'posts', [where('repost', '==', true)], setNumberOfReposts);
    }
  }, [user?.uid]);
  return (
    <ProfileComponent viewing={false} preview={null} previewMade={null} />
  )
}

export default Profile