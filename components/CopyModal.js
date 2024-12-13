import React from 'react'
import { styles } from '@/styles/styles'
import { TrashIcon, FlagIcon } from '@heroicons/react/24/outline'
import { XMarkIcon, DocumentDuplicateIcon } from '@heroicons/react/24/solid'
function CopyModal({item, userId, reportedContent, copy, newMessages, handleNewMessages, filterNewMessages, friendId, lastMessageId}) {
    function toggleSaveToFalse(e) {
        const updatedArray = newMessages.map(item => {
            if (item.id === e.id) {
                return { ...item, copyModal: false, saveModal: false };
            }
            return item;
        });
        handleNewMessages(updatedArray)
    }
    async function copyFunction(item, textCopied) {
        navigator.clipboard.writeText(textCopied).then(()=> toggleSaveToFalse(item)).catch((error) => console.warn(error))
    }
    async function deleteMessage(item) {
        const newMessage = newMessages[newMessages.indexOf(item.id) + 2]
        if (newMessage) {
            if (item.message.image) {
                try {
                    const response = await fetch(`${BACKEND_URL}/api/deleteImageMessageNewMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: {item: item, image: item.message.image, friendId: friendId, newMessage: newMessage}}), // Send data as needed
                    })
                    const data = await response.json();
                    if (data.done) {
                        filterNewMessages(newMessages.filter((e) => e.id != item.id))
                        lastMessageId(newMessage.id)
                    }
                } 
                catch (e) {
                    console.error(e);
                }
            }
            else {
                try {
                    const response = await fetch(`${BACKEND_URL}/api/deleteMessageNewMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: {item: item, friendId: friendId, newMessage: newMessage}}),
                    })
                    const data = await response.json();
                    if (data.done) {
                        filterNewMessages(newMessages.filter((e) => e.id != item.id))
                        lastMessageId(newMessage.id)
                    }
                } catch (e) {
                    console.error(e);
                }
            }   
        }
        else {
            if (item.message.image) {
                try {
                    const response = await fetch(`${BACKEND_URL}/api/deleteImageMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: {item: item, image: item.message.image, friendId: friendId, newMessage: newMessage}}), // Send data as needed
                    })
                    const data = await response.json();
                    if (data.done) {
                        setNewMessages(newMessages.filter((e) => e.id != item.id))
                    }
                } 
                catch (e) {
                    console.error(e);
                }
            }
            else {
                try {
                    const response = await fetch(`${BACKEND_URL}/api/deleteMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data: {item: item, friendId: friendId, newMessage: newMessage}}), // Send data as needed
                    })
                    const data = await response.json();
                    if (data.done) {
                        filterNewMessages(newMessages.filter((e) => e.id != item.id))
                    }
                } 
                catch (e) {
                    console.error(e);
                }
            }
        }
    }
    return (
        <div style={styles.copyModal}>
            {copy ? 
                <>
                    <button style={styles.copyTextContainer} onClick={() => copyFunction(item, item.message.text)}>
                        <p style={styles.copyText}>Copy</p>
                        <DocumentDuplicateIcon style={{alignSelf: 'center'}} className='btn'/>
                    </button>
                    <div className='divider' />
                </> 
            : null}
            {item.user == userId ? 
                <>
                    <button style={styles.copyTextContainer} onClick={() => deleteMessage(item)}>
                        <p style={styles.copyText}>Delete Message</p>
                        <TrashIcon className='btn' style={{alignSelf: 'center'}} />
                    </button>
                    <div className='divider' />
                </>
            : null}
            {!reportedContent.includes(item.id) ? 
                <>
                    <button style={styles.copyTextContainer}>
                        <p style={styles.copyText}>Report</p>
                        <FlagIcon className='btn' style={{alignSelf: 'center'}} />
                    </button> 
                <div className='divider' />
                </>
            : null}
            <button style={styles.copyTextContainer} onClick={() => toggleSaveToFalse(item)}>
                <p style={styles.copyText}>Cancel</p>
                <XMarkIcon className='btn' style={{alignSelf: 'center'}} />
            </button>
        </div>
  )
}

export default CopyModal