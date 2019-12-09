

import json
import re



def inverse( edges ):
    s = '@startuml\n'
    for edge in edges:
        s += concat(edge['from'])
        s += ' --> ' + concat(edge['to'])
        if 'action' in edge:
            s += ' : ' + edge['action']
        s += '\n'
    s += '@enduml'
    return s




def concat( s ):
    if type(s) == str:
        return s
    if 'Ord_cdt' in s:
        ans = {}
        ans["Ord"] = s["Ord"] + "\n If: " + s["Ord_cdt"]
        ans["Inh"] = s["Inh"] + "\n If: " + s["Inh_cdt"]
        return concat(ans)

    return "("+ "\n....\n".join( [k+':'+v for k,v in s.items()] ) + ")"


