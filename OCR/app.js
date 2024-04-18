const express = require("express");
const router = express.Router();
const multer = require('multer');
const uploadOCRfile = require("./handleOCR/uploadOCRfile")
const checkPDFcut = require("./handleOCR/checkPDFcut")
const DoingOCR = require("./handleOCR/DoingOCR")
const checkOCRinDB = require("./handleOCR/checkOCRinDB")
const getPrice = require("./handleOCR/getPrice")

const app = express();
const port = 3000

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/uploadOCRfile", upload.any(), uploadOCRfile);
router.post("/checkPDFcut", upload.any(), checkPDFcut);
router.post("/DoingOCR", DoingOCR);
router.post("/checkOCRinDB", checkOCRinDB);
router.post("/getPrice", getPrice);

app.use("/hsna", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});