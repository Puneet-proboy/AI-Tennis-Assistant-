import os
from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

system_prompt = """You are a very powerful Tennis AI assistant. You know all the information about tennis and strings 
moreover understand the query of the user and provide the answer to the user"""

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    
    # Create chat completion
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
    )
    
    ai_response = response.choices[0].message.content
    return jsonify({"response": ai_response})

if __name__ == '__main__':
    app.run(debug=True)
