import { db } from "./firebase";
import { getDoc, doc } from "firebase/firestore";
export const schedulePushLikeNotification = async(id, username, notificationToken) => {
console.log(id)
let notis = (await getDoc(doc(db, 'profiles', id))).data().allowNotifications
let banned = (await getDoc(doc(db, 'profiles', id))).data().banned
    if (notis && !banned) {
        fetch(`${process.env.BACKEND_URL}/api/likeNotification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username, pushToken: notificationToken,  "content-available": 1, 
                data: {routeName: 'NotificationScreen', deepLink: 'nucliqv1://NotificationScreen'},
            }),
        })
        .then(response => response.json())
        .then(responseData => {
            // Handle the response from the server
            console.log(responseData);
        })
        .catch(error => {
            // Handle any errors that occur during the request
            console.error(error);
        })
    }
}
export const schedulePushCommentNotification = async(id, username, notificationToken, comment) => {
    let notis = (await getDoc(doc(db, 'profiles', id))).data().allowNotifications
    let banned = (await getDoc(doc(db, 'profiles', id))).data().banned
    if (notis && !banned) {
      fetch(`${process.env.BACKEND_URL}/api/commentNotification`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username, pushToken: notificationToken, "content-available": 1, data: {routeName: 'NotificationScreen', deepLink: 'nucliqv1://NotificationScreen'}, comment: comment
        }),
      })
        .then(response => response.json())
        .then(responseData => {
        // Handle the response from the server
        console.log(responseData);
        })
        .catch(error => {
        // Handle any errors that occur during the request
        console.error(error);
        })
    }
}