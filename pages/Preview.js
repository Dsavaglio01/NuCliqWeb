import React, {useState, useEffect} from 'react'
import ThemeHeader from '@/components/Themes/ThemeHeader';
import { useAuth } from '@/context/AuthContext';
import PreviewFooter from '@/components/PreviewFooter';
import { useRouter } from 'next/router';
function Preview({file, onStateChange, changeImageData}) {
    useEffect(() => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImageData(e.target.result);
      };

      reader.readAsDataURL(file); 
    }
  }, [file]);
    const handleClick = () => {
      console.log('brh')
        onStateChange(true)
        changeImageData(imageData)
    }
    const [imageData, setImageData] = useState(null)
    const [source, setSource] = useState(null);
    const router = useRouter();
    const {user} = useAuth();
    const overlay = {
        alignItems: 'center',
        marginTop: '15%',
        justifyContent: 'center',
        flex: 1
    }
    const previewButton = {
      borderRadius: 8,
      padding: 15,
      backgroundColor: "#005278",
      width: '75%',
      marginLeft: '12.5%',
      marginTop: '5%',
      alignItems: 'center'
    }
    const previewText = {
      fontSize: 15.36,
      fontWeight: '700',
      padding: 15,
      color: "#fafafa"
    }
  return (
    <div className='w-max flex flex-col'>
        <span className='text-2xl self-center m-5 mb-0 text-white'>Preview Theme</span>
        <div className='dashedDivider'/>
        <div style={{marginTop: '5%', marginLeft: '5%', marginRight: '5%'}}>
        {/* <Text style={styles.headerText}>Edit the Image by Making it Your Own!</Text> */}
        <div style={{alignItems: 'center', justifyContent: 'center'}}>
        <div className='flex flex-row' style={{borderWidth: 1, padding: 5, borderColor: "#fafafa"}}>
          <img src={imageData} style={{width: 320, height: window.innerHeight / 1.68}}/>
          <div style={overlay} className='items-center'>
          <button style={previewButton}>
            <span style={previewText}>Preview w/ Profile Page</span>
          </button>
          <button style={previewButton}>
            <span style={previewText}>Preview w/ Posts</span>
          </button>
        </div>
        </div>
        
        
        
       {/*  <div style={{width: '75%', marginTop: '2.5%'}}>
            <NextButton text={'Add Stickers'} textStyle={{fontSize: 15.36}} onPress={() => navigation.navigate('StickerGuidelines', {source: source.uri})}/>
        </div> */}
        </div>
        <PreviewFooter containerStyle={{marginTop: '15%'}} text={"CONTINUE"} onPressCancel={() => router.push('All', {name: null})} 
        onClick={handleClick}/>
        </div>
      </div>
  )
}

export default Preview