let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
    email: {type:String, required: true, index: true, unique: true},
    password: {type: String, required: true},
    nombre: {type: String, required: true},
    fecha_nac: {type: Date, required: true}
})

const User = mongoose.model("User", userSchema)

module.exports = User