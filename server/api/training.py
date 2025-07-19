from fastapi import APIRouter
from db import delete_submission
from train import insertDataById
from pydantic import BaseModel
from typing import List

router = APIRouter()

class TrainData(BaseModel):
    beatmapId: int
    labels: List[str]

@router.post('/train')
async def train_beatmap(traindata: TrainData):
    delete_submission('staged_data', traindata.beatmapId)
    for i in traindata.labels:
        insertDataById(traindata.beatmapId, i)
    return {"status": "Training started", "training beatmapId": traindata.beatmapId}

@router.post('/classify-map{beatmap_id}')
async def classify_map_request(beatmap_id: int):
    #labels = some request function
    #return { "labels": }

#@router.post('/find-map{beatmap_id}')
#async def find_similar_map_request(beatmap_id: int):
