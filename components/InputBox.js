import { styles } from '@/styles/styles'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import React from 'react'

function InputBox({text, icon, onChange, value, multiline}) {
  if (multiline) {
    return (
    <div style={styles.inputBoxContainer}> 
    <div style={{ padding: 10 }}>  {/* Adjust padding for icon spacing */}
    {icon == 'email' ? 
        <EnvelopeIcon height={30} color='#fafafa' style={{marginRight: 15}}/>
        : null}
      </div>
      <textarea
        type="text" 
        placeholder={text} 
        value={value}
        onChange={onChange}
        style={styles.inputBox}
      />
      
    </div>
        
  )
  }
  else {
  return (
    <div style={styles.inputBoxContainer}> 
    <div style={{ padding: 10 }}>  {/* Adjust padding for icon spacing */}
    {icon == 'email' ? 
        <EnvelopeIcon height={30} color='#fafafa' style={{marginRight: 15}}/>
        : null}
      </div>
      <input 
        type="text" 
        placeholder={text} 
        value={value}
        onChange={onChange}
        style={styles.inputBox}
      />
      
    </div>
        
  )
}
}

export default InputBox