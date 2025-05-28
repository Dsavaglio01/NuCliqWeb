import Head from 'next/head'
import useStore from '@/components/store'
import ProtectedRoute from '@/components/ProtectedRoute'
import Posts from '@/components/Posts'
import { useRouter } from 'next/router'
import { useState, useEffect, useContext, } from 'react'
import { useAuth } from '@/context/AuthContext'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import Sidebar from '@/components/Sidebar'
import { BeatLoader } from 'react-spinners'
import FollowButtons from '@/components/FollowButtons'
import UserSearchBar from '@/components/UserSearchBar'
import { styles } from '@/styles/styles'
import { fetchNewFriendsList } from '@/firebaseUtils'
import ProfileContext from '@/context/ProfileContext'

export default function Home() {
  const router = useRouter();
  const [searching, setSearching] = useState(false);
  const [list, setList] = useState([]);
  const [actualList, setActualList] = useState([]);
  const [noSearchInput, setNoSearchInput] = useState(false);
  const [listDone, setListDone] = useState(false);
  const sidebarValue = useStore((state) => state.sidebarValue);
  const [changeWidth, setChangeWidth] = useState(false);
  const {user} = useAuth();
  const profile = useContext(ProfileContext);

  useEffect(() => {
    const fetchData = async () => {
      setListDone(false);
      setList([]);
      setActualList([]);
      const {tempList} = await fetchNewFriendsList();
      setList(tempList)
    };
      fetchData(); 
      setListDone(true)

  }, []);

  /* useEffect(() => {
    if (listDone && list.length != 0) {
        const fetchFilteredList = async () => {
          try {
            const newList = await filterPotentialFriends(list, user);
            setActualList(newList);
          } 
          catch (error) {
            console.error('Error fetching filtered list:', error);
          }
        };
        fetchFilteredList();
    }
  }, [listDone, list]) */

const handleStateChange = (newState) => {
  setChangeWidth(!newState)
}

const FriendItem = ({item, index}) => (
  <div key={index}>
    <div style={styles.repostButtonContainer}>
      <div className='cursor-pointer' style={styles.friendsContainer} onClick={() => router.push({pathname: '/ViewingProfile', query: {name: item.id, viewing: true}})}>
        {item.pfp ? 
          <img src={item.pfp} style={styles.searchPfp}/> :
          <UserCircleIcon style={styles.searchPfp}/>
        }
        <div style={styles.searchInfo}>
          <p className='numberofLines1' style={styles.userTitle}>{item.firstName} {item.lastName}</p>
          <p className='numberofLines1' style={styles.timeText}>@{item.userName}</p>
        </div>   
      </div>
      {item.loading ? 
        <div style={{justifyContent: 'center'}}>
          <BeatLoader color="#9edaff" />
        </div> : 
        <div className='justify-center' style={{marginLeft: 'auto'}}>
          <FollowButtons user={user} item={item}/>
        </div>
      }
    </div>
  </div>
)
  return (
    <ProtectedRoute>
      <div className='app-container'>
        <Head>
          <title>NuCliq</title>
          <link rel="icon" href='/favicon.icon' />
        </Head>
        <div style={styles.pageContainer}>
        <div className='flex'>
          <Sidebar onStateChange={handleStateChange}/>
          <div>
            {sidebarValue || !profile ? null :
              <div className='homeContainer'>
                <section className='column column-left'>
                  <div className='flex justify-center align-center'>
                    <Posts changeWidth={changeWidth}/>
                  </div>
                  
                </section>
                <div className='column column-right mr-72'>
                  {searching && noSearchInput ? 
                    <UserSearchBar searching={searching} noSearchInput={() => setNoSearchInput(true)} closeSearching={() => setSearching(false)} openSearching={() => setSearching(true)}/> :
                    <>
                      <UserSearchBar searching={searching} noSearchInput={() => setNoSearchInput(true)} closeSearching={() => setSearching(false)} openSearching={() => setSearching(true)}/>
                      <div className='mt-5'>
                        {actualList.filter((obj, index, self) => index === self.findIndex((o) => o.id === obj.id)).map((item, index) => {
                          return (
                            <FriendItem item={item} index={index}/>
                          )
                        })}
                      </div>
                    </>
                  }
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
