from typing import Union
from fastapi import FastAPI
from train import insertDataById

app = FastAPI()



@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/train/")
async def train_beatmap(beatmapId: int):
    insertDataById(beatmapId)
    return {"status": "Training started", "training beatmapId": beatmapId}

#@app.get("/train")
#def read_train()

#if __name__ == "__main__":
#    main()
