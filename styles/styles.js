import FullTheme from "@/components/Themes/FullTheme";

export const styles = {
    name: {
      fontSize: 15.36,
      paddingTop: 5,
      color: "#fafafa"
    },
    themeChatName: {
      alignSelf: 'center', 
      paddingTop: 5
    },
    message: {
        fontSize: 15.36,
        paddingBottom: 5,
        color: "#fafafa"
    },
    commentText: {
      fontSize: 15.36,
      color: "#fafafa",
        padding: 5,
        paddingBottom: 0
    },
    text: {
      fontSize: 15.36, 
      color: "#fafafa",
      alignSelf: 'flex-start',
      textAlign: 'left'
    },
    header: {
      fontSize: 19.20,
      color: "#fafafa",
      marginLeft: '42.5%'
    },
    notificationHeader: {

    },
    profileFriendsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      display: 'flex',
      marginTop: '2%',
      width: '90%',
    },
    replyContainer: {
      marginLeft: '7.5%', 
      paddingLeft: 0, 
      padding: 10,
    },
    friendsHeader: {
      borderRadius: 5,
      backgroundColor: "lightblue",
      marginTop: '2.5%'
    },
    friendsText: {
      fontSize: 15.36,
    padding: 10,
    color: "#000",
    },
    friendsContainer: {
      borderRadius: 10,
      borderBottomColor: "#d3d3d3",
      padding: 10,
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
    },
    repost: {
        fontSize: 15.36,
      marginLeft: '5%',
      padding: 5,
      color: "#fafafa"
    },
    listItemContainer: {
        flexDirection: 'row',
      display: 'flex',
    justifyContent: 'space-between',
    width: '90%',
    marginLeft: '5%',
    padding: 5
    },
    postText: {
      fontSize: 12.29,
      padding: 5,
      color: "#fafafa",
      paddingBottom: 10
    },
    rePostText: {
      fontSize: 15.36,
      padding: 5,
      paddingTop: 0,
      paddingLeft: '5%',
      color: "#fafafa",
      paddingBottom: 10
    },
  actualrepostText: {
    fontSize: 12.29,
    padding: 5,
    paddingLeft: 0,
    color: "#fafafa",
    paddingBottom: 10
  },
  postFooterText: {
      fontSize: 12.29,
      color: "#fafafa",
      padding: 5,
      alignSelf: 'center'
  },
