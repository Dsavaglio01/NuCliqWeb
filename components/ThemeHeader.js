import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import React from 'react'

function ThemeHeader({backButton, viewingProfile, video, name, text, post, cancelButton}) {
    const router = useRouter();
    const innerContainer = {
      justifyContent: 'space-between',
      display: 'flex'
    }
    const header = {
        fontSize: 24,
        padding: 10,
        paddingLeft: 0,
        marginLeft: 5,
        //marginTop: 8,
        color: "#9edaff"
    }
  return (
   <div style={innerContainer}>
      {backButton ? 
      <ChevronLeftIcon style={{alignSelf: 'center'}} className='btn' onClick={viewingProfile ? () => router.push('ViewingProfile', {name: name, viewing: true}) : () => router.back() }/>
      : null}
      <div style={backButton ? {flexDirection: 'row', marginLeft: '2%', display: 'flex'} : {flexDirection: 'row', display: 'flex'}}>
                <p className='numberofLines1' style={header}>{text}</p>
                </div>
                {cancelButton ? <div style={{flexDirection: 'column', marginTop: '5%'}} onClick={() => router.push('All', {name: null})}>
                  <XMarkIcon className='btn'/>
                  <p style={{fontSize: 12.29}}>Cancel</p>
                </div> : null}
                {post ? 
                {/* <Menu 
                visible={visible}
                onDismiss={closeMenu}
                contentStyle={{backgroundColor: theme.backgroundColor, borderWidth: 1, borderColor: "#71797E"}}
                anchor={<Entypo name='dots-three-vertical' size={25} color={theme.color} style={{paddingTop: '3.5%'}} onClick={openMenu}/>}>
                {name == user.uid ? <Menu.Item title="Delete" titleStyle={{color: theme.color}} onClick={homePost ? () => deletePost(actualPost) : cliquePost ?  () => deleteCliquePost(actualPost) : null}/> : null}
                  {name == user.uid ? postArray != null ? postArray[0].text ? getHour(timestamp) ? <Menu.Item title="Edit" titleStyle={{color: theme.color}} onClick={ cliquePost ? () => router.push('Caption', {edit: true, group: actualGroup, groupPfp: actualGroup.banner, groupName: groupName, postArray: postArray, groupId: cliqueId, editCaption: caption, editId: id}) : () =>  router.push('Caption', {edit: true, postArray: postArray, editCaption: caption, editId: id})}/> : null : <Menu.Item title="Edit" titleStyle={{color: theme.color}} onClick={ cliquePost ? () => router.push('Caption', {edit: true, group: actualGroup, groupPfp: actualGroup.banner, groupName: groupName, postArray: postArray, groupId: cliqueId, editCaption: caption, editId: id}) : () =>  router.push('Caption', {edit: true, postArray: postArray, editCaption: caption, editId: id})}/> : null : null}
                  {!reportedContent.includes(id) ? <Menu.Item title="Report" titleStyle={{color: theme.color}} onClick={cliqueId ? () => router.push('ReportPage', {id: id, comment: null, theme: false, cliqueId: cliqueId, post: true, comments: false, message: false, cliqueMessage: false, reportedUser: userId}) : () => router.push('ReportPage', {id: id, comment: null, cliqueId: null, post: true, theme: false, comments: false, message: false, cliqueMessage: false, reportedUser: userId})}/> : null}
              </Menu> */}
               : null
                }
                  {/* <div style={{flexDirection: 'row', alignSelf: 'center', marginTop: 10}}>
                    <Ionicons name='search' size={30} color="#000" style={{alignSelf: 'center', marginRight: '5%'}} onClick={() => setSearching(true)}/>
                  </div> */}
          </div>
  )
}

export default ThemeHeader