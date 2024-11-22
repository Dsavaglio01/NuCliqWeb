import React from 'react'
import MainButton from './MainButton'
import NextButton from './NextButton'


function PreviewFooter ({onClick, text, onClickCancel}) {
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
      <NextButton text={text} onClick={onClick} textStyle={{fontWeight: '700'}}/>
    </div>
  )
}

export default PreviewFooter
