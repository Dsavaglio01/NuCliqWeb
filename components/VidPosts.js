import React from 'react'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import 'reactjs-popup/dist/index.css';
import { useRouter } from 'next/router'
import { useSpring } from '@react-spring/web'
import { fetchMorePublicPostsExcludingBlockedUsersVideo, fetchPublicPostsExcludingBlockedUsersVideo, fetchReportedPosts, 
  getProfileDetails} from '@/firebaseUtils'
import { styles } from '@/styles/styles'
import IndVidPost from './IndVidPost'
function VidPosts() {
  const [meet, setMeet] = useState(true);
  const [reloadPage, setReloadPage] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState(null);
  const [tempPosts, setTempPosts] = useState([]);
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(0);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [forSale, setForSale] = useState(false);
  const [background, setBackground] = useState(null);
  const [loading, setLoading] = useState(false);
  const snapPoints = [0, 300, 600, 900];
  const [following, setFollowing] = useState(false);
  const [username, setUsername] = useState('')
  const [pfp, setPfp] = useState(null);
  const [notificationToken, setNotificationToken] = useState(null); 
  const {user} = useAuth();
  const [isFetching, setIsFetching] = useState(false);
  const bottomObserver = useRef(null);
  const dropdownRef = useRef(null);
  // useEffect to handle the initial fast scroll
  useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const handleWheel = (event) => {
    event.preventDefault();

    if (!isScrolling) {
      setIsScrolling(true);
      const delta = Math.sign(event.deltaY);
      setScrollDirection(delta);

      // Calculate and set the targetIndex
      let newIndex = activeIndex + delta; // Use delta to determine direction
      newIndex = Math.max(0, Math.min(newIndex, 2));

      container.scrollTo({
        top: newIndex * container.offsetHeight,
        behavior: "smooth",
      });
      setTimeout(() => {
        setIsScrolling(false);
        setActiveIndex(newIndex);
      }, 1500);
    }
  };

  container.addEventListener("wheel", handleWheel);
  return () => container.removeEventListener("wheel", handleWheel);
}, [activeIndex, isScrolling, scrollDirection]);
  const [{ scrollY }, set] = useSpring(() => ({ scrollY: 0, 
    config: {clamp: true, mass: 1, tension: 180, friction: 12},
    onRest: ({ value }) => {
    const { scrollY } = value;
    const closestSnapPoint = snapPoints.reduce((prev, curr) => {
      return Math.abs(curr - scrollY) < Math.abs(prev - scrollY) ? curr : prev;
    });
    // Add a small threshold for snapping
    if (Math.abs(scrollY - closestSnapPoint) < 10) { 
      set({ scrollY: closestSnapPoint });
    }
  }
  
  }));
  useEffect(() => {
    let unsubscribe;

    if (user?.uid) {
      // Use the utility function to subscribe to changes
      unsubscribe = fetchReportedPosts(user.uid, setReportedPosts);
    }

    // Cleanup the listener on unmount
    return () => {
      if (unsubscribe) {
        return unsubscribe;
      }
    };
  }, [user?.uid]);
    /* useEffect(() => {
      const getUsernames = async() => {
        (await getDocs(collection(db, 'usernames'))).forEach((doc) => {
          setUsernames(prevState  => [...prevState, doc.data().username])
        })
      }
      getUsernames()
    }, []) */
  useEffect(() => {
    if (user.uid) {
    const fetchProfileData = async () => {
      const profileData = await getProfileDetails(user.uid);

      if (profileData) {
        setUsername(profileData.username);
        setPfp(profileData.pfp);
        setFollowers(profileData.followers);
        setFollowing(profileData.following);
        setForSale(profileData.forSale);
        setBackground(profileData.postBackground);
        setBlockedUsers(profileData.blockedUsers);
        setNotificationToken(profileData.notificationToken);
      }
    };

    fetchProfileData();
  }
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setTempPosts([]);

      if (meet && reloadPage && blockedUsers !== null) {
        const { posts, lastVisible } = await fetchPublicPostsExcludingBlockedUsersVideo(blockedUsers);
        setTempPosts(posts);
        setLastVisible(lastVisible);
      }

      setLoading(false);
    };

    if (reloadPage) {
      loadPosts();
    }
  }, [meet, reloadPage, blockedUsers]);
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
  async function fetchMorePosts() {
      if (lastVisible != undefined && meet) {
        const { posts, lastVisible: newLastVisible } = await fetchMorePublicPostsExcludingBlockedUsersVideo(blockedUsers, lastVisible);
        setTempPosts([...tempPosts, ...posts]);
        setLastVisible(newLastVisible);
    }
    }
  return (
    <body className='flex justify-center' style={{marginLeft: '22.5vw'}} ref={dropdownRef}>
      <div style={styles.videoContainer} className='vidContainer' ref={containerRef}>
        {tempPosts.map((e, index) => (
          <div key={e.id} className="video-item">
            <IndVidPost item={item} user={user} followers={followers} following={following} username={username} reportedPosts={reportedPosts}
              blockedUsers={blockedUsers} notificationToken={notificationToken} pfp={pfp} forSale={forSale} background={background}/>
          </div>
        ))}
      </div>
    </body>
  )
}

export default VidPosts