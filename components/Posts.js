import React, { useContext } from 'react'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import 'reactjs-popup/dist/index.css';
import { styles } from '@/styles/styles'
import { fetchUserFeedPosts, fetchPublicPostsExcludingBlockedUsers, fetchMorePublicPostsExcludingBlockedUsers} from '@/firebaseUtils'
import IndPost from './IndPost'
import ProfileContext from '@/context/ProfileContext';
function Posts({changeWidth}) {
  const profile = useContext(ProfileContext);
  const [meet, setMeet] = useState(true);
  const [reloadPage, setReloadPage] = useState(true);
  const [tempPosts, setTempPosts] = useState([]);
  const [marginClassOne, setMarginClassOne] = useState('mx-60')
  const [marginClassTwo, setMarginClassTwo] = useState('mx-42')
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followingCount, setFollowingCount] = useState(3);
  const {user} = useAuth();
  const [isFetching, setIsFetching] = useState(false);
  const bottomObserver = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setTempPosts([]);

      if (meet && reloadPage && profile.blockedUsers !== null) {
        const { posts, lastVisible } = await fetchPublicPostsExcludingBlockedUsers(profile.blockedUsers);
        setTempPosts(posts);
        setLastVisible(lastVisible);
      } 
      else if (following && reloadPage) {
        const posts = await fetchUserFeedPosts(user.uid, followingCount);
        setTempPosts(posts);
        setFollowingCount(followingCount + 7);
      }
      setLoading(false);
    };
    if (reloadPage) {
      loadPosts();
    }
  }, [meet, following, reloadPage, followingCount]);
    useEffect(() => {
      if (bottomObserver.current) {
        const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && !isFetching) {
            setIsFetching(true);
            Promise.all(fetchMorePosts()).finally(() => setIsFetching(false)); // Fetch more posts
          }
        }, { threshold: 0.5 }); // Trigger at 50% visibility
        observer.observe(bottomObserver.current);
        return () => observer.disconnect();
      }
    }, [isFetching]);
    const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && lastVisible) {
       // fetchMorePosts();
      }
    },
    {rootMargin: "0px 0px -100px 0px"}
  );
    if (node) observer.current.observe(node);

  }, [loading, lastVisible]);
  async function fetchMorePosts() {
      if (lastVisible != undefined && meet) {
        const { posts, lastVisible: newLastVisible } = await fetchMorePublicPostsExcludingBlockedUsers(profile.blockedUsers, lastVisible);
        setTempPosts([...tempPosts, ...posts]);
        setLastVisible(newLastVisible);
    }
    else if (lastVisible != undefined && following) {
      const posts = await fetchUserFeedPosts(user.uid, followingCount);
        setTempPosts([...tempPosts, ...posts]);
        setFollowingCount(followingCount + 7);
    }
    }
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) { 
        setMarginClassOne('mx-32');
        setMarginClassTwo('mx-40');
      } else {
        setMarginClassOne('mx-32');
        setMarginClassTwo('mx-40')
      }
    };
    handleResize(); // Set initial margin on component mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <body className={changeWidth ? marginClassOne : marginClassTwo} ref={dropdownRef}>
    <div className='flex-grow' style={styles.homeContainer}>
      {tempPosts.map((e, index) => {
        if (tempPosts.length === index + 1) {      
            return (
          <div ref={lastElementRef} key={e.id}>
            <IndPost user={user} item={e} pfp={profile.pfp} blockedUsers={profile.blockedUsers} followers={profile.followers} following={following} 
            forSale={profile.forSale} background={profile.postBackground} username={profile.username} notificationToken={profile.notificationToken} dropdownRef={dropdownRef}/>
          </div>
            )
          
          }
          else {
            return (
            <div key={e.id}>
              <IndPost user={user} item={e} pfp={profile.pfp} blockedUsers={profile.blockedUsers} followers={profile.followers} following={following} 
              forSale={profile.forSale} background={profile.postBackground} username={profile.username} notificationToken={profile.notificationToken} dropdownRef={dropdownRef}/>
            </div>
            )
          }
      })}
    </div>
    </body>
  )
}

export default Posts