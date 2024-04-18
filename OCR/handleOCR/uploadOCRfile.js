const fs = require('fs');
const path = require('path');
const { fromBuffer } = require('pdf2pic')
const { config, fileinDB, deleteinDB } = require('../config-OCR.js')
const axios = require("axios")


const uploadOCRfile = async (req, res) => {
    try {

        const username = req.body.username;
        const files = req.files;

        // 構造 /username/origin 用來存放原始檔案
        const folderPath = `${config.folderBasePath}${username}/origin`;

        // 檢查是否存在
        await fs.promises.mkdir(folderPath, { recursive: true });

        await Promise.all(files.map(async (file) => {
            const decodename = decodeURIComponent(file.originalname);
            const filePath = path.join(folderPath, decodename);

            //先檢查是否有相同檔名，相同的需刪除 DB
            if (fs.existsSync(filePath)) {
                jsondata = deleteinDB(username, decodename)
                await axios.delete(config.deleteDBurl, {
                    data: jsondata,
                    headers: { 'Content-Type': 'application/json' }
                })
                await fs.promises.rmdir(`${config.folderBasePath}${username}/${decodename}`, { recursive: true })
                console.log("have same file name, delete in DB")
            }

            await fs.promises.writeFile(filePath, file.buffer);
        }));

        res.status(200).send(config.fileUploadSuccess);

        // await new Promise(resolve => setTimeout(resolve, 10000));  測試用

        //回傳完後，再對每個檔案存進 /username/filename/, 後續 OCR 撈資料的地方
        await Promise.all(files.map(async (file) => {

            const fileNameWithExtension = decodeURIComponent(file.originalname)

            //取得時間戳記
            // formattedTimestamp = timestamp()
            //加上時間戳記，前端可能無法得知完整的資料夾名稱，導致 checkfiledeal 端點接收到的資料夾路徑會有問題
            // const folderPath = `../HSNA/${username}/${fileNameWithoutExtension}_${formattedTimestamp}/`;

            // 檢查資料夾是否存在，並創建.lock
            const folderPath = `${config.folderBasePath}${username}/${fileNameWithExtension}/`;
            const lockFilePath = `${config.folderBasePath}${username}/.lock`;

            await fs.promises.mkdir(folderPath, { recursive: true });
            await fs.promises.writeFile(lockFilePath, '');

            // 取得原始文件的副檔名
            const ext = path.extname(file.originalname).toLowerCase();

            // 根據副檔名來保存文件
            if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
                const imageBuffer = file.buffer;
                fs.promises.writeFile(`${folderPath}1${ext}`, imageBuffer);

                // save in DB (uesrname, folderPath, 1.png)
                jsondata = fileinDB(folderPath, username, fileNameWithExtension, 1, ext)
                await axios.post(config.fileInDBurl, jsondata, { headers: { 'Content-Type': 'application/json' } })
            }

            // PDF 的處理
            else {
                const pdfBuffer = file.buffer;
                try {
                    const options = {
                        density: 300,
                        saveFilename: "",
                        savePath: folderPath,
                        format: "png",
                        width: 2000,
                        height: 2000
                    }
                    const convert = fromBuffer(pdfBuffer, options)
                    await convert.bulk(-1, { responseType: "image" });

                    //save in DB (username, folderPath, page number)
                    const files = fs.readdirSync(folderPath);
                    const fileCount = files.length;

                    // change .1.png to 1.png
                    await Promise.all(files.map(async (file) => {
                        const oldFilePath = path.join(folderPath, file);
                        const newFilePath = path.join(folderPath, file.substring(1));
                        await fs.promises.rename(oldFilePath, newFilePath)
                    }));

                    const jsondata = fileinDB(folderPath, username, fileNameWithExtension, fileCount, '.png')
                    await axios.post(config.fileInDBurl, jsondata, { headers: { 'Content-Type': 'application/json' } })
                }
                catch (error) {
                    console.error(error);
                }
            }
            // 處理完成後删除 .lock 文件
            if (fs.existsSync(lockFilePath)) {
                console.log(lockFilePath);
                fs.unlinkSync(lockFilePath);
            }
        }));

    } catch (error) {
        console.error(error);
    }
};

module.exports = uploadOCRfile
