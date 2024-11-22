import React from 'react'
import MainButton from './MainButton'
import NextButton from './NextButton'
import PickTheme from './PickTheme'


function PreviewThemeFooter ({text, onClickCancel, onFileSelected}) {
    const container = {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        //margin: '3%',
        marginTop: '3%',
        marginBottom: '5.5%',
    }
  return (
    <div style={container}>
      <MainButton text={"CANCEL"} onClick={onClickCancel}/>
      <PickTheme text={text} onFileSelected={onFileSelected}/>
    </div>
  )
}

export default PreviewThemeFooter
