const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const chalk = require("chalk");

const nuevoGasto = (nGasto) => {
    //definir id para el nuevo gasto
    const nGastoId = uuidv4().slice(32);
    //plantilla para el nuevo gasto
    const gasto = {
        id: nGastoId,
        roommate: nGasto.roommate,
        descripcion: nGasto.descripcion,
        monto: nGasto.monto,
    }
    console.log(gasto);
    //leyendo y almacenando el contenido de gastos.json
    const gastosJSON = JSON.parse(fs.readFileSync("./db/gastos.json","utf8"))
    //console.log(gastosJSON);
    //incluyendo como ultimo objeto el gasto
    gastosJSON.gastos.push(gasto);
    //escribiendo el archivo6
    fs.writeFileSync("./db/gastos.json", JSON.stringify(gastosJSON))
}

const editarGasto = (gastoId, eGasto) => {
    //console.log(gastoId);
    //console.log(nuevoGasto);
    const gastosJSON = JSON.parse(fs.readFileSync("./db/gastos.json","utf8"))

    gastosJSON.gastos.forEach((gasto, i) => {
        if (gasto.id == gastoId) {
            gastosJSON.gastos[i].roommate = eGasto.roommate;
            gastosJSON.gastos[i].descripcion = eGasto.descripcion;
            gastosJSON.gastos[i].monto = eGasto.monto;
        }
    })
    fs.writeFileSync("./db/gastos.json", JSON.stringify(gastosJSON))

}

const eliminarGasto = (gastoId) => {
    const gastosJSON = JSON.parse(fs.readFileSync("./db/gastos.json","utf8"))

    gastosJSON.gastos.forEach((gasto, i) => {
        if (gasto.id == gastoId) {
            gastosJSON.gastos.splice(i, 1);
        }
    })
    fs.writeFileSync("./db/gastos.json", JSON.stringify(gastosJSON))
}

updateGastos = () => {
    const gastosJSON = JSON.parse(fs.readFileSync("./db/gastos.json","utf8"))

    let total = 0;

    gastosJSON.gastos.forEach((gasto, i) => {
        gastosJSON.gastos[i].monto = gasto.monto + 1;
    })
    fs.writeFileSync("./db/gastos.json", JSON.stringify(gastosJSON))
}


//Export de un objeto con 2 metodos
module.exports = { nuevoGasto, editarGasto, eliminarGasto }; 