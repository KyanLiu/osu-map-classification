from typing import Union
from fastapi import FastAPI
from api.submissions import router as submissions_router
from api.training import router as training_router

app = FastAPI()
app.include_router(submissions_router, prefix='/api')
app.include_router(training_router, prefix='/api')


@app.get("/")
def read_root():
    return {"Hello": "World"}




#if __name__ == "__main__":
#    main()
