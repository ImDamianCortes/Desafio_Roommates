const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const chalk = require("chalk");

const nuevoRoommate = async () => {
    //ya que vamos a hacer una consulta a la Api, por buenas practicas debemos utilizar el try/catch
    try {
        //extrayendo de la espera de axios.get con la direccion de la api
        const { data } = await axios.get("http://randomuser.me/api");

        //modelo que tiene un objeto
        const usuario = data.results[0];

        //creando un objeto con los datos que necesitamos
        const user = {
            id: uuidv4().slice(30),
            nombre: `${usuario.name.first} ${usuario.name.last}`,
            debe: 0,
            recibe: 0,
            totalGastos: 0
        };
        //en caso que se realice de forma correcta retornar el user
        return user;
    } catch (e) {
        console.log(chalk.red(e));
        //throw : Lanza una excepcion definida por el usuario.
        throw e;
    }
}

const guardarRoommate = (roommate) => {
    /*
    const template ={
        "usuarios":[]
    }

    fs.appendFileSync("./db/usuarios.json", `${JSON.stringify(template)}`)
    */

    //leyendo y almacenando el contenido de usuarios.json
    const roommatesJSON = JSON.parse(fs.readFileSync("./db/roommates.json","utf8"))
    //console.log(usuariosJSON);
    //incluyendo como ultimo objeto el usuario
    roommatesJSON.roommates.push(roommate);
    //escribiendo el archivo
    fs.writeFileSync("./db/roommates.json", JSON.stringify(roommatesJSON))
}

//Export de un objeto con 2 metodos
module.exports = { nuevoRoommate, guardarRoommate }; 