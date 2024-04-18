from . import response
from . import prompt
import json
from dotenv import load_dotenv
import os
from openai import AsyncOpenAI
import csv
from datetime import date
import threading


def try_parse_json(info):
    try:
        # 嘗試將 info 轉換為 Python 對象
        result = json.loads(info)
        return result
    except json.decoder.JSONDecodeError:
        return None


async def caculate_price(ct, pt, username):

    current_date = date.today().isoformat()
    amount = ct * 0.03 / 1000 + pt * 0.01 / 1000

    lock = threading.Lock()

    with lock:
        with open('usage.csv', 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([current_date, username, amount])


async def main(inputData, username):

    load_dotenv()
    api_key = os.environ.get('OPENAI_API_KEY')
    client = AsyncOpenAI(api_key=api_key)

    user_message = """將下列文章填入格式中，並以json輸出: """ + inputData
    system_message, rule = prompt.get_prompt()

    response_ = await response.create_completion(client, system_message,
                                                 user_message, rule)

    ct = response_.usage.completion_tokens
    pt = response_.usage.prompt_tokens

    await caculate_price(ct, pt, username)

    result = try_parse_json(response_.choices[0].message.content)

    return result
