from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

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

@app.post("/repeat-response")
def repeat_response(request: RepeatRequest):
    return {"response": f"You said: {request.prompt}"}
class RepeatRequest2(BaseModel):
    conversation: list
@app.post("/feedback")
def feedback(request: RepeatRequest2):
    if len(request.conversation) > 2:
        return {"response": "You asked more than 2 questions! Good job!", "isCorrect": True}
    else: 
        return {"response": "You asked less than 2 questions! Try again!", "isCorrect": False}

@app.get("/yes")
def yes_response():
    return {"response": "yes"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
