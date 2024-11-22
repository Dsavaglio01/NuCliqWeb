import React, { useContext } from 'react'
import { useRouter } from 'next/router';
import { XMarkIcon } from '@heroicons/react/24/solid';
const ThemeMadeProgression = ({text}) => {
  const router = useRouter();
  //console.log(personal)
  const container = {
      marginTop: '8%',
      marginBottom: '0.5%',
      shadowColor: "#000000",
      elevation: 20,
      shadowOffset: {width: 1, height: 3},
      shadowOpacity: 0.5,
      shadowRadius: 1,
  }
  const headerText = {
    fontSize: 19.20,
      color: "#9edaff",
      padding: 5,
  }
  const icon = {
    marginRight: '2.5%',
      alignItems: 'center',
      justifyContent: 'center'
  }
  return (
    <div style={container}>
      <div style={{flexDirection: 'row', justifyContent: 'space-between', }}>
        <div>
          <p style={headerText}>{text}</p>
          
          
        </div>
        <div className='cursor-pointer' style={icon} onClick={() => router.back()}>
          <XMarkIcon className='btn'/>
        </div>
      </div>
    </div>
  )
}

export default ThemeMadeProgression