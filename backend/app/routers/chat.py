import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

# Configure Gemini if API key is present
gemini_api_key = os.getenv("GEMINI_API_KEY")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)

SYSTEM_INSTRUCTION = """
You are StockGlobe Intelligence, an advanced AI market engine analyzing 14B parameters of global data. 
You provide concise, professional, and slightly futuristic financial insights.
When discussing the stock market, you use terms like 'capital flows', 'momentum shifts', and 'order book dynamics'.
Keep responses under 3 paragraphs. Focus on factual-sounding, analytical finance phrasing.
"""

@router.post("/chat")
def chat_with_ai(request: ChatRequest):
    if not gemini_api_key:
        return {
            "reply": "I am currently running in offline mode. To activate my full neural-net forecasting, please add a valid GEMINI_API_KEY to your backend environment variables."
        }

    try:
        # We use gemini-1.5-flash for fast text generation
        model = genai.GenerativeModel('gemini-1.5-flash', system_instruction=SYSTEM_INSTRUCTION)
        
        # Convert frontend history to Gemini format (roles must be 'user' or 'model')
        history = []
        for msg in request.messages[:-1]: 
            role = 'model' if msg.role == 'assistant' else 'user'
            history.append({
                "role": role,
                "parts": [msg.text]
            })
            
        chat_session = model.start_chat(history=history)
        last_message = request.messages[-1].text
        response = chat_session.send_message(last_message)
        
        return {"reply": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
