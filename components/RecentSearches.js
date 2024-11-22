import React from 'react'
import { useRouter } from 'next/router'
import { getDocs, query, collection, where, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase';
const RecentSearches = ({data, renderSearches, recentSearches, extraStyling, group, home, friend, theme, ai, get, my, free, purchased}) => {
    const router = useRouter();
    const {user} = useAuth();
    const recentCategories = {
    fontWeight: 'bold',
    marginTop: '5%',
    width: '22.5vw',
    borderRadius: 5,
    borderBottomWidth: 1,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between'
    }
    const recentCategoriesText = {
        fontSize: 15.36,
    padding: 5,
    color: "#fff"
    }
    const clearAllText = {
        fontSize: 12.29,
    padding: 5,
    color: "#9edaff"
    }
     async function deleteAllSearches() {
        recentSearches
        const docSnap = await getDocs(query(collection(db, 'profiles', user.uid, 'recentSearches'), where('user', '==', true)))
        docSnap.forEach(async(e) => {
          await deleteDoc(doc(db, 'profiles', user.uid, 'recentSearches', e.id))
        })
        
      
    }
  return (
    <>
    <div style={recentCategories}>
        <p style={recentCategoriesText}>Recent</p>
        <div onClick={() => deleteAllSearches()} className='cursor-pointer'>
        <p style={clearAllText} >Clear All</p>
        </div>
    </div>
    <div>
            {data.map(item => (
                <div key={item.id}> 
                    {renderSearches({ item })} 
                </div>
            ))}
        </div>
    </>
  )
}

export default RecentSearches