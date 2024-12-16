import ProfileContext from '@/context/ProfileContext'
import { styles } from '@/styles/styles'
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import React, { useContext } from 'react'
import NextButton from './NextButton';
function ContentComponent({item, index, comments, blocked, requests, filterPosts}) {
    const profile = useContext(ProfileContext);
    const router = useRouter();
    //.then(() => setPosts(posts.filter((e) => e.id != item.id)))
    async function unBlock(item) {
      await updateDoc(doc(db, 'profiles', user.uid), {
      blockedUsers: arrayRemove(item.id)
    }).then(async() => await updateDoc(doc(db, 'profiles', item.id), {
      usersThatBlocked: arrayRemove(user.uid)
    })).then(() => handleFilterPosts())
    }
    const handleFilterPosts = () => {
        filterPosts();
    }
  return (
    comments ? 
        <div key={index}>
            <div style={styles.commentListContentContainer}>
            <div style={styles.notificationItemHeader}>
            {profile.pfp ? <img src={profile.pfp} style={styles.notificationImageBorder}/> :
                <UserCircleIcon className='userBtn' style={styles.notificationImageBorder}/>}
                <p className='numberofLines2' style={styles.notificationText}>You {item.reply != undefined ? 'replied' : 'commented'}: {item.comment}</p>
            </div>
            {item.post[0].image ? 
                <div style={styles.commentContentImage} onClick={() => router.push('Post', {post: item.postId, requests: requests, name: item.userId, groupId: null})}>
                    <img src={item.post[0].post} style={styles.notificationImage}/>
                </div> : item.post[0].video ? <div style={styles.leftCommentContentImage} onClick={() => router.push('Post', {post: item.id, requests: requests, name: item.userId, groupId: null})}>
                    <img src={item.post[0].thumbnail} style={styles.notificationImage}/>
                </div> :
                <div style={styles.leftCommentContentImage} onClick={() => router.push('Post', {post: item.postId, name: item.userId, requests: requests, groupId: null})}>
                    <p style={styles.notificationImage}>{item.post[0].value}</p>
                </div>}
            </div>
        </div>
      : blocked ? 
        <div key={index}>
            <div style={styles.contentListContainer} >
                <div style={styles.contentListBlockedContainer}>
                  {item.pfp ? 
                    <img src={item.pfp} style={styles.searchPfp}/> :
                    <UserCircleIcon className='userBtn' style={styles.searchPfp}/>
                  }
                    
                 <div style={styles.contentListBlockedInfo} onClick={() => router.push('ViewingProfile', {name: item.id, viewing: true})}>
                    <p className='numberofLines1' style={styles.name}>{item.firstName} {item.lastName}</p>
                    <p className='numberofLines1' style={styles.message}>@{item.userName}</p>
                </div>
                </div>
              <div style={styles.unBlock}>
                <NextButton text={"Un-Block"} textStyle={{fontSize: 12.29}} onClick={() => unBlock(item)}/>
              </div>
            </div>
        </div>
        : 
        <div key={index}>
            {item.post[0].image ? 
            <div style={styles.contentListPosts} onClick={() => router.push('Post', {post: item.id, requests: requests, name: item.userId, groupId: null})}>
                <img src={item.post[0].post} style={styles.contentListImage}/>
            </div> : item.post[0].video ? <div style={styles.contentListPosts} onClick={() => router.push('Post', {post: item.id, requests: requests, name: item.userId, groupId: null})}>
                <img src={item.post[0].thumbnail} style={styles.contentListImage}/>
            </div> :
            <div style={styles.contentListPosts} onClick={() => router.push('Post', {post: item.id, name: item.userId, requests: requests, groupId: null})}>
                <p style={styles.contentListImage}>{item.post[0].value}</p>
            </div>}
        </div>
        
  )
}

export default ContentComponent