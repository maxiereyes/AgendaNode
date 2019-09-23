let http = require('http')
let express = require('express')
let bodyParser = require('body-parser')
let app = express()
let Router = require('./Router')
const PORT = 3000
let mongoose = require('mongoose')
const url  = "mongodb://localhost:27017/agenda"

mongoose.connect(url, {useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology:true},  function(){
    console.log("Conectado a Base de Datos");
})

let server = http.createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('client'))
app.use(Router)

server.listen(PORT, function(){
    console.log(`Escuchando en puerto : ${PORT}`);
})


