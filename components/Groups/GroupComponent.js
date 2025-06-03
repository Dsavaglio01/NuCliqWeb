import React, { useState } from 'react'
import { styles } from '@/styles/styles';
import Image from 'next/image';
import RequestedIcon from '../RequestedIcon';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { FaUserPlus } from "react-icons/fa";
import { FaC, FaCheck } from "react-icons/fa6";
function GroupComponent({item, user, groupsJoined, ref, index, tempPosts}) {
    const requests = [] // change this later
    const [chosenClique, setChosenClique] = useState(null);
  return (

    <div style={styles.posting} ref={ref}>
      <button style={{alignItems: 'flex-start', flexDirection: 'row'}}>
        <Image source={item.banner} style={{height: 50, width: 50, borderRadius: 10, marginTop: 5}}/>
        <div style={{flexDirection: 'column', marginLeft: 5}}>
            <div style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <div style={{width: '40%'}}>
                    <span style={styles.nameText} numberOfLines={1}>{item.name}</span>
                    {item.members.length == 1 ? <span style={styles.type}>{item.members.length} Member</span> 
                    : <span style={styles.type}>{item.members.length > 999 && item.members.length < 1000000 ? `${item.members.length / 1000}k` : item.members.length > 999999 ? `${item.members.length / 1000000}m` : item.members.length} Members</span>}
                </div>
                <div style={{alignItems: 'flex-end'}}>
                    {item.groupSecurity == 'private' && requests.filter(e => e.id === item.id).length > 0 ?
                    <div style={styles.requestedJoinContainer}>
                        <RequestedIcon color={"#9EDAFF"}/> 
                    </div>
                    : user ? !groupsJoined.includes(item.id) ? <button style={styles.joinContainer} onPress={() => {updateGroup(item)}}>
                        <span style={styles.joinText}>Join</span>
                        
                    </button> :  
                    <button style={styles.joinContainer} onPress={() => removeGroup(item)}>
                        <span style={styles.joinText}>Joined</span>
                    </button> : null}
                
                </div>
                
            </div>
            <p className='numberofLines3' style={styles.descriptionText}>{item.description}</p>
       </div>
      </button>
      {item.transparent ? 
        <div style={styles.overlay}>
          <button style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}} onPress={() => {itemAllNotToTransparent(item); setChosenClique(null)}}>
            <span style={styles.closeText}>Close</span>
            <XMarkIcon className='navBtn'/>
          </button>
          <div style={{alignItems: 'center'}}>
             {item.groupSecurity == 'private' && requests.filter(e => e.id === item.id).length > 0 ?
             <div style={styles.requestedJoinContainer}>
              <RequestedIcon color={"#9EDAFF"}/> 
              </div>
               : user ? !groupsJoined.includes(item.id) ? <button style={styles.joinContainer} onPress={() => {updateGroup(item)}}>
                  <FaUserPlus className='navBtn'/>
              </button> :  
              <button style={styles.joinContainer} onPress={() => removeGroup(item)}>
                  <span style={styles.joinText}>Joined</span>
                  <FaCheck className='navBtn'/>
              </button> : null}
              <button style={styles.joinContainer} onPress={item.groupSecurity == 'private' ? () =>  Alert.alert('Private Cliq', 'Must join Cliq in order to share') : () => navigation.navigate('Chat', {sending: true, message: true, payloadGroup: {name: item.name, pfp: item.banner, id: item.id, group: item.id}})}>
                <span style={styles.joinText}>Share Cliq</span>
              </button>
             
            </div>
        </div>
      : null
      }
      </div>
  )
}

export default GroupComponent