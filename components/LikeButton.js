import React, {useCallback} from 'react'
import { HeartIcon as SolidHeart } from '@heroicons/react/24/solid'
import { HeartIcon } from '@heroicons/react/24/outline'
import { styles } from '@/styles/styles';

function LikeButton({item, user, updateTempPostsAddLike, updateTempPostsRemoveLike, updateTempPostsFocusedLike}) {
  const addHomeLike = useCallback(async() => {
      await updateTempPostsAddLike(item, item.likedBy)
    },
    [item, updateTempPostsAddLike]);
  const removeHomeLike = useCallback(async() => {
      await updateTempPostsRemoveLike(item, item.likedBy)
    },
    [item, updateTempPostsRemoveLike]);
    const focusedLikedItem = useCallback(async() => {
      await updateTempPostsFocusedLike(item, item.likedBy)
    },
    [item, updateTempPostsFocusedLike]);
  return (
    <div className='flex flex-row'>
        {item.likedBy.includes(user.uid) ? 
        <SolidHeart className='btn' style={{color: 'red'}} onClick={() => removeHomeLike(item, item.likedBy)}/> : <HeartIcon className='btn' onClick={() => addHomeLike(item, item.likedBy)}/>}
        <span className='cursor-pointer' onClick={() => focusedLikedItem(item)} style={styles.numberCommentText}>{item.likedBy.length}</span>
    </div>
  )
}

export default LikeButton