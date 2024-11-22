// context/AuthContext.js
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import firebase from '../firebase';
import {onAuthStateChanged, getAuth} from 'firebase/auth'
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const [loadingInitial, setLoadingInitial] = useState(true);
   onAuthStateChanged(auth, (user) => {
        //console.log(user)
        if (user) {
              setUser(user);
        } else {

          setUser(null);

        }
        setLoadingInitial(false)
    })
    const memoedValue = useMemo(() => ({
      user
  }), [user])
  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
