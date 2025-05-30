import React from 'react'
import { styles } from '@/styles/styles';

function FullTheme({theme}) {
    const actualTheme = theme[0]
    console.log(actualTheme)
  return (
    <div className='flex flex-column items-center' style={{flexDirection: 'column'}}>
        <div className='mt-10'>
            <span className='text-white text-2xl'>{actualTheme.name}</span>
        </div>
        <div className='mt-10 bg-red-500' style={{width: '35%', height: '80%'}}>
            <img src={actualTheme.images[0]} style={styles.fullTheme}/>
        </div>
        
    </div>
    
  )
}

export default FullTheme