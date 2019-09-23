let mongoose = require('mongoose')
let Schema = mongoose.Schema

let eventSchema = new Schema({
    titulo: {type: String, required: true},
    fecha_ini: {type: String, required: true},
    fecha_fin: {type: String, required: false},
    dia_completo: {type: Boolean, required: false, default: false},
    fk_usuario: {type: Schema.Types.ObjectId, ref: 'User'}
})

const Events = mongoose.model("Events", eventSchema)

module.exports = Events