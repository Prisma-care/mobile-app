# Python script that lists takes subdirectories as albums/themes & prints a .json

import os
import json

result = list()

for dirname, dirnames, filenames in os.walk('.'):
    # print path to all subdirectories first.
    _id = 1
    _sid = 1
    for subdirname in dirnames:
        theme = dict()
        theme["id"] = _id
        theme["title"] = subdirname

        stories = list()

        for r, d, filenames in os.walk('./' + subdirname):
            # root is all we need!
            for filename in filenames:
                story = dict()
                story["id"] = _sid
                story["title"] = filename.split('.')[0]
                story["source"] = "/" + str(subdirname) + "/" + str(filename)
                story["type"] = "2"

                stories.append(story)
                _sid +=1

        theme["stories"] = stories
        result.append(theme)
        _id += 1

print(json.dumps(result, sort_keys=True, indent=2, separators=(',', ': ')))
