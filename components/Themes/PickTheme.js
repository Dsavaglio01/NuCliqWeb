import React, { useRef } from 'react'
import { styles } from '@/styles/styles';
function PickTheme({text, onFileSelected}) {
    const fileInputRef = useRef(null);
    const handleClick = () => {
        fileInputRef.current.click();
    }
    const handleFileChange = (event) => {
        console.log(event)
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            onFileSelected(selectedFile)
        }
    }
  return (
    <>
    <button style={styles.nextButton} onClick={handleClick}>
        <p style={styles.nextButtonText}>{text}</p>
    </button>
    <input type='file' accept="image/*" ref={fileInputRef} style={{display: 'none'}} onChange={handleFileChange}/>
    </>
  )
}

export default PickTheme