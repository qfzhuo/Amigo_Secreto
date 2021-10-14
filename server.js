//Módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const principal = require('./routes/principal')
const path = require('path')
const Mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash")

//Configurações
    //Flash
    app.use(session({
        secret: "amigosecreto",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
    //Middleware
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next()
    })
    //Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: "main"}))
    app.set('view engine', 'handlebars')
    //Mongoose
    //Por favor, criar um banco de dados com nome "amigosecreto" com MongoDB local para rodar o programa
    Mongoose.Promise = global.Promise;
    Mongoose.connect("mongodb://localhost/amigosecreto", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log("Conectado ao mongo")    
    }).catch((err) => {
        console.log("Erro ao se conectar"+err) 
    })
    //Public
    app.use(express.static(path.join(__dirname,'public')))

//Rotas
app.use('/', principal)

//Outros
const PORT = 8085
app.listen(PORT, () => {
    console.log("Servidor rodando na porta "+PORT)
})