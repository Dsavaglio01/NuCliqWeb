import React, {useState} from 'react'
import { styles } from '@/styles/styles'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import Switch from 'react-switch';
import { logOut, statusFunction, allowNotificationsFunction, privacyFunction  } from '@/firebaseUtils';
function SettingsSideBar(setContentState) {
    const [activityEnabled, setActivityEnabled] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false); 
    const [privacyEnabled, setPrivacyEnabled] = useState(false);
  return (
    <div style={{marginLeft: '5%', marginRight: '5%'}}>
        <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('My Likes')}}>
            <p style={styles.pushNotiText}>My Likes</p>
            <ChevronRightIcon className='btn'/>
        </div>
        <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('comments')}}>
            <p style={styles.pushNotiText}>My Comments</p>
            <ChevronRightIcon className='btn'/>
        </div>
        <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('saves')}}>
            <p style={styles.pushNotiText}>My Bookmarks</p>
            <ChevronRightIcon className='btn'/>
        </div>
        <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('mentions')}}>
            <p style={styles.pushNotiText}>My Mentions</p>
            <ChevronRightIcon className='btn'/>
        </div>
        <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('transaction history')}}>
            <p style={styles.pushNotiText}>Transaction History</p> 
            <ChevronRightIcon className='btn'/>
        </div>
        <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('blocked')}}>
            <p style={styles.pushNotiText}>Blocked Users</p>
            <ChevronRightIcon className='btn'/>
        </div>
        <div className='cursor-pointer' style={styles.sections} onClick={() => {setContentState('reportProblem')}}>
            <p style={styles.pushNotiText}>Report a Problem</p>
            <ChevronRightIcon className='btn'/>
        </div>
            <div className='cursor-pointer' style={styles.sections}>
            <p style={styles.pushNotiText}>Show Active Status</p>
            <Switch checked={activityEnabled} checkedIcon={false} uncheckedIcon={false}
                onColor={'#005278'} offColor='#767577' onHandleColor='#f4f3f4' offHandleColor='#f4f3f4' 
                onChange={() => statusFunction(user.uid, activityEnabled, setActivityEnabled)} value={activityEnabled}/>
        </div>
        <div className='cursor-pointer' style={styles.sections}>
            <p style={styles.pushNotiText}>Push Notifications</p>
            <Switch checked={isEnabled} checkedIcon={false} uncheckedIcon={false}
                onColor={'#005278'} offColor='#767577' onHandleColor='#f4f3f4' offHandleColor='#f4f3f4' onChange={() => allowNotificationsFunction(user.uid, isEnabled,
                profile.notificationToken, setIsEnabled)} value={isEnabled}/>
        </div>
        <p style={styles.tapToReceiveText}>Tap to Receive Notifications</p>
        <div className='cursor-pointer' style={styles.sections}>
            <p style={styles.pushNotiText}>Private Account</p>
            <Switch checked={privacyEnabled} checkedIcon={false} uncheckedIcon={false}
                onColor={'#005278'} offColor='#767577' onHandleColor='#f4f3f4' offHandleColor='#f4f3f4' 
                onChange={() => privacyFunction(user.uid, privacyEnabled, setPrivacyEnabled)} value={privacyEnabled}/>
        </div>
        <p style={styles.tapToReceiveText}>Tap to Make Account Private</p>
            <div className='cursor-pointer' style={styles.sections}>
            <p style={styles.settingsBottomText}>Data Usage Policy</p>
            <ChevronRightIcon className='btn'/>
        </div>
        <div className='cursor-pointer' style={styles.sections}>
            <p style={styles.settingsBottomText}>Data Retention Policy</p>
            <ChevronRightIcon className='btn'/>
        </div>
        <div className='cursor-pointer' style={styles.sections}>
            <p style={styles.settingsBottomText}>Privacy Policy</p>
            <ChevronRightIcon className='btn'/>
        </div>
        <div className='cursor-pointer' style={styles.sections}>
            <p style={styles.settingsBottomText}>Terms and Conditions</p>
            <ChevronRightIcon className='btn'/>
        </div>
        <div className='cursor-pointer' onClick={() => logOut(user?.uid)}>
            <p style={styles.settingsBottomText}>Log Out</p>
        </div>
        <div className='cursor-pointer'>
            <p style={{...styles.settingsBottomText, ...{color: 'red'}}}>Delete Account</p>
        </div>
    </div>
  )
}

export default SettingsSideBar
