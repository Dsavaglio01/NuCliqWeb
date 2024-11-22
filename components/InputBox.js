import { EnvelopeIcon } from '@heroicons/react/24/outline'
import React from 'react'

function InputBox({text, icon, onChange, value, multiline}) {
  if (multiline) {
    return (
    <div style={{ marginTop: '5%', flexDirection: 'row', display: 'flex', }}> 
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
        style={{ 
            width: 300,
          padding: 10,
          border: '1px solid #ccc',
          borderRadius: 5,
          color: "#fafafa",
          backgroundColor: "#121212"
        }}
      />
      
    </div>
        
  )
  }
  else {
  return (
    <div style={{ marginTop: '5%', flexDirection: 'row', display: 'flex', }}> 
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
        style={{ 
            
            width: 300,
          padding: 10,
          border: '1px solid #ccc',
          borderRadius: 5,
          color: "#fafafa",
          backgroundColor: "#121212"
        }}
      />
      
    </div>
        
  )
}
}

export default InputBox