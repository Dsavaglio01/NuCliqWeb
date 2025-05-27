// ProfileContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getProfileDetails } from '@/firebaseUtils';
const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const {user} = useAuth();
  useEffect(() => {
    if (user?.uid) {
        const fetchProfileData = async () => {
            const profileData = await getProfileDetails(user.uid);

            if (profileData) {
                setProfile(profileData)
            }
        };
        fetchProfileData();
    }
  }, [user?.uid]);
  console.log(profile)
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;