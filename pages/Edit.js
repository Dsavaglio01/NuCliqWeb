import React, {useContext, useEffect, useState} from 'react'
import ThemeHeader from '@/components/ThemeHeader';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import InputBox from '@/components/InputBox';
import PreviewFooter from '@/components/PreviewFooter';
import { useAuth } from '@/context/AuthContext';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage'
import NextButton from '@/components/NextButton';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import { useRouter } from 'next/router';
//import {MODERATION_API_USER, MODERATION_API_SECRET, TEXT_MODERATION_URL} from "@env"
const EditScreen = ({firstName, lastName, bio, username}) => {
    const router = useRouter();
    const [editedBio, setEditedBio] = useState(bio);
    const [editedBanner, setEditedBanner] = useState();
    const [editedFirstName, setEditedFirstName] = useState(firstName);
    const [editedLastName, setEditedLastName] = useState(lastName);
    const [allowToEditLastName, setAllowToEditLastName] = useState(lastName.length == 0 ? false : true);
    const [allowToEditBio, setAllowToEditBio] = useState(bio.length == 0 ? false : true);
    const [editedPfp, setEditedPfp] = useState();
    const [editedPrivacy, setEditedPrivacy] = useState('');
    const [alertFirstName, setAlertFirstName] = useState(false);
    const [age, setAge] = useState();
    const [loading, setLoading] = useState(false);
    const {user} = useAuth();
    const storage = getStorage();
    /* useEffect(() => {
            const getData = async() => {
                const docSnap = (await getDoc(doc(db, 'groups', id))).data().description
                setDescription(docSnap)
            }
            getData();
    }, [id]) */
  const linkFirstnameAlert = () => {
        Alert.alert('Cannot save first name', 'First name cannot contain link', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    const personalFirstnameAlert = () => {
        Alert.alert('Cannot save first name', 'First name cannot contain personal information', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    const profanityFirstnameAlert = () => {
      Alert.alert('Cannot save first name', 'First name cannot contain profanity', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    const linkLastnameAlert = () => {
        Alert.alert('Cannot save last name', 'Last name cannot contain link', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    const personalLastnameAlert = () => {
        Alert.alert('Cannot save last name', 'Last name cannot contain personal information', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    const profanityLastnameAlert = () => {
      Alert.alert('Cannot save last name', 'Last name cannot contain profanity', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    const linkBioAlert = () => {
        Alert.alert('Cannot save bio', 'Bio cannot contain link', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    const personalBioAlert = () => {
        Alert.alert('Cannot save bio', 'Bio cannot contain personal information', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    const profanityBioAlert = () => {
      Alert.alert('Cannot save bio', 'Bio cannot contain profanity', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    function createSearchKeywordsWithHybridTokenization(field, limit) {
  // Regular expression to match emojis
  const emojiRegex = /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E6}-\u{1F1FF}]|[\u{200D}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F9C0}]|[\u{1F9D0}-\u{1F9FF}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F004}]|[\u{1F004}])/gu;

  // Remove emojis from the input field
  const sanitizedField = field.replace(emojiRegex, '');

  const words = sanitizedField.split(',').map(word => word.trim());
  const shortTokens = new Set();
  const longTokens = new Set();
  let shortCount = 0;
  let longCount = 0;

  // 1. Add whole words to longTokens
  for (const word of words) {
    if (longCount < limit) {
      longTokens.add(word);
      longCount++;
    }
  }

  // 2. Generate n-grams and include edge n-grams in shortTokens
  const minNgramLength = 3;
  const maxEdgeNgramLength = 3; // Adjust as needed
  for (const word of words) {
    for (let n = word.length; n >= 1 && (shortCount < limit || longCount < limit); n--) {
      // Edge n-grams (prefixes) up to maxEdgeNgramLength
      if (n <= maxEdgeNgramLength && shortCount < limit) {
        const edgeNgram = word.substring(0, n);
        shortTokens.add(edgeNgram);
        shortCount++;
      }

      // Regular n-grams
      for (let i = 0; i <= word.length - n && (shortCount < limit || longCount < limit); i++) {
        const ngram = word.substring(i, i + n);
        if (n <= 3 && shortCount < limit) {
          shortTokens.add(ngram);
          shortCount++;
        } else if (n >= 4 && longCount < limit) {
          longTokens.add(ngram);
          longCount++;
        }
      }
    }

    if (shortCount >= limit && longCount >= limit) break;
  }

  return [Array.from(shortTokens), Array.from(longTokens)];
}

    async function updateDBFirst() {
      setLoading(true)
      if (editedFirstName.length > 0) {
        try {
        data = new FormData();
        data.append('text', editedFirstName);
        data.append('lang', 'en');
        data.append('mode', 'rules');
        data.append('api_user', `${MODERATION_API_USER}`);
        data.append('api_secret', `${MODERATION_API_SECRET}`);
        //console.log(data)
        axios({
          url: `${TEXT_MODERATION_URL}`,
          method:'post',
          data: data,
          //headers: data.getHeaders()
        })
        .then(async function (response) {
          if (response.data) {
                if (response.data.link.matches.length > 0) {
                    linkFirstnameAlert()
                }
               else if (response.data.personal.matches.length > 0) {
                    personalFirstnameAlert()
                }
                else if (response.data.profanity.matches.length > 0 && response.data.profanity.matches.some(obj => obj.intensity === 'high')) {
                  
                    profanityUsernameAlert()
                
                }
                else {
                  const combinedField = `${username.toLowerCase().trim()}, ${editedFirstName.toLowerCase().trim()}, ${lastName.toLowerCase().trim()}`
                  const keywords = createSearchKeywordsWithHybridTokenization(combinedField, 30)
                  await updateDoc(doc(db, 'profiles', user.uid), {
                    firstName: editedFirstName.trim(),
                    smallKeywords: keywords[0],
                    largeKeywords: keywords[1]
                  }).then(() => router.back())
                    
                }
                
                //console.log(data)
            }
        })
        .catch(function (error) {
          // handle error
          if (error.response) console.log(error.response.data);
          else console.log(error.message);
        });
        }
        catch (error) {
            console.error(error)
        }
      }
      else {
        const combinedField = `${username.toLowerCase().trim()}, ${editedFirstName.toLowerCase().trim()}, ${lastName.toLowerCase().trim()}`
                  const keywords = createSearchKeywordsWithHybridTokenization(combinedField, 30)
                  await updateDoc(doc(db, 'profiles', user.uid), {
                    firstName: editedFirstName.trim(),
                    smallKeywords: keywords[0],
                    largeKeywords: keywords[1]
                  }).then(() => router.back())
      }
    }
    async function updateDBAll() {
      setLoading(true)
        try {
        data = new FormData();
        data.append('text', editedFirstName);
        data.append('lang', 'en');
        data.append('mode', 'rules');
        data.append('api_user', `${MODERATION_API_USER}`);
        data.append('api_secret', `${MODERATION_API_SECRET}`);
        //console.log(data)
        axios({
          url: `${TEXT_MODERATION_URL}`,
          method:'post',
          data: data,
          //headers: data.getHeaders()
        })
        .then(async function (response) {
          if (response.data) {
                if (response.data.link.matches.length > 0) {
                    linkFirstnameAlert()
                }
               else if (response.data.personal.matches.length > 0) {
                    personalFirstnameAlert()
                }
                else if (response.data.profanity.matches.length > 0 && response.data.profanity.matches.some(obj => obj.intensity === 'high')) {
                  
                    profanityUsernameAlert()
                
                }
                else {
                        try {
                        data = new FormData();
                        data.append('text', editedLastName);
                        data.append('lang', 'en');
                        data.append('mode', 'rules');
                        data.append('api_user', `${MODERATION_API_USER}`);
                        data.append('api_secret', `${MODERATION_API_SECRET}`);
                        //console.log(data)
                        axios({
                          url: `${TEXT_MODERATION_URL}`,
                          method:'post',
                          data: data,
                          //headers: data.getHeaders()
                        })
                        .then(async function (response) {
                          if (response.data) {
                                if (response.data.link.matches.length > 0) {
                                    linkLastnameAlert()
                                }
                              else if (response.data.personal.matches.length > 0) {
                                    personalLastnameAlert()
                                }
                                else if (response.data.profanity.matches.length > 0 && response.data.profanity.matches.some(obj => obj.intensity === 'high')) {
                  
                    profanityUsernameAlert()
                
                }
                                else {
                                  try {
                          data = new FormData();
                          data.append('text', editedBio);
                          data.append('lang', 'en');
                          data.append('mode', 'rules');
                          data.append('api_user', `${MODERATION_API_USER}`);
                          data.append('api_secret', `${MODERATION_API_SECRET}`);
                          //console.log(data)
                          axios({
                            url: `${TEXT_MODERATION_URL}`,
                            method:'post',
                            data: data,
                            //headers: data.getHeaders()
                          })
                          .then(async function (response) {
                            if (response.data) {
                                  if (response.data.link.matches.length > 0) {
                                      linkBioAlert()
                                  }
                                else if (response.data.personal.matches.length > 0) {
                                      personalBioAlert()
                                  }
                                  else if (response.data.profanity.matches.length > 0 && response.data.profanity.matches.some(obj => obj.intensity === 'high')) {
                  
                    profanityUsernameAlert()
                
                }
                                  else {
                                    const combinedField = `${username.toLowerCase().trim()}, ${editedFirstName.toLowerCase().trim()}, ${editedLastName.toLowerCase().trim()}`
                  const keywords = createSearchKeywordsWithHybridTokenization(combinedField, 30)
                                      await updateDoc(doc(db, 'profiles', user.uid), {
                                        firstName: editedFirstName.trim(),
                                        smallKeywords: keywords[0],
                                        largeKeywords: keywords[1],
                                        lastName: editedLastName.trim(),
                                        bio: editedBio.trim()
                                      }).then(() => router.back())
                                  }
            }
        })
        .catch(function (error) {
          // handle error
          if (error.response) console.log(error.response.data);
          else console.log(error.message);
        });
        }
        catch (error) {
            console.error(error)
        }
                                    
                                }
                                
                                //console.log(data)
                            }
                        })
                        .catch(function (error) {
                          // handle error
                          if (error.response) console.log(error.response.data);
                          else console.log(error.message);
                        });
                        }
                        catch (error) {
                            console.error(error)
                        }
                    
                }
                
                //console.log(data)
            }
        })
        .catch(function (error) {
          // handle error
          if (error.response) console.log(error.response.data);
          else console.log(error.message);
        });
        }
        catch (error) {
            console.error(error)
        }
    }
    async function updateDBLast() {
      setLoading(true)
      if (editedLastName.length > 0) {
        try {
        data = new FormData();
        data.append('text', editedLastName);
        data.append('lang', 'en');
        data.append('mode', 'rules');
        data.append('api_user', `${MODERATION_API_USER}`);
        data.append('api_secret', `${MODERATION_API_SECRET}`);
        //console.log(data)
        axios({
          url: `${TEXT_MODERATION_URL}`,
          method:'post',
          data: data,
          //headers: data.getHeaders()
        })
        .then(async function (response) {
          if (response.data) {
                if (response.data.link.matches.length > 0) {
                    linkLastnameAlert()
                }
               else if (response.data.personal.matches.length > 0) {
                    personalLastnameAlert()
                }
                else if (response.data.profanity.matches.length > 0 && response.data.profanity.matches.some(obj => obj.intensity === 'high')) {
                  
                    profanityUsernameAlert()
                
                }
                else {
                  const combinedField = `${username.toLowerCase().trim()}, ${firstName.toLowerCase().trim()}, ${editedLastName.toLowerCase().trim()}`
                  const keywords = createSearchKeywordsWithHybridTokenization(combinedField, 30)
                  await updateDoc(doc(db, 'profiles', user.uid), {
                    lastName: editedLastName.trim(),
                    smallKeywords: keywords[0],
                                        largeKeywords: keywords[1],
                  }).then(() => router.back())
                    
                }
                
                //console.log(data)
            }
        })
        .catch(function (error) {
          // handle error
          if (error.response) console.log(error.response.data);
          else console.log(error.message);
        });
        }
        catch (error) {
            console.error(error)
        }
      } else {
        const combinedField = `${username.toLowerCase().trim()}, ${firstName.toLowerCase().trim()}, ${editedLastName.toLowerCase().trim()}`
                  const keywords = createSearchKeywordsWithHybridTokenization(combinedField, 30)
                  await updateDoc(doc(db, 'profiles', user.uid), {
                    lastName: editedLastName.trim(),
                    smallKeywords: keywords[0],
                                        largeKeywords: keywords[1],
                  }).then(() => router.back())
      }
    }
    async function updateDBBio() {
      setLoading(true)
      if (editedBio.length > 0) {
        try {
        data = new FormData();
        data.append('text', editedBio);
        data.append('lang', 'en');
        data.append('mode', 'rules');
        data.append('api_user', `${MODERATION_API_USER}`);
        data.append('api_secret', `${MODERATION_API_SECRET}`);
        //console.log(data)
        axios({
          url: `${TEXT_MODERATION_URL}`,
          method:'post',
          data: data,
          //headers: data.getHeaders()
        })
        .then(async function (response) {
          if (response.data) {
                if (response.data.link.matches.length > 0) {
                    linkFirstnameAlert()
                }
               else if (response.data.personal.matches.length > 0) {
                    personalFirstnameAlert()
                }
                else if (response.data.profanity.matches.length > 0 && response.data.profanity.matches.some(obj => obj.intensity === 'high')) {
                  
                    profanityUsernameAlert()
                
                }
                else {
                  await updateDoc(doc(db, 'profiles', user.uid), {
                    bio: editedBio.trim()
                  }).then(() => router.back())
                    
                }
                
                //console.log(data)
            }
        })
        .catch(function (error) {
          // handle error
          if (error.response) console.log(error.response.data);
          else console.log(error.message);
        });
        }
        catch (error) {
            console.error(error)
        }
      }
      else {
        await updateDoc(doc(db, 'profiles', user.uid), {
                    bio: editedBio.trim()
                  }).then(() => router.back())
      }
    }
    async function updateDBFirstLast() {
      setLoading(true)
        try {
        data = new FormData();
        data.append('text', editedFirstName);
        data.append('lang', 'en');
        data.append('mode', 'rules');
        data.append('api_user', `${MODERATION_API_USER}`);
        data.append('api_secret', `${MODERATION_API_SECRET}`);
        //console.log(data)
        axios({
          url: `${TEXT_MODERATION_URL}`,
          method:'post',
          data: data,
          //headers: data.getHeaders()
        })
        .then(async function (response) {
          if (response.data) {
                if (response.data.link.matches.length > 0) {
                    linkFirstnameAlert()
                }
               else if (response.data.personal.matches.length > 0) {
                    personalFirstnameAlert()
                }
                else if (response.data.profanity.matches.length > 0 && response.data.profanity.matches.some(obj => obj.intensity === 'high')) {
                  
                    profanityUsernameAlert()
                
                }
                else {
                        try {
                        data = new FormData();
                        data.append('text', editedLastName);
                        data.append('lang', 'en');
                        data.append('mode', 'rules');
                        data.append('api_user', `${MODERATION_API_USER}`);
                        data.append('api_secret', `${MODERATION_API_SECRET}`);
                        //console.log(data)
                        axios({
                          url: `${TEXT_MODERATION_URL}`,
                          method:'post',
                          data: data,
                          //headers: data.getHeaders()
                        })
                        .then(async function (response) {
                          if (response.data) {
                                if (response.data.link.matches.length > 0) {
                                    linkLastnameAlert()
                                }
                              else if (response.data.personal.matches.length > 0) {
                                    personalLastnameAlert()
                                }
                                else if (response.data.profanity.matches.length > 0 && response.data.profanity.matches.some(obj => obj.intensity === 'high')) {
                  
                    profanityUsernameAlert()
                
                }
                                else {
                                  const combinedField = `${username.toLowerCase().trim()}, ${editedFirstName.toLowerCase().trim()}, ${editedLastName.toLowerCase().trim()}`
                  const keywords = createSearchKeywordsWithHybridTokenization(combinedField, 30)
                                  await updateDoc(doc(db, 'profiles', user.uid), {
                                    firstName: editedFirstName.trim(),
                                    lastName: editedLastName.trim(),
                                    smallKeywords: keywords[0],
                                        largeKeywords: keywords[1],
                                  }).then(() => router.back())
                                    
                                }
                                
                                //console.log(data)
                            }
                        })
                        .catch(function (error) {
                          // handle error
                          if (error.response) console.log(error.response.data);
                          else console.log(error.message);
                        });
                        }
                        catch (error) {
                            console.error(error)
                        }
                    
                }
                
                //console.log(data)
            }
        })
        .catch(function (error) {
          // handle error
          if (error.response) console.log(error.response.data);
          else console.log(error.message);
        });
        }
        catch (error) {
            console.error(error)
        }
    }
    async function updateDBLastBio() {
      setLoading(true)
        try {
        data = new FormData();
        data.append('text', editedLastName);
        data.append('lang', 'en');
        data.append('mode', 'rules');
        data.append('api_user', `${MODERATION_API_USER}`);
        data.append('api_secret', `${MODERATION_API_SECRET}`);
        //console.log(data)
        axios({
          url: `${TEXT_MODERATION_URL}`,
          method:'post',
          data: data,
          //headers: data.getHeaders()
        })
        .then(async function (response) {
          if (response.data) {
                if (response.data.link.matches.length > 0) {
                    linkLastnameAlert()
                }
               else if (response.data.personal.matches.length > 0) {
                    personalLastnameAlert()
                }
                else if (response.data.profanity.matches.length > 0 && response.data.profanity.matches.some(obj => obj.intensity === 'high')) {
                  
                    profanityUsernameAlert()
                
                }
                else {
                        try {
                        data = new FormData();
                        data.append('text', editedBio);
                        data.append('lang', 'en');
                        data.append('mode', 'rules');
                        data.append('api_user', `${MODERATION_API_USER}`);
                        data.append('api_secret', `${MODERATION_API_SECRET}`);
                        //console.log(data)
                        axios({
                          url: `${TEXT_MODERATION_URL}`,
                          method:'post',
                          data: data,
                          //headers: data.getHeaders()
                        })
                        .then(async function (response) {
                          if (response.data) {
                                if (response.data.link.matches.length > 0) {
                                    linkBioAlert()
                                }
                              else if (response.data.personal.matches.length > 0) {
                                    personalBioAlert()
                                }
                                else if (response.data.profanity.matches.length > 0 && response.data.profanity.matches.some(obj => obj.intensity === 'high')) {
                  
                    profanityUsernameAlert()
                
                }
                                else {
                                  const combinedField = `${username.toLowerCase().trim()}, ${firstName.toLowerCase().trim()}, ${editedLastName.toLowerCase().trim()}`
                  const keywords = createSearchKeywordsWithHybridTokenization(combinedField, 30)
                                  await updateDoc(doc(db, 'profiles', user.uid), {
                                    bio: editedBio.trim(),
                                    smallKeywords: keywords[0],
                                        largeKeywords: keywords[1],
                                    lastName: editedLastName.trim()
                                  }).then(() => router.back())
                                    
                                }
                                
                                //console.log(data)
                            }
                        })
                        .catch(function (error) {
                          // handle error
                          if (error.response) console.log(error.response.data);
                          else console.log(error.message);
                        });
                        }
                        catch (error) {
                            console.error(error)
                        }
                    
                }
                
                //console.log(data)
            }
        })
        .catch(function (error) {
          // handle error
          if (error.response) console.log(error.response.data);
          else console.log(error.message);
        });
        }
        catch (error) {
            console.error(error)
        }
    }
    async function updateDBFirstBio() {
      setLoading(true)
        try {
        data = new FormData();
        data.append('text', editedFirstName);
        data.append('lang', 'en');
        data.append('mode', 'rules');
        data.append('api_user', `${MODERATION_API_USER}`);
        data.append('api_secret', `${MODERATION_API_SECRET}`);
        //console.log(data)
        axios({
          url: `${TEXT_MODERATION_URL}`,
          method:'post',
          data: data,
          //headers: data.getHeaders()
        })
        .then(async function (response) {
          if (response.data) {
                if (response.data.link.matches.length > 0) {
                    linkFirstameAlert()
                }
               else if (response.data.personal.matches.length > 0) {
                    personalFirstnameAlert()
                }
                else if (response.data.profanity.matches.length > 0 && response.data.profanity.matches.some(obj => obj.intensity === 'high')) {
                  
                    profanityUsernameAlert()
                
                }
                else {
                        try {
                        data = new FormData();
                        data.append('text', editedBio);
                        data.append('lang', 'en');
                        data.append('mode', 'rules');
                        data.append('api_user', `${MODERATION_API_USER}`);
                        data.append('api_secret', `${MODERATION_API_SECRET}`);
                        //console.log(data)
                        axios({
                          url: `${TEXT_MODERATION_URL}`,
                          method:'post',
                          data: data,
                          //headers: data.getHeaders()
                        })
                        .then(async function (response) {
                          if (response.data) {
                                if (response.data.link.matches.length > 0) {
                                    linkBioAlert()
                                }
                              else if (response.data.personal.matches.length > 0) {
                                    personalBioAlert()
                                }
                                else if (response.data.profanity.matches.length > 0 && response.data.profanity.matches.some(obj => obj.intensity === 'high')) {
                  
                    profanityUsernameAlert()
                
                }
                                else {
                                  const combinedField = `${username.toLowerCase().trim()}, ${editedFirstName.toLowerCase().trim()}, ${lastName.toLowerCase().trim()}`
                  const keywords = createSearchKeywordsWithHybridTokenization(combinedField, 30)
                                  await updateDoc(doc(db, 'profiles', user.uid), {
                                    firstName: editedFirstName.trim(),
                                    smallKeywords: keywords[0],
                                        largeKeywords: keywords[1],
                                    bio: editedBio.trim()
                                  }).then(() => router.back())
                                    
                                }
                                
                                //console.log(data)
                            }
                        })
                        .catch(function (error) {
                          // handle error
                          if (error.response) console.log(error.response.data);
                          else console.log(error.message);
                        });
                        }
                        catch (error) {
                            console.error(error)
                        }
                    
                }
                
                //console.log(data)
            }
        })
        .catch(function (error) {
          // handle error
          if (error.response) console.log(error.response.data);
          else console.log(error.message);
        });
        }
        catch (error) {
            console.error(error)
        }
    }

    function alertUser() {
        if (editedFirstName.length == 0) {
            setAlertFirstName(true)
        }
    }
    function addLastName() {
        setAllowToEditLastName(true)
    }
    function addBio() {
        setAllowToEditBio(true)
    }
    const handleEditedBio = (inputText) => {
    const sanitizedText = inputText.replace(/\n/g, ''); // Remove all new line characters
    setEditedBio(sanitizedText);
  }
    const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Enter') {
      // Prevent user from manually inserting new lines
      return;
    }
  };
    //console.log(editedBio.length)
    //console.log(allowToEditOccupation)
    const titleText = {
        margin: '5%',
        marginLeft: 0,
        fontSize: 19.20,
        fontWeight: '600',
        color: "#fafafa"
    }
    const alertText = {
        color: 'red',
        fontSize: 12.29,
        marginLeft: '5%',
        padding: 5
    }
    const characterCountText = {
      fontSize: 12.29,
      paddingBottom: 0,
      padding: 10,
      textAlign: 'right',
      paddingRight: 0,
      marginRight: '7.5%'
    }
    const headerHeader = {
        color: "#fafafa",
        fontSize: 24,
        padding: 10,
        marginTop: 5,
        textAlign: 'center'
    }
    const inputContainer = {
         width: '100%',
          padding: 10,
          border: '1px solid #ccc',
          borderRadius: 5,
          color: "#fafafa",
          backgroundColor: "#121212"
    }
    const redInputContainer = {
 width: '100%',
          padding: 10,
          border: '1px solid red',
          borderRadius: 5,
          color: "#fafafa",
          backgroundColor: "#121212"
    }
  return (
        <div className='justify-center flex flex-col w-full' style={{marginLeft: 400}}>
    <span style={headerHeader}>Edit Profile</span>
      <div className='divider'/>
      {loading ? <div style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <BeatLoader color={"#9EDAFF"} size={'large'}/> 
        </div> : 
            <div>
      <p style={titleText}>First Name</p>
      <div>
        <input value={editedFirstName} maxLength={100} placeholder={editedFirstName} style={alertFirstName ? redInputContainer : inputContainer}
        onChange={(event) => setEditedFirstName(event.target.value)}/>
        {alertFirstName ?
        <p style={alertText}>You must have a first name</p> : null}

      </div>
      <p style={characterCountText}>{editedFirstName.length}/100</p>
      {allowToEditLastName ? <>
      <p style={titleText}>Last Name</p>
      <div>
       <input value={editedLastName} maxLength={100} placeholder={editedLastName} style={inputContainer}
        onChange={(event) => setEditedLastName(event.target.value)}/>
      </div>
      <p style={characterCountText}>{editedLastName.length}/100</p>
      </>
      : <>
      <p style={titleText}>Last Name</p>
      <div style={{marginLeft: '5%', marginRight: '5%'}}>
        <NextButton text={"+ Add Last Name"} onClick={addLastName}/>
      </div>
      </>}
      {allowToEditBio ? 
       <>
      <p style={titleText}>Bio</p>
      <div>
        <textarea maxLength={200} placeholder={editedBio} value={editedBio} onChange={(event) => {const sanitizedText = event.target.value.replace(/\n/g, ''); // Remove all new line characters
    setEditedBio(sanitizedText)}} style={inputContainer}/>
      </div>
      <p style={characterCountText}>{editedBio.length}/100</p>
      </> : 
      <>
      <p style={titleText}>Bio</p>
      <div style={{marginLeft: '5%', marginRight: '5%'}}>
        <NextButton text={"+ Add Bio"} onClick={addBio}/>
      </div>
      </>
      }
      </div>
}
      <div style={{marginLeft: '5%', marginRight: '5%', marginTop: '5%', marginBottom: '5%'}}>
        <PreviewFooter containerStyle={{ marginTop: '5%'}} text={"SAVE"} onClickCancel={() => router.back()} 
        onClick={editedFirstName.length == 0 ? () => alertUser() : editedFirstName != firstName && lastName == editedLastName && editedBio == bio ? () => updateDBFirst() :
        editedFirstName == firstName && lastName != editedLastName && editedBio == bio ? () => updateDBLast() : editedFirstName == firstName && lastName == editedLastName && editedBio != bio ? 
      () => updateDBBio() : editedFirstName != firstName && lastName != editedLastName && editedBio == bio ? () => updateDBFirstLast() : editedFirstName == firstName && lastName != editedLastName && editedBio != bio ?
    () => updateDBLastBio() : editedFirstName != firstName && lastName == editedLastName && editedBio != bio ? () => updateDBFirstBio() : editedFirstName != firstName && lastName != editedLastName && editedBio != bio ? () => updateDBAll() : () =>
    router.back()}/>
      </div>
      </div>
  )
}

export default EditScreen