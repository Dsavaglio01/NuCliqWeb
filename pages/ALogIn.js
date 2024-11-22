import InputBox from '@/components/InputBox'
import NextButton from '@/components/NextButton'
import RegisterHeader from '@/components/RegisterHeader'
import React, { useState, useEffect } from 'react'
import { fetchSignInMethodsForEmail, getAuth, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink } from 'firebase/auth'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import useHashChange from '../hooks/useHashChange'
function ALogIn() {
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState('');
    const auth = getAuth();
    const user = useAuth();
    const router = useRouter();
    const [initialLoading, setInitialLoading] = useState(false);
    const [initialError, setInitialError] = useState(null);
    const hashchange = useHashChange();
    useEffect(() => {
  if (user.user == null) {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = null;
      if (typeof window !== 'undefined') {
          email = window.localStorage.getItem('emailForSignIn');
          console.log(email)
        }

      setInitialLoading(true);
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          setInitialLoading(false);
          setInitialError('');
          router.push('/'); // Or redirect to intended page 
        })
        .catch((err) => {
          setInitialLoading(false);
          setInitialError(err.message); // More specific error message
          router.push('/ALogIn');
        });
    } else {
      console.log('Enter email and sign in');
    }
  }
}, [user, router, hashchange]);
    function interpretError(message) {
    //console.log(message)
    if (message.includes('(auth/invalid-phone-number)')) {
      //return 'Invalid Format. Please Try Again.'
      window.alert('Please Put Phone # in Correct Format: "+1 999 999 9999"', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/code-expired')) {
      window.alert('Please Press Button to Resend New Code', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/missing-phone-number')) {
      window.alert('Please Put Phone Number', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/user-disabled')) {
      //console.log('first')
      window.alert('Please Create a new account', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/maximum-second-factor-count-exceeded')) {
      window.alert('You Tried to Sign up too Many Times', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/captcha-check-failed')) {
      window.alert('Re-Captcha Check Failed', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/second-factor-already-in-use')) {
      window.alert('Two-Factor Authentication Already Running', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/too-many-requests')) {
      window.alert('Too Many Attempts', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/unsupported-first-factor')) {
      window.alert('Email or Phone Number is not Supported', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/unverified-email')) {
      window.alert('Email Not Verified', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/invalid-verification-code')) {
      window.alert('Invalid Verification Code', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/invalid-email')) {
      window.alert('Please Use a Valid Email', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/invalid-credential')) {
      window.alert('Invalid Credential', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/invalid-verification-id')) {
      window.alert('Invalid Verification ID', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/missing-verification-id')) {
      window.alert('Missing Verification ID', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/account-exists-with-different-credential')) {
      window.alert('Account Exists With Different Credential/Credentials', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/weak-password')) {
      window.alert('Every Password Should Contain at Least 6 Characters', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/user-signed-out')) {
      window.alert('Please Use LOGIN button to Log Back in', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/user-not-found')) {
      window.alert('Please Sign up to Create an Account or Use a Different Credential.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/null-user')) {
      window.alert('Please Sign up or Log in', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('user-cancelled')) {
      window.alert('User Cancelled Operation', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/popup-closed-by-user')) {
      window.alert('User Cancelled Operation', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/wrong-password')) {
      window.alert('Wrong Password', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/missing-multi-factor-info')) {
      window.alert('Missing Two Factor Information', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/credential-already-in-use')) {
      window.alert('Credential Already in Use', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/requires-recent-login')) {
      window.alert('Credential Too Old', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/email-change-needs-verification')) {
      window.alert('Email Change Needs Verification', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else if (message.includes('auth/email-already-in-use')) {
      window.alert('Email Already in Use', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
    else {
      window.alert('Unknown Error Occurred.', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
  }
    const handleLogin = async(email) => {
    try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email)
    // If signInMethods is not empty, email exists
    if (signInMethods && signInMethods.length > 0) {
      try {
        const actionCodeSettings = {
          url: 'http://localhost:3000/ALogIn', // Replace with your app's URL
          handleCodeInApp: true, // Handle the sign-in completion in the app
          iOS: {
            bundleId: 'com.drstem369.NuCliqV1'
          },
        };

        await sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {setSuccess(true);
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('emailForSignIn', email)
        }
          
        })
        
      } catch (error) {
        interpretError(error.code)
      }
    } else {
      window.alert('Email Invalid', 'Please log back in with an email attached to your account', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    }
  } catch (error) {
    interpretError(error.code)
  }
        
  }
  return (
    <div>
        <RegisterHeader login={true}/>
    <div style={{marginLeft: '30%', marginRight: '30%', marginTop: '5%', alignItems: 'center', justifyContent: 'center'}}>
        <InputBox text={"Email Address"} icon={'email'} onChange={(event) => setEmail(event.target.value)} value={email}/>
        <div className='mt-10 ml-2'>
            <p style={{color: "#9edaff"}}>By continuing, you agree to our <u>Terms and Conditions</u> and acknowledge that you understand the <u>Privacy Policy</u> and the <u>Data Policy</u></p>
        </div>
        <div style={{marginTop: '10%', marginLeft: '30%'}}>
          {!success ? 
        <NextButton text={"Verify Email to Log In"} onClick={email.length == 0 ? () => window.alert('Valid Email must be present to login to account', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? () => handleLogin(email) : () => window.alert('Please enter a valid email address')}/> :
    <div className='mt-10'>
      <p style={{fontSize: 15.36, color: '#fafafa'}}>An email has been sent to {email}. Click on the link provided to log in.</p>
      </div>}
      </div>
    </div>
    
    </div>
    
  )
}

export default ALogIn