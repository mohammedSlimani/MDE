
import json
import re




#----------------------
#----------------------
#----------PARSER-----------
#----------------------



def isStart(line):
    if line == '@startuml':
        return True
    return False

def isEnd(line):
    if line == '@enduml':
        return True
    return False

def isTitle(line):
    print("@ title ")
    if re.match("^[A-Za-z0-9_ ]*$", line.strip(' ') ):
        return True
    print(line, ' not title')
    return False

def isName(line):
    if re.match(".*?", line.strip(' ') ):
        return True
    print(line, ' not Name')
    return False

def isEntity(line):
    if re.match("\(.*?\)", line.strip(' ')):
        return True
    print(line.strip(' ') + ' not entity')
    return False


# entity --> entity : str
def isEdge(line):
    #print("@ edge", end=" ")
    d = {}
    if len(line.split('-->')) == 2:
        if isEntity(line.split('-->')[0] ):
            d['from'] = line.split('-->')[0].strip()
            if len(line.split('-->')[1].split(':')) == 2:
                 if isEntity(line.split('-->')[1].split(':')[0] ):
                     d['to'] = line.split('-->')[1].split(':')[0].strip()
                     if isName(line.split('-->')[1].split(':')[1] ):
                         d['action'] = line.split('-->')[1].split(':')[1].strip()
            else:
                if isEntity(line.split('-->')[1]):
                    d['to'] = line.split('-->')[0].strip()

    return d




def parse( input ):

    lines = [line.strip(' ').strip('\n') for line in input.split('\n') if line.strip() != '']
    out = []

    i = 0
    if isStart(lines[i]):
        #print("@ start")
        i += 1

    while ( (not isEnd(lines[i])) and i < len(lines) ):
        if '-->' in lines[i]:
            if isEdge(lines[i]) != {}:
                out.append( isEdge(lines[i]) )
            i += 1
            continue
        else:
            isTitle(lines[i])
            i += 1

    if(i == len(lines)):
        print('expected @enduml')
        return

    if ( isEnd(lines[i]) ):
        #print("@ end")
        i += 1

    return out






#----------------------
#----------------------
#----------INVERSOR-----------
#----------------------




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






#----------------------
#----------------------
#----------SERVER-----------
#----------------------
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/parse', methods=['POST'])
def post_parse():
    return jsonify( { 'lc' : parse(request.json['uml']) } )




@app.route('/inverse', methods=['POST'])
def post_inverse():
    return jsonify({'uml': inverse(request.json)})



if __name__ == '__main__':
    app.run(debug=True)


