import React, { useEffect, useMemo, useState, useContext } from 'react'
import { onSnapshot, collection, query, orderBy, limit, startAfter, where, startAt, endAt, getDocs} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '@/context/AuthContext';
import _ from 'lodash';
import SearchInput from '@/components/SearchInput';
import { useRouter } from 'next/router';
import { ArrowUpLeftIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import { BeatLoader } from 'react-spinners';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
const styles = {
  container: {
    flex: 1,
  },
  noPaddingReceiptText: {
    padding: 10,
    paddingLeft: 10,
    fontSize: 15.36,
    color: "#fafafa",
    width: '50%',
    fontWeight: '600',
    textAlign: 'right',
    paddingTop: 0
  },
  receiptText: {
    padding: 10,
    paddingLeft: 10,
    fontSize: 15.36,
    color: "#fafafa",
    width: '50%',
    textAlign: 'right'
  },
  noPaddingDataReceiptText: {
    padding: 10,
    paddingLeft: 10,
    fontSize: 15.36,
    fontWeight: '600',
    color: "#fafafa",
    width: '50%',
    textAlign: 'left',
    paddingTop: 0
  },
  dataReceiptText: {
    padding: 10,
    paddingLeft: 10,
    fontSize: 15.36,
    fontWeight: '600',
    color: "#fafafa",
    width: '50%',
    textAlign: 'left'
  },
  headerText: {
    fontSize: 24,
    color: "#fafafa",
    textAlign: 'center',
    padding: 10,
    margin: '2.5%',
    //marginTop: '8%',
    fontWeight: '700'
  },
  itemContainer: {flexDirection: 'row', display: 'flex'},
  messageText: {
      fontSize: 19.20, 
      color: "#fafafa", 
      alignSelf: 'center', 
      fontWeight: '600',
      padding: 7.5,
      paddingRight: 0, 
      paddingLeft: 0,
    },
    homeIcon: {position: 'absolute', left: 320, top: 8.5},
  homeContainer: {marginLeft: '5%', marginBottom: '5%'},
  closeHomeIcon: {position: 'absolute', left: 320, top: 10},
  categoriesContainer: {
    borderRadius: 5,
    flexDirection: 'row',
    //marginRight: '5%',
    marginTop: 5,
    padding: 5,
    alignItems: 'center',
    //justifyContent: 'space-between',
    width: '95%',
  },
  categories: {
    fontSize: 15.36,
    padding: 10,
    width: '80%',
    color: "#fafafa"
  },
  buttons: {
    borderWidth: 1,
    //width: '45%',
    color: "#fafafa",
    borderRadius: 5,
    marginTop: '2.5%'
    
  },
  colorButtons: {
     borderWidth: 1,
    //width: '45%',
    color: "#9edaff",
    borderRadius: 5,
    marginTop: '2.5%'
  },
  buttonText: {
    color: "#fafafa",
    fontSize: 15.36,
    textAlign: 'center',
    padding: 10
  },
  colorButtonText: {
color: "#9edaff",
    fontSize: 15.36,
    textAlign: 'center',
    padding: 10
  }
}
const TransactionHistory = () => {
  const {user} = useAuth();
  const [lastVisible, setLastVisible] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(true);
  const router = useRouter();
  const [descendingDate, setDescendingDate] = useState(true);
  const [sellingSearches, setSellingSearches] = useState([]);
  const [ascendingDate, setAscendingDate] = useState(false);
  const [themeSearches, setThemeSearches] = useState([]);
  const [specificSearch, setSpecificSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [filteredGroup, setFilteredGroup] = useState([]);
      const [moreResultButton, setMoreResultButton] = useState(false);
    const [moreResults, setMoreResults] = useState(false);
  useEffect(() => {
    if (themeSearches.length > 0) {
      if (specificSearch.length > 0) {
      setMoreResultButton(false)
      setMoreResults(false)
      const temp = specificSearch.toLowerCase()
      //console.log(temp)
      const tempList = Array.from(new Set(themeSearches.map(JSON.stringify))).map(JSON.parse).filter(item => {
        if (item.name.toLowerCase().match(temp)) {
          return item
        } 
        
      })
      if (tempList.length > 3) {
        setMoreResultButton(true)
      }
      setFiltered(tempList)
    }
    else {
      setFiltered([])
    }
    }
    else if (sellingSearches.length > 0) {
      if (specificSearch.length > 0) {
      setMoreResultButton(false)
      setMoreResults(false)
      const temp = specificSearch.toLowerCase()
      //console.log(temp)
      const tempList = Array.from(new Set(sellingSearches.map(JSON.stringify))).map(JSON.parse).filter(item => {
        if (item.name.toLowerCase().match(temp)) {
          return item
        } 
        
      })
      if (tempList.length > 3) {
        setMoreResultButton(true)
      }
      setFiltered(tempList)
    }
    else {
      setFiltered([])
    }
    }
   }, [themeSearches, sellingSearches])
   useMemo(() => {
    if (specificSearch.length > 0 && purchased) {
      setThemeSearches([])
      const getData = async() => {
        const q = query(collection(db, 'profiles', user.uid, 'purchased'), orderBy('name'), startAt(specificSearch), endAt(specificSearch + '\uf8ff'));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          setThemeSearches(prevState => [...prevState, {id: doc.id, ...doc.data()}])
        });
      }
      getData();
    }
    else if (specificSearch.length > 0 && !purchased) {
      setSellingSearches([])
      const getData = async() => {
        const q = query(collection(db, 'profiles', user.uid, 'sold'), orderBy('name'), startAt(specificSearch), endAt(specificSearch + '\uf8ff'));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          setSellingSearches(prevState => [...prevState, {id: doc.id, ...doc.data()}])
        });
      }
      getData();
    } 
   }, [specificSearch, purchased])
  useEffect(() => {
    if (descendingDate && purchased) {
      setPosts([]);
      setLoading(true)
      let unsub;
          const getSaves = async() => {
            unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'purchased'), where('price', '>', 0), orderBy('timestamp', 'desc'), limit(3)), (snapshot) => {
              setLastVisible(snapshot.docs[snapshot.docs.length-1])
              snapshot.docs.map(async(document) => {
                setPosts(prevState => [...prevState, {id: document.id, ...document.data()}])
              })
            })
          } 
          getSaves();
          setTimeout(() => {
            setLoading(false)
          }, 1000);
          return unsub;
    }
    else if (ascendingDate && purchased) {
      setPosts([]);
      setLoading(true)
      let unsub;
          const getSaves = async() => {
            unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'purchased'), where('price', '>', 0), orderBy('timestamp', 'asc'), limit(3)), (snapshot) => {
              setLastVisible(snapshot.docs[snapshot.docs.length-1])
              snapshot.docs.map(async(document) => {
                setPosts(prevState => [...prevState, {id: document.id, ...document.data()}])
              })
            })
          } 
          getSaves();
          setTimeout(() => {
            setLoading(false)
          }, 1000);
          return unsub;
    }
    else if (descendingDate && !purchased) {
      setPosts([]);
      setLoading(true)
      let unsub;
          const getSaves = async() => {
            unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'sold'), where('price', '>', 0), orderBy('timestamp', 'desc'), limit(3)), (snapshot) => {
              setLastVisible(snapshot.docs[snapshot.docs.length-1])
              snapshot.docs.map(async(document) => {
                setPosts(prevState => [...prevState, {id: document.id, ...document.data()}])
              })
            })
          } 
          getSaves();
          setTimeout(() => {
            setLoading(false)
          }, 1000);
          return unsub;
    }
    else if (ascendingDate && !purchased) {
      setPosts([])
      setLoading(true)
      let unsub;
          const getSaves = async() => {
            unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'sold'), where('price', '>', 0), orderBy('timestamp', 'asc'), limit(3)), (snapshot) => {
              setLastVisible(snapshot.docs[snapshot.docs.length-1])
              snapshot.docs.map(async(document) => {
                setPosts(prevState => [...prevState, {id: document.id, ...document.data()}])
              })
            })
          } 
          getSaves();
          setTimeout(() => {
            setLoading(false)
          }, 1000);
          return unsub;
    }
      
    }, [descendingDate, ascendingDate, purchased])
  function convertTimestampToDate(timestampObject) {
  // Extract seconds and nanoseconds from the object
  const seconds = timestampObject.seconds;
  const nanoseconds = timestampObject.nanoseconds;

  // Create a new Date object from the seconds
  const date = new Date(seconds * 1000);

  // Add milliseconds from nanoseconds (divide by 1 million for conversion)
  date.setMilliseconds(nanoseconds / 1000000);

  // Format the date using desired format options (optional)
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  return date.toLocaleDateString('en-US', options); // Adjust options for formatting
}
const renderThemes = ({item}) => {
    //console.log(item)
    return (
        <button style={styles.categoriesContainer} onClick={() => {setFilteredGroup([item]); setSearching(false)}}>
            <img src={item.images[0]} style={{height: 40, width: 40, borderRadius: 8}}/>
            <span className='numberofLines1' style={styles.categories}>{item.name}</span>
            <ArrowUpLeftIcon style={{alignSelf: 'center', marginLeft: 'auto'}} color={"#9EDAFF"} className='btn'/>
        </button>
    )
  }
  const renderHistory = ({item, index}) => {
      //console.log(item)

      return (
        <div style={index == 0 ? {backgroundColor: "#d3d3d3", marginRight: '5%', borderWidth: 1, marginLeft: '5%', borderColor: "#fafafa"} : {backgroundColor: "#d3d3d3", marginRight: '5%', borderWidth: 1, marginLeft: '5%', borderColor: "#fafafa", marginTop: '5%'}}>
                <div>
                  <div style={styles.itemContainer}>
                      <span style={styles.receiptText}>Transaction Date:</span>
                      <span style={styles.dataReceiptText}>{convertTimestampToDate(item.timestamp)}</span>
                  </div>
                  <div style={styles.itemContainer}>
                      <span style={styles.noPaddingReceiptText}>Purchased Item:</span>
                      <span className='numberofLines2' style={styles.noPaddingDataReceiptText}>{item.name} Theme</span>
                  </div>
                  </div>
                  <div style={{backgroundColor: "#e8e8e8"}}>
                  <div style={styles.itemContainer}>
                      <span style={styles.receiptText}>Item Price:</span>
                      <span style={styles.dataReceiptText}>${(item.price / 100).toFixed(2)}</span>
                  </div>
                  <div style={styles.itemContainer}>
                      <span style={styles.noPaddingReceiptText}>Tax:</span>
                      <span style={styles.noPaddingDataReceiptText}>${((item.price * 0.06) / 100).toFixed(2)} (6%)</span>
                  </div>
                  <div style={styles.itemContainer}>
                      <span style={styles.noPaddingReceiptText}>Processing Fee:</span>
                      <span style={styles.noPaddingDataReceiptText}>${(((item.price * 0.03) / 100) + 0.3).toFixed(2)} (3% + 30&#162;)</span>
                  </div>
                  <div style={styles.itemContainer}>
                      <span style={styles.noPaddingReceiptText}>Total Amount:</span>
                      <span style={styles.noPaddingDataReceiptText}>${((item.price / 100) + ((item.price * 0.06) / 100)+ ((item.price * 0.03) / 100) + 0.3).toFixed(2)}</span>
                  </div>
                  </div>
                  {purchased ? null : 
                  <>
                  <div style={{backgroundColor: "#d3d3d3", borderTopWidth: 1, borderBottomWidth: 1}}>
                    <span style={styles.dataReceiptText}>Transaction Summary</span>
                  </div>
                  <div style={{backgroundColor: "#121212"}}>
                    <div style={styles.itemContainer}>
                      <span style={styles.receiptText}>Item Price:</span>
                      <span style={styles.dataReceiptText}>${(item.price / 100).toFixed(2)}</span>
                  </div>
                  <div style={styles.itemContainer}>
                      <span style={styles.noPaddingReceiptText}>NuCliq Fee:</span>
                      <span style={styles.noPaddingDataReceiptText}>${(item.price * 0.3 / 100).toFixed(2)} (30%)</span>
                  </div>
                  <div className='divider'/>
                  <div style={styles.itemContainer}>
                      <span style={styles.receiptText}>$$$ Paid to You:</span>
                      <span style={styles.dataReceiptText}>${(item.price / 100 - (item.price * 0.3 / 100)).toFixed(2)}</span>
                  </div>
                  </div>
                  </>}
              </div>
    ) 
                
    }
    const handleScroll = _.debounce((event) => {
    // Your logic for fetching more data
    fetchMoreData()
  }, 500);
  function fetchMoreData() {
    if (lastVisible != undefined && purchased && descendingDate) {
          setLoading(true)
        let unsub;
           const getLikes = () => {
            unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'purchased'), where('price', '>', 0), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(3)), (snapshot) => {
            //unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'likes'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(3)), (snapshot) => {
              setLastVisible(snapshot.docs[snapshot.docs.length-1])
              snapshot.docs.map(async(document) => {
                setPosts(prevState => [...prevState, {id: document.id, ...document.data()}])
              })
            })
          } 
          //console.log(tempPosts)
          getLikes();
          setTimeout(() => {
                    setLoading(false)
                  }, 1000);
          return unsub;
        }
    else if (lastVisible != undefined && purchased && ascendingDate) {
          setLoading(true)
        let unsub;
           const getLikes = () => {
            unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'purchased'), where('price', '>', 0), orderBy('timestamp', 'asc'), startAfter(lastVisible), limit(3)), (snapshot) => {
            //unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'likes'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(3)), (snapshot) => {
              setLastVisible(snapshot.docs[snapshot.docs.length-1])
              snapshot.docs.map(async(document) => {
                setPosts(prevState => [...prevState, {id: document.id, ...document.data()}])
              })
            })
          } 
          //console.log(tempPosts)
          getLikes();
          setTimeout(() => {
                    setLoading(false)
                  }, 1000);
          return unsub;
        }
        else if (lastVisible != undefined && !purchased && ascendingDate) {
          setLoading(true)
        let unsub;
           const getLikes = () => {
            unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'myThemes'), where('forSale', '==', true), where('price', '>', 0), orderBy('timestamp', 'asc'), startAfter(lastVisible), limit(3)), (snapshot) => {
            //unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'likes'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(3)), (snapshot) => {
              setLastVisible(snapshot.docs[snapshot.docs.length-1])
              snapshot.docs.map(async(document) => {
                setPosts(prevState => [...prevState, {id: document.id, ...document.data()}])
              })
            })
          } 
          //console.log(tempPosts)
          getLikes();
          setTimeout(() => {
                    setLoading(false)
                  }, 1000);
          return unsub;
        }
        else if (lastVisible != undefined && !purchased && descendingDate) {
          setLoading(true)
        let unsub;
           const getLikes = () => {
            unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'myThemes'), where('forSale', '==', true), where('price', '>', 0), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(3)), (snapshot) => {
            //unsub = onSnapshot(query(collection(db, 'profiles', user.uid, 'likes'), orderBy('timestamp', 'desc'), startAfter(lastVisible), limit(3)), (snapshot) => {
              setLastVisible(snapshot.docs[snapshot.docs.length-1])
              snapshot.docs.map(async(document) => {
                setPosts(prevState => [...prevState, {id: document.id, ...document.data()}])
              })
            })
          } 
          //console.log(tempPosts)
          getLikes();
          setTimeout(() => {
                    setLoading(false)
                  }, 1000);
          return unsub;
        }
  }
  return (
    <div style={{width: '63vw'}}>
      {loading && !lastVisible && posts.length == 0 ?  <div style={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
        <BeatLoader color={"#9EDAFF"}/> 
        </div> :
        <>
          <div style={{paddingBottom: 5, borderBottomWidth: 1, borderColor: "#fafafa"}}>
          <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-evenly', marginTop: '2.5%', marginRight: '5%'}}>
          {
            purchased ?
                  <>
                  <button style={{alignSelf: 'center'}} onClick={() => {setPurchased(true)}}>
            <span style={!purchased ? styles.messageText : {...styles.messageText, color: "#9edaff"}}>Purchased</span>
            
          </button>
        
        <div style={{width: 1, height: '60%', backgroundColor: '#121212', alignSelf: 'center', marginLeft: 20, marginRight: 20}}/>
        <button style={{alignSelf: 'center'}} onClick={() => {setPurchased(false)}}>
          <span style={purchased ? styles.messageText : {...styles.messageText, color: "#9edaff"}}>Sold Themes</span>

        </button> 
       
        </>
        :
        <>
        <button style={{alignSelf: 'center'}} onClick={() => {setPurchased(true)}}>
            <span style={styles.messageText}>Purchased</span>

          </button>
        
        <div style={{width: 1, height: '60%', backgroundColor: "#000", alignSelf: 'center', marginLeft: 20, marginRight: 20}}/>
        <button style={{alignSelf: 'center'}} onClick={() => {setPurchased(false)}}>
          <span style={styles.messageText}>Sold Themes</span>
        </button>
        </>}
          
        </div>
        </div>
       {!loading && posts.length == 0 ?
      <>
      <div style={{flex: 1, justifyContent: 'center', marginBottom: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <span style={styles.headerText}>No Transaction History Yet!</span> 
      </div> 
      </> : <>
            <button style={{width: '90%', marginTop: '5%', zIndex: 0, marginHorizontal: '5%'}}>

                  <SearchInput autoFocus={false} value={specificSearch} icon={'magnify'} placeholder={'Search'} onFocus={() => {setSearching(true)}} iconStyle={styles.homeIcon}
                  containerStyle={{borderWidth: 1, width: '100%', borderColor: "#fafafa"}} text={searching ? true : false} onChangeText={setSpecificSearch} 
                  onClick={() => {setSearching(true); setSpecificSearch('');}}/>
                  <div>
                  {searching && filtered.length == 0 && specificSearch.length > 0 ?
                  <div>
                    <span style={{color: "#9EDAFF", fontSize: 15.36, paddingHorizontal: 10, textAlign: 'center', marginRight: '5%', marginTop: '5%'}}>No Search Results</span>
                  </div> :  
                  searching && moreResults
                  ?
                  <>
                  {!moreResults ? filtered.slice(0,3).map((item, index) => (
                    <renderThemes item={item}/>
                  )) : filtered.slice(0, 10).map((item, index) => (
                    <renderThemes item={item}/>
                  ))
                  }
                  
                  </>
                  : searching && (moreResults || specificSearch.length > 0) ? 
                  <div>
                  {!moreResults ? filtered.slice(0,3).map((item, index) => (
                    <renderThemes item={item}/>
                  )) : filtered.slice(0, 10).map((item, index) => (
                    <renderThemes item={item}/>
                  ))
                  }
                  {moreResults ? 
                  <button style={{alignItems: 'center', marginRight: '5%'}} onClick={() => { setMoreResults(true); setMoreResultButton(false);}}>
                    <span style={{paddingTop: 5, color: "#9EDAFF", fontWeight: '400'}}>See more results</span>
                    </button> : null}
                  </div> : <></>}
                  
                  </div>
                  
                  
              </button>
              <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-evenly', marginHorizontal: '2.5%', marginTop: '2.5%'}}>
                <button style={descendingDate ? styles.colorButtons: styles.buttons} onClick={descendingDate ? null : () => {setDescendingDate(true); setAscendingDate(false)}}>
                  <span style={descendingDate ? styles.colorButtonText: styles.buttonText}>Date ↓</span>
              </button>
                <button style={ascendingDate ? styles.colorButtons: styles.buttons} onClick={ascendingDate ? null : () => {setAscendingDate(true); setDescendingDate(false)}}>
                  <span style={ascendingDate ? styles.colorButtonText: styles.buttonText}>Date ↑</span>
              </button>
              </div>
      <div style={{margin: '5%'}}>
        {filteredGroup.length > 0 ? filteredGroup.map((item, index) => (
            <renderHistory item={item} index={index}/>
        )) : posts.map((item, index) => (
            <renderHistory item={item} index={index}/>
        ))}
      </div>
      </>
      }
      </>}
    </div>
  )
}

export default TransactionHistory

