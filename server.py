from fastapi import FastAPI
import uvicorn
from pydantic import BaseModel
from time import sleep

class FormData(BaseModel):
    name: str
    phone: str

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:63342",
    "http://localhost:8080",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/")
async def get_model(body: FormData):
    print(body)
    sleep(2)
    return {"message": "Have some residuals"}


if __name__ == '__main__':
    uvicorn.run(app, host="localhost", port=5000)