import os
from fastapi import APIRouter
from dotenv import load_dotenv
from ossapi import Ossapi
#from pydantic import BaseModel
#from typing import List

router = APIRouter()
client_id = None
client_secret = None

select_data = [
    ["id"],
    ["difficulty_rating"],
    ["total_length"],
    ["version"],
    ["ar"],
    ["bpm"],
    ["cs"],
    ["drain"],
    ["url"],
    ["_beatmapset", "artist"],
    ["_beatmapset", "covers", "cover"],
    ["_beatmapset", "creator"],
    ["_beatmapset", "preview_url"],
    ["_beatmapset", "title"]
]


def retrieve_osu_keys():
    global client_id, client_secret
    load_dotenv()
    client_id = os.getenv("OSU_CLIENT_ID")
    client_secret = os.getenv("OSU_CLIENT_SECRET")

def get_osu_api_data():
    global client_id, client_secret
    if not client_id or not client_secret:
        retrieve_osu_keys()
    api = Ossapi(client_id, client_secret)

    beatmap = api.beatmap(3675267)
    all_data = []
    for i in select_data:
        data = beatmap
        for k in i:
            data = getattr(data, k)
        all_data.append(data)
    return all_data

@router.get('/')

get_osu_api_data()