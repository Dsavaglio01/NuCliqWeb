import React, { useState, useMemo, useEffect } from 'react'
import SearchInput from './SearchInput';
import { UserCircleIcon} from '@heroicons/react/24/outline';
import { styles } from '@/styles/styles';
import { ArrowUpLeftIcon } from '@heroicons/react/24/solid';
import { fetchUserSearchesLarge, fetchUserSearchesSmall } from '@/firebaseUtils';
import RecentSearches from './RecentSearches';
import { useRouter } from 'next/router';
import { onSnapshot,query, collection, where, limit, orderBy, getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
function UserSearchBar({searching, openSearching, closeSearching}) {
  const router = useRouter();
  const [specificSearch, setSpecificSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const {user} = useAuth();
  const [moreResults, setMoreResults] = useState(false);
  const [searches, setSearches] = useState([]);
  const [actualRecentSearches, setActualRecentSearches] = useState([]);
  const [tempSearches, setTempSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState(false);
  const [filteredGroup, setFilteredGroup] = useState([]);
  const [moreResultButton, setMoreResultButton] = useState(false);
  const handleOpen = () => {
    openSearching()
  }
  function specificSearchFunction(event) {
    setSpecificSearch(event.target.value)
  }
  const handleClose = () => {
    closeSearching()
  }
  const SearchItem = ({item, index}) => (
    <div key={index}>
        <div className='cursor-pointer w-full' style={styles.categoriesContainer} onClick={() => {setFilteredGroup([item]); handleClose()}}>
          {item.pfp ? <img src={item.pfp} style={{height: 40, width: 40, borderRadius: 8}}/> :
          <UserCircleIcon className='btn' style={{height: 40, width: 40, borderRadius: 8}}/>}
            
            <p numberOfLines={1} style={styles.categories}>@{item.username != undefined ? item.username : item.userName}</p>
            <ArrowUpLeftIcon className='btn'/>
        </div>
    </div>
  )
  useMemo(() => {
    if (specificSearch.length > 0) {
      setSearches([])
      const getData = async() => {
        if (specificSearch.length < 4) {
          const {userSearches} = await fetchUserSearchesSmall(specificSearch);
          setSearches(userSearches)
      }
      else {
        const {userSearches} = await fetchUserSearchesLarge(specificSearch);
        setSearches(userSearches)
      }
    }
      
      getData();
    }
  }, [specificSearch])
  useEffect(() => {
    if (actualRecentSearches.length > 0) {
      actualRecentSearches.map(async(item) => {
        //console.log(item.id)
        const docSnap = await getDoc(doc(db, 'profiles', item.id))
        if(docSnap.exists()) {
        setTempSearches(prevState => [...prevState, {id: docSnap.id, searchId: item.searchId, ...docSnap.data()}])
        }
      })
    }
  }, [actualRecentSearches])
  useEffect(() => {

      let unsub;
      const fetchSearches = async() => {
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'recentSearches'), where('user', '==', true), orderBy('timestamp', 'desc'), limit(3)), (snapshot) => {
          setActualRecentSearches(snapshot.docs.map((doc) => ({
            id: doc.data().element.id,
            searchId: doc.id
          })))
        })
      }
      fetchSearches();
      return unsub;
  }, [onSnapshot])
  useMemo(() => {
        if (specificSearch.length > 0) {
      setMoreResultButton(false)
      setMoreResults(false)
      setRecentSearches(true)
      const temp = specificSearch.toLowerCase()
      const tempList = Array.from(new Set(searches.map(JSON.stringify))).map(JSON.parse).filter(item => {
        if (item.userName.toLowerCase().match(temp)) {
          return item
        } 
      })
      if (tempList.length > 3) {
        setMoreResultButton(true)
      }
      setFiltered(tempList)
    }
    else {
      closeSearching()
      setFiltered([])
    }
    }, [searches])
    const renderSearches = ({item}) => {
    return (
      <div style={styles.categoriesContainer}>
        <div className='flex cursor-pointer'onClick={() => recentSearchFunction(item)}>
        {item.pfp ? <img src={item.pfp} style={{height: 40, width: 40, borderRadius: 8}}/> :
              <UserCircleIcon style={{height: 40, width: 40, borderRadius: 8}}/>
              }
            <p className='numberofLines1' style={styles.categories}>@{item.username ? item.username : item.userName}</p>
            </div>
                <XMarkIcon className='btn' onClick={() => removeSearch(item)} style={{alignSelf: 'center', marginLeft: "auto"}}/>
        </div>
    )
  }
  function recentSearchFunction(item) {
    if (item.id != user.uid) {
        router.push({pathname: '/ViewingProfile', query: {name: item.id, viewing: true}})
     }
     else {
      navigation.navigate('Profile', {screen: 'ProfileScreen', params: {name: user.uid, preview: false, viewing: false, previewImage: null, previewMade: false, applying: false}})
     }
  }
  return (
    <div className='flex flex-col w-72'>    
    <div className='mt-10 mb-3' style={{flexDirection: 'row', display: 'flex'}}>
                  <SearchInput width={window.innerWidth < 1500 ? '80%' : '100%'} value={specificSearch} icon={'magnify'} placeholder={'Search'} onFocus={() => handleOpen()} iconStyle={styles.homeIcon}
                  containerStyle={!searching ? {borderWidth: 1, borderColor: '#fff', width: '100%'} : {borderWidth: 1, borderColor: '#fff', width: '150%'}} text={searching ? true : false} onChangeText={specificSearchFunction} 
                  onClick={() => {setSpecificSearch(''); openSearching()}}/>
        
                  </div>
                  <div>
                  {searching && filtered.length == 0 && specificSearch.length > 0 ?
                  <div>
                    <p style={{color: '#fff', fontSize: 15.36, paddingHorizontal: 10, textAlign: 'center', marginRight: '5%', marginTop: '5%'}}>No Search Results</p>
                  </div> :  
                  searching && moreResults
                  ?
                  <ul
                  > 
                  {!moreResults ? filtered.slice(0, 3).map((item, index) => {
                    return (
                        <SearchItem item={item} index={index}/>
                    )
                  }) : filtered.slice(0, 10).map((item, index) => {
                    return (
                        <SearchItem item={item} index={index}/>
                    )
                  })}
                  {
                    recentSearches && searching ?
                    <RecentSearches data={tempSearches.filter((obj, index, self) => index === self.findIndex((o) => o.userName === obj.userName)).reverse()} 
                    theme={false} group={false} home={true} friend={false} ai={false} extraStyling={{width: '90%'}}
                    renderSearches={renderSearches} recentSearches={handleRecentSearches}/> : null
                  }
                  </ul>
                  : searching && (moreResults || specificSearch.length > 0) ? 
                  <div>
                  <ul
                  > 
                  {!moreResults ? filtered.slice(0, 3).map((item, index) => {
                    return (
                        <SearchItem item={item} index={index}/>
                    )
                  }) : filtered.slice(0, 10).map((item, index) => {
                    return (
                        <SearchItem item={item} index={index}/>
                    )
                  })}
                  </ul>
                  <div className='cursor-pointer' style={{alignItems: 'center', marginRight: '5%'}} onClick={() => {setRecentSearches(false); setMoreResults(true); setMoreResultButton(false);}}>
                    <p style={{paddingTop: 5, fontWeight: '400', color:"#9EDAFF", fontSize: 12.29, marginLeft: '35%'}}>See more results</p>
                    </div>
                  </div> : <></>}
                  </div>

      </div>
  )
}

export default UserSearchBar