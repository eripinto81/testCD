module.exports= function(app, con, io){

	app.post('/registrar_pessoa',function(req, res){		
		const sql= 'INSERT INTO registro_pessoa (cpf_pessoa, nome_pessoa, data_nascimento, fk_id_situacao) VALUES (?, ?, ?, ?)';
		con.query(sql, [req.body.cpf_pessoa, req.body.nome_pessoa, req.body.data_nascimento, req.body.fk_id_situacao], function (err, result) {
			if(err){
				res.send("500");				
				console.log("/registrar_pessoa 500");
			}else{
				res.send(["201", result.insertId]);
				console.log("/registrar_pessoa 201");
			}
		})
	})

	app.get('/listar_registro',function(req, res){
		const sql= 'SELECT rp.*, hr.data_entrada, hr.data_saida, hr.observacao, s.nome_situacao AS situacao, a.nome_arquivo, hr.id AS id_historico, st.nome_setor FROM historico_registro AS hr LEFT JOIN registro_pessoa AS rp ON rp.id_pessoa=hr.id_pessoa LEFT JOIN anexo AS a ON a.id_pessoa=rp.id_pessoa LEFT JOIN situacao AS s ON s.id=rp.fk_id_situacao LEFT JOIN setor AS st ON st.id=hr.id_setor GROUP BY hr.id ORDER BY hr.data_entrada DESC';
		con.query(sql, [], function (err, result) {			
			if(err){
				res.send(["500", []]);
				console.log("/listar_registro 500");
			}else{
				res.send(["200", result]);
				console.log("/listar_registro 200");
			}
		})
    })

	app.post('/atualizar_saida_pessoa',function(req, res){		
		const sql= 'UPDATE historico_registro SET data_saida= ? WHERE id_pessoa = ?';
		con.query(sql, [req.body.data_saida, req.body.id_pessoa], function (err, result) {
			if(err){
				res.send("500");				
				console.log("/atualizar_saida_pessoa 500");
			}else{
				res.send("200");
				console.log("/atualizar_saida_pessoa 200");
			}
		})
	})

	app.post('/bloquear',function(req, res){		
		const sql= 'UPDATE registro_pessoa SET fk_id_situacao= ? WHERE id_pessoa = ?';
		con.query(sql, [req.body.situacao, req.body.id_pessoa], function (err, result) {
			if(err){
				res.send("500");				
				console.log("/bloquear 500");
			}else{
				res.send("200");
				console.log("/bloquear 200");
			}
		})
	})

	app.post('/buscar_cpf',function(req, res){
		const sql= 'SELECT rp.*, hr.data_entrada, hr.data_saida, hr.observacao, s.nome_situacao AS situacao, a.nome_arquivo, hr.id AS id_historico FROM historico_registro AS hr LEFT JOIN registro_pessoa AS rp ON rp.id_pessoa=hr.id_pessoa LEFT JOIN anexo AS a ON a.id_pessoa=rp.id_pessoa LEFT JOIN situacao AS s ON s.id=rp.fk_id_situacao WHERE rp.cpf_pessoa = ? GROUP BY hr.id ORDER BY rp.id_pessoa DESC';
		con.query(sql, [req.body.rg], function (err, result) {			
			if(err){
				res.send(["500", []]);
				console.log("/buscar_cpf 500");
			}else{
				res.send(["200", result]);
				console.log("/buscar_cpf 200");
			}
		})
	})
	
	app.post('/busca_avancada_registro',function(req, res){
		let sql= "SELECT rp.*, hr.data_entrada, hr.data_saida, hr.observacao, s.nome_situacao AS situacao, a.nome_arquivo, hr.id AS id_historico, st.nome_setor FROM historico_registro AS hr LEFT JOIN registro_pessoa AS rp ON rp.id_pessoa=hr.id_pessoa LEFT JOIN anexo AS a ON a.id_pessoa=rp.id_pessoa LEFT JOIN situacao AS s ON s.id=rp.fk_id_situacao LEFT JOIN setor AS st ON st.id=hr.id_setor"
		sql= sql + " WHERE"
		sql= sql + " 1 = 1"

		const data_entrada= req.body.data_entrada
		if(data_entrada != "" && data_entrada != null){
			sql= sql + ` AND date_format(hr.data_entrada, '%Y-%m-%d') >= '${data_entrada}'`			 
		}

		const data_saida= req.body.data_saida
		if(data_saida != "" && data_saida != null){
			sql= sql + ` AND date_format(hr.data_saida, '%Y-%m-%d') <= '${data_saida}'`			 
		}

		const rg= req.body.rg
		if(rg != "" && rg != null){
			sql= sql + ` AND rp.cpf_pessoa like '%${rg}%'`			 
		}

		const nome= req.body.nome
		if(nome != "" && nome != null){
			sql= sql + ` AND rp.nome_pessoa like '%${nome}%'`			 
		}

		sql= sql + " GROUP BY hr.id ORDER BY hr.data_entrada DESC"

		con.query(sql, [], function (err, result) {
			if(err){				
				res.send(["500", []]);
				console.log("/busca_avancada_registro 500");
			}else{
				res.send(["200", result]);
				console.log("/busca_avancada_registro 200");
			}
		})
	})

	app.get('/listar_situacao',function(req, res){
		const sql= 'SELECT * FROM situacao';
		con.query(sql, [], function (err, result) {			
			if(err){
				res.send(["500", []]);
				console.log("/listar_situacao 500");
			}else{
				res.send(["200", result]);
				console.log("/listar_situacao 200");
			}
		})
	})

	app.get('/reload_monitoramento',function(req, res){
		io.emit('emitNovoRegistroLog', {});
		res.send("200")
	})

}
