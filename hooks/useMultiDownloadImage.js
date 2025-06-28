import { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import handleImageModeration from "../lib/handleImageModeration";
import handleVideoContentModeration from "../lib/handleVideoModeration";

export const useMultiDownloadImage = ({mood, user, caption, actualPostArray, setNewPostArray}) => {
  //console.log(caption)
  const [downloadLoading, setDownloadLoading] = useState(false);
  const storage = getStorage();
  // Upload Image to Firebase Storage
  const addImage = async (data) => {
    try {
      setDownloadLoading(true);
      const fileName = `posts/${user.uid}post${Date.now()}${data.id}.jpg`
      const response = await fetch(data.post);
      const blob = await response.blob();
      const storageRef = ref(storage, fileName);

      await uploadBytesResumable(storageRef, blob);
      await getLink(fileName, data);
    } catch (error) {
      console.error("Error uploading image:", error);
      setDownloadLoading(false);
    }
  };
  const addVideo = async (data) => {
    try {
    setDownloadLoading(true);
    const fileName = `videos/${user.uid}video${Date.now()}${data.id}.mp4`
    const thumbnailName = `thumbnails/${user.uid}/thumbnail${Date.now()}${data.id}.jpg`
    const response = await fetch(data.post);
    const thumbnailResponse = await fetch(data.thumbnail)
    const blob = await response.blob();
    const thumbnailBlob = await thumbnailResponse.blob();
    const storageRef = ref(storage, fileName);
    const thumbnailStorageRef = ref(storage, thumbnailName)
    await uploadBytesResumable(storageRef, blob);
    await uploadBytesResumable(thumbnailStorageRef, thumbnailBlob);
    await getVideoLink(fileName, data, thumbnailName);
    } catch (error) {
    console.error("Error uploading image:", error);
    setDownloadLoading(false);
    }
  };
  // Get Download URL from Firebase
  const getLink = async (post, item) => {
    console.log(`Item: ${item}`)
    try {
      const starsRef = ref(storage, post);
      const url = await getDownloadURL(starsRef);
      await handleImageModeration({url: url, caption: caption, IMAGE_MODERATION_URL: process.env.IMAGE_MODERATION_URL, mood: mood, 
        MODERATION_API_USER: process.env.MODERATION_API_USER, MODERATION_API_SECRET: process.env.MODERATION_API_SECRET, TEXT_MODERATION_URL: process.env.TEXT_MODERATION_URL,
        actualPostArray: actualPostArray, setNewPostArray: setNewPostArray, reference: starsRef, item: item})
    } catch (error) {
      console.error("Error getting download URL:", error);
      setDownloadLoading(false);
    }
  };
  const getVideoLink = async (post, item, thumbnail) => {
    try {
      const starsRef = ref(storage, post);
      const thumbnailRef = ref(storage, thumbnail)
      const url = await getDownloadURL(starsRef);
      const thumbnailUrl = await getDownloadURL(thumbnailRef)
      await handleVideoContentModeration({url: url, thumbnail: thumbnailUrl, caption: caption, IMAGE_MODERATION_URL: process.env.IMAGE_MODERATION_URL, 
        MODERATION_API_USER: process.env.MODERATION_API_USER, MODERATION_API_SECRET: process.env.MODERATION_API_SECRET, TEXT_MODERATION_URL: process.env.TEXT_MODERATION_URL,
        actualPostArray: actualPostArray, setNewPostArray: setNewPostArray, reference: starsRef, item: item})
    } catch (error) {
      console.error("Error getting download URL:", error);
      setDownloadLoading(false);
    }
  };



  
  const getValuesFromImages = (list) => {
    let values = [];
    list.forEach((item) => {
      if (typeof item === "number") values.push(item);
      if (typeof item === "object" && Object.keys(item).filter(key => key !== "none")) {
        console.log(item)
        Object.values(item).forEach((value) => {
          if (typeof value === "number") values.push(value);
          if (typeof value === "object") values = values.concat(getValuesFromImages([value]));
        });
      }
    });

    return values;
  };

  return { addImage, addVideo, downloadLoading };
};