let express = require('express')
let Router = express.Router()
let mongoose = require('mongoose')
let User = require('./schemas/User')
let Events = require('./schemas/Events')
let bcrypt = require('bcrypt')
let user_id = '';

Router.post('/', (req, res) => {
    let usuario = new User({
        email: "maxiereyes@hotmail.com",
        password: bcrypt.hashSync("q1w2e3r4", 10),
        nombre: "Maximiliano Reyes",
        fecha_nac: "07/11/1988"
    })
    let query = User.findOne({email: "maxiereyes@hotmail.com"})
    query.select('_id email')
    query.exec((err, userBuscado) => {
        if(!userBuscado){
            usuario.save(function(err, usuarioGuardado){
                if(err){
                    res.send(err.message)
                }else{
                    res.send("Usuario Creado")
                }
            })
        }
    })
})

Router.get('/events/all', (req, res) => {
    let eventosLista = ''
    if(!user_id){
        res.json({
            "status": "Error",
            "mensaje" : "Debe loguearse primero"
        })
    }else{
        Events.find({fk_usuario: user_id}, ('_id titulo fecha_ini fecha_fin dia_completo'), (err, eventos) => {
            if(err) res.send(`Error: ${err}`)
            if(eventos == undefined){
                eventosLista = ""
            }else{
                eventosLista = eventos.map((valor, index) => {
                    return {
                        allDay: valor['dia_completo'],
                        start: valor['fecha_ini'],
                        end: valor['fecha_fin'],
                        title : valor['titulo'],
                        id: valor['_id']
                    }
                })
            }
            res.send(eventosLista)
        })
    }
})

Router.post('/events/new', (req, res) => {
    let diaCompleto = (req.body.end === "" ? true : false)
    let evento = new Events({
            titulo: req.body.title,
            fecha_ini: req.body.start,
            fecha_fin: req.body.end ,
            dia_completo: diaCompleto,
            fk_usuario: user_id
    })
    evento.save((err, eventoGuardado) => {
        if (err) res.send(`Error: ${err}`)
        res.send(`Evento ${eventoGuardado.titulo} se creo exitosamente!`)
    })
})

Router.post('/login', (req, res) => {
    let usuario = req.body.user
    let pass = req.body.pass
    User.find({email: usuario}, function(err, docs){
        if(err) res.send(`Error: ${err}`)
        if(docs != ""){
            if(bcrypt.compareSync(pass, docs[0].password)){
                user_id = docs[0]._id
                res.send("Validado")
            }else{
                res.send("Contraseña incorrecta")
            }
        }else{
            res.send("Usuario no encontrado")
        }
    })
})

Router.post('/events/delete/:id', (req, res) => {
    let id = req.params.id
    Events.deleteOne({_id: id}, (err, eventoBorrado) => {
        if(err) res.send(`Error : ${err}`)
        if(eventoBorrado.deletedCount != 0){
            res.send(`Evento eliminado exitosamente`)
        }else{
            res.send(`Evento inexistente! Inconsistencia en Datos...`)
        }
        
    })
})

Router.post('/events/update/:id', (req, res) => {
    let id = req.params.id
    Events.findById(id, (err, respuesta) => {
        if(!respuesta){
            res.send(`Error: ${err}`)
        }else{
            respuesta.titulo = req.body.titulo,
            respuesta.fecha_ini = req.body.start,
            respuesta.fecha_fin = req.body.end,
            respuesta.dia_completo = req.body.allDay

            respuesta.save((err, eventoActualizado) => {
                if(err) res.send(`Error: ${err}`)
                res.send("Evento actualizado correctamente")
            })
        }
    })
})


module.exports = Router