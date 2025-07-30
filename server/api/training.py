from fastapi import APIRouter
from db import delete_submission
from train import OsuModel, insertDataById, shapePredictData
from pydantic import BaseModel
from typing import List

router = APIRouter()

osu_model = None

def load_model():
    global osu_model
    if osu_model is None:
        osu_model = OsuModel()
        osu_model.load()

class TrainData(BaseModel):
    beatmapId: int
    labels: List[str]

@router.post('/train')
async def train_beatmap(traindata: TrainData):
    delete_submission('staged_data', traindata.beatmapId)
    for i in traindata.labels:
        insertDataById(traindata.beatmapId, i)
    return {"status": "Training started", "training beatmapId": traindata.beatmapId}

@router.post('/classify-map/{beatmap_id}')
async def classify_map_request(beatmap_id: int):
    global osu_model
    load_model()
    data = shapePredictData(beatmap_id)
    labels = osu_model.predict_class([data])
    return { "labels": labels}

@router.post('/find-map/{beatmap_id}')
async def find_similar_map_request(beatmap_id: int):
    global osu_model
    load_model()
    data = shapePredictData(beatmap_id)
    maps = osu_model.find_map([data])
    return { "maps": maps}