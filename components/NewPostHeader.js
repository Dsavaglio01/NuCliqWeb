import { UserCircleIcon } from '@heroicons/react/24/solid'
import React from 'react'
import NextButton from './NextButton'
import { styles } from '@/styles/styles'
function NewPostHeader({button, group, pfp}) {
    const pfpStyle = {
        height: window.innerHeight / 18.7,
    width: (window.innerHeight / 18.7) * 1.01625,
    borderRadius: 8
    }
    const newPostText = {
        fontSize: window.innerHeight / 68.7,
    width: '90%',
    padding: 10,
    color: "#fafafa"
    }
  return (
    <>
            <div style={styles.repostButtonContainer}>
                {pfp ? 
                <img src={pfp} style={pfpStyle}/>
                : <UserCircleIcon className='userBtn' style={pfpStyle}/>}
                    <p style={newPostText}>You can post up to 5 images or a single video or a single text post</p>
                {button ?  <div style={{zIndex: 3, height: 70, alignSelf: 'center', alignItems: 'center'}}>
                  <div style={styles.postDoneContainer}>

                    <NextButton text={"DONE"} textStyle={{fontSize: 12.29}}/>
                    </div>
                </div> : group ? null :
                null
                }
            </div>
    </>
  )
}

export default NewPostHeader