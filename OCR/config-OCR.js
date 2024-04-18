const config = {
    folderBasePath: '/mnt/hsna/',
    fileUploadSuccess: 'Files uploaded successfully',
    folderNotFoundMessage: 'Folder not found',
    PDFcutting: 'PDF to png ing...',
    PDFcutted: 'PDF to png done',
    ocrOngoingMessage: 'OCR or save in DB is still ongoing',
    ocrCompletedMessage: 'OCR and save in DB have been completed',
    errorMessage: 'An error occurred',
    fileInDBurl: "",
    deleteDBurl: "",
    ocrInDB: "",
    ocr_csv_path: "/mnt/hsna/price.csv"
};

function fileinDB(graphid, userid, fileName, page, extension) {

    //去掉寫進 DB 有兩條斜線問題	
    const modgraphid = graphid.slice(1)
    const baseInfo = {
        "entry": {
            "graph": modgraphid,
            "srcId": "",
            "classType": "Diary",
            "value": {
                "fileName": fileName,
                "userid": userid,
                "hasOcr": []
            }
        }
    };


    const pageInfoArray = [];
    for (let i = 1; i <= page; i++) {
        const pageInfo = {
            ocrPage: i.toString(),
            ocrFileName: i + extension
        };
        pageInfoArray.push(pageInfo);
    }

    for (const pageInfo of pageInfoArray) {
        baseInfo.entry.value.hasOcr.push({
            "srcId": "",
            "classType": "Ocr",
            "value": {
                "ocrPage": pageInfo.ocrPage,
                "ocrFileName": pageInfo.ocrFileName
            }
        });
    }

    const result = JSON.stringify(baseInfo, null, 2);
    return result;
}

function deleteinDB(userid, filename) {

    const schema = {
        "entry": {
            "userid": userid,
            "fileName": filename
        }
    }
    const result = JSON.stringify(schema, null, 2);
    return result
}

function ocrInDB(userid, filename, page, content) {
    const schema = {
        "entrySrc": {
            "userid": userid,
            "fileName": filename,
            "ocrPage": page,
            "ocrContent": ""
        },
        "entryDst": {
            "userid": userid,
            "fileName": filename,
            "ocrPage": page,
            "ocrContent": content
        }
    }
    const result = JSON.stringify(schema, null, 2);
    return result
}

module.exports = { config, fileinDB, deleteinDB, ocrInDB }
