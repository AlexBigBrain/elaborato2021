const pool = require('./db');

async function checkDatabase() {
    const [result,] = await pool.query('SELECT * FROM `Medico`;');
    return result;
}

async function getDoctors() {
    try {
        const [result,] = await pool.query('SELECT * FROM `Medico`;');
        return result;
    }
    catch {
        console.log('error');
        return [];
    }
}

async function getDoctor(codiceFiscale) {
    try {
        const [result,] = await pool.query('SELECT * FROM `Medico` INNER JOIN `Persona` ON `Persona`.`codiceFiscale` = `Medico`.`codiceFiscale` WHERE `Medico`.`codiceFiscale` = ?;', [codiceFiscale]);
        return result[0];
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function addDoc(newDoc) {
    ErrorAccount = false;
    ErrorPaziente = false;
    try {
        const [result,] = await pool.execute("INSERT INTO `Persona`(`codiceFiscale`, `nome`, `cognome`, `dataNascita`, `sesso`) " +
            "VALUES (?, ?, ?, ?, ?);", [newDoc.codiceFiscale, newDoc.nome, newDoc.cognome, newDoc.dataNascita, newDoc.sesso]);
    }
    catch (e) {
        ErrorPaziente = true
        console.log(e);
    }
    try {
        console.log(newDoc);
        const [result2,] = await pool.execute("INSERT INTO `Medico`(`codiceFiscale`, `specializzazione`, `dataInizioServizio`) " +
            "VALUES (?, ?, ?);", [newDoc.codiceFiscale, newDoc.specializzazione, newDoc.dataInizioServizio]);
    }
    catch (e) {
        console.log(e);
    }
    try {
        const [result3,] = await pool.execute("INSERT INTO `Account`(`email`, `password`, `Persona_codiceFiscale`) " +
            "VALUES (?, ?, ?);", [newDoc.email, newDoc.password, newDoc.codiceFiscale]);
        return [ErrorAccount, ErrorPaziente];
    } catch (e) {
        ErrorAccount = true;
        console.log(e);
        return [ErrorAccount, ErrorPaziente];
    }
}

async function infoUserByDoc(CF) {
    try {
        const [result,] = await pool.query('SELECT `codiceFiscale`, `nome`, `cognome`, `dataNascita`, `sesso` FROM `Persona` INNER JOIN `Collegamento` ON `Collegamento`.`Persona_CF` = `Persona`.`codiceFiscale` WHERE `Collegamento`.`Medico_CF` = ?;', [CF]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function infoPatUserByDoc(CF) {
    try {
        const [result,] = await pool.query('SELECT `Patologia_nome`, `codiceFiscale`, `nome`, `cognome` FROM (SELECT * FROM `Avere` INNER JOIN `Persona` ON `Persona_CF` = `codiceFiscale`) as PazPat INNER JOIN `Collegamento` ON `Collegamento`.`Persona_CF` = PazPat.`codiceFiscale` WHERE `Collegamento`.`Medico_CF` = ? ORDER BY `codiceFiscale`;', [CF]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function visiteByDoc(CF) {
    try {
        const [result,] = await pool.query('SELECT Persona_CF, nome, cognome, dataVisita  FROM (SELECT * FROM `Persona` INNER JOIN `Collegamento` ON `codiceFiscale` = `Persona_CF`) as per INNER JOIN `Visitare` ON per.`id` = `Collegamento_id` WHERE `Medico_CF` = ?;', [CF]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function getFarmaci() {
    try {
        const [result,] = await pool.query('SELECT * FROM `Farmaco`;');
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function getPrescrizioni(CF) {
    try {
        const [result,] = await pool.query('SELECT `nome`, `cognome`, `Medico_CF`, `Persona_CF`, `FarmPres`.`id`, `dataPrescrizione`, NomeFarmaco FROM (SELECT `nome`, `cognome`, `Medico_CF`, `Persona_CF`, `id` FROM `Persona` INNER JOIN `Collegamento` ON `codiceFiscale` = `Persona_CF`) as infoPaz INNER JOIN (SELECT Farmaco.id as FarmacoID, `Prescrizione`.`id`, dataPrescrizione, Collegamento_id, `Farmaco`.`nome` as NomeFarmaco FROM `Prescrizione` INNER JOIN `Farmaco` ON `Farmaco`.`id` = `Farmaco_id`) as FarmPres ON `FarmPres`.`Collegamento_id` = `infoPaz`.`id` WHERE `Medico_CF` = ?;',[CF]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function getPatologie() {
    try {
        const [result,] = await pool.query('SELECT * FROM `Patologia`;');
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function addPrescrizione(Farmaco_ID, Coll_ID) {
    try {
        const [result,] = await pool.execute('INSERT INTO `dbAlexCusto`.`Prescrizione` (`Farmaco_id`, `Collegamento_id`) VALUES(?, ?);', [Farmaco_ID, Coll_ID]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function addPatologiaToPaz(Patologia_nome, Paziente_CF) {
    try {
        const [result,] = await pool.execute('INSERT INTO `dbAlexCusto`.`Avere` (`Patologia_nome`, `Persona_CF`) VALUES (?, ?);', [Patologia_nome, Paziente_CF]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function addPatologia(nomePatologia, esenzionePatologia, isAsmaticaPatologia) {
    try {
        console.log(nomePatologia);
        console.log(esenzionePatologia);
        console.log(isAsmaticaPatologia);
        const [result,] = await pool.execute('INSERT INTO `dbAlexCusto`.`Patologia` (`nome`, `esenzione`, `isAsmatica`) VALUES (?, ?, ?);', [nomePatologia, esenzionePatologia, isAsmaticaPatologia]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function addFarmaco(nomeFarmaco) {
    try {
        console.log(nomeFarmaco);
        const [result,] = await pool.execute('INSERT INTO `dbAlexCusto`.`Farmaco` (`nome`) VALUES (?);', [nomeFarmaco]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}








async function getUsers() {
    try {
        const [result,] = await pool.query('SELECT * FROM `Persona`;');
        return result;
    }
    catch {
        console.log('error');
        return [];
    }
}

async function getUser(CF) {
    try {
        const [result,] = await pool.query('SELECT * FROM `Persona` WHERE `codiceFiscale` = ?;', [CF]);
        return result[0];
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function infoDocbyUser(CF) {
    try {
        const [result,] = await pool.query('SELECT  subQuery.codiceFiscale, subQuery.nome, subQuery.cognome, subQuery.sesso, subQuery.dataNascita, subQuery.dataInizioServizio, subQuery.specializzazione FROM `Persona` INNER JOIN (SELECT * FROM `Collegamento` INNER JOIN (SELECT `Medico`.`codiceFiscale`, `Medico`.`specializzazione`, `Medico`.`dataInizioServizio`, `Persona`.`nome`, `Persona`.`cognome`, `Persona`.`sesso`, `Persona`.`dataNascita` FROM `Medico` INNER JOIN `Persona` ON `Medico`.`codiceFiscale` = `Persona`.`codiceFiscale`) as infoMed ON `Collegamento`.`Medico_CF` = infoMed.`codiceFiscale`) as subQuery ON `Persona`.`codiceFiscale` = subQuery.Persona_CF  WHERE `Persona`.`codiceFiscale` = ?;', [CF]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function farmacibyUser(CF) {
    try {
        const [result,] = await pool.query('SELECT `Medico_CF`, doc.nome as nomeDottore, doc.cognome as cognomeDottore,  infoFarmaco.`nome` as nomeFarmaco, `dataPrescrizione` FROM (SELECT * FROM `Collegamento` INNER JOIN infoDoc ON Medico_CF = codiceFiscale) as doc INNER JOIN (SELECT `Farmaco`.`nome`, `Prescrizione`.`Collegamento_id`, `Prescrizione`.`dataPrescrizione`, `Prescrizione`.`Farmaco_id`, `Prescrizione`.`id` FROM `Prescrizione` INNER JOIN `Farmaco` ON `Prescrizione`.`Farmaco_id` = `Farmaco`.`id`) as infoFarmaco ON doc.`id` = infoFarmaco.`Collegamento_id` WHERE `Persona_CF` = ?;', [CF]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function patologieUser(CF) {
    try {
        const [result,] = await pool.query('SELECT * FROM `Avere` INNER JOIN `Patologia` ON `Patologia_nome` = `nome` WHERE `Persona_CF` = ?;', [CF]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function visiteByUser(CF) {
    try {
        const [result,] = await pool.query('SELECT Medico_CF, nome, cognome, dataVisita, specializzazione  FROM (SELECT * FROM infoDoc INNER JOIN `Collegamento` ON `codiceFiscale` = `Medico_CF`) as doc INNER JOIN `Visitare` ON doc.`id` = `Collegamento_id` WHERE `Persona_CF` = ?;', [CF]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function specializzazioniDoctors() {
    try {
        const [result,] = await pool.query('SELECT DISTINCT `specializzazione` FROM `Medico`;');
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function getDocBySpecializzazione(specializzazione) {
    try {
        const [result,] = await pool.query('SELECT DISTINCT `codiceFiscale` FROM `Medico` WHERE `specializzazione` = ?;',[specializzazione]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function getCollegamento(Persona_CF, Medico_CF) {
    try {
        const [result,] = await pool.query('SELECT * FROM `Collegamento` WHERE `Persona_CF` = ? and `Medico_CF` = ?;',[Persona_CF, Medico_CF]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}


async function newCollegamento(Persona_CF, Medico_CF) {
    try {
        const [result,] = await pool.execute('INSERT INTO `dbAlexCusto`.`Collegamento` (`Persona_CF`, `Medico_CF`) VALUES (?, ?);', [Persona_CF, Medico_CF]);
        return await getCollegamento(Persona_CF, Medico_CF);
    }
    catch(e) {
        console.log(e);
        return [];
    }
}

async function newVisita(orarioEdataVisita, idCollegamento) {
    console.log(orarioEdataVisita);
    console.log(idCollegamento);
    try {
        const [result,] = await pool.execute('INSERT INTO `dbAlexCusto`.`Visitare` (`dataVisita`, `Collegamento_id`) VALUES (?, ?);', [orarioEdataVisita, idCollegamento]);
        return result;
    }
    catch(e) {
        console.log(e);
        return [];
    }
}








async function getUserbyEmail(email) {
    console.log('so qua');
    console.log(email);
    try {
        const [result,] = await pool.query('SELECT `Persona_codiceFiscale` as codiceFiscale, `RefreshToken_token` as refreshToken, `password`, `email` FROM `Account` WHERE `email` = ?;', [email]);
        return result[0];
    }
    catch (e) {
        console.log(e);
        return [];
    }
}

async function addUser(newUser) {
    ErrorAccount = false;
    ErrorPaziente = false;
    try {
        const [result,] = await pool.execute("INSERT INTO `Persona`(`codiceFiscale`, `nome`, `cognome`, `dataNascita`, `sesso`) " +
            "VALUES (?, ?, ?, ?, ?);", [newUser.codiceFiscale, newUser.nome, newUser.cognome, newUser.dataNascita, newUser.sesso]);

    }
    catch (e) {
        ErrorPaziente = true
        console.log(e);

    }
    try {
        const [result2,] = await pool.execute("INSERT INTO `Account`(`email`, `password`, `Persona_codiceFiscale`) " +
            "VALUES (?, ?, ?);", [newUser.email, newUser.password, newUser.codiceFiscale]);
        return [ErrorAccount, ErrorPaziente];
    } catch (e) {
        ErrorAccount = true;
        console.log(e);
        return [ErrorAccount, ErrorPaziente];
    }
}

async function addRefreshTokenToAcc(user) {
    try {
        console.log(user);

        const [result,] = await pool.execute("UPDATE `Account` " +
            "SET `RefreshToken_token` = ? " +
            "WHERE `Persona_codiceFiscale` = ?;", [user.refreshToken, user.codiceFiscale]);
        return [result];
    }
    catch (e) {
        console.log(e);
        return [];
    }
}

async function getRefreshTokens() {
    try {
        const [result,] = await pool.query("SELECT `token` FROM `RefreshToken`;");
        return await result.map(res => res.token);
    }
    catch (e) {
        console.log(e);
        return [];
    }
}

async function delRefreshToken(token) {
    try {
        const [result,] = await pool.query("DELETE FROM `RefreshToken` WHERE `token` = ?;", [token]);
        return result;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}

async function getElencoPatologieforEveryMedico() {
    try {
        const [result,] = await pool.query("SELECT  `codiceFiscale`,`nome`, `cognome`, `Patologia_nome` as Patologie FROM `Avere` INNER JOIN (SELECT * FROM `Collegamento` INNER JOIN `Persona` ON `codiceFiscale` = `Collegamento`.`Medico_CF`) as MedicoInfo ON `Avere`.`Persona_CF` = MedicoInfo.`Persona_CF` ORDER BY `Medico_CF`;");
        return result;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}

async function FarmaciMaggiormenteRichiesti() {
    try {
        const [result,] = await pool.query("SELECT `nome`, COUNT(*) AS NumeroRichiesta FROM `Prescrizione` INNER JOIN `Farmaco` ON `Farmaco`.`id` = `Farmaco_id` GROUP BY `Farmaco_id` ORDER BY NumeroRichiesta DESC;");
        return result;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}

async function NumeroPersoneConEsenzione() {
    try {
        const [result,] = await pool.query("SELECT COUNT(PersoneConMalattie) as NumeroPersoneConEsenzione FROM (SELECT count(*) as PersoneConMalattie FROM `Avere` INNER JOIN `Patologia` ON `nome` = `Patologia_nome` GROUP BY `Persona_CF`) as Persone;");
        return result[0];
    }
    catch (e) {
        console.log(e);
        return [];
    }
}


module.exports = {
    getElencoPatologieforEveryMedico,
    FarmaciMaggiormenteRichiesti,
    NumeroPersoneConEsenzione,
    getDoctors,
    getDoctor,
    addDoc,
    infoUserByDoc,
    getUserbyEmail,
    getUsers,
    getUser,
    infoDocbyUser,
    infoPatUserByDoc,
    visiteByDoc,
    getFarmaci,
    addPrescrizione,
    addPatologiaToPaz,
    addPatologia,
    addFarmaco,
    getPrescrizioni,
    getPatologie,

    
    farmacibyUser,
    patologieUser,
    visiteByUser,
    specializzazioniDoctors,
    getDocBySpecializzazione,
    getCollegamento,
    newCollegamento,
    newVisita,
    addUser,
    checkDatabase,
    addRefreshTokenToAcc,
    getRefreshTokens,
    delRefreshToken
};