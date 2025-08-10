from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import training_router, submissions_router, osu_api_router

app = FastAPI()
app.include_router(submissions_router, prefix='/api')
app.include_router(training_router, prefix='/api')
app.include_router(osu_api_router, prefix='/api')

origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def read_root():
    return {"Hello": "World"}



#if __name__ == "__main__":
#    main()
