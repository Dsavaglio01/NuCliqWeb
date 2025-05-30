import React, {useContext, useState} from 'react'
import ThemeHeader from '../components/ThemeHeader';
import PreviewFooter from '@/components/PreviewFooter';
import { useRouter } from 'next/router';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
function CreateTheme({onStateChange}) {
    const router = useRouter();
    const {avatar} = router.query;
    const [designing, setDesigning] = useState(false);
    //const [uploadGuidelines, setUploadGuidelines] = useState(false);
    const [copyright, setCopyright] = useState(false);
    const [credits, setCredits] = useState(false);
    const handleClick = () => {
      onStateChange(true)
    }
    const header = {
         fontSize: 24,
        textAlign: 'center',
        color: "#fafafa",
        padding: 10,
        paddingLeft: 0, 
        marginLeft: '10%'
    }
    const guidelineHeader = {
        fontSize: 19.20,
        padding: 10,
        paddingLeft: 0,
        marginLeft: '10%',
        textAlign: 'center',
        color: "#9edaff"
    }
    const supplementaryText = {
        fontSize: 19.20,
        color: "#fafafa",
        padding: 10,
        paddingTop: 0,
        marginLeft: '5%',
        paddingLeft: 0,
    }
    const optionsContainer = {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '5%',
        marginRight: '5%',
        display: 'flex'
    }
    const optionsTextActivated = {
        fontSize: 15.36,
        color: "#fafafa",
        padding: 10,
        paddingLeft: 0,
        paddingBottom: 0
    }
    const optionsText = {
        fontSize: 15.36,
        color: "#fafafa",
        padding: 10,
        paddingLeft: 0
    }
    const explainText = {
        fontSize: 15.36,
        color: "#9edaff" 
    }
  return (

    <div className=' flex flex-col'>
      <p style={header}>{avatar ? 'Create Your Own Avatar' : 'Designing New Themes'}</p>
      <div className='divider' style={{borderStyle: 'dashed', borderRadius: 1, width: '100%'}}/>
      <p style={guidelineHeader}>DESIGN GUIDELINES</p>
      <div style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
      {avatar ? <></> : 
      <p style={supplementaryText}>NuCliq allows you to create your own themes! Please read the information below before uploading your theme.</p>}     
      {/* <div className='cursor-pointer' style={styles.downloadContainer} onClick={() => downloadPdf()}>
        <MaterialCommunityIcons name='download-outline' size={27.5} style={{alignSelf: 'center', paddingRight: 5}} color={theme.color}/>
        <p style={[styles.downloadText, {color: theme.color}]}>Download Complete Guidelines</p>
      </div> */}
      <div style={{marginTop: '5%'}}>
      <div className='cursor-pointer' style={optionsContainer} onClick={() => setDesigning(!designing)}>
        <p style={designing ? optionsTextActivated : optionsText}>Designing your own themes</p>
        {designing ? <ChevronUpIcon style={{paddingTop: 10, alignSelf: 'center'}} className='navBtn' color={"#fafafa"}/> : <ChevronDownIcon style={{paddingTop: 10, alignSelf: 'center'}}  color={"#fafafa"} className='navBtn'/>}
        
      </div>
      {designing ? <div className='ml-[5%] mr-[5%]'>
        <p style={explainText}><span style={{fontSize: 19.20}}>{`\u2022 `}</span><span style={{fontWeight: '700'}}>Unique Designs</span>: NuCliq prefers that you design unique themes. Uniquely designed themes help your design to be memorable and different and help you showcase your personality. Creating your own theme also enables you to stand out from the rest of the crowd.</p>
        </div> : null}
      <div className='cursor-pointer' style={optionsContainer} onClick={() => setCopyright(!copyright)}>
        <p style={copyright ? optionsTextActivated : optionsText}>Copyright guidelines</p>
        {copyright ? <ChevronUpIcon style={{paddingTop: 10, alignSelf: 'center'}}  color={"#fafafa"} className='navBtn'/> : <ChevronDownIcon color={"#fafafa"} style={{paddingTop: 10, alignSelf: 'center'}}  className='navBtn'/>}
      </div>
      {copyright ? <div className='ml-[5%] mr-[5%]'>
        <p style={explainText}><span style={{fontSize: 19.20}}>{`\u2022 `}</span>Using graphical images, photos, vectors, or other images from third-party technologies (websites, apps, etc.) is not allowed on NuCliq. You may only use these graphical images if the third-party website will enable you to do so. You must carefully read the terms and conditions of the websites. NuCliq is not responsible for copyright infringement or legal actions resulting from the violation.</p>
        </div> : null}
      <div className='cursor-pointer' style={optionsContainer} onClick={() => setCredits(!credits)}>
        <p style={optionsText}>Credits for uploading</p>
        {credits ? <ChevronUpIcon style={{paddingTop: 10, alignSelf: 'center'}}  color={"#fafafa"} className='navBtn'/> : <ChevronDownIcon color={"#fafafa"} style={{paddingTop: 10, alignSelf: 'center'}}  className='navBtn'/>}
      </div>
      {credits ? 
      <div className='ml-[5%] mr-[5%]'>
        <p style={explainText}><span style={{fontSize: 19.20}}>{`\u2022 `}</span>In order for you to upload images as themes, you must have at least 1 NuCliq credit in order to do so. If you have 0 credits you must purchase credits in order to upload images. Credit purchases come in bundles of 20 credits (20 SUCCESSFUL uploads) to purchase. Purchase of credits are non-refundable.</p>
      </div> : null}
      {/* <div className='cursor-pointer' style={styles.optionsContainer} onClick={() => setHowSell(!howSell)}>
        <p style={howSell ? [styles.optionsText, {paddingBottom: 0, color: theme.color}] : [styles.optionsText, {color: theme.color}]}>How can I sell my themes?</p>
        {howSell ? <MaterialCommunityIcons name='chevron-up' size={27.5} style={{paddingTop: 10}} color={theme.color}/> : <MaterialCommunityIcons name='chevron-down' size={27.5} color={theme.color}/>}
      </div>
      {howSell ? <div>
        <p style={[styles.explainText, {color: theme.color}]}><p style={{fontSize: Dimensions.get('screen').height / 35.2}}>{`\u2022 `}</p>You can sell your uniquely designed themes through the NuCliq marketplace only.</p>
        <p style={[styles.explainText, {color: theme.color}]}><p style={{fontSize: Dimensions.get('screen').height / 35.2}}>{`\u2022 `}</p><p style={{fontWeight: '700'}}>Important note</p>: Once you sell your themes on the NuCliq marketplace, you cannot give them away for free, sell, or resell them on other platforms. You can only provide them for free or sell them through NuCliq. Reselling themes is not allowed.</p>
        </div> : null} */}
      {/* <div className='cursor-pointer' style={styles.optionsContainer} onClick={() => setHowEarn(!howEarn)}>
        <p style={howEarn ? [styles.optionsText, {paddingBottom: 0, color: theme.color}] : [styles.optionsText, {color: theme.color}]}>How much can I earn selling themes?</p>
        {howEarn ? <MaterialCommunityIcons name='chevron-up' size={27.5} style={{paddingTop: 10}} color={theme.color}/> : <MaterialCommunityIcons name='chevron-down' size={27.5} style={{alignSelf: 'center'}} color={theme.color}/>}
      </div>
      {howEarn ? <div>
        <p style={[styles.explainText, {color: theme.color}]}><p style={{fontSize: Dimensions.get('screen').height / 35.2}}>{`\u2022 `}</p>We require that you sell your themes between $1.99 - $4.99, making it easily affordable for everyone to purchase your themes. You get 70%, and NuCliq gets 30% of the total theme sale after processing fees.</p>
        </div> : null} */}
      </div>
      </div>
      <div className='divider' style={{borderStyle: 'dashed', borderRadius: 1, width: '100%'}}/>
      <div style={{marginLeft: '10%', marginRight: '10%'}}>
      
      
      <PreviewFooter text={"CONTINUE"} onClickCancel={() => router.push('All', {name: null})} onClick={handleClick}/>
        </div>
    </div>
  )
}

export default CreateTheme