from fastapi import APIRouter
from train import insertDataById
from pydantic import BaseModel
from typing import List

router = APIRouter()

class TrainData(BaseModel):
    beatmapId: int
    labels: List[str]

@router.post('/train')
async def train_beatmap(traindata: TrainData):
    insertDataById(traindata.beatmapId, traindata.labels)
    return {"status": "Training started", "training beatmapId": traindata.beatmapId}
