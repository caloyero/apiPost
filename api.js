const { request, response } = require('express');
var express = require('express');

var mysql = require('mysql');

var api = express();

var cors = require('cors')
api.use(express.json());
api.use(cors());


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
    let sql = "UPDATE post SET titulo = ?, contenido = ?, usuarios_id = ? WHERE id = ?";

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
    let sql = "UPDATE post SET likes = ? WHERE id = ?";

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
api.post('/api/user/aunt', (request,response)=>{
    const {email,password} = request.body;
   /*  let email= request.body.email;
    let password = request.body.password; */
    connection.query('SELECT * FROM usuarios WHERE email = ? AND password = ?',[email, password],(error,fila)=>{
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
});

/* comentarios */

api.get('/api/comentarios/:id',(request,response)=>{
    connection.query('SELECT * FROM comentarios WHERE post_id = ?',[request.params.id],(error, fila)=>{
        if(error)
        {
            throw error;
        }else{
            response.send(fila);
        }
    })
});

api.post('api/comen',(request,response)=>{
    let dataComentarios={
        comentario:request.body.comentario,
        post_id:request.body.post_id,
        usuarios_id:request.body.usuarios_id,
    };
    let sqlComentarios = "INSERT INTO comentarios SET ?"
    connection.query(sqlComentarios, dataComentarios, function(error,result)
    {
        if (error) {
            throw error
        }else{
            response.send(result,dataComentarios);
        }
    });

});

/* crear post  */
api.post('/api/comentarios', (request,response)=>{
    let datosComentario ={
        post_id:request.body.post_id,
        comentario:request.body.comentario,
        usuarios_id:request.body.usuarios_id,
    };

    let sql = "INSERT INTO comentarios SET ?";
    connection.query(sql, datosComentario, function(error,result)
    {
        if (error) {
            throw error
        }else{
            response.send(result);
        }
    });
});

/* notificaciones */

api.get('/api/post/notificaciones/:id',(request,response)=>{
    connection.query('SELECT N.tipo,U.nombre,U.apellido,U.foto_de_perfil FROM notificaciones N LEFT JOIN usuarios U ON N.id_usuario = U.id LEFT JOIN post P ON N.id_post = P.id WHERE P.usuarios_id = ?',[request.params.id], (error,fila)=>{
        if (error) {
            throw error
        }else{
            response.send(fila);
        }
    })
})

/* Chat */
api.get('/api/chat/:id',(request,response)=>{
    connection.query('SELECT DISTINCT CH.id, MR.mensaje_receptor, MR.fecha,ME.mensaje_emisor,ME.fecha FROM chat CH LEFT JOIN  mensaje_receptor MR ON CH.id_receptor = MR.id_receptor LEFT JOIN mensaje_emisor ME ON CH.id = ME.id_chat WHERE ME.id_emisor = ?',[request.params.id],(error,chatList)=>{
        if (error){
            throw error
        }else{response.send(chatList)}
    })
})

var port = 4000

api.get('/', function (request, response) {
    response.send('ruta get')
})

api.listen(port, function () {
    console.log('API port: ' + port)
});