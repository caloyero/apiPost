const { request, response } = require('express');
var express = require('express');

var mysql = require('mysql');

var api = express();
api.use(express.json());


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bdpost'
});

connection.connect(function(error){
    if (error) {
        throw error;
    }else{
        console.log('exito');
    }
})

api.get('/api/post',(request,response)=>{
    connection.query('SELECT * FROM post', (error,filas)=>{
        if (error) {
            throw error
        }else{
            response.send(filas);
        }
    })
})


api.get('/api/post/:id',(request,response)=>{
    connection.query('SELECT * FROM post WHERE id = ?',[request.params.id], (error,fila)=>{
        if (error) {
            throw error
        }else{
            response.send(fila);
        }
    })
})

api.post('/api/post', (request,response)=>{
    let data ={
        titulo:request.body.titulo,
        contenido:request.body.contenido,
        usuarios_id:request.body.usuarios_id,
    };

    let sql = "INSERT INTO post SET ?";
    connection.query(sql, data, function(error,result)
    {
        if (error) {
            throw error
        }else{
            response.send(result);
        }
    });
});


// usuario

api.get('/api/user/:id',(request,response)=>{
    connection.query('SELECT * FROM usuarios WHERE id = ?',[request.params.id],(error,fila)=>{
        if(error)
        {
            throw error;
        }else{
            response.send(fila);
        }
    })
});

api.get('/api/postFromUserId/:id',(request,response)=>{
    connection.query('SELECT * FROM post WHERE usuarios_id = ?',[request.params.id],(error, fila)=>{
        if(error)
        {
            throw error;
        }else{
            response.send(fila);
        }
    })
})

var port = 3000

api.get('/', function (request, response) {
    response.send('ruta get')
})

api.listen(port, function () {
    console.log('API port: ' + port)
});