// servidor para el puerto que se usa, expone localmente
const express=require("express")
const app = express();
const mysql = require('mysql');

// conexion a la base de datos

    const db = mysql.createConnection({
        host:'database-prueba.cbfqmyaafoch.us-east-1.rds.amazonaws.com',
        port:'3306',
        user:'admin',
        password: 'Nub3$S1rl3y',
        database: 'Prueba'
    });

db.connect((error)=>{ 
    if (error) {
        console.log(error.message)
        return
    }
    console.log('Base de datos conectada')
}) 
// consumir la api
const fetch = require("node-fetch");


var paises;
var arrayDensidadDemografica=[];

// llamado al api de paises con respuesta y se convierte al json
fetch("https://restcountries.com/v3.1/all")
    .then((respuesta) => {
        return respuesta.json()
    }).then((respuesta) => {
        paises = respuesta;
    })

// mi api
app.get('/densidad',(req,res) => {

    crearLog();
    paises.forEach(element => {
        let  densidadDemografica = element.population /element.area 
        arrayDensidadDemografica.push(densidadDemografica);
    });

    ordenarArray(arrayDensidadDemografica)
    arrayDensidadDemografica.reverse()
    
    let arrayDensidadDemograficaNuevo = arrayDensidadDemografica.slice(0,5)

    res.json({
        ok:true,
        mensaje:'Datos de los paises con mayor densidad demográfica',
        paises:arrayDensidadDemograficaNuevo
    })

    arrayDensidadDemografica = []
});
function crearLog(){

    let descripcion = "ok";
    let fechaActual = new Date();
    let query= "INSERT INTO log ( descripcion, hora ) values ?";
    let values = [
        [descripcion,fechaActual]
    ]
    db.query(query, [values], function(error, resultado, archivo){
        if (error) throw error
        console.log(resultado)
    })
}

function ordenarArray(arrayOrdenado){
    arrayOrdenado.sort(function(a, b) {
        return a - b;
    });
}


// levanta el servidor
app.listen( 4000, () =>{
    console.log('Servidor corriendo en puerto ' + 4000);
});