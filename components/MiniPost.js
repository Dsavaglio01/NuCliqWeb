import React from 'react'
import { styles } from '@/styles/styles'
function MiniPost({item}) {
  return (
    item.post[0].image ? 
    <div style={{borderWidth: 1, borderColor: "#121212"}} className='cursor-pointer'>
        <img src={item.post[0].post} style={styles.image}/>
    </div> : item.post[0].video ? 
    <div style={{borderWidth: 1, borderColor: "#121212"}} className='cursor-pointer'>
        <img src={item.post[0].thumbnail} style={styles.image}/>
    </div>  : <div style={{ width: (window.outerHeight / 4) * 1.01625}} className='cursor-pointer justify-center flex items-center'>
        <div className='chat-bubble'>
            <p className='text-black' style={{fontSize: 15.36, height: window.innerHeight / 4, width: '100%', paddingLeft: 5, paddingTop: 2.5}}>{item.post[0].value}</p>
            
        </div>
    </div>
  )
}

export default MiniPost