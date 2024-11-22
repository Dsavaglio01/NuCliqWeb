import RegisterHeader from '@/components/RegisterHeader';
import React from 'react'
import { useRouter } from 'next/router';

function SignUp() {
  const router = useRouter();
  const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'http://localhost/SignUp',
  // This must be true.
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.example.ios'
  },
  dynamicLinkDomain: 'example.page.link'
};

  return (
        <RegisterHeader onPress={() => router.push('/login')}/>

  )
}

export default SignUp