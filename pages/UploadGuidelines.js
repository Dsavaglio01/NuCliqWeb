import React, {useContext, useState} from 'react'
import ThemeHeader from '../components/ThemeHeader'
import PreviewThemeFooter from '../components/PreviewThemeFooter';
import { useRouter } from 'next/router';

function UploadGuidelines ({handleStateChange}) {
    const router = useRouter()
    const {upload, ai} = router.query;
    const [isChecked, setIsChecked] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileSelected = (event) => {
       // console.log(event)
       // console.log(file)
       handleStateChange(true, event)
        //setSelectedFile(file);
        // ... do something with the selected file
    };
    const pickImage = async() => {
      await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          //allowsMultipleSelection: true,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        }).then(async(image) => {
          if (!image.canceled) {
              image.assets.map(async(ite, index) => {
              //getFileSize(ite.uri)
              const result = await Image.compress(
                ite.uri,
                {},
              );
              //getFileSize(result)
              //console.log(result)
              router.push('DesignTheme', {source: result})
                      
            })
            }
        })
    };
    const header = {
        fontSize: 19.20,
        textAlign: 'center',
        color: "#fafafa",
        padding: 10,
        paddingLeft: 0, 
    }
    const supplementaryText = {
        fontSize: 15.36,
        color: "#9edaff",
        textAlign: 'center',
        padding: 10,
        paddingLeft: 0,
    }
    const tandctext = {
        fontSize: 15.36,
        fontWeight: '700',
        margin: '2.5%',
        color: "#fafafa",
        padding: 10,
    }
    const bulletTandCText = {
        fontSize: 15.36,
        color: "#fafafa",
        padding: 10,
        paddingTop: 5, alignSelf: 'center',
    }
    const agreeText = {
        fontSize: 12.29,
        color: "#fafafa",
        padding: 10,
        fontWeight: '700'
    }
    /* <PhotoIcon className='btn' onClick={() => document.getElementById('fileInput').click()}/>
            <input 
        type="file" 
        accept="image/*" 
        //onChange={handleImageChange} 
        id="fileInput" 
        style={{ display: 'none' }} 
      /> */
  return (
    <div className='w-max'>
        <p style={header}>{upload ? 'Upload Theme' : 'Generate Theme'}</p>
        <div className='dashedDivider'/>
        <p style={supplementaryText}>Please review and agree to the NuCliq Terms and Conditions below.</p>
        <div style={{borderWidth: 1, marginTop: '2.5%', borderColor: "#fafafa"}}>
            <p style={tandctext}>Terms & Conditions</p>
            <div className='divider' />
            <p style={tandctext}>When uploading an image as your theme for your timeline and profile make sure you follow these guidelines:</p>
            <ul className='ml-16'>
                <li style={bulletTandCText}>Make sure the image is not infringing any copyright or you did not copy or use it without permission from the owner.</li>
                <li style={bulletTandCText}>The image is appropriate, safe for work and the community.</li>
            </ul>
            <div className='cursor-pointer ml-9 pt-10' onClick={() => {setIsChecked(!isChecked)}} style={{flexDirection: 'row', display: 'flex', padding: 10, alignItems: 'center'}}>
                <label>
                    <input type='checkbox' value={isChecked} checked={isChecked} onChange={() => {setIsChecked(!isChecked)}} color={isChecked ? "#9EDAFF" : '#fafafa'}/>
                </label>
                <p style={agreeText}>I agree with the <span style={{textDecorationLine: 'underline'}} onClick={() => router.push('TandC')}>Terms and Conditions</span></p>
            </div>
            
        </div>
        <div style={{width: '90%', marginLeft: '5%', marginTop: '2.5%'}}>
            <PreviewThemeFooter text={"CONTINUE"} onClickCancel={() => {console.log('I wsa pressed')}} onFileSelected={(file) => handleFileSelected(file)}/>
        </div>
    </div>
  )
}

export default UploadGuidelines
