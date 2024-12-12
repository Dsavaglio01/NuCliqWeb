function getCalculatedTime(time) {
    if (time != null) {
        return time.toDate().toLocaleTimeString([], {hour: 'numeric', minute:'numeric'})
    }
}
export default getCalculatedTime;
