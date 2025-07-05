from fastapi import APIRouter
from train import insertDataById

router = APIRouter()

@router.get('/train/')
async def train_beatmap(beatmapId: int):
    insertDataById(beatmapId)
    return {"status": "Training started", "training beatmapId": beatmapId}
