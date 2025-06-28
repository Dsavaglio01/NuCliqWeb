import React from 'react'
import { styles } from '@/styles/styles'
import NewPostHeader from './NewPostHeader'
import CarouselComponent from './Carousel'
function CaptionModal({profile, data}) {
    console.log(data)
  return (
    <>
        <p className='text-white text-2xl'>Media Post</p>
        <div className='divider'/>
        <div style={{width: '90%', marginLeft: '5%',}}>
            {data && data.length > 1 ?
                <CarouselComponent itemPost={data}/> : data && data.length == 1 ?
                <div className="px-5 pb-5">
                    <img src={data[0].post} style={{height: 400}} className="w-full rounded-md" />
                </div> : null
                }
        </div>
        
        {/* <div className='m-5'>
            <textarea style={styles.captionBox} className='rounded-md' placeholder='Caption...' />
        </div> */}
        
    </>
  )
}

export default CaptionModal