import React, { useContext, useEffect, useState, useRef, useCallback } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute';
import Head from 'next/head';
import Sidebar from '@/components/Sidebar';
import useStore from '@/components/store';
import { styles } from '@/styles/styles';
import SendingModal from '@/components/SendingModal';
import ProfileContext from '@/context/ProfileContext';
import ReportModal from '@/components/ReportModal';
import { useAuth } from '@/context/AuthContext';
import { AdjustmentsHorizontalIcon, ChevronRightIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import SearchInput from '@/components/SearchInput';
import { BeatLoader } from 'react-spinners';
import GroupComponent from '@/components/Groups/GroupComponent';
import { fetchCliqs } from '@/firebaseUtils';
function GroupPage() {
  const sidebarValue = useStore((state) => state.sidebarValue);
  const [sendingModal, setSendingModal] = useState(false);
  const profile = useContext(ProfileContext);
  const [reportModal, setReportModal] = useState(false);
  const [reg, setReg] = useState(true);
  const [my, setMy] = useState(false);
  const [joined, setJoined] = useState(false);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState(false);
  const [specificSearch, setSpecificSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [filteredGroup, setFilteredGroup] = useState(null);
  const {user} = useAuth();
  const [tempPosts, setTempPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [followingCount, setFollowingCount] = useState(3);
  function setSpecificSearchFunction(event) {
    setSpecificSearch(event.target.value)
  }
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && lastVisible) {
        //fetchMoreData();
      }
    },
    {rootMargin: "0px 0px -100px 0px"}
  );
    if (node) observer.current.observe(node);

  }, [loading, lastVisible]);
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setTempPosts([]);
      if (profile) {
        if (reg && profile.bannedFrom !== null) {
          const { posts, lastVisible } = await fetchCliqs(profile.bannedFrom);
          setTempPosts(posts);
          setLastVisible(lastVisible);
        } 
/*       else if (following && reloadPage) {
        const posts = await fetchUserFeedPosts(user.uid, followingCount);
        setTempPosts(posts);
        setFollowingCount(followingCount + 7);
      } */
        setLoading(false);
      }
      
    };
    loadPosts();
  }, [profile, reg])
  return (
    <ProtectedRoute>
        <Head>
          <title>NuCliq</title>
          <link rel="icon" href='/favicon.icon' />
        </Head>
        {sidebarValue ? null :
          <div style={styles.themePageContainer}>
            <div className='flex'>
              <Sidebar />
            </div>
            <SendingModal sendingModal={sendingModal} closeSendingModal={() => setSendingModal(false)} theme={true} post={false} video={false} user={user} 
            followers={profile ? profile.followers : []} following={profile ? profile.following : []}/>
            <ReportModal reportModal={reportModal} closeReportModal={() => setReportModal(false)} theme={true} post={false} video={false}/>
            <div className='themeSidebar'>
              <div style={styles.themeHeader}>
                <p style={styles.headerText}>Cliqs</p>
                <AdjustmentsHorizontalIcon className='btn' color='#fafafa'/>
              </div>
              <div style={styles.optionHeader}>
                <div className='cursor-pointer' style={styles.sections} onClick={() => {setMy(true); setReg(false); setJoined(false)}}>
                    <p style={styles.pushNotiText}>My Cliqs</p>
                    <ChevronRightIcon className='btn'/>
                </div>
                <div className='cursor-pointer' style={styles.sections} onClick={() => {setMy(false); setReg(false); setJoined(true)}}>
                    <p style={styles.pushNotiText}>Joined Cliqs</p>
                    <ChevronRightIcon className='btn'/>
                </div>
                <div className='cursor-pointer' onClick={() => setCreateCliq(true)} style={styles.sections}>
                    <p style={styles.pushNotiText}>Create Cliq</p>
                    <ChevronRightIcon className='btn'/>
                </div>
              </div>
            </div>
            <div style={styles.themeMainContainer} className=''>
              <div>
                {searching ? <div className='flex justify-end m-10 mr-20' style={{display: 'flex'}}>
                  <SearchInput width={'40%'} autoFocus={true} value={specificSearch} icon={'magnify'} placeholder={reg ? 'Search Cliqs to Join' : my ? 'Search My Cliqs' : joined ? 'Search Joined Cliqs' 
                  : null} onFocus={() => {setRecentSearches(true); setSearching(true)}} iconStyle={styles.postIcon}
                  containerStyle={{borderWidth: 1, borderColor: "#fafafa"}} onSubmitEditing={() => {setRecentSearches(false) }} text={searching ? true : false} onChangeText={setSpecificSearchFunction} 
                  onClick={() => {setSpecificSearch(''); setRecentSearches(true); setSearching(true)}}/>
                  {<XMarkIcon className='navBtn self-center' style={{marginLeft: 10}} color='#fafafa' onClick={() => { setRecentSearches(false); setSearching(false); setFiltered([]); setSpecificSearch('')}}/>}
                  </div> :
                  <div className='flex justify-end m-10 mr-20 cursor-pointer' onClick={() => {setSearching(true); setFiltered([]); setSpecificSearch('')}}>
                    <MagnifyingGlassIcon className='btn'/>
                  </div>
                }
                {/* {searching ? 
                  <div>
                    <div className='recentThemes'>
                    {searching && filtered.length == 0 && specificSearch.length > 0 ?
                    <div>
                      <p style={styles.noSearchResultsThemeText}>No Search Results</p>
                    </div> :  
                    searching
                    ?
                    <>

                    {!moreResults ? filtered.slice(0, 3).map((item, index) => {
                      return (
                          <div key={index} className='cursor-pointer' style={styles.categoriesContainer} onClick={() => {setFilteredGroup([item]); addToRecentSearches(item); setSearching(false)}}>
                              <img src={item.images[0]} style={styles.searchPfp}/>
                              <p numberOfLines={1} style={styles.categories}>{item.name}</p>
                              <ArrowUpLeftIcon className='btn' style={styles.threeDotIcon}/>
                          </div>
                      )
                    }) : filtered.slice(0, 10).map((item, index) => {
                      return (
                          <div key={index} className='cursor-pointer' style={styles.categoriesContainer} onClick={() => {setFilteredGroup([item]); addToRecentSearches(item); setSearching(false)}}>
                              <img src={item.images[0]} style={styles.searchPfp}/>
                              <p numberOfLines={1} style={styles.categories}>{item.name}</p>
                              <ArrowUpLeftIcon className='btn' style={styles.threeDotIcon}/>
                          </div>
                      )
                    })}
                    <div className='flex justify-end'>
                    {
                      recentSearches && searching && tempSearches.filter((obj, index, self) => index === self.findIndex((o) => o.searchId === obj.searchId)).reverse().length > 0 ?
                      
                      <RecentSearches data={tempSearches.filter((obj, index, self) => index === self.findIndex((o) => o.searchId === obj.searchId)).reverse()} 
                      get={get} free={free} my={my} purchased={purchased}
                      renderSearches={renderRecentThemes}/> : null
                    }
                    </div>
                    </>
                    : null}
                    </div>
                    </div>
                    : null} 
                  */}
                <div style={styles.main} className='overflow-x-auto overflow-scroll'>
                  {!searching ? filteredGroup != null ? 
                    renderSpecific(filteredGroup)
                  :
                  reg == true && tempPosts.length > 0 ? tempPosts.map((item, index) => {
                    if (tempPosts.length === index + 1) {
                      return (
                        <GroupComponent item={item} user={user} ref={lastElementRef} freeTempPosts={freeTempPosts} setFreeTempPosts={setFreeTempPosts} myThemes={myThemes}
                        setMyThemes={setMyThemes} purchasedThemes={purchasedThemes} setPurchasedThemes={setPurchasedThemes} reportedThemes={reportedThemes} specificThemeId={(id) => setSpecificId(id)}
                        specificThemeStateTrue={(item) => setFullTheme([item])} index={index} get={get} free={free} purchased={purchased} my={my} 
                        specificState={(state) => setSpecificState(state)} specificUsername={(username) => setSpecificUsername(username)}/>
                    )
                    }
                    else {
                      return (
                        <GroupComponent item={item} user={user} specificUsername={(username) => setSpecificUsername(username)} specificState={(state) => setSpecificState(state)} ref={null} freeTempPosts={freeTempPosts} setFreeTempPosts={setFreeTempPosts} myThemes={myThemes} reportedThemes={reportedThemes} specificThemeId={(id) => setSpecificId(id)}
                        setMyThemes={setMyThemes} specificThemeStateTrue={(item) => setFullTheme([item])} purchasedThemes={purchasedThemes} setPurchasedThemes={setPurchasedThemes} index={index} get={get} free={free} purchased={purchased} my={my}/>
                      )
                    }
                  })
                  : loading ? <div style={styles.loadContainer}>
                    <BeatLoader color="#9edaff" />
                  </div> : <div style={styles.loadContainer}>
                    {<p style={styles.noThemesText}>Sorry no More Cliqs!</p>}
                    
                  </div> : null}
                </div>  
              </div>
            </div>
          </div>
        }
    </ProtectedRoute>
  )
}

export default GroupPage