module.exports= function(app, con){

	app.post('/login',function(req, res){
		const sql= 'SELECT * FROM usuario AS u WHERE u.email = ? AND u.senha = ?';
		con.query(sql, [req.body.email, req.body.senha], function (err, result) {			
			if(result.length == 0){
				res.send(["404", []]);
				console.log("/login 404");
			}else{
				res.send(["200", result]);
				console.log("/login 200");
			}
		})
	})

}
