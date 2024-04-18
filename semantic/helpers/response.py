def create_completion(client, system_message, user_message, rule):

    # 調用 OpenAI API
    response = client.chat.completions.create(
        model="gpt-4-0125-preview",
        temperature=1.0,
        response_format={"type": "json_object"},
        messages=[{
            "role": "system",
            "content": system_message
        }, {
            "role": "user",
            "content": user_message
        }, {
            "role": "user",
            "content": rule
        }])

    return response
