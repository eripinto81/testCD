module.exports= function(app, con){

	app.post('/adicionar_camera',function(req, res){
		const sql= 'INSERT INTO camera (login, senha, host, porta) VALUES (?, ?, ?, ?)';
		con.query(sql, [req.body.login, req.body.senha, req.body.host, req.body.porta], function (err, result) {			
			if(err){
				res.send(["500", []]);
				console.log("/adicionar_camera 500");
			}else{
				res.send(["200", result]);
				console.log("/adicionar_camera 200");
			}
		})
	})

	app.get('/listar_camera',function(req, res){
		const sql= 'SELECT * FROM camera';
		con.query(sql, [], function (err, result) {			
			if(err){
				res.send(["500", []]);
				console.log("/listar_camera 500");
			}else{
				res.send(["200", result]);
				console.log("/listar_camera 200");
			}
		})
	})
	
	app.post('/deletar_camera',function(req, res){
		const sql= 'DELETE FROM camera WHERE id = ?';
		con.query(sql, [req.body.id_camera], function (err, result) {			
			if(err){
				console.log(err);
				
				res.send(["500", []]);
				console.log("/deletar_camera 500");
			}else{
				res.send(["200", result]);
				console.log("/deletar_camera 200");
			}
		})
	})

}
