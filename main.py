
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
def avg_dist(hit_objects):
    if hit_objects is None:
        return 0
    last_object = hit_objects[0]
    total_dist = 0
    for i in range(1, len(hit_objects)):
        cur_object = hit_objects[i]
        type_val = cur_object[3]
        #print(cur_object) 
        if type_val & 8:
            # this should do something to track the distance of the next hit object

        elif type_val & 1:
            # consider spinner objects
            dist = ((last_object[0] - cur_object[0]) ** 2 + (last_object[1] - cur_object[1]) ** 2) ** 0.5
            total_dist += dist
            last_object = [cur_object[0], cur_object[1]]
        elif type_val & 2:
            print(cur_object)
            curve_type = cur_object[5]
            if curve_type == "B":
                


        '''
        if cur_object[0] == last_object[0]:
            dist = ((cur_object[1] - last_object[1]) ** 2 + (cur_object[2] - last_object[2]) ** 2) ** 0.5
            total_dist += dist
        last_object = cur_object

        '''

    

def parse_osu_file(file_path):
    hit_objects = []
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()
        currentType = 0
        # up to 7 types
        for currentLine in content.splitlines():
            if currentLine == "[Editor]":
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

    print(avg_dist(hit_objects))

parse_osu_file("./assets/dataset/vivid_hikari_extra.osu")