module.exports= function(app, con){

	app.post('/adicionar_ocorrencia',function(req, res){
		const sql= 'INSERT INTO livro_ocorrencia (descricao_ocorrencia, data) VALUES (?, ?)';
		con.query(sql, [req.body.descricao_ocorrencia, req.body.data], function (err, result) {			
			if(err){
				res.send(["500", []]);
				console.log("/adicionar_ocorrencia 500");
			}else{
				res.send(["201", result]);
				console.log("/adicionar_ocorrencia 201");
			}
		})
    })
    
    app.post('/atualizar_ocorrencia',function(req, res){
		const sql= 'UPDATE livro_ocorrencia SET descricao_ocorrencia= ? WHERE id = ?';
		con.query(sql, [req.body.descricao_ocorrencia, req.body.id_ocorrencia], function (err, result) {			
			if(err){
				res.send(["500", []]);
				console.log("/atualizar_ocorrencia 500");
			}else{
				res.send(["200", result]);
				console.log("/atualizar_ocorrencia 200");
			}
		})
	})

	app.get('/lista_ocorrencia',function(req, res){
		const sql= 'SELECT * FROM livro_ocorrencia AS lo ORDER BY lo.data DESC';
		con.query(sql, [], function (err, result) {			
			if(err){
				res.send(["500", []]);
				console.log("/lista_ocorrencia 500");
			}else{
				res.send(["200", result]);
				console.log("/lista_ocorrencia 200");
			}
		})
	})

	app.post('/busca_ocorrencia',function(req, res){
		let sql= "SELECT * FROM livro_ocorrencia AS lo"
		sql= sql + " WHERE"
		sql= sql + " 1 = 1"

		const data_entrada= req.body.data
		if(data_entrada != "" && data_entrada != null){
			sql= sql + ` AND date_format(lo.data, '%Y-%m-%d') = '${data_entrada}'`			 
		}
		const descricao_ocorrencia= req.body.descricao_ocorrencia
		if(descricao_ocorrencia != "" && descricao_ocorrencia != null){
			sql= sql + ` AND lo.descricao_ocorrencia like '%${descricao_ocorrencia}%'`			 
		}

		sql= sql + " ORDER BY lo.data DESC"

		con.query(sql, [], function (err, result) {
			if(err){				
				res.send(["500", []]);
				console.log("/busca_ocorrencia 500");
			}else{
				res.send(["200", result]);
				console.log("/busca_ocorrencia 200");
			}
		})
	})

}
