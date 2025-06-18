import requests
import tempfile


def download_osu_data(beatmap_id):
    url = f"https://osu.direct/api/osu/{beatmap_id}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }
    request = requests.get(url, headers=headers)
    if request.status_code != 200:
        print("Error fetching map with id", beatmap_id)
        return
    raw_data = request.content
    with tempfile.NamedTemporaryFile(delete=False) as file:
        file.write(raw_data)
        file_path = file.name
    with open(file_path, "r", encoding="utf-8", errors="ignore") as file:
        data = file.read()
    return data



#download_osu_data(4708805)