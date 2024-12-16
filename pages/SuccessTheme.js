import React, { useState, useEffect, useContext } from 'react'
import InputBox from '@/components/InputBox';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { onSnapshot, doc, getDocs, collection} from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import MainButton from '@/components/MainButton';
import { useRouter } from 'next/router';
import { BeatLoader } from 'react-spinners';
import NextButton from '@/components/NextButton';
import PreviewFooter from '@/components/PreviewFooter';
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';
import ProfileContext from '@/context/ProfileContext';
function SuccessTheme({post, handleStateChange}) {
    const profile = useContext(ProfileContext);
    const [edit, setEdit] = useState(false);
    const [emptyThemeName, setEmptyThemeName] = useState(false);
    const [emptyKeywords, setEmptyKeywords] = useState(false);
    const [profileChecked, setProfileChecked] = useState(false);
    const [postChecked, setPostChecked] = useState(false);
    const router = useRouter();
    const [stripeId, setStripeId] = useState(null);
    const [themeName, setThemeName] = useState('');
    const [price, setPrice]  = useState(0);
    const [themeNames, setThemeNames] = useState([]);
    const [privacy, setPrivacy] = useState(false);
    const [uploading, setUploading] = useState(false);
    const {user} = useAuth();
    const [sellChecked, setSellChecked] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [errorPersonalThemeName, setErrorPersonalThemeName] = useState(false);
    const [errorLinkThemeName, setErrorLinkThemeName] = useState(false);
    const [errorProfanityThemeName, setErrorProfanityThemeName] = useState(false);
    const [errorPersonalKeywords, setErrorPersonalKeywords] = useState(false);
    const [errorLinkKeywords, setErrorLinkKeywords] = useState(false);
    const [errorProfanityKeywords, setErrorProfanityKeywords] = useState(false);
    const [errorThemeName, setErrorThemeName] = useState(false);
    const [errorPriceRange, setErrorPriceRange] = useState(false);
     const [keywords, setKeywords] = useState('');
     const [originalKeywords, setOriginalKeywords]  = useState('');
    function keywordFunction(event) {
    const text = event.target.value
  const sanitizedText = text.replace(/\n/g, '');
  const keywords = createSearchKeywordsForMultipleWords(sanitizedText.toLowerCase(), 5, 3, 30)
  setKeywords(keywords)
  setOriginalKeywords(sanitizedText)
}
const goToPurchased = () => {
    handleStateChange(true, themeName, post, price, keywords, stripeId, profileChecked, postChecked, profile.notificationToken)
}
const priceAlert = () => {
        setErrorPriceRange(true)
        setUploading(false)
    }
    useEffect(() => {
      const getNames = async() => {
        const querySnapshot = await getDocs(collection(db, "profiles", user.uid, 'myThemes'));
          querySnapshot.forEach((doc) => {
            setThemeNames(prevState => [...prevState, doc.data().name.toLowerCase()])
            // doc.data() is never undefined for query doc snapshots
            
          });
      }
      getNames()
    }, [])
function createSearchKeywordsForMultipleWords(field, maxLen, n, limit) {
  const words = field.split(' ').map(word => word.trim()); // Split the field by spaces and trim spaces
  const result = new Set(); // Store unique keywords
  let count = 0; // Counter for added keywords

  // Loop through each word
  for (const word of words) {
    // Generate prefixes (from length 1 to maxLen)
    for (let i = 1; i <= maxLen && i <= word.length && count < limit; i++) {
      const prefix = word.substring(0, i);
      result.add(prefix);
      count++;
      if (count >= limit) break;
    }

    // Generate suffixes (from length 1 to maxLen)
    for (let i = 1; i <= maxLen && i <= word.length && count < limit; i++) {
      const suffix = word.substring(word.length - i);
      result.add(suffix);
      count++;
      if (count >= limit) break;
    }

    // Generate n-grams (of length n)
    for (let i = 0; i <= word.length - n && count < limit; i++) {
      const ngram = word.substring(i, i + n);
      result.add(ngram);
      count++;
      if (count >= limit) break;
    }

    if (count >= limit) break;
  }

  return Array.from(result).slice(0, limit); // Return as an array
}
    const main = {
        marginTop: '2.5%',
    }
    const successText = {
        fontSize: 24,
        fontWeight: '700',
        padding: 0,
        color: "#9edaff",
        textAlign: 'center'
    }
   const  headerText = {
        fontSize: 19.20,
        fontWeight: '700',
        color: "#fafafa"
    }
    const superscript= {
        color: "red",
        fontSize: 19.20
    }
    const redSupplementaryText = {
         fontSize: 12.29,
        padding: 25,
        paddingBottom: 0,
        paddingTop: 5,
        color: 'red'
    }
    const paragraph = {
        fontSize: 15.36,
        paddingLeft: 10,
        color: "#fafafa"
    }
    const nameBorder ={
        width: 400,
          padding: 10,
          border: '1px solid #ccc',
          borderRadius: 5,
          color: "#fafafa",
          backgroundColor: "#121212"
    }
    const redNameBorder = {
        width: 400,
          padding: 10,
          border: '1px solid #ccc',
          borderRadius: 5,
          color: "#fafafa",
          backgroundColor: "#121212",
          borderColor: 'red'
    }
    const redCharsText = {
        fontSize: 12.29,
        color: 'red'
    }
    const charsText = {
        fontSize: 12.29,
        color: '#fafafa'
    }
    const commaText = {
         fontSize: 12.29,
        fontWeight: '700',
        alignSelf: 'center',
        color: "#fafafa"
    }
    const handleThemeName = (event) => {
    const inputText = event.target.value
    const sanitizedText = inputText.replace(/\n/g, ''); // Remove all new line characters
    setThemeName(sanitizedText);
  }
  return (
    <div>
        <div style={main}>
            <p style={successText}>Name & Keywords</p>
            <div className='dashedDivider'/>
            <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-around', marginTop: '5%', alignItems: 'center'}}>
                <div className='m-5 flex flex-col' style={{borderWidth: 1}}>
                    <div className='p-5'>
                    <p style={superscript}>* <span style={headerText}>Name of Theme: </span></p>
                    <div style={ {marginTop: '2.5%'}}>
                        {!edit ? <>
                        <input type='text' maxLength={50} placeholder={"Name of Theme"} value={themeName} onChange={handleThemeName} style={emptyThemeName || errorThemeName ||  errorLinkThemeName || errorPersonalThemeName || errorProfanityThemeName ? redNameBorder: nameBorder}/>
                        {errorLinkThemeName ? <p style={redSupplementaryText}>Name must not contain link(s)</p> :
                        errorPersonalThemeName ? <p style={redSupplementaryText}>Name must not contain personal information</p> : 
                        errorProfanityThemeName ? <p style={redSupplementaryText}>Name must not contain profanity</p> : 
                        errorThemeName ? <p style={redSupplementaryText}>You already have a theme with that name</p> :  null}
                        </> : <div style={{ borderRadius: 9, borderWidth: 1, backgroundColor: "#fff", width: '90%', marginLeft: '5%', display: 'flex', flexDirection: 'row',}}> 
                            <p style={{fontSize: 15.36, paddingTop: 13, fontWeight: '300', color: "#000", minHeight: 80, maxHeight: 200, width: '90%', marginLeft: '3%'}}>{themeName}</p>
                            </div>}
                        
                    </div>
                    
                    <div style={{marginLeft: 'auto', justifyContent: 'flex-end', display: 'flex', marginRight: '5%', marginTop: '5%'}}>
                        {edit ? <p style={redCharsText}>Name cannot be changed</p> :
                        <p style={charsText}>{`${50 - themeName.length}`} Chars Remaining</p>}
                        
                    </div>
                <div style={{marginTop: '2.5%'}} className='flex flex-col'>
                <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-between'}}>
                  <div style={{flexDirection: 'row', display: 'flex'}}>
                    <p style={superscript}>* <span style={headerText}>Keywords: </span></p> 
                    <button onPress={() => setInfoModal(true)}>
                       <InformationCircleIcon className='btn' color='#fafafa' style={{alignSelf: 'center', paddingLeft: 10, height: 22.5}}/>
                      </button>  
                   
                  </div>
                    <p style={commaText}>Separate by Comma</p>
                </div>
                <div style={{marginTop: '2.5%'}}>
                    <textarea style={emptyKeywords || errorLinkKeywords || errorPersonalKeywords || errorProfanityKeywords ? redNameBorder: nameBorder} maxLength={100} onChange={keywordFunction} value={originalKeywords} placeholder={"Type Search Keywords"}/>
                    {errorLinkKeywords ? <p style={redSupplementaryText}>Keyword(s) must not contain link(s)</p> :
                errorPersonalKeywords ? <p style={redSupplementaryText}>Keyword(s) must not contain personal information</p> : 
                errorProfanityKeywords ? <p style={redSupplementaryText}>Keyword(s) must not contain profanity</p> : null}
                </div>
                <div style={{marginLeft: 'auto', marginTop: '3%', marginRight: '5%'}}>
                    <p style={charsText}>{`${100 - originalKeywords.length}`} Chars Remaining</p>
                </div>
            </div>
            </div>
            <div className='successDivider'/>
            {!edit && !privacy ? 
            <>
            <div style={{flexDirection: 'row', display: 'flex', marginLeft: '5%'}}>
            {/* <button onPress={edit ? null : () => {setSellChecked(!sellChecked)}} style={{flexDirection: 'row', display: 'flex', alignItems: 'center'}}>

                    <Checkbox value={sellChecked} onValueChange={edit ? null : () => {setSellChecked(!sellChecked)}} color={sellChecked ? theme.theme != 'light' ? "#9EDAFF" : "#005278" : theme.color} />
                    <div >
                    <p style={[styles.paragraph, {color: theme.color}]}>I want to share my theme</p>
                    </div>
                </button>    */}
            <div className='cursor-pointer' onClick={edit ? null : () => {setSellChecked(!sellChecked)}} style={{flexDirection: 'row', display: 'flex', alignItems: 'center'}}>
                <label>
                    <input type='checkbox' value={sellChecked} checked={sellChecked} onChange={edit ? null : () => {setSellChecked(!sellChecked)}} color={sellChecked ? "#9EDAFF" : '#fafafa'}/>
                </label>
                <p style={paragraph} className='self-center'>I want to share my theme</p>
            </div>

            
            
            </div>
            {/* <p style={{padding: 5, fontSize: 12.29, color: theme.color}}>Leave price at $0.00 to sell for free</p> */}
            </>
            : null}
            <div className='successDivider'/>
            <div className='flex flex-row justify-between' style={{width: '75%', marginLeft: '10%'}}>
                <span className='text-white px-5'>Price: </span>
                <div className='px-5 flex'>
                    <CurrencyDollarIcon className='userBtn' />
                    <input value={price} type='number' onChange={(e) => setPrice(e.target.value)} className='bg-transparent text-white border-2 w-16 pl-1 ml-2'/>
                </div>
            </div>
            <div className='successDivider'/>
            <div style={{marginLeft: '5%', paddingBottom: '5%'}}>
                <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-between'}}>
                    <p style={paragraph}>Use my theme on: </p>
                    
                </div>
                
                <div style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-between', marginTop: '5%', marginLeft: '5%'}}>
                    <div className='cursor-pointer' onClick={edit ? null : () => {setProfileChecked(!profileChecked)}} style={{flexDirection: 'row', display: 'flex', alignItems: 'center'}}>
                <label>
                    <input type='checkbox' value={profileChecked} checked={profileChecked} onChange={edit ? null : () => {setProfileChecked(!profileChecked)}} color={profileChecked ? "#9EDAFF" : '#fafafa'}/>
                </label>
                <p style={paragraph}>Profile Page</p>
            </div>
                <div className='cursor-pointer' onClick={edit ? null : () => {setPostChecked(!postChecked)}} style={{flexDirection: 'row', display: 'flex', alignItems: 'center'}}>
                <label>
                    <input type='checkbox' value={postChecked} checked={postChecked} onChange={edit ? null : () => {setPostChecked(!postChecked)}} color={postChecked ? "#9EDAFF" : '#fafafa'}/>
                </label>
                <p style={paragraph}>Posts</p>
            </div> 
                    
                <div>         
                </div>
                
                </div>
                
                
            </div>
                </div>
                <div style={{borderWidth: 1, padding: 2.5}}>
                    <img src={post} style={{height: 500, width: 300}}/>
                </div>
            </div>
            
            <div style={{width: '90%', marginLeft: '5%', marginTop: '2.5%'}}>
            <div style={{flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        //margin: '3%',
        marginTop: '3%',
        marginBottom: '5.5%',}}>
                <MainButton text={"CANCEL"} onClick={uploading ? null : () => router.push('All', {name: null})}/>
                {uploading ? <BeatLoader color='#9edaff' style={{marginRight: '10%'}} /> : <NextButton text={"CONTINUE"} onClick={themeName.length == 0 ? () => setEmptyThemeName(true) : themeNames.includes(themeName) ? () => nameAlert() : sellChecked ? originalKeywords.length == 0 ? 
                () => setEmptyKeywords(true) : Number.parseFloat(price) * 100 != 0 && (Number.parseFloat(price) * 100 > 499 || Number.parseFloat(price) < 199) * 100 ? () => priceAlert() : Number.parseFloat(price) * 100 > 0 ? () => goToPurchased()
                : () => sendThemeToDB() : ()  => goToPurchased()}/> }
                
            </div>
        </div>
        </div>
    </div>
  )
}

export default SuccessTheme