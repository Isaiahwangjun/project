
###### Get start

semantic (default port: 3001)

```
python main.py
```

OCR (default port: 3000)

```
node app.js
```

###### 使用情境

(OCR) 可上傳檔案 (png, jpg, pdf) 進行 OCR，並儲存在本地端 & 資料庫 (apache jena)

> /uploadOCRfile 上傳檔案，若檔案為 pdf，先將每頁分別存下來
>
> /checkPDFcut 檢查檔案是否儲存完畢
>
> /DoingOCR 正式執行OCR
>
> /checkOCRinDB 檢查是否已執行完 OCR，並儲存進資料庫
>
> /getPrice 取得今日 OCR 張數


---



(semantic) 傳入文字，此模型主要是分析人物關係矩陣

> /AISemantic 執行語意分析
>
> /check 檢查是否分析完畢
>
> /usage 取得今日 opanai 使用金額
