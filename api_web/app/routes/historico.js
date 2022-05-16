module.exports= function(app, con, io){

	app.post('/registrar_historico',function(req, res){		
		const sql= 'INSERT INTO historico_registro (id_pessoa, id_setor, data_entrada, data_saida, observacao) VALUES (?, ?, ?, ?, ?)';
		con.query(sql, [req.body.id_pessoa, req.body.id_setor, req.body.data_entrada, req.body.data_saida, req.body.observacao], function (err, result) {
			if(err){												
				res.send("500");				
				console.log("/registrar_historico 500");
			}else{
				res.send(["201", result.insertId]);
				console.log("/registrar_historico 201");
			}
		})
	})

}
