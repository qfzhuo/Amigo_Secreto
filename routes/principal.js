const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Participante")
const Participante = mongoose.model("participantes")

router.get('/', (req, res) => {
    res.render("principal/index")
})

router.get("/participantes", (req, res) => {
    Participante.find().then((participantes) => {
    res.render("principal/participantes", {participantes: participantes.map(Participante => Participante.toJSON())})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar os participantes"+err)
        res.redirect("/")
    })
})

router.post("/participantes", (req, res) => {

    const novoParticipante = {
        nome: req.body.nome,
        email: req.body.email
    }

    new Participante(novoParticipante).save().then(() => {
        req.flash('success_msg', 'Participante cadastrado com sucesso!')
        res.redirect('/participantes')
    }).catch((err) => {
        req.flash('error_msg', "Houve um erro ao cadastrar os participantes, tente novamente!")
        res.redirect("/")
    })
})

router.get("/participantes/edit/:id", (req, res) => {
    Participante.findOne({_id:req.params.id}).lean().then((participante) => {
        res.render("principal/editparticipantes", {participante: participante})
    }).catch((err) => {
        req.flash("error_msg", "Este participante não existe "+err)
        res.redirect("/participantes")
    })
})

router.post("/participantes/edit/", (req, res) => {
    Participante.findOne({_id: req.body.id}).then((participante) => {
        participante.nome = req.body.nome
        participante.email = req.body.email

        participante.save().then(() => {
            req.flash("success_msg", "Participante editado com sucesso!")
            res.redirect("/participantes")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao salvar a edição do participante "+err)
            res.redirect("/participantes")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar o participante "+err)
        res.redirect("/participantes")
    })
})

router.post("/participantes/deletar", (req, res) => {
    Participante.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Participante deletado com sucesso!")
        res.redirect("/participantes")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar o participante"+err)
        res.redirect("/participantes")
    })
})

router.get("/participantes/sortear", (req, res) => { 
    let group = Participante.find({_id:req.params.id})
    console.log("oi "+group)
})

module.exports = router