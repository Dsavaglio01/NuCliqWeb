import React from 'react'
import { styles } from '@/styles/styles'
function NextButton({text, onClick}) {
  return (
    <button style={styles.nextButton} onClick={onClick}>
        <p style={styles.nextButtonText}>{text}</p>
    </button>
  )
}

export default NextButton