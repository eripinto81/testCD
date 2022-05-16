module.exports= function(app, con, io){

	app.post('/registrar_localizacao',function(req, res){		
		const sql= 'INSERT INTO registro_localizacao (id_usuario, lat, lon, data) VALUES (?, ?, ?, ?)';
		con.query(sql, [req.body.id_usuario, req.body.lat, req.body.lon, req.body.data], function (err, result) {
			if(err){												
				res.send("500");				
				console.log("/registrar_localizacao 500");
			}else{
				res.send(["200", result.insertId]);
				console.log("/registrar_localizacao 200");
				io.emit('emitNovoRegistroLocalizacao', {});
			}
		})
	})

	app.get('/listar_localizacao',function(req, res){		
		const sql= 'SELECT * FROM registro_localizacao AS rl LEFT JOIN usuario AS u ON u.id_usuario = rl.id_usuario';
		con.query(sql, [], function (err, result) {
			if(err){												
				res.send("500");				
				console.log("/listar_localizacao 500");
			}else{
				res.send(["200", result]);
				console.log("/listar_localizacao 200");
			}
		})
	})

	app.post('/localizacao_usuario',function(req, res){	
		let data_atual= new Date()
		dia= data_atual.getDate()
		if(dia < 10){
			dia= '0'+dia
		}
		mes= data_atual.getMonth()+1
		if(mes < 10){
			mes= '0'+mes
		}
		data_atual= data_atual.getFullYear()+'-'+mes+'-'+dia
		
		const sql= `SELECT * FROM registro_localizacao AS rl LEFT JOIN usuario AS u ON u.id_usuario = rl.id_usuario WHERE u.id_usuario = ? AND date_format(rl.data, '%Y-%m-%d') = '${data_atual}' ORDER BY rl.data DESC`;
		con.query(sql, [req.body.id_usuario], function (err, result) {
			if(err){												
				res.send("500");				
				console.log("/localizacao_usuario 500");
			}else{
				res.send(["200", result]);
				console.log("/localizacao_usuario 200");
			}
		})
	})

	app.post('/busca_localizacao',function(req, res){
		let sql= "SELECT * FROM registro_localizacao AS rl LEFT JOIN usuario AS u ON u.id_usuario = rl.id_usuario"
		sql= sql + " WHERE"
		sql= sql + " 1 = 1"

		const data= req.body.data
		if(data != "" && data != null){
			sql= sql + ` AND date_format(rl.data, '%Y-%m-%d') = '${data}'`			 
		}
		const nome= req.body.nome
		if(nome != "" && nome != null){
			sql= sql + ` AND u.nome_usuario like '%${nome}%'`			 
		}

		sql= sql + " ORDER BY rl.data DESC"

		con.query(sql, [], function (err, result) {
			if(err){				
				res.send(["500", []]);
				console.log("/busca_localizacao 500");
			}else{
				res.send(["200", result]);
				console.log("/busca_localizacao 200");
			}
		})
	})

}
