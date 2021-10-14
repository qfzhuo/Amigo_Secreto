const express = require('express')
const nodemailer = require('nodemailer')
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
        req.flash("error_msg", "Houve um erro ao deletar o participante "+err)
        res.redirect("/participantes")
    })
})

router.get("/participantes/sortear", (req, res) => { 
    Participante.find().then(function(amigos) { 
    var amigos_sorteados = amigos.slice()
    if (amigos.length <= 2){
        req.flash("error_msg", "Participantes insuficiente para o amigo secreto")
        res.redirect("/participantes")
    } 
    else {
        function shuffle(array){
            var indice_atual = array.length, valor_temporario, indice_aleatorio

            while (0 != indice_atual) {
                indice_aleatorio = Math.floor(Math.random() * indice_atual)
                indice_atual -= 1

                valor_temporario = array[indice_atual]
                array[indice_atual] = array[indice_aleatorio]
                array[indice_aleatorio] = valor_temporario
            }
            return array
        }
        repete_sorteio = true
        var cont = 0
        while (repete_sorteio) {
            if (cont==amigos.length){
                repete_sorteio = false
            } else {
                repete_sorteio = true
                amigos_sorteados = shuffle(amigos_sorteados)
                cont = 0
                for (contv=0; contv<amigos.length; contv++){
                    if (amigos[contv] !== amigos_sorteados[contv]){
                        cont++
                    } else {
                        cont = 0
                    }
                }
            }
        }
        for (let j=0; j<amigos.length; j++){
            let pessoa = amigos[j].nome
            let email_pessoa = amigos[j].email
            let amigosecreto = amigos_sorteados[j].nome

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'yk5pz2dlgdhlxqul@ethereal.email',
                    pass: 'KcUR3esJs5JUNjB7nn'
                }
            });

            var message = {
                from: "yk5pz2dlgdhlxqul@ethereal.email",
                to: email_pessoa,
                subject: "Amigo Secreto",
                text: pessoa + ", seu amigo secreto é " + amigosecreto
            };
            transporter.sendMail(message, function(err){
                if (err) {
                    req.flash("error_msg", "Erro ao encaminhar os emails" + err)
                    res.redirect("/participantes")
                }
                else {
                    req.flash("success_msg", "Sorteio e envio de emails concluídos, verifique sua caixa de entrada")
                    res.redirect("/participantes") 
                }
            })
            
        }
    }
    })
})
        
      
      


module.exports = router