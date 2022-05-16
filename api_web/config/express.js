const express= require('express')
const bodyParser= require('body-parser')
const validator= require('express-validator')
const cors= require('cors')
const access= require('./access_token')
const fileUpload= require('express-fileupload')
const CONFIG= require('../config/CONFIG_URL')

module.exports= function() {
	var app= express()
	app.set('view engine','ejs')
	app.set('views','./app/views')
	app.engine('html', require('ejs').renderFile)
	app.use(bodyParser.json({limit: '50mb'}))
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
	app.use(validator())
	app.use(cors())
	app.use(fileUpload())

	app.use(function(req, res, next){
		res.header("Access-Control-Allow-Origin", `${CONFIG.URL_API}`)
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-CSRF-Token, X-File-Name")
		if(!access.token(req.headers['x-access-token'])){
			res.sendStatus(401)
			return 
		}
		next()
	})
	
	return app
}
