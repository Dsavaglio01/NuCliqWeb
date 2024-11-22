import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function RegisterHeader({onPress, group, login, channel, forgot, paymentMethod, createChat, privateInvite}) {
  return (
    <div style={{borderRadius: 35}}>
  <div style={{ 
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      padding: 15 // Added padding to provide space around the content
    }}>
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor:"#121212"}}>
          <ChevronLeftIcon onClick={onPress} className='cursor-pointer' height={37.5} style={{marginRight: 15}} color={'#fafafa'} /> 
        <Image
          src={require('../assets/DarkMode5.png')} // Make sure this path is correct
          alt="Your logo description"
          height={50}
          width={150}
        />
      </div>
    </div>
    <div style={{backgroundColor: "#1a1a1a", borderWidth: 1, borderColor: "#9EDAFF", marginLeft: '-1%', marginTop: '2.5%', width: '45%', borderRadius: 10,}}>
        {login ? <p numberOfLines={1} style={{fontSize: 24,
        textAlign: 'center',
        padding: 10,
        paddingTop: 4,
        marginTop: 8,
        color: "#fafafa",
        alignSelf: 'center'}}>Login w/ Email</p> :
        <p numberOfLines={1} style={{fontSize: 24,
        textAlign: 'center',
        padding: 10,
        paddingTop: 4,
        marginTop: 8,
        color: "#fafafa",
        alignSelf: 'center'}}>Account Registration</p>
        } 
      </div>
    </div>
  )
}
export default RegisterHeader