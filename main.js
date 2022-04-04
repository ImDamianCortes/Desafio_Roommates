//Importar librerias
const http = require('http');
const fs = require('fs');
const url = require('url');
const { nuevoRoommate, guardarRoommate } = require('./assets/js/usuarios');
const { nuevoGasto, editarGasto, eliminarGasto } = require('./assets/js/gastos');
const chalk = require('chalk');

const port = process.env.PORT || 3000;
const hostname = "localhost";

const actualizar = () => {
    //Obteniendo data de roommates y gastos
    const gastosJSON = JSON.parse(fs.readFileSync("./db/gastos.json", "utf8"))
    const roommatesJson = JSON.parse(fs.readFileSync("./db/roommates.json", "utf8"));
    //definiendo total de gastos
    let total = 0;
    //recorrioendo los gastos para sumar el total 
    gastosJSON.gastos.forEach((gasto, i) => {
        total = total + gasto.monto;
        if(gasto.monto > 0){
            //console.log(gasto.roommate);
            roommatesJson.roommates.find(roommate => {
                //console.log(roommate.nombre)
                //Pendiente
                if(roommate.nombre == gasto.roommate){
                    console.log(roommate.nombre)
                    console.log(roommate.totalGastos)
                    roommate.totalGastos = roommate.totalGastos + gasto.monto;
                    console.log(roommate.totalGastos)
                }
                
            })
        }

    })
    //definiendo promedio de gastos por roommate
    let promGastos = total / roommatesJson.roommates.length;
}


//Crear servidor
http.createServer(function (req, res) {




    //Obtener la url
    var path = url.parse(req.url).pathname;
    console.log(chalk.yellow(path));




    //Disponibilizando html
    if (req.url == "/") {
        fs.readFile('./index.html', 'utf8', function (err, data) {
            if (err) {
                console.error(err);
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data)
            }
        });
    }

    //almacenando usuario/roommate
    if (req.url.startsWith("/roommate") && req.method == "POST") {
        //ejecutando nuevoUsuario
        //con .then especifico que dentro se recibira al usuario
        //en caso que salga bien user/usuario
        nuevoRoommate().then(async (roommate) => {
            guardarRoommate(roommate)
            res.end(JSON.stringify(roommate))
        }).catch(e => {
            res.statusCode = 500;
            res.end();
            console.log("Error en el registro de un usuario random", e)
        })
    }

    //Devolviendo los roommates almacenados
    if (req.url.startsWith("/roommates") && req.method == "GET") {
        res.setHeader("Contect-Type", "application/json")
        res.end(fs.readFileSync("./db/roommates.json", "utf8"))
    }

    //Devolviendo el historial de gastos registrados
    if (req.url.startsWith("/gastos") && req.method == "GET") {
        res.setHeader("Contect-Type", "application/json")
        actualizar();
        res.end(fs.readFileSync("./db/gastos.json", "utf8"));
    }
    //agrgando un nuevo gasto
    if (req.url.startsWith("/gasto") && req.method == "POST") {
        let body = "";
        req.on("data", (payload) => {
            body = payload.toString()
            //console.log(body) //para ver el cuerpo del post obtengo como string
        })
        req.on("end", () => {
            const nGasto = JSON.parse(body)
            //console.log(nuevoGasto) //para ver el cuerpo del post obtengo como objeto
            //console.log(nGasto.roommate)
            //console.log(nGasto.descripcion)
            //console.log(nGasto.monto)
            nuevoGasto(nGasto)
            res.end(JSON.stringify(nGasto))
        })
    }
    //Editando un gasto
    if (req.url.startsWith("/gasto") && req.method == "PUT") {
        let body = "";
        req.on("data", (payload) => {
            body = JSON.parse(payload)
            //console.log(body) //para ver el cuerpo del post obtengo como string
        })
        req.on("end", () => {
            //console.log(req.url.slice(10))
            editarGasto(req.url.slice(10), body)
            res.end(JSON.stringify(body))
        })

    }
    //elimiando un gasto
    if (req.url.startsWith("/gasto") && req.method == "DELETE") {
        let body = "";
        req.on("data", (payload) => {
            body = JSON.parse(payload)
            //console.log(body) //para ver el cuerpo del post obtengo como string
        })
        req.on("end", () => {
            //console.log(req.url.slice(10))
            eliminarGasto(req.url.slice(10), body)
            res.end(JSON.stringify(body))
        })

    }


}).listen(`${port}`, hostname, () => {
    console.log(`Servidor corriendo en http://${hostname}:${port}`);
});