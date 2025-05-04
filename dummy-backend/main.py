from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Pydantic model for request body
class RequestModel(BaseModel):
    user_inquiry: str
    user_id: int

# Dummy function to mimic saving conversation
def save_conversation(user_id, user_inquiry, response):
    print(f"Saved conversation: [User {user_id}] {user_inquiry} → {response}")

@app.post("/send_request")
def send_request(request: RequestModel):
    user_inquiry = request.user_inquiry
    user_id = request.user_id

    # Dummy response
    response = "This is a dummy response."

    if "plot" in user_inquiry.lower() or "ارسم" in user_inquiry:
        return {"response": "Dummy image generated.", "type": "image"}

    # Save non-plot conversation
    save_conversation(user_id, user_inquiry, response)
    return {"response": response, "type": "text"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
