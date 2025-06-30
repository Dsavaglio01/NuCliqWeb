import React, { useState, useMemo, useEffect } from 'react'
import SearchInput from './SearchInput';
import { UserCircleIcon} from '@heroicons/react/24/outline';
import { styles } from '@/styles/styles';
import { ArrowUpLeftIcon } from '@heroicons/react/24/solid';
import { fetchActualRecentSearches, fetchRecentSearches, fetchUserSearchesLarge, fetchUserSearchesSmall } from '@/firebaseUtils';
import RecentSearches from './RecentSearches';
import { useRouter } from 'next/router';
import { onSnapshot, collection, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
function UserSearchBar({searching, openSearching, closeSearching, noSearchInput}) {
  const router = useRouter();
  const [specificSearch, setSpecificSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const {user} = useAuth();
  const [moreResults, setMoreResults] = useState(false);
  const [searches, setSearches] = useState([]);
  const [actualRecentSearches, setActualRecentSearches] = useState([]);
  const [tempSearches, setTempSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState(false);
  const [tempPosts, setTempPosts] = useState([]);
  const [filteredGroup, setFilteredGroup] = useState([]);
  const handleOpen = () => {
    openSearching()
  }
  function specificSearchFunction(event) {
    setSpecificSearch(event.target.value)
  }
  const handleNoSearchInput = () => {
    noSearchInput();
  }
  const SearchItem = ({item, index}) => (
    <div key={index}>
      <div className='cursor-pointer' style={styles.categoriesContainer} onClick={() => {setFilteredGroup([item]); closeSearching()}}>
        {item.pfp ? 
          <img src={item.pfp} style={styles.searchPfp}/> :
          <UserCircleIcon className='btn' style={styles.searchPfp}/>}
        <p numberOfLines={1} style={styles.categories}>@{item.username != undefined ? item.username : item.userName}</p>
        <ArrowUpLeftIcon className='btn ml-auto'/>
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
    else {
      handleNoSearchInput();
    }
  }, [specificSearch])
  useEffect(() => {
    if (actualRecentSearches.length > 0) {
      const { tempSearches } = fetchRecentSearches(actualRecentSearches);
      setTempPosts(tempSearches);
    }
  }, [actualRecentSearches])
  useEffect(() => {
    let unsubscribe;

    if (user?.uid) {
      console.log(user.uid)
      unsubscribe = fetchActualRecentSearches(user.uid, (data) => {
        setActualRecentSearches(data);
      });
    }

    return () => {
      if (unsubscribe) {
        return unsubscribe; 
      }
    };
  }, [user?.uid, onSnapshot]);
  useMemo(() => {
      if (specificSearch.length > 0) {
      setMoreResults(false)
      setRecentSearches(true)
      const temp = specificSearch.toLowerCase()
      const tempList = Array.from(new Set(searches.map(JSON.stringify))).map(JSON.parse).filter(item => {
        if (item.userName.toLowerCase().match(temp)) {
          return item
        } 
      })
      if (tempList.length > 3) {
        //setMoreResultButton(true)
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
          {item.pfp ? <img src={item.pfp} style={styles.searchPfp}/> :
            <UserCircleIcon style={styles.searchPfp}/>
          }
          <p className='numberofLines1' style={styles.categories}>@{item.username ? item.username : item.userName}</p>
        </div>
        <XMarkIcon className='btn' onClick={() => removeSearch(item)} style={styles.threeDotIcon}/>
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
  function addToRecentSearches(item) {
    var element = item
    if (tempSearches.filter(e => e.id == item.id).length > 0) {
      tempSearches.map(async(e) => {
        if (e.id == e.id) {
          await setDoc(doc(db, 'profiles', user.uid, 'recentSearches', e.id), {
            group: false,
            event: false,
            element,
            user: true,
            ai: false,
            theme: false,
            friend: false,
            timestamp: serverTimestamp()
          })
        }
      })
    } 
    else {
      addDoc(collection(db, 'profiles', user.uid, 'recentSearches'), {
        group: false,
        event: false,
        element,
        user: true,
        ai: false,
        friend: false,
        theme: false,
        timestamp: serverTimestamp()
      })
    }
  }
  return (
    <div className={'w-96'}>    
      <div className='mt-10 mb-3'>
        <SearchInput width={'100%'} value={specificSearch} icon={'magnify'} placeholder={'Search'} onFocus={() => handleOpen()} iconStyle={styles.homeIcon}
        containerStyle={!searching ? {borderWidth: 1, borderColor: '#fff', width: '100%'} : {borderWidth: 1, borderColor: '#fff', width: '150%'}} text={searching ? true : false} onChangeText={specificSearchFunction} 
        onClick={() => {setSpecificSearch(''); openSearching()}} onXClick={() => {setSpecificSearch(''); closeSearching()}}/>
      </div>
      <div>
        {searching && filtered.length == 0 && specificSearch.length > 0 ?
        <div>
          <p style={styles.noSearchResultsText}>No Search Results</p>
        </div> :  
        searching && moreResults
        ?
        <ul> 
          {!moreResults ? filtered.slice(0, 3).map((item, index) => (
              <SearchItem item={item} index={index}/>
            )
          ) : filtered.slice(0, 10).map((item, index) => (
              <SearchItem item={item} index={index}/>
            )
          )}
          {recentSearches && searching ?
            <RecentSearches data={tempSearches.filter((obj, index, self) => index === self.findIndex((o) => o.userName === obj.userName)).reverse()} 
            theme={false} group={false} home={true} friend={false} ai={false} extraStyling={{width: '90%'}}
            renderSearches={renderSearches} recentSearches={handleRecentSearches}/> : null}
        </ul>
        : searching && (moreResults || specificSearch.length > 0) ? 
        <div>
          <ul> 
            {!moreResults ? filtered.slice(0, 3).map((item, index) => (
                  <SearchItem item={item} index={index}/>
              )
            ) : filtered.slice(0, 10).map((item, index) => (
                  <SearchItem item={item} index={index}/>
              )
            )}
          </ul>
          <div className='cursor-pointer' style={styles.seeMoreResultsContainer} onClick={() => {setRecentSearches(false); setMoreResults(true)}}>
            <p style={styles.seeMoreResultsText}>See more results</p>
          </div>
        </div> : <></>}
      </div>

    </div>
  )
}

export default UserSearchBar