
const mysql = require('mysql')


//Esta es la constante que realicé  para la configuración para el acceso a la base de datos
const  conex =  mysql.createConnection({

  host:'localhost',
  database:'productos_crud',
  user:'root',
  password:'TESTEO12_3',
  
  
});

module.exports=conex;