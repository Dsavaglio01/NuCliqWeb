function getCalculatedTime(time) {
    console.log(time)
    if (time != null) {
        const date = new Date(time.seconds * 1000 + time.nanoseconds / 1e6);
        return date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
    }

}
export default getCalculatedTime;
