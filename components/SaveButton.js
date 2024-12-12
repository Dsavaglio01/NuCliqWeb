import React, {useCallback} from 'react'
import { BookmarkIcon as SolidBookmark } from '@heroicons/react/24/solid'
import { BookmarkIcon } from '@heroicons/react/24/outline'
function SaveButton({item, user, updateTempPostsAddSave, updateTempPostsRemoveSave}) {
    const addHomeSave = useCallback(async() => {
      await updateTempPostsAddSave(item, item.savedBy)
    }, [item, updateTempPostsAddSave]);
  const removeHomeSave = useCallback(async() => {
      await updateTempPostsRemoveSave(item, item.savedBy)
    }, [item, updateTempPostsRemoveSave]);
  return (
     <div className='flex flex-row'>
        {item.savedBy.includes(user.uid) ? 
        <SolidBookmark className='btn' style={{color: '#9EDAFF'}} onClick={() => removeHomeSave(item)}/> : <BookmarkIcon className='btn' onClick={() => addHomeSave(item)}/>}
    </div>
  )
}

export default SaveButton