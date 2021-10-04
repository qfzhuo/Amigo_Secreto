const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Participante = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

mongoose.model("participantes", Participante)