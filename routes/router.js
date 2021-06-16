require('dotenv').config();
const {
    getElencoPatologieforEveryMedico,
    FarmaciMaggiormenteRichiesti,
    NumeroPersoneConEsenzione,
    getDoctors,
    getDoctor,
    addDoc,
    infoUserByDoc,
    infoPatUserByDoc,
    visiteByDoc,
    getFarmaci,
    getPrescrizioni,
    getPatologie,
    addPrescrizione,
    addPatologiaToPaz,
    addPatologia,
    


    
    getUserbyEmail,
    getUsers,
    getUser,
    infoDocbyUser,
    farmacibyUser,
    patologieUser,
    visiteByUser,
    specializzazioniDoctors,
    getCollegamento,
    newCollegamento,
    getDocBySpecializzazione,
    newVisita,
    addUser,
    checkDatabase,
    addRefreshTokenToAcc,
    getRefreshTokens,
    delRefreshToken
} = require('../db/dbcontroller');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const path = require('path');

const router = express.Router();

router.get('/infoDoc', authenticateToken, async (req, res) => {
    console.log(req.user);
    console.log(req.user.CF);
    const Doctor = await getDoctor(req.user.CF);
    res.status(200).json(Doctor)
})

router.get('/infoUser', authenticateToken, async (req, res) => {
    console.log(req.user);
    console.log(req.user.CF);
    const User = await getUser(req.user.CF);
    res.status(200).json(User)
})

router.get('/infoDocbyUser', authenticateToken, async (req, res) => {
    console.log(req.user);
    console.log(req.user.CF);
    const User = await infoDocbyUser(req.user.CF);
    res.status(200).json(User)
})

router.get('/farmacibyUser', authenticateToken, async (req, res) => {
    console.log(req.user);
    console.log(req.user.CF);
    const User = await farmacibyUser(req.user.CF);
    res.status(200).json(User)
})

router.get('/patologieUser', authenticateToken, async (req, res) => {
    console.log(req.user);
    console.log(req.user.CF);
    const User = await patologieUser(req.user.CF);
    res.status(200).json(User)
})

router.get('/visiteByUser', authenticateToken, async (req, res) => {
    console.log(req.user);
    console.log(req.user.CF);
    const User = await visiteByUser(req.user.CF);
    res.status(200).json(User)
})

router.get('/specializzazioniDoctors', async (req, res) => {
    const User = await specializzazioniDoctors();
    
    res.status(200).json(User);
})

router.post('/newVisita', authenticateToken, async (req, res) => {
    console.log('newVisita');
    console.log(req.user);
    console.log(req.body);
    const Docs = await getDocBySpecializzazione(req.body.tipologiaVisita);
    console.log(Docs);
    console.log(Docs.length);
    const CFMedicoScelto = Docs[Math.floor(Math.random() * Docs.length)].codiceFiscale;
    let col = await getCollegamento(req.user.CF, CFMedicoScelto);
    console.log(col);
    if (col.length === 0) {
        col = await newCollegamento(req.user.CF, CFMedicoScelto);
    }
    const dataEorarioVisite = `${req.body.dataVisita} ${req.body.orarioVisita}`;

    const newV = await newVisita(dataEorarioVisite, col[0].id);
    console.log(newV);
    res.status(200).send('Added');
})


router.get('/infoUserByDoc', authenticateToken, async (req, res) => {
    console.log(req.user);
    console.log(req.user.CF);
    const User = await infoUserByDoc(req.user.CF);
    res.status(200).json(User)
})

router.get('/infoPatUserByDoc', authenticateToken, async (req, res) => {
    console.log(req.user);
    console.log(req.user.CF);
    const User = await infoPatUserByDoc(req.user.CF);
    res.status(200).json(User)
})

router.get('/visiteByDoc', authenticateToken, async (req, res) => {
    console.log(req.user);
    console.log(req.user.CF);
    const User = await visiteByDoc(req.user.CF);
    res.status(200).json(User)
})

router.get('/getFarmaci', authenticateToken, async (req, res) => {
    console.log(req.user);
    console.log(req.user.CF);
    const User = await getFarmaci();
    res.status(200).json(User)
})

router.get('/getPrescrizioni', authenticateToken, async (req, res) => {
    console.log(req.user);
    console.log(req.user.CF);
    const User = await getPrescrizioni(req.user.CF);
    res.status(200).json(User)
})

router.get('/getPrescrizioni', authenticateToken, async (req, res) => {
    console.log(req.user);
    console.log(req.user.CF);
    const User = await getPrescrizioni(req.user.CF);
    res.status(200).json(User)
})

router.get('/getPatologie', authenticateToken, async (req, res) => {
    console.log(req.user);
    console.log(req.user.CF);
    const User = await getPatologie();
    res.status(200).json(User)
})


router.post('/addPrescrizione', authenticateToken, async (req, res) => {
    console.log('addPrescrizione');
    console.log(req.user);
    console.log(req.body);
    let col = await getCollegamento(req.body.PazCF, req.user.CF);
    console.log(col);



    const newP = await addPrescrizione(req.body.farmacoID, col[0].id);
    console.log(newP);
    res.status(200).send('Added');
})

router.post('/addPatologiaToPaz', authenticateToken, async (req, res) => {
    console.log('addPatologiaToPaz');
    console.log(req.user);
    console.log(req.body);

    const result = await addPatologiaToPaz(req.body.Patologia_nome, req.body.Paziente_CF);
    console.log(res);
    res.status(200).send('Added');
})

router.post('/addPatologia', authenticateToken, async (req, res) => {
    console.log('addPatologia');
    console.log(req.user);
    console.log(req.body);

    console.log('AGGIUNGIAMO LA PATOLOGIAAAAAAAAAAAAAAAA');
    const result = await addPatologia(req.body.nomePatologia, req.body.esenzionePatologia, req.body.isAsmaticaPatologia);
    console.log(res);
    res.status(200).send('Added');
})

router.post('/addFarmaco', authenticateToken, async (req, res) => {
    console.log('addFarmaco');
    console.log(req.user);
    console.log(req.body);

    console.log('AGGIUNGIAMO LA PATOLOGIAAAAAAAAAAAAAAAA');
    const result = await addFarmaco(req.body.nomeFarmaco);
    console.log(res);
    res.status(200).send('Added');
})





router.get('/patologiaPazienti', authenticateToken, async (req, res) => {
    const Patologie = await getElencoPatologieforEveryMedico();
    res.json(Patologie);
});

router.get('/farmaciMaggiormenteRichiesti', authenticateToken, async (req, res) => {
    const farmaci = await FarmaciMaggiormenteRichiesti();
    res.json(farmaci);
});

router.get('/codiceEsenzione', authenticateToken, async (req, res) => {
    const NumeroPersone = await NumeroPersoneConEsenzione();
    res.json(NumeroPersone);
});

function authenticateToken(req, res, next) {
    console.log(req.headers);
    const authHeader = req.headers['authorization']
    console.log(authHeader);
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        console.log(user);
        console.log('KEKWKEKWKEKWKEKWKEKWKEKWKEKWKEKWKEKWKEKWKEKWKEKWKEKWKEKWKEKWKEKW');
        req.user = user;
        next();
    })
}

module.exports = router;