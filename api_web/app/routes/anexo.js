module.exports= function(app, con){

	const CONFIG= require('../../config/CONFIG_URL')
	
	const fs= require('fs');

	app.post('/upload',function(req, res, next){	
		res.header("Access-Control-Allow-Origin", CONFIG.URL_API);

		let nome_arquivo= req.files.file.name

		req.files.file.mv(CONFIG.UPLOAD + nome_arquivo, function(err) {
			if (err) {
				console.log("/upload failed 500");
			}else{		
				console.log("/upload successfully 200");		
				res.send(nome_arquivo);
			}
		})
	})

	app.post('/adicionar_anexo',function(req, res){
		const sql= 'INSERT INTO anexo (nome_arquivo, id_pessoa, id_historico, tipo, tamanho) VALUES (?,?,?,?,?)';
		const filds= [req.body.nome_arquivo, req.body.id_pessoa, req.body.id_historico, req.body.tipo, req.body.tamanho]		
		con.query(sql, filds, function (err, result) {
			if(err){				
				res.send("500");
				console.log("/adicionar_anexo 500");
			}else{
				res.send("201");
				console.log("/adicionar_anexo 201");
			}
		})
	})

	app.get('/listar_anexo',function(req, res){
		const sql= 'SELECT * FROM anexo AS a';
		con.query(sql, [], function (err, result) {
			if(err){
				res.send(["500", []]);
				console.log("/listar_anexo 500");
			}else{
				res.send(["200", result])
				console.log("/listar_anexo 200");
			}
		})
	})
	
	app.post('/deletar_anexo',function(req, res){
		let sql= 'DELETE FROM anexo WHERE id = ?';

		con.query(sql, [req.body.id], function (err) {
			if(err){
			    console.log("/deletar_anexo 500");
			}else{
				console.log("/deletar_anexo 200");
			}
		})

		let url_delete= CONFIG.UPLOAD+'/'+req.body.file

		fs.unlink(url_delete, (err)=> {
			if (err) {
				console.log("failed to delete: " + err);
			} else {
				console.log('successfully deleted');                                
			}
		})
		res.send(["200"])
	})
	
}