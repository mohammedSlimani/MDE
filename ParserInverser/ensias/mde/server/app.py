import json
from ensias.mde.parser.inversor import inverse
from ensias.mde.parser.parser import parse
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


