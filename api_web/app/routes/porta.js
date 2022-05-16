module.exports= function(app, con){

    var request= require("request");

    app.post('/conectar_porta',function(req, res){
        var options= 
        { 
            method: 'POST',
            url: 'http://'+ req.body.ip +'/login.fcgi',
            headers: 
            { 
                'content-type': 'application/json' 
            },
            body: 
            { 
                "login": req.body.login,
                "password": req.body.senha
            },
            json: true 
        }

        request(options, function (error, response, body) {
            if (error) {
                console.log('/conectar_porta 500');
                res.send('500')
            }else{
                console.log('/conectar_porta 200');
                res.send(response)
            }
        })
	})

    
	app.post('/abrir_porta',function(req, res){
        var options= 
        { 
            method: 'POST',
            url: 'http://'+ req.body.ip +'/execute_actions.fcgi?session=' + req.body.session,
            headers: 
            { 
                'content-type': 'application/json' 
            },
            body: 
            { 
                "actions": [ { "action": "door", "parameters": "door=1" } ]
            },
            json: true 
        }

        request(options, function (error, response, body) {
            if (error) {
                console.log('/abrir_porta 500');
                res.send('500')
            }else{
                console.log('/abrir_porta 200');
                res.send('200')
            }
        })
	})

}
