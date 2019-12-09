


import json


file = open('input.json', 'r')
input =  json.load(file)
file.close()



def concat(s):
    if type(s) == str:
        return s

    ans = { }
    ans["ord"] = s["Ord"] + "\n" + s["Ord_cdt"]
    ans["Inh" ] = s["Inh"] + "\n" + s["Inh_cdt"]

    return ( k+v for k,v in s.items() )



for edge in input:
    ans = {}

    ans['key']



