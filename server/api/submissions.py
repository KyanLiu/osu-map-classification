from fastapi import APIRouter, HTTPException, Depends, Request
from db import add_submission, retrieve_submissions, delete_submission
from models import User
from limiter import limiter
from auth import get_current_admin_user
from pydantic import BaseModel
from typing import List

router = APIRouter()

class SubmissionData(BaseModel):
    beatmapId: int
    tags: List[str]

# this endpoint is open for all users
@router.post('/create-submissions')
@limiter.limit("5/minute")
async def create_submission(request: Request, submission_data: SubmissionData):
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
async def get_submissions(admin_user: User = Depends(get_current_admin_user)):
    data = retrieve_submissions('submissions_data')
    return {"submissions": data}

@router.delete('/delete-submission/{beatmap_id}')
async def delete_submission_data(beatmap_id: int, admin_user: User = Depends(get_current_admin_user)):
    delete_submission('submissions_data', beatmap_id)
    return {"status": "deleted the saved submissions"}

@router.get('/staged-submissions')
async def get_staged_submissions(admin_user: User = Depends(get_current_admin_user)):
    data = retrieve_submissions('staged_data')
    return {"submissions": data}

@router.post('/stage-submissions')
async def create_staged_submission(staged_data: SubmissionData, admin_user: User = Depends(get_current_admin_user)):
    delete_submission('submissions_data', staged_data.beatmapId)
    for i in staged_data.tags:
        add_submission('staged_data', i, staged_data.beatmapId)
    return {"status": "saved staged beatmaps and tags"}

@router.delete('/delete-staged/{beatmap_id}')
async def delete_staged_data(beatmap_id: int, admin_user: User = Depends(get_current_admin_user)):
    delete_submission('staged_data', beatmap_id)
    return {"status": "deleted the staged submissions"}
