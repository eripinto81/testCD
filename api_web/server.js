const app= require('./config/express')()

const PORT= process.env.PORT || 8081

const session= require('express-session');
const MySQLStore= require('express-mysql-session')(session)

// const config_database= {
//   host: "localhost",
//   port: "3306",
//   user: "root",
//   password: "",
//   database: "monitoramento"
// }

const config_database= {
  host: "localhost",
  port: "3306",
  user: "ssp",
  password: "@SSP2019ra",
  database: "monitoramento"
}

const con= new MySQLStore(config_database)
 
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: con,
    resave: false,
    saveUninitialized: false
}))

// CONFIGURAR ROTAS
const anexo= require('./app/routes/anexo')(app, con)
const camera= require('./app/routes/camera')(app, con)
const email= require('./app/routes/email')(app, con)
const historico= require('./app/routes/historico')(app, con)
const livro_ocorrencia= require('./app/routes/livro_ocorrencia')(app, con)
const login= require('./app/routes/login')(app, con)
const map= require('./app/routes/map')(app, con)
const monitoramento= require('./app/routes/monitoramento')(app, con)
const porta= require('./app/routes/porta')(app, con)
const setor= require('./app/routes/setor')(app, con)
const usuario= require('./app/routes/usuario')(app, con)


/*
HTTPS
*/

// const fs= require('fs');
// const https= require('https');
// const privateKey= fs.readFileSync('/etc/letsencrypt/live/www.segurancaam.com.br/privkey.pem', 'utf8');
// const certificate= fs.readFileSync('/etc/letsencrypt/live/www.segurancaam.com.br/fullchain.pem', 'utf8');
// const credentials= {key: privateKey, cert: certificate};
// const httpsServer= https.createServer(credentials, app);
// const io= require('socket.io')(httpsServer);

// const registro= require('./app/routes/registro')(app, con, io)
// const localizacao= require('./app/routes/localizacao')(app, con, io)

// io.on('connection', socket=> {

//   socket.on('registroPessoa', id=> {
//     io.emit('emitRegistroPessoa', {})
//   })
  
// })

// httpsServer.listen(PORT, function(){
// 	console.log('server running https...');
// })


/*
HTTP
*/

const http= require('http').Server(app)
const io= require('socket.io')(http)

const registro= require('./app/routes/registro')(app, con, io)
const localizacao= require('./app/routes/localizacao')(app, con, io)

io.on('connection', socket=> {

  socket.on('registroPessoa', id=> {
    io.emit('emitRegistroPessoa', {})
  })
  
})

http.listen(PORT, function(){
	console.log('server running http...')
})