postHeader: {
    flexDirection: 'row',
    display: 'flex',
    marginTop: 0,
      alignItems: 'center',
      flex: 1,
      margin: '2.5%',
      marginLeft: '3.5%',
  },
  addText: {
    fontSize: 15.36,
    padding: 7.5,
    paddingTop: 10,
    paddingLeft: 15,
    alignSelf: 'center',
    color: "#fafafa"
  },
  notificationText: {
    fontSize: 15.36,
    color: "#fafafa",
    padding: 7.5,
    paddingLeft: 15,
    maxWidth: '90%'
  },
  acceptText: {
    padding: 7.5, 
    paddingLeft: 7.5, 
    paddingRight: 7.5, 
    fontSize: 12.29
  },
  searchInput: {
    fontSize: 15.36, 
    color: "#fff", 
    backgroundColor: "#121212",
    paddingLeft: 10
  },
  sendText: {
    fontSize: 12.29,
    color: "#121212",
    padding: 6,
    paddingLeft: 12.5,
    paddingRight: 12.5,
    textAlign: 'center'
  },
  addVideoText: {
    fontSize: typeof window !== 'undefined' ? window.innerHeight / 70: 0,
    padding: 7.5,
    color: "#fafafa",
    marginRight: 'auto',
    alignSelf: 'center'
  },
  timestamp: {
    fontSize: 12.29,
    color: '#fafafa',
    marginRight: 'auto',
    marginTop: 5,
  },
  userTimestamp: {
    fontSize: 12.29,
    color: '#121212',
    marginTop: 5,
  },
  commentHeart: {
    alignSelf: 'center',
    paddingRight: 3
  },
  numberCommentText: {
    fontSize: 12.29, 
    color: "#fafafa", 
    alignSelf: 'center', 
    paddingLeft: 5
  },
  postUsername: {
    fontSize: 15.36,
    alignSelf: 'center',
    paddingLeft: 5,
    color: "#fafafa",
    display: 'flex'
  },
  repostButtonContainer: {
    flexDirection: 'row', 
    display: 'flex', 
    alignItems: 'center'
  },
  reportText: {
    color: "#fafafa", 
    fontSize: 12.29, 
    borderWidth: 0.5, 
    borderColor: "#fafafa", 
    padding: 5
  },
  pfpBorder: {
    borderRadius: 8
  },
  timeText: {
    fontSize: 12.29, 
    color: "#fafafa"
  },
  miniImage: {
    height: '100%',
    width: typeof window !== 'undefined' ? (window.outerHeight / 4) * 1.01625 : 0
  },
  image: {
    height: typeof window !== 'undefined' ? window.outerHeight / 4 : 0,
    width: typeof window !== 'undefined' ? (window.outerHeight / 4) * 1.01625 : 0
  },
  postDoneContainer: {
    alignSelf: 'center', 
    alignItems: 'center', 
    marginTop: '20%'
  },
  homeContainer: {
    display: 'flex', 
    flexDirection: 'column', 
    maxWidth: '80vw'
  },
  commentModalContainer: {
    width: '80%',
    left: '50%',
    right: 'auto',
    padding: 0,
    borderRadius: 10,
    transform: 'translate(-50%, 0)',
    backgroundColor: "#121212",
    marginRight: '-50%'
  },
  videoCommmentModalContainer: {
    width: '20%',
    left: '84%',
    right: 'auto',
    padding: 0,
    borderRadius: 10,
    transform: 'translate(-50%, 0)',
    backgroundColor: "#121212",
    marginRight: '-50%'
  },
  modalContainer: {
    width: '40%',
    left: '50%',
    right: 'auto',
    borderRadius: 10,
    transform: 'translate(-50%, 0)',
    backgroundColor: "#121212",
    marginRight: '-50%'
  },
  addComment: {
    fontSize: 15.36, 
    paddingLeft: 5, 
    paddingTop: 20, 
    width: '45%'
  },
  reportSupplementText: {
      fontSize: 15.36,
    color: "#fafafa",
    padding: 10,
    alignSelf: 'center'
    },
    reportContentText: {
      fontSize: 19.20,
      color: "#fafafa",
      textAlign: 'center',
      padding: 10
    },
    addTextReport: {
      fontSize: 15.36,
      color: "#fafafa",
      padding: 7.5,
      maxWidth: '90%',
      marginLeft: 0
    },
    reportThanksContentText: {
      fontSize: 24, 
      fontWeight: '600', 
      color: "#fafafa",
      marginVertical: '5%',
    textAlign: 'center',
    padding: 10

    },
    repostCommentStyle: {
      marginLeft: '5%',
      backgroundColor: "#121212",
      padding: 5,
      color: "#fafafa",
      fontSize: 19.20,
        paddingBottom: 20
    },
    repostItemContainer: {
        justifyContent: 'center', 
        marginTop: '15%'
    },
    repostCommentText: {
        textAlign: 'right', 
        marginRight: '5%', 
        marginBottom: '5%', 
        fontSize: 12.29, 
        color: "#fafafa"
    },
    thanksContainer: {
      flex: 1, 
      justifyContent: 'center', 
      marginBottom: '50%'
    },
    reportLoadingContainer: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent:'center', 
      marginBottom: '20%'
    },
    repostContainer: {
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#fafafa",
      width: '90%',
      marginLeft: '5%'
    },
    notificationImageText: {
      height: 45, 
      width: 100, 
      marginTop: 20,
      borderRadius: 8, 
      alignSelf: 'center', 
      fontSize: 15.36,
      color: "#fafafa"
    },
    commentInput: {
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      flexDirection: 'row',
      borderTopWidth: 1, 
      borderColor: "#fafafa"
    },
    sendingInput: {
      borderTopWidth: 0.25,
      width: '95%',
      padding: 15,
      backgroundColor: "#121212",
      margin: '2.5%',
      marginTop: 0,
      paddingBottom: 0,
      marginBottom: 0,
      borderColor: "#fafafa",
      color: "#fafafa"
    },
    notificationContainer: {
      flex: 1, 
      marginVertical: '2.5%'
    },
    inputPfp: {
      height: 35, 
      width: 35, 
      borderRadius: 25, 
      marginLeft: 5
    },
    postRepostHeader: {
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
      margin: '2.5%',
      marginTop: 0,
      marginLeft: '3.5%'
    },
    addRepostText: {
      fontSize: 15.36,
      color: "#fafafa",
      padding: 7.5,
      paddingTop: 0,
      //width: '99%',
      paddingLeft: 15,
      //width: '98%',
      alignSelf: 'center'
    },
    homeIcon: {
      position: 'absolute', 
      eft: 280, 
      top: 8.5
    },
    categoriesContainer: {
      borderRadius: 5,
      flexDirection: 'row',
      display: 'flex',
      width: '65%',
      marginLeft: '15%',
      marginBottom: 5,
      padding: 5,
      alignItems: 'center',
    },
    categories: {
    fontSize: 15.36,
    padding: 10,
    color: "#fff",
    width: '35%',
  },
  sendingFriendsContainer: {
    width: '30%', 
    margin: 5, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  photoIcon: {
    alignSelf: 'center', 
    margin: 5
  },
  separator: {
    height: 35, 
    borderWidth: 0.5, 
    alignSelf: 'center', 
    borderColor: "grey"
  },
  themeContainer: {
    margin: 15,
    borderWidth: 1,
    height: 290,
    padding: 5,
    marginBottom: 20,
    width: 200, 
    justifyContent: 'center',
    borderColor: "#fafafa"
  },
  postContainer: {
    margin: '2.5%',
    padding: 5,
    height: 60,
    width: 245,
    borderRadius: 20,
    backgroundColor: "#005278"
  },
  postPostText: {
    fontSize: typeof window !== 'undefined' ? window.innerHeight / 68.7 : 0,
    padding: 10,
    paddingTop: 0,
    color: "#005278"
  },
  regImage: {
    height: 200,
    width: 200,
    borderRadius: 10,
    resizeMode: 'contain'
  },
  postIcon: {
    position: 'absolute', 
    left: 260, 
    top: 8.5
  },
  overlay: {
    position: 'relative',
    bottom: 280,
    height: 280,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    paddingTop: '8%',
    marginLeft: '5%',
    marginRight: '5%'
  },
  headerText: {
    fontSize: 24,
    flex: 1,
    textAlign: 'left',
    paddingLeft: 0,
    fontWeight: '700',
    color: "#fff",
    alignSelf: 'center',
    padding: 10,
  },
  profileHeaderText: {
    fontSize: 15.36,
    fontWeight: '700',
    color: "#fff",
    padding: 5,
    paddingTop: 0,
    paddingBottom: 0,
    textAlign: 'center'
  },
  pushNotiText: {
    fontSize: 19.20,
        padding: 5,
        color: "#fff"
  },
  headerSupplementText: {
    fontSize: 15.36,
    color: "#fff",
    padding: 5,
    paddingTop: 0,
    paddingBottom: 0,
    textAlign: 'center'
  },
  noOfPosts: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: '5%',
  },
  profileCircle: {
    width: 82.5,
    height: 82.5,
    borderRadius: 8,
    borderWidth: 2,
    marginTop: 7.5,
    borderColor: "#9edaff",
  },
  nameAge: {
    fontSize: 19.20,
    color: "#fafafa",
    fontWeight: '700',
    padding: 7.5,
    paddingBottom: 0,
  },

  noThemesText: {
    fontSize: 24,
      padding: 10,
      color: "#fafafa",
      textAlign: 'center'
  },
  closeText: {
    fontSize: 12.29,
      padding: 2.5,
      color: "#fafafa",
  },
  applyContainer: {
    marginTop: '10%',
      backgroundColor: "#121212",
      borderRadius: 8,
      width: '80%',
      alignItems: 'center'
  },
  main: {
    flexDirection: 'row',
      display: 'flex',
      flexWrap: 'wrap',
      marginLeft: '5%',
  },
  closeSend: {
    display: 'flex', 
    justifyContent: 'space-between'
  },
  sections: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    display: 'flex',
    marginTop: '5%',
    alignItems: 'center',
    paddingBottom: 10,
  },
  notificationItemContainer: {
    marginBottom: '2.5%', 
    width: '100%', 
    height: 50,
    justifyContent: 'space-between', 
    display: 'flex',
    borderBottomWidth: 1, 
    borderBottomColor: "#d3d3d3", 
    paddingBottom: 15, 
    marginTop: 0,
  },
  notificationItemHeader: {
    display: 'flex', 
    alignItems: 'center', 
    width: '100%',
        marginLeft: '2.5%'
  },
  copyTextContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    display: 'flex'
  },
  inputBoxContainer: {
    marginTop: '5%',
    display: 'flex'
  },
  applyText: {
    fontSize: 15.36,
    padding: 7.5,
    textAlign: 'center',
    color: "#fafafa"
  },
  toggleView: {
    borderWidth: 2,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    borderRadius: 10,
    height: typeof window !== 'undefined' ? window.innerHeight / 7 : 0,
    marginTop: '5%',
    borderColor: '#005278',
    backgroundColor: "#f5f5f5"
  },
  editText: {
    fontSize: typeof window !== 'undefined' ? window.innerHeight / 68.7 : 0,
    padding: 10,
    paddingTop: 0,
    marginTop: '2.5%',
    color: "#fafafa",
    textAlign: 'center'
  },
  input: {
    minHeight: 150,
    borderRadius: 5,
    borderWidth: 0.25,
    padding: 5,
    width: '95%',
    marginLeft: '2.5%',
    fontSize: 15.36, 
    textAlign: 'left', 
    color: "#121212", 
    borderColor: "#fafafa",
  },
  moreRepliesText: {
    textAlign: 'left', 
    color: "#fafafa"
  },
  userText: {
    textAlign: 'left', 
    color: "#121212",
    fontSize: 15.36
  },
  commentInputContainer: {
    position: 'absolute', 
    bottom: 30, 
    width: '100%'
  },
  personalChatInput: {
    height: 40,
    width: '87.5%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginLeft: '2.5%',
    marginRight: '2.5%',
    flexDirection: 'row',
    display: 'flex'
  },
  personalChatImage: {
    height: 220, 
    width: 223.4375, 
    borderRadius: 8, 
    marginLeft: 5
  },
  commentHeaderContainer: {
    flexDirection: 'row', 
    display: 'flex', 
    width: '95%', 
    marginLeft: '2.5%', 
    margin: '2.5%'
  },
  personalChatSendInput: {
    width: '95%', 
    marginLeft: '1%', 
    backgroundColor: "#121212", 
    color: "#fafafa", 
    padding: 5, 
    alignSelf: 'center'
  },
  editBottomText: {
    fontSize: typeof window !== 'undefined' ? window.innerHeight / 68.7: 0,
    padding: 10,
    paddingTop: 0,
    marginTop: 0,
    marginBottom: '2.5%',
    color: "#fafafa",
    textAlign: 'center'
  },
  editPostText: {
    fontSize: typeof window !== 'undefined' ? window.innerHeight / 54.9 : 0,
    padding: 10,
    paddingBottom: 0,
    color: "#005278"
  },
  postLength: {
    fontSize: 12.29,
    paddingBottom: 10,
    paddingTop: 5,
    color: "#fafafa",
    textAlign: 'right',
    marginRight: '5%'
  },
  newPostContainer: {
    flexDirection: 'row', 
    display: 'flex', 
    justifyContent: 'space-evenly', 
    flex: 1
  },
  selectImageContainer: {
    borderRadius: 10, 
    flexDirection: 'row', 
    display: 'flex', 
    backgroundColor: "#fafafa"
  },
  textContainer: {
    alignItems: 'center', 
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: '-2.5%'
  },
  loadContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  postImage: {
    height: 50, 
    width: 50
  },
  sendingFriendPfp: {
    height: 110, 
    width: 110, 
    borderRadius: 55, 
    alignSelf: 'center'
  },
  postContainerButton: {
    flexDirection: 'row', 
    display: 'flex', 
    justifyContent: 'flex-end', 
    marginHorizontal: '10%'
  },
  userTextMessage: {
    display: 'flex', 
    justifyContent: 'flex-end'
  },
  typeMessageContainer: {
    flexDirection: 'row', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginLeft: '5%', 
    marginRight: '5%', 
    paddingBottom: 5
  },
  repostLoadingContainer: {
    flex: 1, 
    alignItems: 'flex-end', 
    marginRight: '5%', 
    marginTop: '5%'
  },
  seeMoreResultsContainer: {
    alignItems: 'center',
    marginRight: '5%'
  },  
  threeDotIcon: {
    alignSelf: 'center', 
    marginLeft: 'auto'
  },

  notificationButton: {
    borderRadius: 10,
    marginLeft: 'auto', 
    alignSelf: 'center',
  },
  userNewMessage: {
    alignSelf: 'flex-end', 
    marginLeft: 'auto'
  },
  newMessage: {
    alignSelf: 'flex-start', 
    display: 'flex', 
    flexDirection: 'row'
  },
  userTitle: {
    fontSize: 15.36,
    color: "#fff",
    width: '10vw',
    fontWeight: '700'
  },
  seeMoreResultsText: {
    paddingTop: 5, 
    fontWeight: '400', 
    color:"#9EDAFF", 
    fontSize: 12.29, 
    marginLeft: '35%'
  },
  usernameTextSending: {
    fontSize: 15.36,
    color: "#fafafa",
    alignSelf: 'center',
    padding: 5
  },
  commentHeader: {
    display: 'flex',
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%'
  },
  commentSection: {
    marginLeft: '1.5%',
    width: '90%',
    alignSelf: 'center'
  },
  commentFooterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  replyFooterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginLeft: 2.5
  },
  addCommentSecondContainer: {
    marginBottom: '10%',
    marginLeft: '-5%',
    backgroundColor: "#121212",
    width: '105%',
    borderColor: "#fafafa"
  },
  personalChatInputContainer: {
    display: 'flex', 
    marginLeft: '-2%', 
    position: 'sticky', 
    bottom: 0, 
    marginTop: '5%'
  },
  personalChatInputMessageContainer: {
    marginBottom: '5%', 
    marginLeft: '-2%', 
    bottom: 50, 
    position: 'sticky', 
    display: 'flex'
  },
  usernameTextSendingChecked: {
    fontSize: 15.36,
    color: "#fafafa",
    marginTop: -27.5,
    alignSelf: 'center',
    padding: 5
  },
  pageContainer: {
    height: '100vh', 
    display: 'flex', 
    flexDirection: 'column', 
    position: 'sticky'
  },
  videoContainer: {
    height: '100vh',
    overflow: 'hidden',
    marginTop: '4%',
    overflowY: 'auto'
  },
  sendingCheck: {
    position: 'relative', 
    bottom: 20, 
    left: 80
  },
  videoItemContainer: {
    backgroundColor: "#121212",
    width: '30vw',
    objectFit: 'contain',
    overflow: 'auto',
  },
  swipeContainer: {
    flex: 1, 
    display: 'flex', 
    flexDirection: 'row', 
    height: '100%'
  },
  commentsContainer: {
    display: 'flex', 
    height: '100%'
  },
  inputComment: {
    fontSize: 15.36, 
    padding: 5, 
    display: 'flex'
  },
  commentCarousel: {
    width: '100%', 
    maxWidth: '800px', 
    height: '100%', 
    overflow: 'hidden'
  },
  video: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover' 
  },
  videoHeader: {
    position: 'relative', 
    bottom: 105, 
    display: 'flex', 
    marginLeft: '2.5%'
  },
  commentScrollable: {
    flex: 1, 
    width: '100%', 
    overflow: 'hidden'
  },
  searchPfp: {
    height: 45, 
    width: 45, 
    borderRadius: 8, 
    borderWidth: 1.5,
    color: "#fafafa"
  },
  noCommentsText: {
    fontSize: 24,
    padding: 10,
    color: "#fafafa"
  },
  noCommentsTextSupp: {
    fontSize: 19.20,
    padding: 10,
    color: "#fafafa"
  },
  usernameText: {
    fontSize: 15.36,
    paddingTop: 0,
    padding: 5,
    paddingBottom: 0,
    color: "#fafafa"
  },
  sendButton: {
    borderRadius: 10, 
    borderWidth: 1, 
    height: 40, 
    borderColor: "#9EDAFF", 
    marginTop: 10, 
    backgroundColor: "#9EDAFF"
  },
  notificationImage: {
    height: 40, 
    width: 40, 
    borderRadius: 8, 
    alignSelf: 'center', 
  },
  notificationImageBorder: {
    height: 40, 
    width: 40, 
    borderRadius: 1, 
    alignSelf: 'center', 
    borderWidth: 1
  },
  nextButton: {
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: "#9EDAFF", 
    backgroundColor: "#9EDAFF"
  },
  commentContainerPfp: {
    width: 40, 
    height: 40, 
    borderRadius: 8, 
    marginRight: 5
  },
  searchPfp: {
    width: 40, 
    height: 40, 
    borderRadius: 8, 
  },
  profileImage: {
    width: 40,
    height: 40,
    backgroundColor: "#fafafa",
    borderRadius: 20,
    marginRight: 10, // Add spacing between image and text
  },
  userBubbleStyle: {
    backgroundColor: '#9edaff',
    padding: 10,
    margin: 5,
    borderRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 5,
    maxWidth: '100%',
    alignSelf: 'flex-end',
  },
  timestampContainer: { 
    width: '100%',  // Adjust the width as needed
    alignItems: 'flex-end', // Align timestamp to the right
  },
  userTimestampContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  flexColumn: {
    flexDirection: 'column', 
    display: 'flex'
  },
  videoButtonContainer: {
    flexDirection: 'column', 
    display: 'flex', 
    marginBottom: '10%', 
    width: 100, 
    justifyContent: 'flex-end'
  },
  likeButton: {
    top: 5,
    right: 10, // Default: right side
  },
  userLikeButton: {
    left: 'auto',
    right: 10
  },
  bubbleStyle: {
    backgroundColor: '#005278',
    padding: 10,
    margin: 5,
    borderRadius: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 20,
    maxWidth: '100%',
    alignSelf: 'flex-start',
  },
  notificationCommentContainer: {
    display: 'flex', 
    alignItems: 'center', 
    width: '100%'
  },
  sendingButton: {  
    borderRadius: 10, 
    borderWidth: 1, 
    height: 40, 
    borderColor: "#9EDAFF",
    marginTop: 10, 
    marginRight: 5, 
    backgroundColor: "#9EDAFF"
  },
  nextButtonText: {
    fontSize: 15.36,
    padding: 12,
    paddingLeft: 25,
    color: "#121212",
    paddingRight: 25,
    textAlign: 'center'
  },
  inputBox: {
    width: 300,
    padding: 10,
    border: '1px solid #ccc',
    borderRadius: 5,
    color: "#fafafa",
    backgroundColor: "#121212"
  },
  commentsPfp: {
    height: 35, 
    width: 35, 
    borderRadius: 17.5
  },
  videoPfp: {
    height: typeof window !== 'undefined' ? window.innerHeight / 20 : 0, 
    width: typeof window !== 'undefined' ? window.innerHeight / 20 : 0, 
    borderRadius: 8
  },
  searchInfo: {
    paddingLeft: 20, 
    width: '75%'
  },
  videoInfo: {
    display: 'flex', 
    width: '70%'
  },
  chatSendButton: {
    width: 70,
    height: 40,
    alignItems: 'center',
    backgroundColor: '#005278',
    borderRadius: 10,
  },
  copyText: {
    fontSize: 15.36,
    paddingRight: 10,
    color: "#fafafa",
  },
  miniPostContainer: {
    borderWidth: 1, 
    borderColor: "#fafafa",
    height: typeof window !== 'undefined' ? (window.outerHeight / 4) : 0,
    width: typeof window !== 'undefined' ? ((window.innerHeight / 4) * 1.01625) : 0,
  },
  miniPostText: {
    fontSize: 15.36, 
    width: '100%', 
    paddingLeft: 5, 
    paddingTop: 2.5, 
    paddingBottom: 2.5
  },
  commentPfp: {
    height: 33,
    width: 33,
    borderRadius: 8
  },
  imagepfp: {
    height: 33, 
    width: 33, 
    borderRadius: 8, 
    margin: '5%'
  },
  copyModal: {
    borderRadius: 10,
    backgroundColor: "gray",
    marginRight: '5%',
    marginLeft: '5%',
    marginBottom: '2.5%'
  },
  noSearchResultsText: {
    color: '#fafafa', 
    fontSize: 15.36, 
    textAlign: 'center', 
    marginRight: '5%',
    marginTop: '5%'
  },
  captionText: {
    fontSize: 12.29,
    padding: 10,
    color: "#fafafa",
    paddingBottom: 0,
    paddingRight: 0,
  },
  chatName: {
    fontSize: 15.36, 
    alignSelf: 'center', 
    color: "#fafafa", 
    marginLeft: 15
  },
  readReceipt: {
    fontSize: 12.29,
    color: '#fafafa',
    marginLeft: 'auto', 
    marginRight: 10
  },
  acceptContainer: {
    alignItems: 'center', 
    justifyContent: 'center', 
    marginLeft: 'auto'
  },
  chatContainer: {
    backgroundColor: '#121212', 
    borderTopWidth: 1,
    borderTopColor: "#d3d3d3",
    padding: 10,
    display: 'flex',
    alignItems: 'center'
  },
  specificTheme: {
    height: 240, 
    width: 200, 
    marginBottom: 7.5
  },
  themeCloseContainer: {
    display: 'flex', 
    justifyContent: 'flex-end', 
    alignItems: 'center'
  },
  themeOptionsContainer: {
    alignItems: 'center', 
    display: 'flex', 
    flexDirection: 'column'
  },
  themePageContainer: {
    display: 'flex', 
    overflow: 'hidden', 
    flexDirection: 'row', 
    position: 'sticky'
  },
  themeMainContainer: {
    display: 'grid', 
    flex: 1, 
    overflowY: 'scroll',
    height: '100vh', 
    gridTemplateColumns: '60vw 1fr'
  },
  optionHeader: {
    marginLeft: '5%', 
    marginRight: '5%'
  },
  noSearchResultsThemeText: {
    color: "#9EDAFF", 
    fontSize: 15.36, 
    paddingHorizontal: 10, 
    textAlign: 'center', 
    marginRight: '5%', 
    marginTop: '5%'
  },
  profileHeaderContainer: {
    width: '100%', 
    height: typeof window !== 'undefined' ? window.innerHeight * 0.25 : 0, 
    objectFit: 'cover',
    zIndex: -1
  },
  profileLoader: {
    marginTop: '-7.5%', 
    alignItems: 'flex-end', 
    marginLeft: '2.5%', 
    flex: 1,
    zIndex: 3
  },
  friendsHeaderTwo: {
    paddingLeft: 80, 
    padding: 3,
    borderRadius: 5,
    minWidth: 200,
    backgroundColor: "lightblue",
    marginTop: '2.5%',
  },
  noPostsSupp: {
    color: "#fafafa",
    textAlign: 'center',
    padding: 10,
    paddingTop: 0, 
    fontSize: 15.36
  },
  contentContainer: {
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr 1fr 1fr', 
    gap: 0, 
    marginTop: 10, 
    marginLeft: '2.5%',
    gridAutoRows: 'min-content'
  },
  contentListContainer: {
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
    padding: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '105%',
    marginLeft: '-2.5%'
  },
  contentListHeaderText: {
    fontSize: 19.20,
    textAlign: 'center',
    padding: 10,
    margin: '2.5%',
    fontWeight: '700',
    color: "#fafafa"
  },
  commentListContentContainer: {
    margin: '2.5%', 
    display: 'flex', 
    marginTop: 0, 
    borderBottomWidth: 1, 
    borderBottomColor: "#d3d3d3", 
    paddingBottom: 10
  },
  commentContentImage: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: '-2.5%'
  },
  leftCommentContentImage: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 'auto'
  },
  contentListBlockedContainer: {
    marginLeft: '1%',
    display: 'flex'
  },
  contentListBlockedInfo: {
    paddingLeft: 20, 
    width: '100%', 
    justifyContent: 'center'
  },
  unBlock: {
    marginLeft: 'auto', 
    marginRight: '1%'
  },
  contentListPosts: {
    borderRadius: 10, 
    margin: '2.5%', 
    width: 155,
    height: 155 / 1.015625,
    backgroundColor: "#262626"
  },
  contentListImage: {
    width: typeof window !== 'undefined' ? window.innerHeight / 5.45 : 0,
    height: typeof window !== 'undefined' ? (window.innerHeight / 5.45) / 1.015625 : 0,
    borderRadius: 8
  },
  signUpMain: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  continueText: {
    marginLeft: 'auto', 
    fontSize: 19.20, 
    color: "#fafafa", 
    cursor: true
  },
  messageContainer: {
    color: '#fafafa', 
    fontSize: 15.36,
    paddingBottom: 5,
  },
  settingsPostContainer: {
    borderRadius: 5, 
    width: '18vw',
    height: 300 / 1.015625
  },
  settingsPostTextContainer: {
    borderRadius: 5, 
    width: '18vw',
    height: 300 / 1.015625,
    backgroundColor: "#fafafa"
  },
  settingsBottomText: {
    fontSize: 15.36,
    padding: 10,
    paddingLeft: 5,
    color: "#fff"
  },
  tapToReceiveText: {
    fontSize: 15.36,
    padding: 5,
    marginLeft: '10%',
    paddingBottom: 10,
    color: "#fff"
  },
  settingsEditText: {
    fontSize: 15.36,
    color: "#fafafa", 
    margin: '5%',
    textAlign: 'right'
  },
  settingsAddText: {
    fontSize: 15.36,
    color: "#fafafa",
    padding: 7.5,
    paddingLeft: 15,
    maxWidth: '75%'
  },
  settingsReportContainer: {
    flexDirection: 'row', 
    display: 'flex', 
    alignItems: 'center', 
    marginLeft: '5%'
  },
  fullTheme: {
    width: '100%',
    height: '90%'
  },
  themeOverlay: {
    position: 'relative',
    bottom: '90%',
    height: '90%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  previewButton: {
    borderRadius: 8,
    backgroundColor: "#121212",
    marginBottom: 20,
    alignItems: 'center',
    padding: 10
  },
  previewText: {
    color: "#9edaff",
    fontSize: 15.36,
    fontWeight: '700',
    paddingVertical: 10
  },
  sorryNoThemeText: {
    padding: 10,
    color: "#fafafa",
    fontSize: 19.20,
    margin: 5,
    fontWeigtht: '600',
    textAlign: 'center',
  },
  purchaseButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginTop: '-2.5%'
  },
  continue: {
    marginLeft: 'auto', 
    fontSize: 15.36, 
    color: "#fafafa", 
    cursor: true
  },
  questionText: {
    fontSize: 15.36,
    padding: 10,
    paddingTop: 0,
    color: "#fafafa"
  },
  postText: {
    fontSize: 15.36,
    padding: 10,
    paddingTop: 0,
    color: "#fafafa",
    fontWeight: '600'
  },
  useThemeLoadingContainer: {
    alignItems: 'flex-end', 
    flex: 1,
    marginTop: '15%',
    marginLeft: '5%',
    justifyContent: 'flex-end'
  },
  playBtn: {
    position: 'relative',
    left: '85%',
    bottom: '85%'
  }
}