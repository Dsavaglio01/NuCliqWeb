import React, {useContext, useRef} from 'react'
import { IoIosCloseCircleOutline } from "react-icons/io";
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
        overflow: 'hidden',
        }} onClick={ () => {onClick; textInputRef.current.focus()}}>
        {/* <MagnifyingGlassIcon className='btn' style={styles.searchIcon}/> */}
        <input ref={textInputRef} value={text == true ? value : ''} onChange={onChangeText} style={styles.searchInput} type='text' 
        autoFocus={autoFocus} placeholder={placeholder} onFocus={onFocus} onSubmit={onSubmitEditing}/>
        <div className='flex justify-center ml-auto p-1 pr-2'>
          <IoIosCloseCircleOutline className='btn' size={20} stlye={{alignSelf: 'center'}}/>
        </div>
        
        
    </div>
  )
}

export default SearchInput