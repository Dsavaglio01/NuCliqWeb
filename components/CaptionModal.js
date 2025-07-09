import React, {useState, useEffect} from 'react'
import { styles } from '@/styles/styles'
import CarouselComponent from './Carousel'
import { IoIosArrowBack } from "react-icons/io";
import { BeatLoader } from 'react-spinners';
import MainButton from './MainButton';
import { useMultiDownloadImage } from '@/hooks/useMultiDownloadImage';
function CaptionModal({ data, profile, closeCaptionModal, user}) {
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [newPostArray, setNewPostArray] = useState([]);
    const {addImage, addVideo} = useMultiDownloadImage({user: user, mood: '', caption: caption ?? '', actualPostArray: data, setNewPostArray: setNewPostArray});
    const handleCaption = () => {
        setUploading(true)
        if (data.length > 1 || (data.length == 1 && !data[0].text)) {
            uploadImages()
        }
    }
    const uploadImages = () => {
      setUploading(true);
        data.map(async(item) => {
            if (item.image) {
                addImage(item)
            }
            else {
                addVideo(item)
            }
        })
    }
    console.log(`Newpostarray: ${newPostArray}`)
    useEffect(() => {
        if (newPostArray.length > 0 && profile) {
            if ((newPostArray.filter((item) => item.image == true).every(obj => obj['post'].includes('https://firebasestorage.googleapis.com')) && newPostArray.length == data.length) || (newPostArray.filter((item) => item.text).every(obj => obj['visible'] == true) && newPostArray.length == data.length)) {
            const doFunction = async() => {
                try {
                const response = await fetch(`http://localhost:4000/api/uploadPost`, {
                    method: 'POST', // Use appropriate HTTP method (GET, POST, etc.)
                    headers: {
                    'Content-Type': 'application/json', // Set content type as needed
                    },
                    body: JSON.stringify({ data: {caption: caption, mood: '', blockedUsers: profile.blockedUsers, newPostArray: newPostArray, forSale: profile.forSale, finalMentions: [], pfp: profile.pfp, notificationToken: profile.notificationToken,
                    background: profile.postBackground, user: user.uid, username: profile.userName, value: profile.private}}), // Send data as needed
                })
                const data = await response.json();
                if (data.done) {
                    setFinished(true)
                    setUploading(false)
                }
                } 
                catch (error) {
                console.error('Error:', error);
                }
                
            }
            doFunction()
            } 
        }
        }, [newPostArray, profile])
  return (
    <>
        <div className='flex'>
            <IoIosArrowBack onClick={closeCaptionModal} className='btn self-center' size={30}/>
            <p className='text-white text-2xl self-center pl-5'>Media Post</p>
        </div>
       
        <div className='divider'/>
        {finished ? 
            <div className='flex justify-center items-center'>
                <span style={styles.successText}>{newPostArray.length == 1 ? newPostArray[0].text ?  'Your vibe is now uploaded on the home page!' : newPostArray[0].video ?
                'Your vid is now uploaded on the vidz page!' : 'Your post is now uploaded on the home page!' : 'Your post is now uploaded on the home page!'}</span>
            </div> 
            :
            <>
        <div style={{width: '90%', marginLeft: '5%',}}>
            {data && data.length > 1 ?
                <CarouselComponent itemPost={data} height={500}/> : data && data.length == 1 ?
                <div className="px-5 pb-5">
                    <img src={data[0].post} style={{height: 500}} className="w-full rounded-md" />
                </div> : null
            }
        </div>
        
        <div className='m-5'>
            <textarea style={styles.captionBox} value={caption} onChange={(e) => setCaption(e.target.value)} className='rounded-md' placeholder='Caption...' />
        </div>
        <div style={{position: 'absolute', left: '85%'}}>   
            <div style={styles.postContainerButton}>
                {(data.length > 0 && !uploading && !finished) ? 
                    <div className='mr-3 mt-3'>
                    <MainButton text={"POST"} onClick={() => handleCaption()} />
                </div> :
                uploading ? 
                    <div className='mt-5 mr-3'>
                        <BeatLoader color='#9edaff'/> 
                    </div>
                : null}
            </div>
        </div> 
        </>}
    </>
  )
}

export default CaptionModal