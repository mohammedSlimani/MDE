
### runing the server
```
python3 -m ensias.mde.server.app
```

### IT is deployed at 
- http://tromastrom.pythonanywhere.com

#### Routes are :
- inverse 
```
POST http://tromastrom.pythonanywhere.com/inverse
[
 {
  from:...
  to:...
 }
]
```

- Parse
```
POST http://tromastrom.pythonanywhere.com/parse
{
  "uml":"ASCII STRING OF THE PLANTUML"
}
```
