require('dotenv').config();
const {
    getDoctor,
    addDoc,
    getUserbyEmail,
    addUser,
    checkDatabase,
    addRefreshTokenToAcc,
    getRefreshTokens,
    delRefreshToken
} = require('./db/dbcontroller');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./routes/router');
const app = express();
const app2 = express();


app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public/dist/ElaboratoAlessandroCustodi2021')))

app.use('/api', router);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dist/ElaboratoAlessandroCustodi2021/index.html'));
})


app.listen(3000, async () => {
    console.log(`Example app listening at http://localhost:3000`);
    console.log(process.env.ACCESS_TOKEN_SECRET);
    res = await checkDatabase();
    console.log(res);
});



// AUTH SERVER 

app2.use(express.json());
app2.use(cors());
// SignUp
app2.post('/:typeUser/signup', async (req, res) => {
    //Si distingue se è in corso la registrazione di un dottore o di un cliente
    try {
        const param = (req.params.typeUser).toLowerCase();
        const typeUser = param === 'user' || param === 'doc' ? param : undefined;

        //Crittograffia applicata alla passoword per una maggiore sicurezza
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            email: req.body.email,
            password: hashedPassword,
            codiceFiscale: req.body.codiceFiscale,
            nome: req.body.nome,
            cognome: req.body.cognome,
            sesso: req.body.sesso,
            dataNascita: req.body.dataNascita,
            specializzazione: req.body.specializzazione || null,
            dataInizioServizio: req.body.dataInizioServizio || null
        };
        console.log('useroooo');
        console.log(user);
        // Si registra l'account nella tabella corretta
        let result;
        switch (typeUser) {
            case 'doc':
                result = await addDoc(user);
                break;
            case 'user':
                result = await addUser(user);
                break;
            // In caso la tabella non esista si invia un errore 404 (Perché la route è sbagliata, quindi la pagina non esisterebbe)
            default:
                res.status(404).send();
                return;
        }
        // In caso ci sia invece un errore interno al server (tipo che esista già un account con le stesse credenziali) si invia un errore 500
        ErrorAccount = result[0];
        ErrorPaziente = result[1];
        if (ErrorAccount) {
            res.status(500).send('Esiste già un account con queste credenziali.');
            return;
        }
        if (ErrorPaziente) {
            res.status(500).send('Esiste già una persona con queste credenziali.');
            return;
        }

        // In caso di corretta esecuzione dei passaggi, si invia un codice 200 con allegato l'user registrato.
        console.log('Risposta Inviata');
        res.status(200).send('Aggiunta Riuscita.');
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
});


// Auth

app2.post('/login', Authentication, async (req, res) => {

    console.log('yesyes');
    const codiceFiscale = req.body.codiceFiscale;
    const user = { CF: codiceFiscale, typeUser: req.body.typeUser };
    console.log(user);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    result = await addRefreshTokenToAcc({ codiceFiscale: codiceFiscale, refreshToken: refreshToken });
    console.log('porcoddio');
    console.log(result);
    if (result.length === 0) {
        res.status(500).send();
        return;
    }
    res.json({ accessToken: accessToken, refreshToken: refreshToken, token_type: 'bearer', expiresIn: 120, typeUser: req.body.typeUser });

})

app2.delete('/:typeUser/logout', async (req, res) => {
    const param = (req.params.typeUser).toLowerCase();
    const typeUser = param === 'user' || param === 'doc' ? true : false;

    if (!typeUser) {
        res.status(404).send();
        return;
    }
    await delRefreshToken(req.body.token);
    res.sendStatus(204);
})



app2.post('/token', async (req, res) => {
    const refreshTokens = await getRefreshTokens();
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);

    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        console.log(user);
        const accessToken = generateAccessToken({ CF: user.CF, typeUser: user.typeUser });
        res.json({ accessToken: accessToken });
    });
});

// funzioni di supporto
async function Authentication(req, res, next) {
    // Riconoscimento di chi fa richiesta per l'autenticazione

    if (req.body.email === 'admin@gmail.com' && req.body.password === 'adminadmin') {
        console.log('yes');
        req.body.codiceFiscale = 'admin';
        req.body.typeUser = 'admin';
        next();
        return;
    }

    // Si prende la lista 
    let User;
    if (!!req.body.email === false) {
        res.status(500).send('Didn\' pass the email');
        return;
    }
    const researchString = (req.body.email).toLowerCase();
    console.log(researchString);

    User = await getUserbyEmail(researchString);

    console.log(User);
    if (!!User === false) {
        res.status(400).send('Cannot find the account');
        return;
    }
    try {
        if (!(await bcrypt.compare(req.body.password, User.password))) {
            res.send('Not Allowed')
            return;
        }
    } catch {
        res.status(500).send()
        return;
    }
    console.log('kssk');
    result = await getDoctor(User.codiceFiscale);
    let typeUser = '';
    switch (!!result) {
        case false:
            typeUser = 'user';
            break;

        default:
            typeUser = 'doc';
            break;
    }
    req.body.codiceFiscale = User.codiceFiscale;
    req.body.typeUser = typeUser;
    next();
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '24h' });
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
}

app2.listen(4000, async () => {
    console.log(`Example app listening at http://localhost:4000`);
})