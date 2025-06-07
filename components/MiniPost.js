import React from 'react'
import { styles } from '@/styles/styles'
import { FaPlay } from "react-icons/fa6";
function MiniPost({item, index, repost, onClick}) {

  return (
    <div key={index} style={{height: 300}} onClick={onClick}>

    {repost ? 
      <div style={styles.miniPostContainer} className='chatBubbleContainer'>
        <div className='chat-bubble' style={{backgroundColor: "#fafafa"}}>
         <p className='chatBubbleText text-ellipsis' style={styles.miniPostText}>{item.post.post[0].value}</p> 
        </div>
        <div className='miniArrow'/>
      </div> : item.post[0].image ? 
      <div style={styles.miniPostContainer} className='cursor-pointer'>
        <img src={item.post[0].post} style={styles.miniImage}/>
      </div> : item.post[0].video ? 
      <>
        <div style={styles.miniPostContainer} className='cursor-pointer'>
          <img src={item.post[0].thumbnail} style={styles.miniImage}/>
        </div>
        <FaPlay className='userBtn' color='#005278' style={styles.playBtn}/>
      </>
      : 
        <div style={styles.miniPostContainer} className='chatBubbleContainer'>
          <div className='chat-bubble' style={{backgroundColor: "#fafafa"}}>
            <p className='chatBubbleText text-ellipsis' style={styles.miniPostText}>{item.post[0].value}</p> 
          </div>
          <div className='miniArrow'/>
        </div>
      }
    </div>
  )
}

export default MiniPost