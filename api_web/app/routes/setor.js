module.exports= function(app, con){

	app.get('/listar_setor',function(req, res){
		const sql= 'SELECT * FROM setor AS s ORDER BY s.nome_setor ASC';
		con.query(sql, [req.body.email, req.body.senha], function (err, result) {			
			if(err){
				res.send(["500", []]);
				console.log("/listar_setor 500");
			}else{
				res.send(["200", result]);
				console.log("/listar_setor 200");
			}
		})
	})

}
