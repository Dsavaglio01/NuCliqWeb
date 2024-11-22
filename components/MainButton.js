import React, { useContext } from 'react'
const MainButton = ({text, onClick}) => {

    const logInButton = {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#9edaff"
    }
    const alreadyText = {
        fontSize: 12.29,
        padding: 12,
        color: "#fafafa",
        fontWeight: '700',
        paddingLeft: 25,
        paddingRight: 25,
        textAlign: 'center'
    }
  return (
    <div className='cursor-pointer' style={logInButton} onClick={onClick}>
        <p style={alreadyText}>{text}</p>
    </div>
  )
}

export default MainButton