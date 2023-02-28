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
/* listar foto de perfil y nombre de usuario */
api.get('/api/users/chat/:id',(request,response)=>{
    
    connection.query('SELECT usuarios.nombre,usuarios.foto_de_perfil FROM usuarios WHERE usuarios.id= ?',[request.params.id],(error,fila)=>{
        if(error)
        {
            throw error;
        }else{
            response.send(fila);
        }
    })
});
/* listar usuarios */

api.get('/api/user/',(request,response)=>{
    connection.query('SELECT US.id,US.nombre,US.apellido,US.foto_de_perfil FROM usuarios US',[request.params.id],(error,fila)=>{
        if (error) {
            throw error
        }else{response.send(fila)}
    })
})

api.get('/api/users/:id',(request,response)=>{
    connection.query('SELECT usuarios.nombre,usuarios.foto_de_perfil FROM usuarios WHERE usuarios.id= ?',[request.request.id],(error,fila)=>{
        if(error)
        {
            throw error
        }else{
            response.send(fila)
        }
    })
})
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
/* listar chat emisor */
api.get('/api/chat/listems/:id', (request, response)=>{
    connection.query('SELECT CH.id,CH.id_emisor,CH.id_receptor,US.nombre,US.foto_de_perfil FROM chat CH LEFT JOIN usuarios US ON CH.id_receptor = US.id WHERE CH.id_emisor = ?',[request.params.id],(error,result)=>{
        if (error) {
            throw error
        }else{
            response.send(result)
        }
    })
})
/* listar chat receptor */
api.get('/api/chat/listrep/:id', (request, response)=>{
    connection.query('SELECT CH.id,CH.id_emisor,CH.id_receptor,CH.mensaje_emisor,US.nombre,US.foto_de_perfil FROM chat CH LEFT JOIN usuarios US ON CH.id_receptor = US.id WHERE CH.id_receptor = ?',[request.params.id],(error,result)=>{
        if (error) {
            throw error
        }else{
            response.send(result)
        }
    })
})

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
    connection.query('SELECT * FROM mensaje_emisor UNION SELECT* FROM mensaje_receptor WHERE mensaje_receptor.id_chat = ?',[request.params.id],(error,chatList)=>{
        if (error){
            throw error
        }else{response.send(chatList)}
    })
})

/* crear chat */
api.post('/api/chat/enviar',(request,response)=>{
    let chat ={
        id_emisor : request.body.id_emisor,
        id_receptor : request.body.id_receptor,
        mensaje_emisor : request.body.mensaje_emisor,
    };
    let sql = 'INSERT INTO chat SET ?';
    connection.query(sql,chat,function(error,result){
 
        if(error)
        {
            throw error
        }else{
            response.send(result);
        }
    })
})

/* MENSAJES_EMISOR */
api.get('/api/messages/emisor/:id',(request,response) =>{
    connection.query('SELECT ME.mensaje_emisor,ME.fecha FROM chat CH LEFT JOIN mensaje_emisor ME ON CH.id = ME.id_chat WHERE CH.id = ?',[request.params.id],(error,result) =>{
        if(error)
        {
            throw error
        }else{
           response.send(result)
        }
    })
})

var port = 4000

api.get('/', function (request, response) {
    response.send('ruta get')
})

api.listen(port, function () {
    console.log('API port: ' + port)
});