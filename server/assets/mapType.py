import os

# Map conversion Array:
# [Speed, Aim, Tech, Flow Aim, Stream, Burst, Consistency]
mapConversion = ["speed", "jump aim", "tech", "flow aim", "stream", "burst", "consistency"]
# add precision (circle size)

'''
mapClasses = {
    "camellia_m1lli0npp_megam1ll0n.osu": [0, 0, 1, 0, 0, 1, 0],
    "ericsaade_popular_celebrity.osu": [0, 1, 0, 0, 0, 0, 0],
    "frederic_oddloop_oldnoob.osu": [0, 0, 0, 0, 0, 0, 0],
    "linkinpark_breakingthehabit_turbokolab.osu": [0, 1, 0, 0, 0, 0, 0],
    "thelivingtombstone_goodbyemoonmen_cyb3rsomniverse.osu": [0, 1, 0, 0, 0, 0, 0],
}

def getMapClasses():
    data = {}
    for fn in os.listdir('assets/catagorized_data'):
        with open("assets/catagorized_data/" + fn, "r", encoding="utf-8") as file:
            content = file.read()
            for line in content.splitlines():
                beatmap_id = int(line)
                type_file = fn.removesuffix(".txt")
                if type_file in data:
                    data[type_file].append(beatmap_id)
                else:
                    data[type_file] = [beatmap_id]
    return data



mapClasses = {
    3970329: ["flow aim", "stream", "consistency"],
    668662: ["stream", "burst", "consistency"]
}

'''
#getMapClasses()