module.exports= function(app, con){

	app.post('/cadastrar_usuario',function(req, res){		
		const sql= 'INSERT INTO usuario (nome_usuario, cpf_usuario, matricula, contato, fk_id_unidade, email, senha) VALUES (?, ?, ?, ?, ?, ?, ?)';
		con.query(sql, [req.body.nome_usuario, req.body.cpf_usuario, req.body.matricula, req.body.contato, req.body.fk_id_unidade, req.body.email, req.body.senha], function (err, result) {
			if(err){
				res.send("500");
				console.log("/cadastrar_usuario 500");
			}else{
				res.send("201");
				console.log("/cadastrar_usuario 201");
			}
		})
	})

	app.post('/obter_usuario',function(req, res){	
		const sql= 'SELECT * FROM usuario WHERE id_usuario = ?';
		const filds= [req.body.id]
		con.query(sql, filds, function (err, result) {
			if(err){
				res.send(["500", []]);
				console.log("/obter_usuario 500");
			}else{
				res.send(["200", result]);
				console.log("/obter_usuario 200");
			}
		})
	})

	app.get('/listar_usuario',function(req, res){
		const sql= 'SELECT * FROM usuario AS u ORDER BY u.id_usuario DESC';
		con.query(sql, [], function (err, result) {
			if(err){
				res.send(["500", []]);
				console.log("/listar_usuario 500");
			}else{
				res.send(["200", result]);
				console.log("/listar_usuario 200");
			}
		})
	})

	app.post('/buscar_usuario',function(req, res){
		let sql= "SELECT * FROM usuario AS u WHERE"
		sql= sql + " 1 = 1"

		const nome_busca= req.body.nome_busca
		if(nome_busca != "" && nome_busca != null){
			sql= sql + ` AND u.nome_usuario like '%${nome_busca}%'`			 
		}

		const matricula= req.body.matricula
		if(matricula != "" && matricula != null){
			sql= sql + ` AND u.matricula like '%${matricula}%'`			 
		}
		
		con.query(sql, [], function (err, result) {
			if(err){				
				res.send(["500", []]);
				console.log("/buscar_usuario 500");
			}else{
				res.send(["200", result]);
				console.log("/buscar_usuario 200");
			}
		})
	})

	app.post('/alterar_usuario',function(req, res){	
		const sql= 'UPDATE usuario SET contato= ? WHERE id_usuario = ?';
		const filds= [req.body.telefone, req.body.id]
		con.query(sql, filds, function (err, result) {
			if(err){
				res.send("500");
				console.log("/alterar_usuario 500");
			}else{
				res.send("200");
				console.log("/alterar_usuario 200");
			}
		})
	})

	app.post('/alterar_senha',function(req, res){	
		const sql= 'UPDATE usuario SET senha= ? WHERE id_usuario = ?';
		const filds= [req.body.senha, req.body.id]		
		con.query(sql, filds, function (err, result) {
			if(err){
				res.send("500");
				console.log("/alterar_senha 500");
			}else{
				res.send("200");
				console.log("/alterar_senha 200");
			}
		})
	})

	app.get('/listar_unidade',function(req, res){
		const sql= 'SELECT * FROM unidade';
		con.query(sql, [], function (err, result) {
			if(err){
				res.send(["500", []]);
				console.log("/listar_unidade 500");
			}else{
				res.send(["200", result]);
				console.log("/listar_unidade 200");
			}
		})
	})

}
