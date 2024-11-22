import React from 'react'

function NextButton({text, onClick}) {
  return (
    <button style={{borderRadius: 10, borderWidth: 1, borderColor: "#9EDAFF", backgroundColor: "#9EDAFF"}} onClick={onClick}>
        <p style={{fontSize: 15.36,
        padding: 12,
        paddingLeft: 25,
        color: "#121212",
        paddingRight: 25,
        textAlign: 'center'}}>{text}</p>
    </button>
  )
}

export default NextButton