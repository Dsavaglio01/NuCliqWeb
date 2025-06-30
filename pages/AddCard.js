import NextButton from '@/components/NextButton'
import React from 'react'

function AddCard({}) {
    const headerHeader = {
        color: "#fafafa",
        fontSize: 24,
        padding: 10,
        textAlign: 'center'
    }
    const addCard = async() => {
        await fetch('http://localhost:4000/api/endpoint', {
            method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
      },
        }).then(response => response.json())
    .then(responseData => {
      // Handle the response from the server
      console.log(responseData);
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error(error);
    })
    }
  return (
    <div>
        <div className='flex justify-center mt-5 flex-col pb-3' style={{borderBottomWidth: 1, borderBottomColor: "#fafafa"}}>
            <span style={headerHeader}>{"Add Card to Receive Payments"}</span>
            
        </div>
        <div className='flex flex-col items-center justify-center h-full'>
        <NextButton text={"Add Card"} onClick={() => addCard()}/>
          </div>
    </div>
  )
}

export default AddCard