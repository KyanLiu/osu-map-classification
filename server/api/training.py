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
