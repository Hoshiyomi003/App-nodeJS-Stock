// Aquí creo variables para los requerimientos
const express = require('express');
const mysql = require('mysql');
const conex = require('./Db/Dbcnx.js');
const cors = require('cors');
const dotenv = require('dotenv')

//Validación cuando monte la app a Azure

if (process.env.NODE_ENV == 'production'){
    dotenv.config();
}


var app = express();

app.use(express.json());

//Middlewares
app.use(cors({
    origins: ["http://127.0.0.1:5501", "http://127.0.0.1:5500","https://bicicletas-stocktest1.azurewebsites.net/","https://bicicletas-stocktest1.azurewebsites.net"]
}))


//Probando la conexión
conex.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log("La conexión fue exitosa");
    }
    
});
 




app.get('/', function(require,response){
    response.send("Aquí empieza lo duro");
})

//Esta es la función para una Query que traiga todos los articulos
app.get('/api/productos', (require,response) =>{
    conex.query('SELECT * FROM productos', (err,filas)=>{
        if(err){
            throw err
        } else{
            response.send(filas);
        }

    })

});

//Ahora una para un solo articulo

app.get('/api/productos/:id', (require,response) =>{
    conex.query('SELECT * FROM productos WHERE id =?',[require.params.id], (err,fila)=>{
        if(err){
            throw err
        } else{
           response.send(fila);
          //Con este llamo a un campo en particular, este caso descripción
           //response.send(fila[0].descripción)
        }

    })

});

//Esta es la función para ingresa un nuevo dato
app.post('/api/productos', (require,response) =>{
    let data = {nombre:require.body.nombre, precio:require.body.precio, stock:require.body.stock}
    let sql = "INSERT INTO productos SET ? "
    conex.query(sql,data, function(err,results){
        if(err){
            throw err
        } else{
           response.send(results);
          
        }

        
    });

});

//Función para editar un dato
app.put('/api/productos/:id', (require,response)=>{
    let id = require.params.id;
    let nombre = require.body.nombre;
    let precio = require.body.precio;
    let stock = require.body.stock;
    //Así es la sentencia para actualizar un dato en SQL, con el update
    let sql = "UPDATE productos SET nombre= ?, precio = ?, stock = ? WHERE id= ?"; 
    conex.query(sql,[nombre,precio,stock,id], function(err,results){
        if(err){
            throw err
        }else{
            response.send(results)

        }
        
    });
});

//Ahora para eliminar un dato

app.delete('/api/productos/:id', (require,response)=>{
    conex.query('DELETE FROM productos WHERE id= ?', [require.params.id], function(err,filas){
        if(err){
            throw err
        } else{
            response.send(filas);
        }
    });

});

console.log(process.env)
const puerto = process.env.PUERTO || 3000;

app.listen(puerto, function(){
    console.log("Servidor OK en el puerto:" +puerto);
})
    

