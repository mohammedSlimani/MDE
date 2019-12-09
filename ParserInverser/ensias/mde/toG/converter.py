from ensias.mde.parser.inversor import concat
import json


def parser(edges):
    ans = []
    for edge in edges:
        d = {}
        d['from'] = concat(edge['from'])
        d['to'] = concat(edge['to'])
        if 'action' in edge:
            d['action'] = edge['action']
        ans.append(d )
    return  ans



file = open("inputDC.json", "r" )
dc_edges =  json.load(file)
file.close()

dc_edges = parser(dc_edges)


# ----- get names

dic_names = {}
c = 1
for edge in dc_edges:
    if edge['from'] not in dic_names:
        dic_names[edge['from']] = c
        c += 1
    if edge['to'] not in dic_names:
        dic_names[edge['to']] = c
        c += 1



# ----- replace names




print( dc_edges )






