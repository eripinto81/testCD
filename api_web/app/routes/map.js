module.exports= function(app, con){

    app.get('/buscar_local/:endereco',function(req, status){
        const request= require('request');
        request('https://nominatim.openstreetmap.org/search?q='+req.params.endereco+'&format=geojson&limit=1', (err, res, resposta)=> {
            if (err) {
                status.send(["404", []]);
                console.log("/buscar_local 404");
            } else {
                status.send(["200", resposta]);
                console.log("/buscar_local 200");
            }
        })
    })

}