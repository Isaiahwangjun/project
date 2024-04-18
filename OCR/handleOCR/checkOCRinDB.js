const { config } = require('../config-OCR.js')
const fs = require('fs')

const checkOCRinDB = async (req, res) => {
    try {
        const username = req.body.username;

        const folderPath = `${config.folderBasePath}${username}/`;
        const lockFilePath = `${folderPath}.lock`;

        if (!fs.existsSync(folderPath)) {
            res.status(404).send(config.folderNotFoundMessage)
        }
        else if (fs.existsSync(lockFilePath)) {
            res.status(201).send(config.ocrOngoingMessage);
        } else {
            res.status(200).send(config.ocrCompletedMessage);
        }
    }
    catch (error) {
        console.log(error);
    }
};

module.exports = checkOCRinDB;
