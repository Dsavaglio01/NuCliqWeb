import axios from "axios";
import { deleteObject } from "firebase/storage";
import { linkUsernameAlert, profanityUsernameAlert } from "./alert";
const IMAGE_MODERATION_URL = process.env.NEXT_PUBLIC_IMAGE_MODERATION_URL;
const MODERATION_API_USER = process.env.NEXT_PUBLIC_MODERATION_API_USER;
const MODERATION_API_SECRET = process.env.NEXT_PUBLIC_MODERATION_API_SECRET;
const TEXT_MODERATION_URL = process.env.NEXT_PUBLIC_TEXT_MODERATION_URL;

function performActionAfterConfirmation() {
    console.log("User clicked OK! Something is happening now.");
    deleteObject(reference).catch(console.error)
    document.getElementById('status').textContent = "Action confirmed!";
}

async function handleModerationAlert(reference, itemId) {
    const message = `Unable to Post as Post #${itemId} Goes Against Our Guidelines`;
    const userConfirmed = window.confirm(message); // The message serves as your "body"

    if (userConfirmed) {
        performActionAfterConfirmation();
    } else {
        console.log("User clicked Cancel or closed the dialog.");
        deleteObject(reference).catch(console.error)
        document.getElementById('status').textContent = "Action cancelled.";
    }
}

const newData = []
const handleImageModeration = async ({
  url,
  caption,
  actualPostArray,
  setNewPostArray,
  reference,
  item,
}) => {
  try {
    console.log('Here')
    const response = await fetch('http://localhost:4000/api/imageModeration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, caption, actualPostArray, item }),
    })
    const data = await response.json();
    console.log(data)
    if (data.linkError) {
      linkUsernameAlert();
    }
    else if (data.profError) {
      profanityUsernameAlert();
    }
    else {
      if (actualPostArray.length != newData.length) {
        newData.push(data.newPostArray)
      }
      else {
        console.log(`New Data: ${newData}`)
        return newData
      }

    }
  } catch (error) {
    console.error('Error in content moderation:', error);
  }
};
export default handleImageModeration;