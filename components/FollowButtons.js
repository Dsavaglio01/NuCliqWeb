import React, { useEffect, useCallback, useState, useContext } from 'react';
import FollowIcon from './FollowIcon';
import FollowingIcon from './FollowingIcon';
import RequestedIcon from './RequestedIcon';
import { getProfileDetails, getRequests } from '@/firebaseUtils';
import ProfileContext from '@/context/ProfileContext';

function FollowButtons({ user, item }) {
  const profile = useContext(ProfileContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    let unsubscribe;

    if (user.uid) {
      unsubscribe = getRequests(user.uid, (data) => {
        setRequests(data);
      });
    }

    return () => {
      if (unsubscribe) {
        return unsubscribe; 
      }
    };
  }, [user?.uid]); // Dependency on user.uid

  const handleClick = useCallback(() => {
    if (!user.uid) return;

    const isFollowing = profile.following.includes(item.userId);
    const isRequested = requests.some(e => e.id === item.userId);

    if (isFollowing) {
      removeFriend(item.userId);
    } else if (item.userId !== user.uid && !isRequested) {
      addFriend(item);
    }
  }, [user.uid, profile.following, item.userId, requests]); // Dependencies for useCallback

  return (
    <button onClick={handleClick} disabled={!user.uid || item.userId === user.uid || requests.some(e => e.id === item.userId)}> 
      {requests.some(e => e.id === item.userId) ? (
        <RequestedIcon color="#9EDAFF" width={65} height={32} />
      ) : profile.following.includes(item.userId) ? (
        <FollowingIcon color="#9EDAFF" width={70} height={32} />
      ) : item.userId === user.uid ? null : (
        <FollowIcon color="#9EDAFF" width={50} height={32} />
      )}
    </button>
  );
}

export default FollowButtons;