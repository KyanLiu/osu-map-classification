from fastapi import APIRouter, HTTPException
from db import add_submission, retrieve_submissions
from pydantic import BaseModel
from typing import List

router = APIRouter()

class SubmissionData(BaseModel):
    beatmapId: int
    tags: List[str]

@router.post('/create-submissions')
async def create_submission(submission_data: SubmissionData):
    for i in submission_data.tags:
        add_submission('submissions_data', i, submission_data.beatmapId)
    return {"status": "saved submission beatmaps and tags"}
    #return submission_data
    #try:
    #    return {"status": "saved beatmaps and tags"}
    #except Exception as e:
    #    print(e)
    #    raise HTTPException(status_code=404, detail=e)

@router.get('/retrieve-submissions')
async def get_submissions():
    data = retrieve_submissions('submissions_data')
    return {"submissions": data}

@router.get('/staged-submissions')
async def get_staged_submissions():
    data = retrieve_submissions('staged_data')
    return {"submissions": data}

@router.post('/stage-submissions')
async def create_staged_submission(staged_data: SubmissionData):
    for i in staged_data.tags:
        add_submission('staged_data', i, staged_data.beatmapId)
    return {"status": "saved staged beatmaps and tags"}
