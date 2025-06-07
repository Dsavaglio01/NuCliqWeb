import React, { } from 'react'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import 'reactjs-popup/dist/index.css';
import { useSpring } from '@react-spring/web'
import { fetchMorePublicPostsExcludingBlockedUsersVideo, fetchPublicPostsExcludingBlockedUsersVideo, fetchReportedPosts} from '@/firebaseUtils'
import { styles } from '@/styles/styles'
import IndVidPost from './IndVidPost'
function VidPosts({profile}) {
  console.log(profile)
  const [meet, setMeet] = useState(true);
  const [reloadPage, setReloadPage] = useState(true);
  const [tempPosts, setTempPosts] = useState([]);
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(0);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const snapPoints = [0, 300, 600, 900];
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

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setTempPosts([]);

      if (meet && reloadPage && profile.blockedUsers !== null) {
        const { posts, lastVisible } = await fetchPublicPostsExcludingBlockedUsersVideo(profile.blockedUsers);
        setTempPosts(posts);
        setLastVisible(lastVisible);
      }

      setLoading(false);
    };

    if (reloadPage) {
      loadPosts();
    }
  }, [meet, reloadPage, profile.blockedUsers]);
  console.log(tempPosts.length)
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
        const { posts, lastVisible: newLastVisible } = await fetchMorePublicPostsExcludingBlockedUsersVideo(profile.blockedUsers, lastVisible);
        setTempPosts([...tempPosts, ...posts]);
        setLastVisible(newLastVisible);
    }
    }
  return (
    <main ref={dropdownRef}>
      <div ref={containerRef}>
          {tempPosts.map((e, index) => (
            <div key={e.id} className="video-item">
              <IndVidPost item={e} user={user} tempPosts={tempPosts} setTempPosts={setTempPosts} dropdownRef={dropdownRef} followers={profile.followers} following={profile.following} username={profile.username} reportedPosts={reportedPosts}
                blockedUsers={profile.blockedUsers} notificationToken={profile.notificationToken} pfp={profile.pfp} forSale={profile.forSale}/>
            </div>
          ))}
        
      </div>
    </main>
  )
}

export default VidPosts