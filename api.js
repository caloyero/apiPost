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

/* posts */

/* listar post */
api.get('/api/post',(request,response)=>{
    connection.query('SELECT * FROM usuarios us,post ps WHERE us.id = ps.usuarios_id', (error,filas)=>{
        if (error) {
            throw error
        }else{
            response.send(filas);
        }
    })
})

/* listar post por id */
api.get('/api/post/perfil/:id',(request,response)=>{
    connection.query('SELECT ps.id,ps.titulo,ps.contenido,ps.usuarios_id,ps.likes,ps.imagen,us.foto_de_perfil,us.nombre FROM usuarios us,post ps WHERE ps.usuarios_id = us.id and us.id = ?',[request.params.id], (error,fila)=>{
        if (error) {
            throw error
        }else{
            response.send(fila);
        }
    })
})

/* crear post  */
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

/* actuaslizar post */

api.put('/api/post/:id',(request,response)=>{
    let id = request.params.id;
    let titulo = request.body.titulo;
    let contenido = request.body.contenido;
    let usuarios_id = request.body.usuarios_id;
    let sql = "UPDATE posT SET titulo = ?, contenido = ?, usuarios_id = ? WHERE id = ?";

    connection.query(sql, [titulo, contenido, usuarios_id, id], function(error, result)
    {
         if (error) {
            throw error
        } else{
            response.send(result);
        }
    });
    
});

/* dar likes */

api.put('/api/post/likes/:id',(request,response)=>{
    let id = request.params.id;
    let likes = request.body.likes;
    let sql = "UPDATE posT SET likes = ? WHERE id = ?";

    connection.query(sql, [likes, id], function(error, result)
    {
         if (error) {
            throw error
        } else{
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
// foto de  perfil
api.get('/api/userPerfil/:id',(request,response)=>{
    connection.query('SELECT foto_de_perfil FROM usuarios WHERE id = ?',[request.params.id],(error,fila)=>{
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

/* comentarios */

api.get('/api/comentariosFromPostId/:id',(request,response)=>{
    connection.query('SELECT * FROM comentarios WHERE post_id = ?',[request.params.id],(error, fila)=>{
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