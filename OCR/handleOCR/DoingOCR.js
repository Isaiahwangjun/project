const ocrFunction = require('./helpers/GoogleOCR');
const fs = require('fs');
const { config, ocrInDB } = require('../config-OCR.js')
const path = require('path');
const axios = require("axios")
const { createObjectCsvWriter } = require('csv-writer');

const csvWriter = createObjectCsvWriter({
    path: config.ocr_csv_path,
    header: [
        { id: 'date', title: 'date' },
        { id: 'username', title: 'Username' },
        { id: 'imagesProcessed', title: 'ImagesProcessed' }
    ]
});

const DoingOCR = async (req, res) => {
    try {
        const username = req.body.username;
        const files = req.body.files;

        const lockFilePath = `${config.folderBasePath}${username}/.lock`;
        await fs.promises.writeFile(lockFilePath, '');

        let totalImagesProcessed = 0;

        res.status(200).send("already doing OCR")
        for (const folderName in files) {
            const folder = files[folderName];
            for (const fileName of folder) {
                console.log(fileName)
                const filePath = `${config.folderBasePath}${username}/${folderName}/${fileName}`;
                const imageBuffer = await fs.promises.readFile(filePath);
                const ocrResult = await ocrFunction(imageBuffer);
                console.log(ocrResult)
                console.log(ocrResult.replace(/\n/g, ""))
                // write in DB  (ocr結果包含"\n" 會無法寫入，需先刪除)
                jsondata = ocrInDB(username, folderName, path.parse(fileName).name, ocrResult.replace(/\n/g, ""))
                await axios.put(config.ocrInDB, jsondata, { headers: { 'Content-Type': 'application/json' } })
                totalImagesProcessed++;
            }
        }

        const today = new Date().toLocaleDateString();
        const records = [{ date: today, username: username, imagesProcessed: totalImagesProcessed }];
        await csvWriter.writeRecords(records);

        if (fs.existsSync(lockFilePath)) {
            console.log(lockFilePath);
            fs.unlinkSync(lockFilePath);
        }
    }
    catch (error) {
        console.error(error);
    }
}
module.exports = DoingOCR
