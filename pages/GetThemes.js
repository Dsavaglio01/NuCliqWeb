import React, {useState, useEffect, useMemo, useCallback, useRef, useContext,} from 'react'
import SearchInput from '@/components/SearchInput'
import { collection, getDoc, getDocs, getFirestore, onSnapshot, query, where, addDoc, limit, updateDoc, orderBy, startAfter, doc, serverTimestamp, deleteDoc, documentId, startAt, endAt } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext';
import useStore from '@/components/store';
import Head from 'next/head';
import RecentSearches from '@/components/RecentSearches'
import { useRouter } from 'next/router'
import { XMarkIcon, ChevronRightIcon, AdjustmentsHorizontalIcon, ArrowUpLeftIcon} from '@heroicons/react/24/solid';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { BeatLoader } from 'react-spinners';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import CreateTheme from './CreateTheme';
import UploadGuidelines from './UploadGuidelines';
import Preview from './Preview';
import SuccessTheme from './SuccessTheme';
import SpecificTheme from './SpecificTheme';
import PriceSummary from './PriceSummary';
import HomeScreenPreview from './HomeScreenPreview';
import AddCard from './AddCard';
import ReportModal from '@/components/ReportModal';
import SendingModal from '@/components/SendingModal';
import { styles } from '@/styles/styles';
import { fetchFreeThemes, fetchMoreFreeThemes, fetchMorePurchasedThemes, fetchMyThemes, fetchPurchasedThemes, fetchReportedThemes, fetchThemeSearches } from '@/firebaseUtils';
import ProfileContext from '@/context/ProfileContext';
import FullTheme from '@/components/FullTheme';
console.log('Imported FullTheme:', FullTheme);
import ThemeComponent from '@/components/ThemeComponent';
function GetThemes () {
  const profile = useContext(ProfileContext);
  const BACKEND_URL = process.env.BACKEND_URL
  const router = useRouter();
  const {name, goToMy, registers, goToPurchased} = router.query;
  const [searching, setSearching] = useState(false);
  const [get, setGet] = useState(false);
  const [my, setMy] = useState(false);
  const sidebarValue = useStore((state) => state.sidebarValue);
  const [recentSearches, setRecentSearches] = useState(false);
  const {user} = useAuth()
  const [filtered, setFiltered] = useState([]);
  const [uploadGuidelines, setUploadGuidelines] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [free, setFree] = useState(true);
  const [fullTheme, setFullTheme] = useState(null);
  const [specificId, setSpecificId] = useState(null);
  const [file, setFile] = useState(null);
  const [sendingModal, setSendingModal] = useState(false);
  const [specificSearch, setSpecificSearch] = useState('');
  const [createTheme, setCreateTheme] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [price, setPrice] = useState(0);
  const [keywords, setKeywords] = useState('');
  const [stripeId, setStripeId] = useState(null);
  const [addCard, setAddCard] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);
  const [postChecked, setPostChecked] = useState(false);
  const [specificUsername, setSpecificUsername] = useState(null);
  const [lastVisible, setLastVisible] = useState();
  const [freeLastVisible, setFreeLastVisible] = useState();
  const [specificThemeState, setSpecificThemeState] = useState(false);
  const [specificState, setSpecificState] = useState(false);
  const [reportedThemes, setReportedThemes] = useState([]);
  const [preview, setPreview] = useState(false);
  const [moreResultButton, setMoreResultButton] = useState(false);
  const [moreResults, setMoreResults] = useState(false);
  const [myLastVisible, setMyLastVisible] = useState([]);
  const [reportModal, setReportModal] = useState(false);
  const [purchasedLastVisible, setPurchasedLastVisible] = useState([]);
  const [tempPosts, setTempPosts] = useState([]);
  const [freeTempPosts, setFreeTempPosts] = useState([]);
  const [purchased, setPurchased] = useState(false);
  const [homePreview, setHomePreview] = useState(false);
  const [myThemes, setMyThemes] = useState(null);
  const [mostPopular, setMostPopular] = useState(true);
  const [priceSummary, setPriceSummary] = useState(false);
  const [purchasedThemes, setPurchasedThemes] = useState(null);
  const [successTheme, setSuccessTheme] = useState(false);
  const [loading, setLoading] = useState(true);
  const [themeSearches, setThemeSearches] = useState([]);
  const [filteredGroup, setFilteredGroup] = useState(null);
  const [getSearches, setGetSearches] = useState([]);
  const [freeSearches, setFreeSearches] = useState([]);
  const [mySearches, setMySearches] = useState([]);
  const [purchasedSearch, setPurchasedSearch] = useState([]);
  const [tempSearches, setTempSearches] = useState([]);
  const [sortIncreasingDate, setSortIncreasingDate] = useState(false);
  const [sortDecreasingDate, setSortDecreasingDate] = useState(false);
  const [sortIncreasingPrice, setIncreasingPrice] = useState(false);
  const [sortDecreasingPrice, setDecreasingPrice] = useState(false);
  const [postDoneApplying, setPostDoneApplying] = useState(false);
  const [profileDoneApplying, setProfileDoneApplying] = useState(false);
  const [bothDoneApplying, setBothDoneApplying] = useState(false);
  const [registrationModal, setRegistrationModal] = useState(false);
  const [chosenTheme, setChosenTheme] = useState(null);
  const [useThemeModalLoading, setUseThemeModalLoading] = useState(false);
  const db = getFirestore();
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && lastVisible) {
        fetchMoreFreeData();
      }
    },
    {rootMargin: "0px 0px -100px 0px"}
  );
    if (node) observer.current.observe(node);

  }, [loading, lastVisible]);
  useEffect(() => {
    if (registers) {
      setRegistrationModal(registers)
    }
    if (goToMy) {
      new Promise (resolve => {
      setMy(true);
      setGet(false);
      setFree(false);
      setPurchased(false);
      resolve()
      }).then(() => setLoading(false))
    }
    else if (goToPurchased) {
      new Promise (resolve => {
      setMy(false);
      setGet(false);
      setFree(false);
      setPurchased(true);
      resolve()
      }).then(() => setLoading(false))
    }
  }, [router.query])
    useEffect(() => {
    let unsubscribe;

    if (user?.uid) {

      // Use the utility function to subscribe to changes
      unsubscribe = fetchReportedThemes(user.uid, setReportedThemes);
    }

    // Cleanup the listener on unmount
    return () => {
      if (unsubscribe) {
        return unsubscribe;
      }
    };
  }, [user?.uid]);
    useEffect(() => {
      if (specificSearch.length > 0) {
      setFiltered([]);
      setMoreResultButton(false)
      setMoreResults(false)
      setRecentSearches(true)
      const tempList = Array.from(new Set(themeSearches.map(JSON.stringify))).map(JSON.parse).filter(item => {
        return item
      })

      if (tempList.length > 3) {
        setMoreResultButton(true)
      }
      setFiltered(tempList)
    }
    else {
      setFiltered([])
    }
   }, [themeSearches])
  useEffect(() => {
    let unsubscribe;
    if (user.uid && purchased && sortIncreasingDate) {
      unsubscribe = fetchPurchasedThemes(user.uid, 'timestamp', 'desc', setPurchasedThemes, setPurchasedLastVisible);
    }
    else if (user.uid && purchased && sortDecreasingDate) {
      unsubscribe = fetchPurchasedThemes(user.uid, 'timestamp', 'asc', setPurchasedThemes, setPurchasedLastVisible);
    }
    else if (user.uid && purchased && sortDecreasingPrice) {
      unsubscribe = fetchPurchasedThemes(user.uid, 'price', 'asc', setPurchasedThemes, setPurchasedLastVisible);
    }
    else if (user.uid && purchased && sortIncreasingPrice) {
      unsubscribe = fetchPurchasedThemes(user.uid, 'price', 'desc', setPurchasedThemes, setPurchasedLastVisible);
    }
    return () => {
      if (unsubscribe) {
        return unsubscribe;
      }
    };
  }, [user?.uid, purchased, sortIncreasingDate, sortDecreasingDate, sortIncreasingPrice, sortDecreasingPrice]);
  useMemo(() => {
    const getSearches = async() => {
    if (specificSearch.length > 0 && get) {
      setThemeSearches([])
      const {themeSearches} = await fetchThemeSearches('products', specificSearch, user.uid);
      setThemeSearches(themeSearches)
    } 
    if (specificSearch.length > 0 && free) {
      setThemeSearches([])
      const {themeSearches} = await fetchThemeSearches('freeThemes', specificSearch, user.uid);
      setThemeSearches(themeSearches)
    } 
    if (specificSearch.length > 0 && my) {
      setThemeSearches([]);
      const {themeSearches} = await fetchThemeSearches('myThemes', specificSearch, user.uid);
      setThemeSearches(themeSearches)
    } 
    if (specificSearch.length > 0 && purchased) {
     setThemeSearches([]);
      const {themeSearches} = await fetchThemeSearches('purchased', specificSearch, user.uid);
      setThemeSearches(themeSearches)
    } 
  }
  getSearches()
  }, [specificSearch, get, free, my, purchased])
  async function fetchPurchasedData() {
    if (purchasedLastVisible != undefined && mostPopular) {
      const { tempPosts, lastPurchasedVisible } = fetchMorePurchasedThemes(user.uid, 'bought_count', 'desc', purchasedLastVisible);
      setPurchased([...purchased, ...tempPosts]);
      setPurchasedLastVisible(lastPurchasedVisible);
    }
    else if (purchasedLastVisible != undefined && sortDecreasingDate) {
      const { tempPosts, lastPurchasedVisible } = fetchMorePurchasedThemes(user.uid, 'timestamp', 'asc', purchasedLastVisible);
      setPurchased([...purchased, ...tempPosts]);
      setPurchasedLastVisible(lastPurchasedVisible);
    }
    else if (purchasedLastVisible != undefined && sortDecreasingPrice) {
      const { tempPosts, lastPurchasedVisible } = fetchMorePurchasedThemes(user.uid, 'price', 'asc', purchasedLastVisible);
      setPurchased([...purchased, ...tempPosts]);
      setPurchasedLastVisible(lastPurchasedVisible);
    }
    else if (purchasedLastVisible != undefined && sortIncreasingDate) {
      const { tempPosts, lastPurchasedVisible } = fetchMorePurchasedThemes(user.uid, 'timestamp', 'desc', purchasedLastVisible);
      setPurchased([...purchased, ...tempPosts]);
      setPurchasedLastVisible(lastPurchasedVisible);
    }
    else if (purchasedLastVisible != undefined && sortIncreasingPrice) {
      const { tempPosts, lastPurchasedVisible } = fetchMorePurchasedThemes(user.uid, 'price', 'desc', purchasedLastVisible);
      setPurchased([...purchased, ...tempPosts]);
      setPurchasedLastVisible(lastPurchasedVisible);
    }
    
  }
  
  function fetchMoreFreeData () {
    if (mostPopular && freeLastVisible != undefined) {
      const { tempPosts, lastFreeVisible } = fetchMoreFreeThemes(user.uid, 'bought_count', 'desc', freeLastVisible);
      setFreeTempPosts([...freeTempPosts, ...tempPosts])
      setFreeLastVisible(lastFreeVisible);
    }
    else if (sortIncreasingDate && freeLastVisible != undefined) {
      const { tempPosts, lastFreeVisible } = fetchMoreFreeThemes(user.uid, 'timestamp', 'desc', freeLastVisible);
      setFreeTempPosts([...freeTempPosts, ...tempPosts])
      setFreeLastVisible(lastFreeVisible);
    }
    else if (sortDecreasingDate && freeLastVisible != undefined) {
      const { tempPosts, lastFreeVisible } = fetchMoreFreeThemes(user.uid, 'timestamp', 'asc', freeLastVisible);
      setFreeTempPosts([...freeTempPosts, ...tempPosts])
      setFreeLastVisible(lastFreeVisible);
    }
  }
  function fetchMyData () {
    if (myLastVisible != undefined && mostPopular) {
      //console.log('first')
    let newData = [];
    let unsub;

      const fetchCards = async () => {
        newData = [];
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'myThemes'), orderBy('timestamp', 'desc'), startAfter(myLastVisible), limit(10)), (snapshot) => {
          snapshot.docs.map((doc) => {
            if (!myThemes.some(doc2 => doc2.id === doc.id))
              newData.push({
              id: doc.id,
              transparent: false,
              ...doc.data()
            })
            
          })
          //console.log(newData)
          if (newData.length > 0) {
                
                setMyThemes([...myThemes, ...newData])
                setMyLastVisible(snapshot.docs[snapshot.docs.length-1])
              }
        })
      }
      fetchCards();
      return unsub;
    }
    else if (myLastVisible != undefined && sortDecreasingDate) {
      //console.log('first')
    let newData = [];
    let unsub;

      const fetchCards = async () => {
  
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'myThemes'), orderBy('timestamp', 'asc'), startAfter(myLastVisible), limit(10)), (snapshot) => {
          snapshot.docs.map((doc) => {
            if (!myThemes.some(doc2 => doc2.id === doc.id))
              newData.push({
              id: doc.id,
              transparent: false,
              ...doc.data()
            })
            
          })
          //console.log(newData)
          if (newData.length > 0) {
                
                setMyThemes([...myThemes, ...newData])
                setMyLastVisible(snapshot.docs[snapshot.docs.length-1])
              }
        })
      }
      fetchCards();
      return unsub;
    }
    else if (myLastVisible != undefined && sortIncreasingDate) {
      //console.log('first')
    let newData = [];
    let unsub;

      const fetchCards = async () => {
  
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'myThemes'), orderBy('timestamp', 'desc'), startAfter(myLastVisible), limit(10)), (snapshot) => {
          snapshot.docs.map((doc) => {
            if (!myThemes.some(doc2 => doc2.id === doc.id))
              newData.push({
              id: doc.id,
              transparent: false,
              ...doc.data()
            })
            
          })
          //console.log(newData)
          if (newData.length > 0) {

                
                setMyThemes([...myThemes, ...newData])
                setMyLastVisible(snapshot.docs[snapshot.docs.length-1])
              }
        })
      }
      fetchCards();
      return unsub;
    }
  }

  function fetchMoreData () {
    if (mostPopular) {
        let newData = [];
      const fetchCards = async () => {
        const q = query(collection(db, 'products'), orderBy('stripe_metadata_bought_count', 'desc'), startAfter(lastVisible), limit(10));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                newData.push({
                    id: doc.id,
                    transparent: false,
                    ...doc.data()
                  })
              if (newData.length > 0) {
                setLoading(true)
                new Promise(resolve => {
        setTempPosts([...tempPosts, ...newData])
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
          resolve(); // Resolve the Promise after setCompleteMessages is done
      }).finally(() => setLoading(false)); 
                
              }
            });
      }
      fetchCards();
      
    }
    else if (sortIncreasingDate) {
      let newData = [];
      const fetchCards = async () => {
        const q = query(collection(db, 'products'), orderBy('stripe_metadata_timestamp', 'desc'), startAfter(lastVisible), limit(10));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                newData.push({
                    id: doc.id,
                    transparent: false,
                    ...doc.data()
                  })
              if (newData.length > 0) {
                setLoading(true)
                
                setTempPosts([...tempPosts, ...newData])
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
              }
            });
      }
      fetchCards();
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }
    else if (sortDecreasingDate) {
      let newData = [];
      const fetchCards = async () => {
        const q = query(collection(db, 'products'), orderBy('stripe_metadata_timestamp', 'asc'), startAfter(lastVisible), limit(10));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                newData.push({
                    id: doc.id,
                    transparent: false,
                    ...doc.data()
                  })
              if (newData.length > 0) {
                setLoading(true)
                
                setTempPosts([...tempPosts, ...newData])
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
              }
            });
      }
      fetchCards();
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }
    else if (sortDecreasingPrice) {
      let newData = [];
      const fetchCards = async () => {
        const q = query(collection(db, 'products'), orderBy('stripe_metadata_price', 'asc'), startAfter(lastVisible), limit(10));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                newData.push({
                    id: doc.id,
                    transparent: false,
                    ...doc.data()
                  })
              if (newData.length > 0) {
                setLoading(true)
                
                setTempPosts([...tempPosts, ...newData])
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
              }
            });
      }
      fetchCards();
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }
    else if (sortIncreasingPrice) {
      let newData = [];
      const fetchCards = async () => {
        const q = query(collection(db, 'products'), orderBy('stripe_metadata_price', 'desc'), startAfter(lastVisible), limit(10));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                newData.push({
                    id: doc.id,
                    transparent: false,
                    ...doc.data()
                  })
              if (newData.length > 0) {
                setLoading(true)
                
                setTempPosts([...tempPosts, ...newData])
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
              }
            });
      }
      fetchCards();
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    }
  }
  useEffect(() => {

      let unsub;
      const fetchSearches = async() => {
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'recentSearches'), where('getTheme', '==', true), orderBy('timestamp', 'desc'), limit(3)), (snapshot) => {
          setGetSearches(snapshot.docs.map((doc) => ({
            id: doc.id,
            searchId: doc.data().element.id
          })))
        })
      }
      fetchSearches();
      return unsub;
  }, [])
  useEffect(() => {

      let unsub;
      const fetchSearches = async() => {
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'recentSearches'), where('freeTheme', '==', true), orderBy('timestamp', 'desc'), limit(3)), (snapshot) => {
          setFreeSearches(snapshot.docs.map((doc) => ({
            id: doc.data().element.id
          })))
        })
      }
      fetchSearches();
      return unsub;
  }, [])
  useEffect(() => {

      let unsub;
      let unsub2;
      const fetchSearches = async() => {
        unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'recentSearches'), where('myTheme', '==', true), orderBy('timestamp', 'desc'), limit(3)), (snapshot) => {
          setMySearches(snapshot.docs.map((doc) => ({
            id: doc.data().element.id
          })))
        })
        unsub2 = onSnapshot(query(collection(db, 'profiles', user.uid, 'recentSearches'), where('purchasedTheme', '==', true), orderBy('timestamp', 'desc'), limit(3)), 
        (snapshot) => {
          setPurchasedSearch(snapshot.docs.map((doc) => ({
            id: doc.data().element.id
          })))
        })
      }
      fetchSearches();
      return unsub, unsub2;
  }, [])
  useEffect(() => {
    if (mySearches.length > 0 && my) {
      setTempSearches([])
      mySearches.map(async(item) => {
        //console.log('first')
        //console.log(item)
        const docSnap = await getDoc(doc(db, 'profiles', user.uid, 'myThemes', item.id))
        if (docSnap.exists()) {
          setTempSearches(prevState => [...prevState, {id: docSnap.id, searchId: item.id, ...docSnap.data()}])
        }
        
      })
    }
    
  }, [mySearches, my])
  useMemo(() => {
    if (purchasedSearch.length > 0 && purchased) {
      setTempSearches([])
      purchasedSearch.map(async(item) => {
        //console.log('first')
        //console.log(item)
        const docSnap = await getDoc(doc(db, 'profiles', user.uid, 'purchased', item.id))
        if (docSnap.exists()) {
          setTempSearches(prevState => [...prevState, {id: docSnap.id, searchId: item.id, ...docSnap.data()}])
        }
      })
    }
    
  }, [purchasedSearch, purchased])
  useEffect(() => {
    if (getSearches.length > 0 && get) {
      setTempSearches([])
      getSearches.map(async(item) => {
        //console.log('first')
        const docSnap = await getDoc(doc(db, 'products', item.searchId))
        if (docSnap.exists()) {
          setTempSearches(prevState => [...prevState, {id: docSnap.id, searchId: item.id, ...docSnap.data()}])
        }
         /* const docSnap = await getDocs(collection(db, 'profiles', user.uid, 'myThemes'), where('images', 'array-contains', item.id))
         console.log(docSnap.docs.length)
         docSnap.forEach((e) => {
            if (e.exists()) {
          setTempSearches(prevState => [...prevState, {id: e.id, ...e.data()}])
         }
         }) */
        
      })
    }
    
  }, [getSearches, get])
  useEffect(() => {
    if (freeSearches.length > 0 && free) {
      setTempSearches([])
      freeSearches.map(async(item) => {
        //console.log('first')
        //console.log(item)
        const docSnap = await getDoc(doc(db, 'freeThemes', item.id))
        if (docSnap.exists()) {
          setTempSearches(prevState => [...prevState, {id: docSnap.id, searchId: item.id, ...docSnap.data()}])
        }
         /* const docSnap = await getDocs(collection(db, 'profiles', user.uid, 'myThemes'), where('images', 'array-contains', item.id))
         console.log(docSnap.docs.length)
         docSnap.forEach((e) => {
            if (e.exists()) {
          setTempSearches(prevState => [...prevState, {id: e.id, ...e.data()}])
         }
         }) */
        
      })
    }
    
  }, [freeSearches, free])
  
  useMemo(() => {
      let unsubscribe;
    if (user.uid && my && sortIncreasingDate) {
      unsubscribe = fetchMyThemes(user.uid, 'timestamp', 'desc', setMyThemes, setMyLastVisible);
    }
    else if (user.uid && my && sortDecreasingDate) {
      unsubscribe = fetchMyThemes(user.uid, 'timestamp', 'asc', setMyThemes, setMyLastVisible);
    }
    else if (user.uid && my && sortDecreasingPrice) {
      unsubscribe = fetchMyThemes(user.uid, 'price', 'asc', setMyThemes, setMyLastVisible);
    }
    else if (user.uid && my && sortIncreasingPrice) {
      unsubscribe = fetchMyThemes(user.uid, 'price', 'desc', setMyThemes, setMyLastVisible);
    }
    return () => {
      if (unsubscribe) {
        return unsubscribe;
      }
    };
  }, [my, user?.uid, sortIncreasingDate, sortDecreasingDate, sortIncreasingPrice, sortDecreasingPrice])
  useEffect(() => {
    if (sortIncreasingDate && purchased) {
      setLoading(true)
      let unsub;
    const getThemes = async() => {
      new Promise(resolve => {
      unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'purchased'), orderBy('timestamp', 'desc')), (snapshot) => {
        setPurchasedThemes(snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          transparent: false
        })))
        setPurchasedLastVisible(snapshot.docs[snapshot.docs.length - 1])
      })
      resolve()
      }).finally(() => setLoading(false))
    }
    getThemes();
    return unsub;
    }
  }, [sortIncreasingDate, purchased])
  useEffect(() => {
    if (sortDecreasingDate && get) {
    //console.log(themes.length)
    setTempPosts([])
    setLoading(true)
    const getThemes = async() => {
      const querySnapshot = await getDocs(query(collection(db, 'products'), orderBy('stripe_metadata_timestamp', 'asc'), limit(10)));
        querySnapshot.forEach((doc) => {
          setTempPosts(prevState => [...prevState, {id: doc.id, transparent: false, ...doc.data()}])
        });
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
    }
    getThemes();
    setTimeout(() => {
      setLoading(false)
    }, 1000);
    }
  }, [sortDecreasingDate, get])
  useMemo(() => {
    if (user.uid && free && mostPopular) {
      const getThemes = async() => {
        const { tempPosts, lastFreeVisible } = await fetchFreeThemes('bought_count', 'desc');
        console.log("tempPosts: " + tempPosts)
        setFreeTempPosts(tempPosts);
        setLastVisible(lastFreeVisible);
      }
      getThemes()
    }
    else if (user.uid && free && sortIncreasingDate) {
      const getThemes = async() => {
        const { tempPosts, lastFreeVisible } = await fetchFreeThemes('timestamp', 'desc');
        console.log("tempPosts: " + tempPosts)
        setFreeTempPosts(tempPosts);
        setLastVisible(lastFreeVisible);
      }
      getThemes()
    }
    else if (user.uid && free && sortDecreasingDate) {
      const getThemes = async() => {
        const { tempPosts, lastFreeVisible } = await fetchFreeThemes('timestamp', 'asc');
        console.log("tempPosts: " + tempPosts)
        setFreeTempPosts(tempPosts);
        setLastVisible(lastFreeVisible);
      }
      getThemes()
    }
  }, [mostPopular, free, user?.uid, sortIncreasingDate, sortDecreasingDate])
  useEffect(() => {
    if (sortIncreasingDate && get) {
      setTempPosts([])
    setLoading(true)
    const getThemes = async() => {
      const querySnapshot = await getDocs(query(collection(db, 'products'), orderBy('stripe_metadata_timestamp', 'desc'), limit(10)));
        querySnapshot.forEach((doc) => {
          setTempPosts(prevState => [...prevState, {id: doc.id, transparent: false, ...doc.data()}])
        });
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
    }
    getThemes();
    setTimeout(() => {
      setLoading(false)
    }, 1000);
    }
  }, [sortIncreasingDate, get])
  useEffect(() => {
    if (sortDecreasingDate && purchased) {
      setLoading(true)
      let unsub;
    const getThemes = async() => {
      new Promise(resolve => {
      unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'purchased'), orderBy('timestamp', 'asc')), (snapshot) => {
        setPurchasedThemes(snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          transparent: false
        })))
        setPurchasedLastVisible(snapshot.docs[snapshot.docs.length - 1])
      })
      resolve()
    }).finally(() => setLoading(false))
    }
    getThemes();
    return unsub;
    }
  }, [sortDecreasingDate, purchased])
  useEffect(() => {
    if (sortIncreasingPrice && purchased) {
      setLoading(true)
      let unsub;
    const getThemes = async() => {
      new Promise(resolve => {
      unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'purchased'), orderBy('price', 'desc')), (snapshot) => {
        setPurchasedThemes(snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        setPurchasedLastVisible(snapshot.docs[snapshot.docs.length - 1])
      })
    }).finally(() => setLoading(false))
    }
    getThemes();
    return unsub;
    }
  }, [sortIncreasingPrice, purchased])
  useEffect(() => {
    if (mostPopular && purchased) {
      let unsub;
    const getThemes = async() => {
      unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'purchased'), orderBy('bought_count')), (snapshot) => {
        setPurchased(snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        setPurchasedLastVisible(snapshot.docs[snapshot.docs.length - 1])
      })
    }
    getThemes();
    setTimeout(() => {
      setLoading(false)
    }, 2000);
    return unsub;
    }
  }, [mostPopular, purchased])
  useEffect(() => {
    if (sortIncreasingPrice && get) {
      setTempPosts([])
      setLoading(true)
    const getThemes = async() => {
      const querySnapshot = await getDocs(query(collection(db, 'products'), orderBy('stripe_metadata_price', 'desc'), limit(10)));
        querySnapshot.forEach((doc) => {
          setTempPosts(prevState => [...prevState, {id: doc.id, transparent: false, ...doc.data()}])
        });
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
    }
    getThemes();
    setTimeout(() => {
      setLoading(false)
    }, 1000);
    }
  }, [sortIncreasingPrice, get])
  //console.log(get)
  useEffect(() => {
    if (mostPopular && get) {
      setTempPosts([])
    const getThemes = async() => {
      const querySnapshot = await getDocs(query(collection(db, 'products'), orderBy('stripe_metadata_bought_count', 'desc'), limit(10)));
      
        new Promise(resolve => {
        querySnapshot.forEach((doc) => {
          setTempPosts(prevState => [...prevState, {id: doc.id, transparent: false, ...doc.data()}])
        });
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
          resolve(); // Resolve the Promise after setCompleteMessages is done
      }).finally(() => setLoading(false)); 
    }
    getThemes();
    }
  }, [mostPopular, get])
  //console.log(mostPopular)
  useEffect(() => {
    if (sortDecreasingPrice && get) {
      setTempPosts([])
      setLoading(true)
    const getThemes = async() => {
      const querySnapshot = await getDocs(query(collection(db, 'products'), orderBy('stripe_metadata_price', 'asc'), limit(10)));
        querySnapshot.forEach((doc) => {
          setTempPosts(prevState => [...prevState, {id: doc.id, transparent: false, ...doc.data()}])
        });
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
    }
    getThemes();
    setTimeout(() => {
      setLoading(false)
    }, 1000);
    }
  }, [sortDecreasingPrice, get])
  useEffect(() => {
    if (sortDecreasingPrice && purchased) {
      setLoading(true)
      let unsub;
    const getThemes = async() => {
      new Promise(resolve => {
      unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'purchased'), orderBy('price', 'asc')), (snapshot) => {
        setPurchasedThemes(snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })))
        setPurchasedLastVisible(snapshot.docs[snapshot.docs.length - 1])
      })
    }).finally(() => setLoading(false))
    }
    getThemes();
    return unsub;
    }
  }, [sortDecreasingPrice, purchased])
  //console.log(themes.length)
  //console.log(user.uid)
  async function addToRecentSearches(item){
    var element = item
    if (get) {
      if (tempSearches.filter(e => e.id == item.id).length > 0) {
      //console.log('bruh')
      tempSearches.map(async(e) => {
        if (e.id == e.id) {
          //setTempId(element.id)
          await updateDoc(doc(db, 'profiles', user.uid, 'recentSearches', e.id), {
            group: false,
            event: false,
            element,
            user: false,
            ai: false,
            getTheme: true,
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
        user: false,
        ai: false,
        friend: false,
        getTheme: true,
        timestamp: serverTimestamp()
      })
    }
    }
    else if (free) {
      if (tempSearches.filter(e => e.id == item.id).length > 0) {
      //console.log('bruh')
      tempSearches.map(async(e) => {
        if (e.id == e.id) {
          //setTempId(element.id)
          await updateDoc(doc(db, 'profiles', user.uid, 'recentSearches', e.id), {
            group: false,
            event: false,
            element,
            user: false,
            ai: false,
            freeTheme: true,
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
        user: false,
        ai: false,
        friend: false,
        freeTheme: true,
        timestamp: serverTimestamp()
      })
    }
    }
    else if (purchased) {
      if (tempSearches.filter(e => e.id == item.id).length > 0) {
      //console.log('bruh')
      tempSearches.map(async(e) => {
        if (e.id == e.id) {
          //setTempId(element.id)
          await updateDoc(doc(db, 'profiles', user.uid, 'recentSearches', e.id), {
            group: false,
            event: false,
            element,
            user: false,
            ai: false,
            purchasedTheme: true,
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
        user: false,
        ai: false,
        friend: false,
        purchasedTheme: true,
        timestamp: serverTimestamp()
      })
    }
    }
    else if (my) {
      if (tempSearches.filter(e => e.id == item.id).length > 0) {
      //console.log('bruh')
      tempSearches.map(async(e) => {
        if (e.id == e.id) {
          //setTempId(element.id)
          await updateDoc(doc(db, 'profiles', user.uid, 'recentSearches', e.id), {
            group: false,
            event: false,
            element,
            user: false,
            ai: false,
            myTheme: true,
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
        user: false,
        ai: false,
        friend: false,
        myTheme: true,
        timestamp: serverTimestamp()
      })
    }
  }
  }
  
  function itemFreeToTransparent(item) {
    const updatedThemes = [...freeTempPosts];
    const objectIndex = updatedThemes.findIndex(obj => obj.id === item.id)
    updatedThemes[objectIndex].transparent = true
    setFreeTempPosts(updatedThemes)
  }
  function itemFreeNotToTransparent(item) {
    const updatedThemes = [...freeTempPosts];
    const objectIndex = updatedThemes.findIndex(obj => obj.id === item.id)
    updatedThemes[objectIndex].transparent = false
    setFreeTempPosts(updatedThemes)
  }
  function itemAllToTransparent(item) {
    const updatedThemes = [...tempPosts];
    const objectIndex = updatedThemes.findIndex(obj => obj.id === item.id)
    
    updatedThemes[objectIndex].transparent = true
    setTempPosts(updatedThemes)
  }
  function itemAllNotToTransparent(item) {
    const updatedThemes = [...tempPosts];
    const objectIndex = updatedThemes.findIndex(obj => obj.id === item.id)
    updatedThemes[objectIndex].transparent = false
    setTempPosts(updatedThemes)
  }
  async function applyToPosts() {
    console.log(chosenTheme.item.selling)
    //console.log(chosenTheme.item)
      setApplyLoading(true);
      await updateDoc(doc(db, 'profiles', user.uid), {
            postBackground: chosenTheme.item.images[0],
            postBought: chosenTheme.item.selling != undefined && chosenTheme.item.selling == true ? true : chosenTheme.item.forSale != undefined && chosenTheme.item.forSale == true ? true : false,
            postBought: chosenTheme.item.selling != undefined && chosenTheme.item.selling == true ? true : chosenTheme.item.forSale != undefined && chosenTheme.item.forSale == true ? true : false,
        }).then(() => {setTimeout(() => {
          setApplyLoading(false)
          setUseThemeModalLoading(false); setPostDoneApplying(true); setChosenTheme(null);
        }, 1000); })
    //setUseThemeModalLoading(true)
    
  }
  async function applyToProfile() {
   // setUseThemeModalLoading(true)
   setApplyLoading(true)
    await updateDoc(doc(db, 'profiles', user.uid), {
            background: chosenTheme.item.images[0],
            forSale: chosenTheme.item.selling != undefined && chosenTheme.item.selling == true ? true : chosenTheme.item.forSale != undefined && chosenTheme.item.forSale == true ? true : false,
        }).then(() => { setTimeout(() => {
          setApplyLoading(false)
          setUseThemeModalLoading(false); setProfileDoneApplying(true); setChosenTheme(null);
        }, 1000);})
  }
  async function applyToBoth() {
    setApplyLoading(true)
   //console.log(chosenTheme.item.images[0])
    await updateDoc(doc(db, 'profiles', user.uid), {
            background: chosenTheme.item.images[0],
            postBackground: chosenTheme.item.images[0],
            postBought: chosenTheme.item.selling != undefined && chosenTheme.item.selling == true ? true : chosenTheme.item.forSale != undefined && chosenTheme.item.forSale == true ? true : false,
        }).then(() => {
        setTimeout(() => {
          setApplyLoading(false)
          setUseThemeModalLoading(false); 
          setBothDoneApplying(true); 
          setChosenTheme(null); 
        }, 1000);})
  }
  async function deleteTheme(item) {

    //let url = 'https://us-central1-nucliq-c6d24.cloudfunctions.net/deleteTheme'
      Alert.alert('Delete Theme?', 'If applied to your profile page or posts, it will be removed from there as well', [
      {
        text: 'Cancel',
        onClick: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onClick: async() => {
      try {
    const response = await fetch(`${BACKEND_URL}/api/deleteTheme`, {
      method: 'POST', // Use appropriate HTTP method (GET, POST, etc.)
      headers: {
        'Content-Type': 'application/json', // Set content type as needed
      },
      body: JSON.stringify({ data: { background: profile.background, theme: item.item.images[0], postBackground: profile.postBackground, item: item, user: user.uid}}), // Send data as needed
    })
    const data = await response.json();
    if (data.done) {
    }
  } catch (error) {
    console.error('Error:', error);
  }
      }},
    ]);
  }
  async function deletePurchasedTheme(item) {
    Alert.alert('Are you sure you want to delete this theme?', 'If applied to your profile page or posts, it will be removed from there as well.', [
      {
        text: 'No',
        onClick: () => console.log(item),
        style: 'cancel',
      },
      {text: 'Yes', onClick: 
      async() => await deleteDoc(doc(db, 'profiles', user.uid, 'purchased', item.item.id)).then(async() => {
        const docSnap = await getDocs(query(collection(db, 'products'), where('images', 'array-contains', item.item.images[0])))
        const freeDocSnap = await getDocs(query(collection(db, 'freeThemes'), where('images', 'array-contains', item.item.images[0])))
        docSnap.forEach(async(e) => {
          if (e.id) {
            await deleteDoc(doc(db, 'products', e.id))
          }
        })
        freeDocSnap.forEach(async(e) => {
          if (e.id) {
            await deleteDoc(doc(db, 'freeThemes', e.id))
          }
        })
      }).then(async() => {
        const snap = await getDoc(doc(db, 'profiles', user.uid))
        let list = snap.data().cliqueBackgrounds
        let uniqueList = Array.from(new Set(list.map(JSON.stringify))).map(JSON.parse)
        uniqueList.map(async(el) => {
          const docSnap = await getDocs(query(collection(db, 'groups', el.id, 'themes'), where('images', 'array-contains', item.item.images[0])))
          const freeDocSnap = await getDocs(query(collection(db, 'groups', el.id, 'freeThemes'), where('images', 'array-contains', item.item.images[0])))
            docSnap.forEach(async(e) => {
            if (e.id) {
              await deleteDoc(doc(db, 'groups', el.id, 'themes', e.id))
            }
          })
          freeDocSnap.forEach(async(e) => {
            if (e.id) {
              await deleteDoc(doc(db, 'groups', el.id, 'freeThemes', e.id))
            }
          })
        })
      }).then(background == item.item.images[0] && postBackground == item.item.images[0] ? async() => await updateDoc(doc(db, 'profiles', user.uid), {
        background: null,
        postBackground: null
      }).then(async() => {(await getDocs(query(collection(db, 'posts'), where('userId', '==', user.uid)))).forEach(async(document) => {
          await updateDoc(doc(db, 'posts', document.id), {
            background: null
          })
        })}) : postBackground == item.item.images[0] ? async() => await updateDoc(doc(db, 'profiles', user.uid), {
        postBackground: null
      }).then(async() => {(await getDocs(query(collection(db, 'posts'), where('userId', '==', user.uid)))).forEach(async(document) => {
          await updateDoc(doc(db, 'posts', document.id), {
            background: null
          })
        })}) : background == item.item.images[0] ? async() => await updateDoc(doc(db, 'profiles', user.uid), {
        background: null
      }) : null)},

    ]);
  }
  
  function recentSearchFunction(item) {

      setFilteredGroup([item])
        setSearching(false)
  }
  const renderRecentThemes = ({item}) => {
    return (
      <div className='cursor-pointer' style={styles.categoriesContainer} onClick={() => recentSearchFunction(item)}>
        <img src={item.images[0]} style={styles.searchPfp}/>
            <p numberOfLines={1} style={styles.categories}>{item.name}</p>
            <div className='cursor-pointer' onClick={() => removeSearch(item)} style={styles.threeDotIcon}>
                <XMarkIcon className='navBtn'/>
            </div>
        </div>
    )
  }
   async function removeSearch(item) {
    console.log(item)
      await deleteDoc(doc(db, 'profiles', user.uid, 'recentSearches', item.searchId)).then(() => setTempSearches(tempSearches.filter((e) => e.id !== item.id)))
      

    //
    //console.log(item.id)
  }
  const renderSpecific = (item) => {
    return (
      <div key={item[0].id} style={styles.themeContainer} className='max-w-full'>
      <div className='cursor-pointer' onClick={() => {setSpecificThemeState(true); setSpecificId(item[0].id); setSpecificState('free'); setSpecificUsername(item[0].username)} }>
        <img src={item[0].images[0]} style={styles.specificTheme}/>
      </div>
      <div style={styles.closeSend}>
          <p className='themeText'>{item[0].name}</p>
          <div className='cursor-pointer' onClick={free ? () => itemFreeToTransparent(item[0]) : () => itemAllToTransparent(item[0])}>
            <Bars3Icon className='navBtn' color='#fafafa' style={{alignSelf: 'center'}}/>
          </div>
          
        </div>
      {item[0].transparent ? 
        <div style={styles.overlay}>
          <div style={styles.themeCloseContainer} onClick={free ? () => {itemFreeNotToTransparent(item[0] ); setChosenTheme(null)} :
            () => {itemAllNotToTransparent(item[0] ); setChosenTheme(null)}}>
            <p style={styles.closeText}>Close</p>
            <XMarkIcon className='navBtn'/>
          </div>
          <div style={styles.themeOptionsContainer}>
            <div className='cursor-pointer' style={styles.applyContainer} onClick={() => {setSpecificThemeState(true); setSpecificId(item[0] .id); setSpecificState('free'); setSpecificUsername(item[0] .username)}}>
                <p style={styles.applyText}>Get Theme</p>
              </div>
              <div className='cursor-pointer' style={styles.applyContainer} onClick={() => setSendingModal(true)}>
                <p style={styles.applyText}>Share Theme</p>
              </div>
              {!free ? item[0] .stripe_metadata_userId && item[0] .stripe_metadata_userId != user.uid && !reportedThemes.includes(item[0].id) ? 
              <div className='cursor-pointer' style={styles.applyContainer} onClick={() => setReportModal(true)}>
                <p style={styles.applyText}>Report Theme</p>
              </div>
              : null : item[0] .userId && item[0] .userId != user.uid && !reportedThemes.includes(item[0] .id) ? 
              <div className='cursor-pointer' style={styles.applyContainer} onClick={() => setReportModal(true)}>
                <p style={styles.applyText}>Report Theme</p>
              </div>
              : null}
            </div>
        </div>
      : null
      }
      </div>
    )
  }
  const handleCreateChange = (newState) => {
    setUploadGuidelines(newState)
  }
  const handlePostThemeChange = (newState) => {
    setHomePreview(newState)
  }
  const handlePriceSummaryChange = (newState) => {
    setAddCard(newState)
  }
  const handleUploadChange = (newStateOne, newStateTwo) => {
    setPreview(newStateOne)
    setFile(newStateTwo)
  }
  const handlePreviewChange= (newStateOne) => {
    console.log(newStateOne)
    setSuccessTheme(newStateOne)
  }
  const handleChangeImage = (newStateOne) => {
    setFile(newStateOne)
  }
  const handleSuccessThemeChange = (newStateOne, name, theme, price, keywords, stripeId, profileChecked, postChecked, notificationToken ) => {
    setPriceSummary(newStateOne)
    setThemeName(name)
    setFile(theme)
    setPrice(price)
    setKeywords(keywords)
    setStripeId(stripeId)
    setProfileChecked(profileChecked)
    setPostChecked(postChecked)
    setNotificationToken(notificationToken)
  }
  function setSpecificSearchFunction(event) {
    setSpecificSearch(event.target.value)
  }
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
                  
                  <p style={styles.headerText}>Themes</p>
                  <AdjustmentsHorizontalIcon className='btn' color='#fafafa'/>
              </div>
              <div style={styles.optionHeader}>
                  <div className='cursor-pointer' style={styles.sections} onClick={() => {setMy(false); setFree(true); setPurchased(false)}}>
                      <p style={styles.pushNotiText}>Get Themes</p>
                      <ChevronRightIcon className='btn'/>
                  </div>
                  <div className='cursor-pointer' style={styles.sections} onClick={() => {setMy(true); setFree(false); setPurchased(false)}}>
                      <p style={styles.pushNotiText}>My Themes</p>
                      <ChevronRightIcon className='btn'/>
                  </div>
                  <div className='cursor-pointer' style={styles.sections} onClick={() => {setMy(false); setFree(false); setPurchased(true)}}>
                      <p style={styles.pushNotiText}>Collected Themes</p>
                      <ChevronRightIcon className='btn'/>
                  </div>
                  <div className='cursor-pointer' onClick={() => setCreateTheme(true)} style={styles.sections}>
                      <p style={styles.pushNotiText}>Create Theme</p>
                      <ChevronRightIcon className='btn'/>
                  </div>
                  
              </div>
          </div>
         <div style={styles.themeMainContainer} className=''>
          

          {!createTheme && !uploadGuidelines && !preview && !successTheme && !priceSummary &&!addCard && !specificThemeState && !homePreview && !fullTheme ? 
          <div>
            {searching ? <div className='flex justify-end m-10 mr-20' style={{display: 'flex'}}>
                  <SearchInput width={'40%'} autoFocus={true} value={specificSearch} icon={'magnify'} placeholder={get ? 'Search Themes to Buy' : free ? 'Search Themes to Get' : my ? 'Search My Themes' : purchased ? 'Search Collected Themes' 
                  : null} onFocus={() => {setRecentSearches(true); setSearching(true)}} iconStyle={styles.postIcon}
                  containerStyle={{borderWidth: 1, borderColor: "#fafafa"}} onSubmitEditing={() => {setRecentSearches(false) }} text={searching ? true : false} onChangeText={setSpecificSearchFunction} 
                  onClick={() => {setSpecificSearch(''); setRecentSearches(true); setSearching(true)}}/>
                  {<XMarkIcon className='navBtn self-center' style={{marginLeft: 10}} color='#fafafa' onClick={() => { setRecentSearches(false); setSearching(false); setFiltered([]); setSpecificSearch('')}}/>}
                  </div> :
            <div className='flex justify-end m-10 mr-20 cursor-pointer' onClick={() => {setSearching(true); setFiltered([]); setSpecificSearch('')}}>
              <MagnifyingGlassIcon className='btn'/>
            </div>}
           {searching ? 
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
           <div style={styles.main} className='overflow-x-auto overflow-scroll'>
            

              {!searching ? filteredGroup != null ? 
            renderSpecific(filteredGroup)
          :
          get == true && name == null && tempPosts.length > 0 ? tempPosts.map((item, index) => {
            if (tempPosts.length === index + 1) {
              return (
                <ThemeComponent item={item} user={user} ref={lastElementRef} freeTempPosts={freeTempPosts} setFreeTempPosts={setFreeTempPosts} myThemes={myThemes}
                setMyThemes={setMyThemes} purchasedThemes={purchasedThemes} setPurchasedThemes={setPurchasedThemes} reportedThemes={reportedThemes} specificThemeId={(id) => setSpecificId(id)}
                specificThemeStateTrue={(item) => setFullTheme([item])} index={index} get={get} free={free} purchased={purchased} my={my} 
                specificState={(state) => setSpecificState(state)} specificUsername={(username) => setSpecificUsername(username)}/>
            )
            }
            else {
              return (
                <ThemeComponent item={item} user={user} specificUsername={(username) => setSpecificUsername(username)} specificState={(state) => setSpecificState(state)} ref={null} freeTempPosts={freeTempPosts} setFreeTempPosts={setFreeTempPosts} myThemes={myThemes} reportedThemes={reportedThemes} specificThemeId={(id) => setSpecificId(id)}
                setMyThemes={setMyThemes} specificThemeStateTrue={(item) => setFullTheme([item])} purchasedThemes={purchasedThemes} setPurchasedThemes={setPurchasedThemes} index={index} get={get} free={free} purchased={purchased} my={my}/>
              )
            }
          }) :
          free && freeTempPosts && freeTempPosts.length > 0
          ? 
          freeTempPosts.map((item, index) => {
            if (freeTempPosts.length === index + 1) {      
            return (
                <ThemeComponent user={user} ref={lastElementRef} specificUsername={(username) => setSpecificUsername(username)} specificState={(state) => setSpecificState(state)} specificThemeId={(id) => setSpecificId(id)} reportedThemes={reportedThemes} freeTempPosts={freeTempPosts} setFreeTempPosts={setFreeTempPosts} myThemes={myThemes}
                setMyThemes={setMyThemes} specificThemeStateTrue={(item) => setFullTheme([item])} purchasedThemes={purchasedThemes} setPurchasedThemes={setPurchasedThemes} item={item} index={index} get={get} free={free} my={my} purchased={purchased}/>
            ) 
            }
            else {
              return (
                 <ThemeComponent user={user} ref={null} specificUsername={(username) => setSpecificUsername(username)} specificState={(state) => setSpecificState(state)} specificThemeId={(id) => setSpecificId(id)} reportedThemes={reportedThemes} freeTempPosts={freeTempPosts} setFreeTempPosts={setFreeTempPosts} myThemes={myThemes}
                setMyThemes={setMyThemes} specificThemeStateTrue={(item) => setFullTheme([item])} purchasedThemes={purchasedThemes} setPurchasedThemes={setPurchasedThemes} item={item} index={index} get={get} free={free} my={my} purchased={purchased}/>
              )
            }
          })
          : my && myThemes && myThemes.length > 0 ? 
         myThemes.map((item, index) => {
            if (myThemes.length === index + 1) {      
            return (
               <ThemeComponent user={user} ref={lastElementRef} specificUsername={(username) => setSpecificUsername(username)} specificState={(state) => setSpecificState(state)} specificThemeId={(id) => setSpecificId(id)} reportedThemes={reportedThemes} freeTempPosts={freeTempPosts} setFreeTempPosts={setFreeTempPosts} myThemes={myThemes}
                setMyThemes={setMyThemes} specificThemeStateTrue={(item) => setFullTheme([item])} purchasedThemes={purchasedThemes} setPurchasedThemes={setPurchasedThemes} item={item} index={index} get={get} free={free} my={my} purchased={purchased}/>
            ) 
            }
            else {
              return (
               <ThemeComponent user={user} ref={null} specificUsername={(username) => setSpecificUsername(username)} specificState={(state) => setSpecificState(state)} specificThemeId={(id) => setSpecificId(id)} reportedThemes={reportedThemes} freeTempPosts={freeTempPosts} setFreeTempPosts={setFreeTempPosts} myThemes={myThemes}
                setMyThemes={setMyThemes} specificThemeStateTrue={(item) => setFullTheme([item])} purchasedThemes={purchasedThemes} setPurchasedThemes={setPurchasedThemes} item={item} index={index} get={get} free={free} my={my} purchased={purchased}/>
              )
            }
          })
          : purchased && purchasedThemes && purchasedThemes.length > 0 ?
          purchasedThemes.map((item, index) => {
            if (purchasedThemes.length === index + 1) {      
            return (
                <ThemeComponent user={user} ref={lastElementRef} specificUsername={(username) => setSpecificUsername(username)} specificState={(state) => setSpecificState(state)} specificThemeId={(id) => setSpecificId(id)} reportedThemes={reportedThemes} freeTempPosts={freeTempPosts} setFreeTempPosts={setFreeTempPosts} myThemes={myThemes}
                setMyThemes={setMyThemes} specificThemeStateTrue={(item) => setFullTheme([item])} purchasedThemes={purchasedThemes} setPurchasedThemes={setPurchasedThemes} item={item} index={index} get={get} free={free} my={my} purchased={purchased}/>
            ) 
            }
            else {
              return (
                <ThemeComponent user={user} ref={null} specificUsername={(username) => setSpecificUsername(username)} specificState={(state) => setSpecificState(state)} specificThemeId={(id) => setSpecificId(id)} reportedThemes={reportedThemes} freeTempPosts={freeTempPosts} setFreeTempPosts={setFreeTempPosts} myThemes={myThemes}
                setMyThemes={setMyThemes} specificThemeStateTrue={(item) => setFullTheme([item])} purchasedThemes={purchasedThemes} setPurchasedThemes={setPurchasedThemes} item={item} index={index} get={get} free={free} my={my} purchased={purchased}/>
              )
            }
          })
          : loading ? <div style={styles.loadContainer}>
            <BeatLoader color="#9edaff" />
          </div> : <div style={styles.loadContainer}>
            {purchased ? <p style={styles.noThemesText}>Sorry you have no Purchased Themes!</p> : my ? <p style={styles.noThemesText}>Sorry you have no themes created right now!</p> :
            free ? <p style={styles.noThemesText}>Sorry no Themes to Get Right Now!</p> : <p style={styles.noThemesText}>Sorry no Themes to Get Right Now!</p>}
            
          </div> : null}
           </div> 
           </div>
           : createTheme && !uploadGuidelines && !preview && !successTheme && !priceSummary &&!addCard && !specificThemeState && !fullTheme && !homePreview ? <CreateTheme onStateChange={handleCreateChange}/> : uploadGuidelines && !preview && !successTheme  && !specificThemeState
           ? <UploadGuidelines handleStateChange={handleUploadChange}/> : preview && !successTheme && !priceSummary &&!addCard && !homePreview && !specificThemeState && !fullTheme ? <Preview file={file} onStateChange={handlePreviewChange} changeImageData={handleChangeImage}/> 
           : successTheme && !priceSummary &&!addCard && !homePreview && !specificThemeState && !fullTheme ? <SuccessTheme  post={file} handleStateChange={handleSuccessThemeChange}/> : priceSummary &&!addCard && !homePreview && !specificThemeState ?
            <PriceSummary handleStateChange={handlePriceSummaryChange} name={themeName} theme={file} keywords={keywords} stripeId={stripeId} price={price} notificationToken={notificationToken} profileChecked={profileChecked} postChecked={postChecked} /> :
            addCard && !homePreview && !specificThemeState && !fullTheme ? <AddCard /> :
           specificThemeState && !homePreview && !fullTheme ? <SpecificTheme onStateChange={handlePostThemeChange} specificId={specificId} specificUsername={specificUsername} specificState={specificState}/> : homePreview && !fullTheme ? <HomeScreenPreview />
           : fullTheme ? <FullTheme theme={fullTheme} profile={profile}/> : null}
         </div>
      </div>}
    </ProtectedRoute>
  )
}

export default GetThemes