import React, {useContext, useRef} from 'react'
import themeContext from '../lib/themeContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/solid';
const SearchInput = ({text, onChangeText, width, containerStyle, value, onClick, onFocus, placeholder, autoFocus, iconStyle, onSubmitEditing}) => {
  const textInputRef = useRef(null)
  return (
    <div className='cursor-pointer' style={{backgroundColor: '#121212', borderRadius: 10,
      borderWidth: 1,
        height: 40,
        width: width,
        display: 'flex',
        flexDirection: 'row',
        }} onClick={ () => {onClick; textInputRef.current.focus()}}>
        <MagnifyingGlassIcon className='btn' style={{alignSelf: 'center', paddingLeft: 10}}/>
        <input ref={textInputRef} value={text == true ? value : ''} onChange={onChangeText} style={{fontSize: 15.36, color: "#fff", backgroundColor: "#121212",
        fontWeight: '600', borderWidth: 0, paddingLeft: 10}} type='text' autoFocus={autoFocus} placeholder={placeholder} onFocus={onFocus} onSubmit={onSubmitEditing}/>
        {/* {text == true ? <ArchiveBoxXMarkIcon className='btn' onClick={onClick} /> : null} */}
        
    </div>
  )
}

export default SearchInput