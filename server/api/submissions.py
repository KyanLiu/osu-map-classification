from fastapi import APIRouter
from front_db import add_submission, retrieve_submissions
from pydantic import BaseModel

router = APIRouter()

Class SubmissionData(BaseModel):
    tags: List[str]
    beatmapId: int

@router.post('/submissions/')
async def create_submission(submission_data: SubmissionData):
    for i in submission_data.tags:
        add_submission(i, submission_data.beatmapId)
    return {"status": "saved beatmaps and tags"}

@router.get('/submissions/')
async def get_submissions():
    data = retrieve_submissions()
    return {"submissions": data}
