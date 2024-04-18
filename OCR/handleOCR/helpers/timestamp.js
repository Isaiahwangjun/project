function getFormattedTimestamp() {
    const now = new Date();

    // 將日期轉換為 yyyy-mm-dd 格式
    const formattedDate = now.toISOString().split('T')[0];

    // 將時間轉換為 hh:mm:ss 格式
    const formattedTime = now.toTimeString().split(' ')[0].replace(/:/g, '-');

    // 將日期和時間組合為格式化字符串
    const formattedDateTime = `${formattedDate}_${formattedTime}`;

    return formattedDateTime;
}
module.exports = getFormattedTimestamp