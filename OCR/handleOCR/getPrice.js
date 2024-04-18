const csv = require('csv-parser');
const fs = require('fs');
const { config } = require('../config-OCR.js')

const getPrice = async (req, res) => {
    try {
        const today = new Date().toLocaleDateString();
        let totalImagesProcessed = 0;
        console.log(today)
        fs.createReadStream(config.ocr_csv_path)
            .pipe(csv())
            .on('data', (row) => {
                if (row.date === today) {
                    totalImagesProcessed += parseInt(row.ImagesProcessed);
                }
            })
            .on('end', () => {
                res.status(200).send({ totalImagesProcessed });
            })
            .on('error', (error) => {
                console.error("Error reading CSV:", error);
                res.status(500).send("Error reading CSV");
            });
    }
    catch (error) {
        console.error(error);
    }
};

module.exports = getPrice
