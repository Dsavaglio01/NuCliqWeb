import React, { useRef } from 'react'

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
    <button style={{borderRadius: 10, borderWidth: 1, borderColor: "#9EDAFF", backgroundColor: "#9EDAFF"}} onClick={handleClick}>
        <p style={{fontSize: 15.36,
        padding: 12,
        paddingLeft: 25,
        paddingRight: 25,
        textAlign: 'center'}}>{text}</p>
    </button>
    <input type='file' accept="image/*" ref={fileInputRef} style={{display: 'none'}} onChange={handleFileChange}/>
    </>
  )
}

export default PickTheme