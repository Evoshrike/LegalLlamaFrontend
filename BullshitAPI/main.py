from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI()

# Need this to avoid CORS issues. 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains (change to specific domains for security)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


class RepeatRequest(BaseModel):
    prompt: str

# Depreciated
@app.post("/generate-response")
def repeat_response(request: RepeatRequest):
    return {"response": f"You said: {request.prompt}"}
class CategorizeRequest(BaseModel):
    question: str
@app.post("/categorize-question")
def categorize_question(request: CategorizeRequest):
    time.sleep(1)
    if "what" in request.question.lower():
        return {"message": "Open-Ended"}
    else:
        return {"message": "Suggestive"}
    

@app.post("/llm-categorize-question")
def llm_categorize_question(request: CategorizeRequest):
    time.sleep(1)
    if "what" in request.question.lower():
        return {"message": "Open-Ended"}
    else:
        return {"message": "Suggestive"}
    
    
@app.get("/generate-question")
def generate_question():
    time.sleep(1)
    return {"question": "What happened?", "category": "Open-Ended"}

@app.get("/start-session")
def start_session():
    return {"session_id": "1234567890"}
class ChatRequest(BaseModel):
    message: str
    scenario: str
@app.post("/chat")
def chat(request: ChatRequest):
    time.sleep(1)
    return {"message": f"You said: {request.message}"}

@app.get("/generate-scenario")
def generate_scenario():
    time.sleep(1)
    return {
        "Scenario": (
            "A thirteen-year-old boy named Benjamin is referred for an interview after school officials "
            "notice repeated absences and changes in his behavior. The interviewer is given access to "
            "Benjamin's journal, which contains disturbing entries hinting at inappropriate contact with "
            "an adult. Additionally, there are text messages on his phone from an unknown number that are "
            "sexually explicit."
        )
    }

class FeedbackRequest(BaseModel):
    questions: list

@app.post("/give-feedback")
def give_feedback(request: FeedbackRequest):
    
    return {"response": "You have progressed to the next stage! Well done!", "is_correct": True}
    
    
class InstantFeedbackRequest(BaseModel):
    question_1: str
    response: str
    question_2: str

@app.post("/testing-feedback")
def testing_feedback(request: InstantFeedbackRequest):
    return {
        "q_type": "Open-Ended",
        "q_stage": 1,
        "context_switch": False
    }

@app.get("/yes")
def yes_response():
    return {"response": "yes"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
