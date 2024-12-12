import React, {useContext, useRef} from 'react'
import themeContext from '../lib/themeContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/solid';
import { styles } from '@/styles/styles';
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
        <MagnifyingGlassIcon className='btn' style={styles.searchIcon}/>
        <input ref={textInputRef} value={text == true ? value : ''} onChange={onChangeText} style={styles.searchInput} type='text' 
        autoFocus={autoFocus} placeholder={placeholder} onFocus={onFocus} onSubmit={onSubmitEditing}/>
        
    </div>
  )
}

export default SearchInput