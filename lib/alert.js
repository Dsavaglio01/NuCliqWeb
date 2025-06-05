export const linkUsernameAlert = (name, onPress) => {
    window.alert(`Cannot post ${name.toLowerCase()}`, `${name} cannot contain link`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => onPress()},
    ]);
}
export const profanityUsernameAlert = (name, onPress) => {
    window.alert(`Cannot post ${name.toLowerCase()}`, `${name} cannot contain profanity`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => onPress()},
    ]);
}
