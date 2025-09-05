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

def get_osu_api_data(beatmap_id):
    global client_id, client_secret
    if not client_id or not client_secret:
        retrieve_osu_keys()
    api = Ossapi(client_id, client_secret)

    beatmap = api.beatmap(beatmap_id)
    all_data = []
    for i in select_data:
        data = beatmap
        for k in i:
            data = getattr(data, k)
        all_data.append(data)
    return all_data

def validate_beatmap_id(beatmap_id):
    try:
        global client_id, client_secret
        if not client_id or not client_secret:
            retrieve_osu_keys()
        api = Ossapi(client_id, client_secret)

        beatmap = api.beatmap(beatmap_id)
        if beatmap.mode.value != 'osu':
            return 1
        return 2
    except ValueError as e:
        return 0
    except Exception as e:
        print(e)
        return 0

# it should return 0 if the beatmapId does not exist
# it should return 1 if the beatmapId is not a standard osu map
# it should return 2 if the beatmapId is a standard osu map
#print(validate_beatmap_id(905576))
#print(validate_beatmap_id(3675267))


@router.get('/osu-data/{beatmap_id}')
async def get_osu_data(beatmap_id: int):
    data = get_osu_api_data(beatmap_id)
    return { "osu_data": data }

@router.get('/validate-id/{beatmap_id}')
async def validate_map(beatmap_id: int):
    valid = validate_beatmap_id(beatmap_id)
    return { "valid": valid}

