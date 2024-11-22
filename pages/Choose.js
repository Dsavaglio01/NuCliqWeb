import React, {useContext, useEffect, useState} from 'react'
import ThemeHeader from '@/components/ThemeHeader'
import NextButton from '@/components/NextButton'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '@/context/AuthContext';
import themeContext from '../lib/themeContext'
import { useRouter } from 'next/router'
function Choose () {
    const [credits, setCredits] = useState(0);
    const theme = useContext(themeContext)
    const router = useRouter();
    const [lastFour, setLastFour] = useState([]);
    const [lastName, setLastName] = useState('');
    const [customerId, setCustomerId] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [paymentMethodID, setPaymentMethodID] = useState(null);
    const {user} = useAuth();
  
const MAX_RETRY_ATTEMPTS = 3;



  /*  */
    useEffect(() => {
      let unsub;
        const getData = async() => {
          unsub = onSnapshot(doc(db, "profiles", user.uid), (doc) => {
              setCredits(doc.data().credits)
          });
            /* const docSnap = await getDoc(doc(db, 'profiles', user.uid))
            setCredits(docSnap.data().credits) */
        }
        getData()
        return unsub;
    }, [])
    useEffect(() => {
    const getProfileDetails = async() => {
    const docSnap = await getDoc(doc(db, "profiles", user.uid)); 
    if (docSnap.exists()) {
      const profileVariables = {
        firstName: await (await getDoc(doc(db, 'profiles', user.uid))).data().firstName,
        lastName: await (await getDoc(doc(db, 'profiles', user.uid))).data().lastName,
        paymentMethodID: await (await getDoc(doc(db, 'profiles', user.uid))).data().paymentMethodID,
        lastFour: await (await getDoc(doc(db, 'profiles', user.uid))).data().paymentMethodLast4,
        customerId: await (await getDoc(doc(db, 'profiles', user.uid))).data().customerId
      };
      //console.log(profileVariables)
      setFirstName(profileVariables.firstName);
      setLastName(profileVariables.lastName)
      setLastFour(profileVariables.lastFour)
      setCustomerId(profileVariables.customerId)
      if (profileVariables.paymentMethodID == undefined) {
        setPaymentMethodID(null)
      }
      else {
        setPaymentMethodID(profileVariables.paymentMethodID)
      }
      //)
      
    } 
  }
  
  getProfileDetails();
  }, [])
  //console.log(lastFour)
  const header = {
        fontSize: 24,
        textAlign: 'left',
        color: "#fafafa",
        fontFamily: 'Montserrat_700Bold',
        padding: 10,
        paddingLeft: 0, 
        //marginTop: '5%'
    }
    const headerText = {
        fontSize: 19.20,
        color: "#fafafa",
        padding: 10,
        textAlign: 'left',
        paddingLeft: 0,
    }
    const supplementaryText = {
        fontSize: 15.36,
        color: "#fafafa",
        padding: 10,
        textAlign: 'left',
        paddingLeft: 0,
    }
     const buttonContainer = {
        marginVertical: '2.5%',
        //marginHorizontal: '5%'
    }
    const centeredView = {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: '10%'
  }
  //fconsole.log(lastFour)
  return (
    <div>
        <ThemeHeader text={"Get Themes"} backButton={true} video={false}/>
        <div className='divider'/>
        <div style={{marginLeft: '5%', marginRight: '5%'}}>
        <p style={header}>Designing New Themes</p>
        {/* <Text style={headerText}>Each SUCCESSFUL upload of a theme costs 1 NuCliq Credit</Text>
        <Text style={supplementaryText}>{credits == undefined ? '0' : credits} credits remaining</Text> */}
        <div>
            <div style={buttonContainer}>
                <NextButton text={"UPLOAD THEME"} onPress={() => router.push('UploadGuidelines', {ai: false, upload: true,})}/>
            </div>
     {/*        <div style={styles.buttonContainer}>
                <MainButton text={"PURCHASE 10 CREDITS for $0.99!"} onPress={() => purchaseCredits(pack)}/>
            </div> */}
            {/* <div style={styles.buttonContainer}>
                <NextButton text={"GENERATE WITH AI"} onPress={() => navigation.navigate('UploadGuidelines', {ai: true, upload: false,})}/>
            </div> */}
        </div>
        </div>
    </div>
  )
}

export default Choose