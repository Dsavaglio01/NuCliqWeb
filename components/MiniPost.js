import React from 'react'
import { styles } from '@/styles/styles'
import { useRouter } from 'next/router'
function MiniPost({item, index, repost}) {
  const router = useRouter();
  return (
    <div key={index}>
    {repost ? 
      <div style={styles.miniPostContainer} onClick={() => router.push({pathname: 'Post', query: {post: item.id}})} className='cursor-pointer justify-center flex items-center'>
        <div className='chat-bubble' style={{backgroundColor: "#fafafa"}}>
         <p className='text-black overflow-hidden text-ellipsis' style={styles.miniPostText}>{item.post.post[0].value}</p> 
        </div>
      </div> :
    item.post[0].image ? 
      <div style={styles.miniPostContainer} className='cursor-pointer'>
        <img src={item.post[0].post} style={styles.image}/>
      </div> : item.post[0].video ? 
      <div style={styles.miniPostContainer} className='cursor-pointer'>
        <img src={item.post[0].thumbnail} style={styles.image}/>
      </div> : 
      <div style={styles.miniPostContainer} className='cursor-pointer justify-center flex items-center'>
        <div className='chat-bubble' style={{backgroundColor: "#fafafa"}}>
          <p className='text-black' style={styles.miniPostText}>{item.post[0].value}</p> 
        </div>
      </div>}
    </div>
  )
}

export default MiniPost