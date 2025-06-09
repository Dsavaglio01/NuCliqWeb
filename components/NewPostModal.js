import React, { useState, useRef, useContext} from 'react'
import ReactModal from 'react-modal';
import { styles } from '@/styles/styles';
import NewPostHeader from './NewPostHeader';
import { PhotoIcon, VideoCameraIcon, ChatBubbleBottomCenterTextIcon, EllipsisVerticalIcon, XMarkIcon} from '@heroicons/react/24/solid';
import { BeatLoader } from 'react-spinners';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import MainButton from './MainButton';
import ProfileContext from '@/context/ProfileContext';
const grid = 5
function NewPostModal({newPostModal, closePostModal}) {
    const profile = useContext(ProfileContext);
    const fileInputRef = useRef(null);
    const fileVideoInputRef = useRef(null);
    const [initialText, setInitialText] = useState({});
    const [text, setText] = useState('');
    const [data, setData] = useState([]);
    const [textOpen, setTextOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const handleClose = () => {
        closePostModal();
    }
    const handleClick = () => {
        fileInputRef.current.click();
    }
    const handleVideoClick = () => {
        fileVideoInputRef.current.click();
    }
    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            Array.from(selectedFiles).slice(0, 5).map((file, index) => {
                const item = URL.createObjectURL(file)
                setData(prevState => [...prevState, {id: index, image: true, video: false, thumbnail: null, post: item, visible: false}])
            });
        }
    }
    const handleVideoFileChange = (event) => {
      const selectedFile = event.target.file;
        if (selectedFile) {
          addVideoToArray(selectedFile)
        }
    }
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };
    function addToArray() {
        if (text.length > 0) {
            setData({id: 1, image: false, visible: false, value: text, text: true, textSize: 15.36, textColor: "#fafafa", textAlign: 'left', backgroundColor: "#121212"})
            setText('')
        }
    }
    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        const items = reorder(
            data,
            result.source.index,
            result.destination.index
        );
        setData(items)
    }
    const getListStyle = isDraggingOver => ({
        background: "#fafafa",
        padding: grid,
        paddingBottom: 0,
        width: '100%'
    });
    const getItemStyle = (draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: grid * 2,
        paddingBottom: 10,
        marginLeft: 0,
        marginRight: 0,
        margin: `0 0 ${grid}px 0`,
        flexDirection: 'row',
        display: 'flex',
        borderBottomWidth: 1,
        borderColor: "#121212",

        // styles we need to apply on draggables
        ...draggableStyle
    });
    const handleText = (event) => {
        setText(event.target.value)
    }
    return (
        <ReactModal isOpen={newPostModal} style={{content: styles.modalContainer}}>
            <div>
            <p className='text-white'>New Post</p>
            <div className='divider'/>
            <div>
                <NewPostHeader group={false} data={data} pfp={profile.pfp}/>
                <div style={styles.toggleView}>
                <div style={{display: 'flex'}}>
                    <div style={styles.newPostContainer}>
                    <>
                        <button style={styles.selectImageContainer} onClick={handleClick}>
                        <PhotoIcon className='postBtn' color='#005278' style={{alignSelf: 'center'}}/>
                        <div>
                            <p style={styles.editPostText}>Select Images</p>
                            <p style={styles.postPostText}>up to {5 - (data.filter((item) => item.image == true)).length} images</p>
                        </div>
                        </button>
                        <input type='file' multiple ref={fileInputRef} style={{display: 'none'}} accept="image/*" onChange={handleFileChange}/>
                    </>
                    <div style={styles.separator}/>
                    <>
                        <button style={styles.selectImageContainer} onClick={handleVideoClick}>
                        <VideoCameraIcon className='postBtn' color='#005278' style={{alignSelf: 'center'}}/>
                        <div>
                            <p style={styles.editPostText}>Select Vid</p>
                            <p style={styles.postPostText}>up to 60 seconds</p>
                        </div>
                        </button>
                        <input type='file' ref={fileVideoInputRef} style={{display: 'none'}} accept="video/*" onChange={handleVideoFileChange}/>
                    </>
                    </div>
                </div>
                <div className='cursor-pointer' style={styles.textContainer} onClick={() => setTextOpen(true)}>
                    <ChatBubbleBottomCenterTextIcon className='postBtn' color='#005278'/>
                    <div>
                        <p style={styles.editPostText}>What's vibing?</p>
                        <p style={styles.postPostText}>Post Text</p>
                    </div>
                </div>
                </div>
                <p style={styles.editText}>Hold, drag and drop to change order of your posts</p>
                <p style={styles.editBottomText}>To edit/adjust your post, press the three dots</p>
                {loading ? 
                <div style={styles.loadContainer}> 
                    <BeatLoader color='#9edaff'/>
                </div> : data.length != 0 && !loading && !textOpen ? 
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                        {data.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                                <div
                                    className='flex flex-row'
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                    )}
                                >
                                <img src={item.post} style={styles.postImage}/>
                                <p className='text-black self-center pl-6'>Post #{index + 1}</p>
                                <EllipsisVerticalIcon className='postBtn' style={styles.threeDotIcon} color='#121212'/>
                                </div>
                            )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                        </div>
                    )}
                    </Droppable>
                </DragDropContext>
                : textOpen ? 
                <div>
                    <div>
                    <div style={styles.typeMessageContainer}>
                        <>
                        <div style={{display: 'flex'}}>
                            <ChatBubbleBottomCenterTextIcon className='postBtn' color='#9edaff' style={{alignSelf: 'center'}}/>
                            <p style={styles.editText}>Type your message below</p>
                        </div>
                        </>
                    </div>
                    <div className='divider'/>
                    <>
                        <div style={{marginTop: '5%'}}>
                        <textarea placeholder={initialText ? initialText.value : "What's Vibing?"} value={text} style={styles.input} onChange={handleText} maxLength={300} />
                        <p style={styles.postLength}>{text.length}/300</p>
                        </div>
                        <div style={styles.postContainerButton}>
                        <div style={{alignSelf: 'center'}}>
                        {text.length > 0 ? <div className='mr-3 mt-3'>
                        <MainButton text={"FINISH"} onPress={text.length > 0 ? initialText ? () => putKeys() : () => addToArray() : null} />
                        </div> : null}
                        </div>
                        </div>
                    </>
                    </div>
                </div> 
                : null}
            </div>
            </div>
            <button className="close-button" onClick={() => {handleClose(); setData([])}}>
            <XMarkIcon className='btn'/>
            </button>
        </ReactModal>
  )
}

export default NewPostModal