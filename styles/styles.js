export const styles = {
    name: {
        fontSize: 15.36,
        paddingTop: 5,
        color: "#fafafa"
        //width: '95%'
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
    header: {
        fontSize: 19.20,
        color: "#fafafa",
        marginLeft: '42.5%'
        //marginLeft: 'auto'
    },
    profileFriendsContainer: {
      flexDirection: 'row',
    justifyContent: 'space-evenly',
    display: 'flex',
    width: '90%',
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
        borderBottomWidth: 1,
        borderBottomColor: "#d3d3d3",
        padding: 10,
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        marginLeft: '2.5%'
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
  addVideoText: {
    fontSize: window.innerHeight / 70,
      padding: 7.5,
      color: "#fafafa",
      marginRight: 'auto',
      //width: '98%',
      alignSelf: 'center'
  },
  numberCommentText: {
    fontSize: 12.29, 
    color: "#fafafa", 
    alignSelf: 'center', 
    paddingLeft: 5
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
  image: {
     height: window.outerHeight / 4,
    width: (window.outerHeight / 4) * 1.01625
  },
  homeContainer: {
    display: 'flex', 
    flexDirection: 'column', 
    maxWidth: '80vw'
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
    repostContainer: {
        borderWidth: 1,
      borderRadius: 10,
      borderColor: "#fafafa",
      width: '90%',
      marginLeft: '5%'
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
    width: '200%',
    //marginRight: '5%',
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
  themeContainer: {
     margin: 15,
    borderWidth: 1,
     //marginHorizontal: 10,
     height: 290,
      padding: 5,
      marginBottom: 20,
      width: 200, 
      justifyContent: 'center',
      borderColor: "#fafafa"
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
    borderColor: "#fafafa",
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
      marginLeft: '5%'
  },
  sections: {
    justifyContent: 'space-between',
        flexDirection: 'row',
        display: 'flex',
        marginTop: '5%',
        alignItems: 'center',
        paddingBottom: 10,
  },
  applyText: {
    fontSize: 15.36,
      padding: 7.5,
      textAlign: 'center'
  }
}