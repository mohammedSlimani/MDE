

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


print("@startuml\n(start) --> (Ord:Go_up\n If:  < free v < not Eject > ^ < wpa2 > >  \n....\nInh:Go_dn\n If: --)\n(Ord:Go_up\n If:  < free v < not Eject > ^ < wpa2 > >  \n....\nInh:Go_dn\n If: --) --> (2) : dn\n(2) --> (Ord:Go_dn\n If:  < < not ok v < not Eject > > ^ < < < ok > v < Eject > > -> up ebp > >  \n....\nInh:Go_up\n If: --) : up\n(Ord:Go_dn\n If:  < < not ok v < not Eject > > ^ < < < ok > v < Eject > > -> up ebp > >  \n....\nInh:Go_up\n If: --) --> (6) : up\n(6) --> (Ord:Go_up\n If:  < free v < not Eject > ^ < wpa2 > >  \n....\nInh:Go_dn\n If: --) : Go_up\n@enduml")