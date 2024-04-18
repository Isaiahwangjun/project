const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient({ keyFilename: "./vision-ocr-311508-2df5a99e811b.json" })

async function OCR(file) {
    console.log('正在執行 OCR 函數...');

    const image = { content: file.toString('base64') };
    const [result] = await client.textDetection({ image });
    const texts = result.textAnnotations;
	if (texts.length===0) {   //沒偵測到文字
        console.log("test")
		return '無資料';
    }
    return texts[0].description;
}

module.exports = OCR
