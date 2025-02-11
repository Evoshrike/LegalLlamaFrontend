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

@app.get("/yes")
def yes_response():
    return {"response": "yes"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
