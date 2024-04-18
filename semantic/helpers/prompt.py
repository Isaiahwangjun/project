import json


def get_prompt():
    example_json = {
        "日記": [
            {
                "person": ["person1", "person2", "person3"],
                "semantic": "此欄位是放資料所引用的內文"
            },
        ]
    }

    system_message = """你是一位文學調查者，我們要查看某人的日記，並在當中找出他與誰一起做哪些事。
    資料格式應該像是: """ + json.dumps(example_json) + """。
    請確實找到文章內容再填入，資料正確很重要，一步一步慢慢做。"""

    rule = """
        請遵循以下規則:
        1.以繁體中文回答
        2.person請填人名，尊稱不用填入，第一人稱代名詞也不用填入
    """

    return [system_message, rule]
