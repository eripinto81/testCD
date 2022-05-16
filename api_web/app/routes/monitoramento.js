module.exports= function(app, con, io){

	app.get('/listar_log_monitoramento',function(req, res){
		const sql= 'SELECT l.*, s.nome_situacao, s.id AS id_status, a.nome_arquivo FROM log_monitoramento AS l LEFT JOIN situacao AS s ON s.id=l.status_pessoa LEFT JOIN registro_pessoa AS rp ON rp.cpf_pessoa=l.cpf LEFT JOIN anexo AS a ON a.id_pessoa=rp.id_pessoa ORDER BY data_instante DESC';
		con.query(sql, [], function (err, result) {			
			if(err){
				res.send("500");
				console.log("/listar_log_monitoramento 500");
			}else{
				res.send(result);
				console.log("/listar_log_monitoramento 200");
			}
		})
	})
	
	app.post('/busca_registro_face',function(req, res){
		let sql= "SELECT l.*, s.nome_situacao, s.id AS id_status, a.nome_arquivo FROM log_monitoramento AS l LEFT JOIN situacao AS s ON s.id=l.status_pessoa LEFT JOIN registro_pessoa AS rp ON rp.cpf_pessoa=l.cpf LEFT JOIN anexo AS a ON a.id_pessoa=rp.id_pessoa"
		sql= sql + " WHERE"
		sql= sql + " 1 = 1"

		const data_entrada= req.body.data_entrada
		if(data_entrada != "" && data_entrada != null){
			sql= sql + ` AND date_format(l.data_instante, '%Y-%m-%d') >= '${data_entrada}'`			 
		}

		const data_saida= req.body.data_saida
		if(data_saida != "" && data_saida != null){
			sql= sql + ` AND date_format(l.data_instante, '%Y-%m-%d') <= '${data_saida}'`			 
		}

		const cpf= req.body.cpf
		if(cpf != "" && cpf != null){
			sql= sql + ` AND l.cpf like '%${cpf}%'`			 
		}

		const nome= req.body.nome
		if(nome != "" && nome != null){
			sql= sql + ` AND l.nome like '%${nome}%'`			 
		}

		const situacao= req.body.situacao
		if(situacao != "" && situacao != null){
			sql= sql + ` AND l.status_pessoa = ${situacao}`			 
		}

		sql= sql + " ORDER BY l.data_instante DESC"

		con.query(sql, [], function (err, result) {
			if(err){				
				res.send(["500", []]);
				console.log("/busca_registro_face 500");
			}else{
				res.send(["200", result]);
				console.log("/busca_registro_face 200");
			}
		})
	})

}
