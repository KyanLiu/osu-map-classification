import math
import os
import sys
import numpy as np
sys.path.append('assets')
from KNN import KNearestNeighbors
from mapType import mapConversion
from mapType import mapClasses
from data import download_osu_data
from db import flatten_data, get_tags_db, insert_db, standardize_data, build_db, exists_db, standard_deviation_calc

def ncr(n, i):
    curN = 1
    curI = 1
    subN = 1
    for k in range(2, n+1):
        curN *= k
        if k <= i:
            curI *= k
        if k <= (n - i):
            subN *= k
    return curN // (curI * subN)
def pow(k, n): # k^n
    if n == 0:
        return 1 
    cur = pow(k, n//2)
    cur*=cur
    if n % 2 == 1:
        cur *= k
    return cur


def bezier_point_calc(t_val, ctrl_points):
    n = len(ctrl_points) - 1
    x,y = 0,0
    for i in range(0, n + 1):
        comb = ncr(n, i)
        fexp = pow(1 - t_val, n - i)
        nexp = pow(t_val, i)
        x += comb * fexp * nexp * ctrl_points[i][0]
        y += comb * fexp * nexp * ctrl_points[i][1]
    return [x, y]


def bezier_curve_calc(ctrl_points, length):
    prev = bezier_point_calc(0, ctrl_points)
    store = 0
    for i in range(1, 1001):
        cur = 0.001 * i
        cur_pnt = bezier_point_calc(cur, ctrl_points)
        store += math.hypot(cur_pnt[0] - prev[0], cur_pnt[1] - prev[1])
        if float(store) >= float(length):
            return cur_pnt
        prev = cur_pnt
    return prev

def slider_endpoint(cur_object):
    # possibly need to handle length being longer than the defined curve
    cur_type = cur_object[5]
    if cur_type == "B":
        return bezier_curve_calc(cur_object[6], cur_object[8])
    elif cur_type == "L":
        return cur_object[6][-1]
    elif cur_type == "C":
        # this part is not necesarrily correct
        return cur_object[6][2]
    return cur_object[6][0]

def circle_size_radius(cs):
    return 109 - 9 * cs

def parse_hit_object(line):
    parts = line.split(",")
    result = []
    for c in parts:
        if c.isnumeric():
            result.append(int(c))
        elif c[0].isalpha():
            result.append(c[0])
            ns = c[2:].split("|")
            nxtTmp = []
            for n in ns:
                tmp = n.split(":")
                nxtTmp.append([int(tmp[0]), int(tmp[1])])
            result.append(nxtTmp)
        else:
            result.append(c)
    return result



def get_map_endpoint_time(hit_objects):
    # estimate end time of map
    mx = 0
    mn = float('inf')
    for line in hit_objects:
        mx = max(line[2], mx)
        mn = min(line[2], mn)
    return [mn, mx]
def get_slider_ratio(hit_objects):
    if hit_objects is None:
        return 0
    ct = 0
    for cur_object in hit_objects:
        type_val = cur_object[3]
        if type_val & 2:
            ct += 1
    return ct / len(hit_objects)
def avg_bpm(timing_points, map_end_time):
    weighted_sum = 0 
    total_dur = 0
    for i in range(len(timing_points)):
        line = timing_points[i]
        cur_bpm = 60000 / line[1]
        dur = 0
        if i+1 == len(timing_points):
            dur = map_end_time - line[0]
        else:
            dur = timing_points[i+1][0] - line[0]
        weighted_sum += dur * cur_bpm
        total_dur += dur
    return weighted_sum / total_dur
def avg_slider_velocity(sv_points, map_end_time):
    if len(sv_points) == 0:
        return 1.0
    weighted_sum = 0
    total_dur = 0
    for i in range(len(sv_points)):
        line = sv_points[i]
        cur_sv = -100 / line[1]
        dur = 0
        if i+1 == len(sv_points):
            dur = map_end_time - line[0]
        else:
            dur = sv_points[i+1][0] - line[0]
        weighted_sum += dur * cur_sv
        total_dur += dur
    return weighted_sum / total_dur
        

def avg_dist(hit_objects, map_bpm, circleSize):
    if hit_objects is None:
        return 0
    last_object = None
    last_time = 0
    total_dist = 0


    beat_duration = 60000 / map_bpm # in ms, each time between each beat
    
    spaced_stream_cnt = 0 # maybe normalize by dividing this by stream_cnt
    cur_spaced_cnt = 0
    stream_cnt = 0
    burst_cnt = 0
    cur_close = 0
    flow_aim_cnt = 0

    cur_flow = 0
    # maybe a flow aim count?
    for i in range(0, len(hit_objects)):
        cur_object = hit_objects[i]
        type_val = cur_object[3]
        if last_object is None:
            cur_close = 1
            cur_flow = 1
            cur_spaced_cnt = 0
            if type_val & 8:
                continue
            if type_val & 1:
                last_object = [cur_object[0], cur_object[1]]
            else:
                last_object = slider_endpoint(cur_object)
            last_time = cur_object[2]
        elif type_val & 8:
            last_object = None
            if cur_close > 2 and cur_spaced_cnt > 0:
                spaced_stream_cnt += cur_spaced_cnt
            if cur_close > 6:
                stream_cnt += cur_close
            elif cur_close > 2:
                burst_cnt += cur_close
            cur_close = 0
            cur_spaced_cnt = 0

            # flow aim check
            if cur_flow > 2:
                flow_aim_cnt += cur_flow
            cur_flow = 1
        elif type_val & 1: # circle
            dist = math.hypot(last_object[0] - cur_object[0], last_object[1] - cur_object[1])
            # find the beat fraction
            diff_time = (cur_object[2] - last_time) / beat_duration
            #print(diff_time, cur_close)
            if diff_time <= 0.3:
                cur_close += 1
                dist_calc = circle_size_radius(circleSize) 
                #print(dist, dist_calc)
                if dist >= dist_calc: # spaced stream
                    cur_spaced_cnt += 1
            else:
                if cur_close > 2 and cur_spaced_cnt > 0:
                    spaced_stream_cnt += cur_spaced_cnt
                if cur_close > 6:
                    stream_cnt += cur_close
                elif cur_close > 2:
                    burst_cnt += cur_close
                cur_close = 1
                cur_spaced_cnt = 0

            # flow aim check
            if diff_time <= 0.4:
                cur_flow += 1
            else:
                if cur_flow > 2:
                    flow_aim_cnt += cur_flow
                cur_flow = 1

            total_dist += dist
            last_object = [cur_object[0], cur_object[1]]
            last_time = cur_object[2]

        elif type_val & 2: # slider
            slider_end = slider_endpoint(cur_object)
            dist = math.hypot(last_object[0] - slider_end[0], last_object[1] - slider_end[1])
            if cur_close > 2 and cur_spaced_cnt > 0:
                spaced_stream_cnt += cur_spaced_cnt
            if cur_close > 6:
                stream_cnt += cur_close
            elif cur_close > 2:
                burst_cnt += cur_close
            cur_close = 1
            cur_spaced_cnt = 0

            diff_time = (cur_object[2] - last_time) / beat_duration
            # flow aim check
            if diff_time <= 0.4:
                cur_flow += 1
            else:
                if cur_flow > 2:
                    flow_aim_cnt += cur_flow
                cur_flow = 1

            total_dist += dist
            last_object = slider_end
            last_time = cur_object[2]
    if cur_close > 2 and cur_spaced_cnt > 0:
        spaced_stream_cnt += cur_spaced_cnt
    if cur_close > 6:
        stream_cnt += cur_close
    elif cur_close > 2:
        burst_cnt += cur_close
    if cur_flow > 2:
        flow_aim_cnt += cur_flow
    flow_aim_density = flow_aim_cnt / len(hit_objects)
    spaced_stream_density = 0
    if stream_cnt > 0:
        spaced_stream_density = spaced_stream_cnt / stream_cnt
    #print("stream count", stream_cnt, "burst count", burst_cnt, "spaced stream density", spaced_stream_density, "flow aim density", flow_aim_density)
    return [total_dist / len(hit_objects), stream_cnt / len(hit_objects), burst_cnt / len(hit_objects), spaced_stream_density, flow_aim_density]

def parse_osu_file(beatmap_data, beatmap_id):
    hit_objects = []
    timing_points = []
    sv_points = []
    total_data = [beatmap_id]
    circle_size = 0
    currentType = 0
    # up to 7 types
    for currentLine in beatmap_data.splitlines():
        if currentLine.isspace() or currentLine == "":
            continue
        elif currentLine == "[Editor]":
            currentType = 1
        elif currentLine == "[Metadata]":
            currentType = 2
        elif currentLine == "[Difficulty]":
            currentType = 3
        elif currentLine == "[Events]":
            currentType = 4
        elif currentLine == "[TimingPoints]":
            currentType = 5
        elif currentLine == "[Colours]":
            currentType = 6
        elif currentLine == "[HitObjects]":
            currentType = 7
        else:
            if currentType == 7:
                cur = parse_hit_object(currentLine)
                hit_objects.append(cur)
            elif currentType == 5:
                cur = [float(i) for i in currentLine.split(',')]
                if int(cur[6]) == 1:
                    timing_points.append(cur)
                else:
                    sv_points.append(cur)
            elif currentLine.startswith("Title:"):
                total_data.append(currentLine[6:])
            elif currentLine.startswith("CircleSize:"):
                circle_size = float(currentLine[11:])
                total_data.append(["circle size", float(currentLine[11:])])
            elif currentLine.startswith("OverallDifficulty:"):
                total_data.append(["overall difficulty", float(currentLine[18:])])
            elif currentLine.startswith("ApproachRate:"):
                total_data.append(["approach rate", float(currentLine[13:])]) 
            elif currentLine.startswith("SliderMultiplier:"):
                total_data.append(["slider multiplier", float(currentLine[17:])])
            elif currentLine.startswith("SliderTickRate:"):
                total_data.append(["slider tick rate", float(currentLine[15:])])
    map_end_time = get_map_endpoint_time(hit_objects)
    map_bpm = avg_bpm(timing_points, map_end_time[1]) 
    map_length = map_end_time[1] - map_end_time[0]
    map_density = len(hit_objects) / map_length 
    map_distance_details = avg_dist(hit_objects, map_bpm, circle_size)
    total_data.append(["slider to hit objects ratio", get_slider_ratio(hit_objects)])
    total_data.append(["average note distance", map_distance_details[0]])
    total_data.append(["average bpm", map_bpm])
    total_data.append(["average slider velocity", avg_slider_velocity(sv_points, map_end_time[1])])
    total_data.append(["length of map", map_length])
    total_data.append(["map density", map_density])
    total_data.append(["stream count density", map_distance_details[1]])
    total_data.append(["burst count density", map_distance_details[2]])
    total_data.append(["spaced stream density", map_distance_details[3]])
    total_data.append(["flow aim density", map_distance_details[4]])
    #print("map length", map_end_time[1] - map_end_time[0])
    #print(avg_bpm(timing_points, map_end_time), "average bpm")
    #print(avg_slider_velocity(sv_points, map_end_time), "slider velocity")
    #print(avg_dist(hit_objects))
    #print(get_slider_ratio(hit_objects))
    return total_data


#def z_score_calc():
    

def insertDataById(beatmap_id):
    if exists_db(beatmap_id):
        print("Beatmap ID", beatmap_id, "is already in the database.")
        return

    data = download_osu_data(beatmap_id)
    if data is None:
        return
    map_osu_details = parse_osu_file(data, beatmap_id)

    tags = mapClasses[beatmap_id]

    insert_db(map_osu_details, tags)
    #print(map_osu_details)
    
def connect_tags(data):
    # connect the data with tags/classes
    # remove the beatmap id and name from the data?
    tags = get_tags_db()
    grouped = {}
    connect_tags = {}
    for i in data:
        grouped[i[0]] = i[2:]
    for tag in tags:
        for id in tags[tag]:
            if id in connect_tags:
                connect_tags[tag].append(grouped[id])
            else:
                connect_tags[tag] = [grouped[id]]

    return connect_tags

def shape_predict_data(beatmap_id, mean, standard_deviation):
    data = download_osu_data(beatmap_id)
    if data is None:
        return
    map_osu_details = parse_osu_file(data, beatmap_id)
    numbers = (flatten_data(map_osu_details))[2:]
    standard_deviation[standard_deviation == 0] = 1
    standardized_numbers = (np.array(numbers) - np.array(mean)) / np.array(standard_deviation)
    new_data = standardized_numbers.tolist()
    return new_data
    
def main():
    #insertDataById(668662) 
    #insertDataById(3970329)
    mean, standard_deviation = standard_deviation_calc()
    standardized_data = standardize_data(mean, standard_deviation)
    #print(standardized_data)
    new_train_data = connect_tags(standardized_data)
    new_test_data = shape_predict_data(1860169, mean, standard_deviation)
    #print(new_test_data)
    clf = KNearestNeighbors()
    clf.fit(new_train_data)
    print(clf.predict(new_test_data))

    '''
    for fn in os.listdir('assets/dataset'):
        if fn.endswith(".osu"):
            map_osu_details = parse_osu_file("./assets/dataset/" + fn)
            #print(fn)
            #print(map_osu_details)
            # this returns stats like aim distance etc...
            # we then must normalize the data somehow? or do it beforehand
            map_Type_Collection = mapClasses[fn]
            # this returns data type like aim, should be used for all these catagories
            for i in range(0, len(map_Type_Collection)):
                if map_Type_Collection[i] != 0:
                    #print(fn, mapConversion[i])
                    if mapConversion[i] not in data:
                        data[mapConversion[i]] = [map_osu_details]
                    else:
                        data[mapConversion[i]].append(map_osu_details)
    #print(data)
    '''


if __name__ == "__main__":
    main()