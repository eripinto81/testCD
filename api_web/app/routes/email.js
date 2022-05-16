module.exports= function(app, con){

	const CONFIG_email= "ssp.fds2019@gmail.com"
	const CONFIG_senha= "@fds2019"
	
	const HOST= "smtp.gmail.com"
	const PORT= 465

	app.post('/verificar_email',function(req, res){
		const sql= 'SELECT * FROM usuario WHERE email = ?';
		con.query(sql, [req.body.email], function (err, result) {
			if(err){
				res.send("500");
				console.log("/verificar_email 500");
			}else if(result.length == 0){
				res.send("404");
				console.log("/verificar_email 404");
			}else{
				res.send("200")
				console.log("/verificar_email 200")
			}
		})
	})

	app.post('/enviar_senha',function(req, res){
		const sql= 'SELECT * FROM usuario WHERE email = ?';
		const filds= [req.body.email]
		con.query(sql, filds, function (err, result) {
			if(err){
				res.send("500");
				console.log("/alterar_senha_usuario 500");
			}else{				
				if(result.length == 0){
					res.send("404")
				}else{
				
					const nodemailer= require('nodemailer');

					const transporter= nodemailer.createTransport({
						host: HOST,
						port: PORT,
						secure: true,
						auth: {
							user: CONFIG_email,
							pass: CONFIG_senha
						},
						tls: { rejectUnauthorized: false }
					})

					/* gerar senha */
					const letras= '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
					const tamanho= 5
					let aleatorio= ''
					let SENHA= ''

					for (var i= 0; i < tamanho; i++) {
						var rnum= Math.floor(Math.random() * letras.length);
						aleatorio+= letras.substring(rnum, rnum + 1);
					}
					
					const crypto= require('crypto');
					SENHA= crypto.createHash('md5').update(aleatorio).digest("hex")

					const mailOptions= {
						from: CONFIG_email,
						to: req.body.email,
						subject: 'Troque sua senha.',
						html: `Sua senha temporária é: <b>${aleatorio}</b>\n`
					}

					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
							console.log(error)
							res.send("500")
						} else {
							const sql_alter= 'UPDATE usuario SET senha= ? WHERE email = ?';
							const filds_alter= [SENHA, req.body.email]
							con.query(sql_alter, filds_alter, function (err, result) {
								if(err){
									res.send("500")
									console.log("/alterar_senha_usuario 500");
								}else{
									console.log('Email enviado: ' + info.response);
									res.send("200")
								}
							})
						}
					})
				}
			}
		})
	})

}
