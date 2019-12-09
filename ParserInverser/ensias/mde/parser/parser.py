import re

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




# -----------------
# -----------------
# ------PARSING------
# -----------------



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



# print( ("".join(open('input.txt').readlines()) ))

# import requests
#print( requests.post('http://localhost:5000/parse', data= "".join(open('input.txt').readlines())) )

