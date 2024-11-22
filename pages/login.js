// pages/login.js
import { useRouter } from 'next/router';
import firebase from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { getAuth, OAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const router = useRouter();
  const { user } = useAuth();
  const provider = new OAuthProvider('apple.com')
  provider.addScope('email')
  provider.addScope('name');
  const auth = getAuth();
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);
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
      
      <h3 className='leave'>Leave politics at the door and let's enjoy connecting over shared interests. Politics free-zone.</h3>
      <div style={{marginLeft: '20%'}}>
        <div
        onClick={() => signInApple()}
        className={'flex items-center p-2 rounded-3xl mt-10 px-5 border w-72 cursor-pointer'}
        >
        <EnvelopeIcon className='navBtn' style={{color: "#fafafa"}}/>
        <span style={{marginLeft: 'auto', fontSize: 19.20, color: "#fafafa", cursor: true}}>Continue with Apple</span>
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
