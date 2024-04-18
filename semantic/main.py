from fastapi import FastAPI, Request, BackgroundTasks, Response
from helpers import model, relationMatrix, config
import uvicorn
import os
import json
import csv
from datetime import date
import threading

app = FastAPI()


async def background(folder_path, content, username, response: Response):

    result = await model.main(content, username)

    # 如果模型分析的結果為空，返回404
    if result is None:
        response.status_code = 404
        return

    #否則產生 .json，裡面放擷取結果
    with open(f'{folder_path}/.json', "w", encoding="utf-8") as json_file:
        json.dump(result, json_file, ensure_ascii=False)

    #依照 .json內容產生關係矩陣.csv
    relationMatrix.relationMatrix(f'{folder_path}/.json', '主角', folder_path)
    relationMatrix.change(folder_path)

    try:
        os.remove(f'{folder_path}/.lock')
    except:
        pass


@app.post("/AISemantic")
async def AISemantic(request: Request, background_tasks: BackgroundTasks):

    inputData = await request.json()
    username = inputData.get('username')
    content = inputData.get('content')

    folder_path = os.path.join(config.folderPath, username)
    os.makedirs(folder_path, exist_ok=True)

    lock_file_path = os.path.join(folder_path, ".lock")
    with open(lock_file_path, "w"):
        pass

    txt_file_path = os.path.join(folder_path, ".txt")
    with open(txt_file_path, "w", encoding='utf-8') as f:
        f.write(content)

    background_tasks.add_task(background, folder_path, content, username,
                              Response)

    return {"Ready to analysis"}


@app.post("/check")
async def check(request: Request, response: Response):

    inputData = await request.json()
    username = inputData.get('username')

    folder_path = os.path.join(config.folderPath, username)
    lock_file_path = os.path.join(folder_path, ".lock")

    if os.path.exists(lock_file_path):
        response.status_code = 201
        return
    else:
        csv_file_path = os.path.join(folder_path, "DotLine.csv")

        with open(csv_file_path, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            data = [row for row in reader]

    return data


@app.post("/usage")
async def usage():

    lock = threading.Lock()
    with lock:
        with open('usage.csv', 'r') as file:
            reader = csv.reader(file)
            data = list(reader)

    current_date = date.today().isoformat()
    total_usage = sum(float(row[2]) for row in data if row[0] == current_date)

    return total_usage


if __name__ == "__main__":
    uvicorn.run('main:app', host="localhost", port=3001)
