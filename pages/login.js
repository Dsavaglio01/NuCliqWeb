// pages/login.js
import { useRouter } from 'next/router';
import firebase from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import Image from 'next/image';
import { getAuth, OAuthProvider, signInWithPopup } from 'firebase/auth';
import {FaApple, FaGoogle} from 'react-icons/fa'
import { styles } from '@/styles/styles';
import { GoogleAuthProvider } from "firebase/auth";
const Login = () => {
  const router = useRouter();
  const { user } = useAuth();
  const provider = new OAuthProvider('apple.com')
  const googleProvider = new GoogleAuthProvider();
  provider.addScope('email')
  provider.addScope('name');
  const auth = getAuth();
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);
  const signInGoogle = () => {
    signInWithPopup(auth, googleProvider).then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  }
  const signInApple = () => {
    signInWithPopup(auth, provider).then((result) => {
      const user = result.user;
      const credential = OAuthProvider.credentialFromResult(result)
      console.log(credential)
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;
    }).catch((error) => {
      console.log(error)
      const credential = OAuthProvider.credentialFromError(error)
    })
  }
  const handleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
      router.push('/');
    } catch (error) {
      console.error('Error logging in: ', error);
    }
  };

  return (
    <div style={{marginLeft: '30%', marginRight: '30%', marginTop: '1.5%'}}>
      <Image src={require('../assets/loginlogo.png')}/>
    <div className='mx-5 mt-5'>
        <div className='mt-8'>
            <h1 className='beHeadings'>Be Creative.</h1>
            <h1 className='beHeadings'>Be Different.</h1>
            <h1 className='beHeadings'>Be You.</h1>
        </div>
      
      {/* <h3 className='leave'>Leave politics at the door and let's enjoy connecting over shared interests. Politics free-zone.</h3> */}
      <div style={styles.signUpMain}>
        <div onClick={() => signInApple()} className={'flex items-center p-2 rounded-3xl mt-10 px-5 border w-64 cursor-pointer'}>
        <FaApple className='navBtn' style={{color: "#fafafa"}}/>
        <span style={styles.continue}>Continue with Apple</span>
      </div>
        <div onClick={() => signInGoogle()} className={'flex items-center p-2 rounded-3xl mt-10 px-5 border w-64 cursor-pointer'}>
          <FaGoogle className='navBtn' style={{color: "#fafafa"}}/>
          <span style={styles.continue}>Continue with Google</span>
        </div>
    </div>
    <div className='mt-10'>
        <p style={{color: "#9edaff"}}>By continuing, you agree to our <u>Terms and Conditions</u> and acknowledge that you understand the <u>Privacy Policy</u> and the <u>Data Policy</u></p>
    </div>
    </div>
    </div>
  );
};

export default Login;
