/*
	Carga dos módulos externos por meio da função "require"

	"http"  	implementa as funcionalidades de acesso à estrutura 
				das mensagens do pŕotocolo HTTP
	
	"url"		implementa as funcionalidades para acesso à estrutura
				de urls

	"fs"		file sistem, fornece recursos para acesso ao sistema 
				de arquivos local 
*/

var http = require('http');
var url = require('url');
var fs = require('fs');

/*
	instanciação do servidor HTTP
*/
http.createServer(function (req, res) {
	// Parsing da url utilizada na reqisição HTTP
	var q = url.parse(req.url,true); 

	// extração do pathname que indica o recurso requisitado pela msg HTTP
	var filename = "."+q.pathname;

	// leitura assíncrona do arquivo requisitado (pathname) no sistema de arquivos
	fs.readFile(filename, 
		
		// função de callback, executada no final da leitura

		//function(err,data) { // SINTAXE ALTERNATIVA PARA A LINHA DE BAIXO!!
		(err,data) => {

			// condição de erro capturada na leitura
			if (err) {
			
				// montagem e envio da resposta HTTP com condição de erro
				res.writeHead(404, {'Content-Type':'text/html'});
				return res.end("404 File Not Found");
			}

			// montagem e envio da mensagem com condição de sucesso.
			// "data" contém o conteúdo lido do arquivo 
			res.writeHead(200);
			res.write(data);
			return res.end();
		}
	);
	// indicação da porta em que o servidor aguarda as requisições HTTP
}).listen(8080); 
console.log("Aguardando requisicoes na porta 8080!");