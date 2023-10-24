const http = require('http')


http.createServer(function(req, res){
	res.write("On the way to become full stack!! Just staretd")
	res.end()
}
).listen(3000)

console.log("server started on port 3000")
