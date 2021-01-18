/*
    ==============================================================
	Código exemplo comentado  

	Servidor simples para carga de arquivos fixos segundo um 
	template codificado com o uso do EJS 

	Neste programa, estamos usando o framework Express, que 
	encapsula muitas fas funcionalidades necessárias à criação
	de funções de back-end para aplicações Web.
	
	Portanto, para executar esse exemplo simples, além do NodeJS,
	é preciso ter instalados os módulos EXPRESS e EJS

	O express trabalha com o conceito de "rotas", que identificam 
	os recursos a serem requisitados ao servidor pelos clientes. 

	Neste exemplo, quatro rotas podem ser utilizadas para tratar
	requisições com o método GET:

	1a ROTA
	http://localhost:8080/user/XPTO/books/LIVRO
	Neste exemplo, não é usado o EJS, mas feita uma demostração 
	de maneira alternativa para envio de dados ao servidor. Você
	pode mudar XPTO e LIVRO por qualquer string. 

	2a ROTA
	http://localhost:8080/ 
	Neste exemplo, apenas um teste simples de uso do template EJS
	é apresentado. Usa-se a rota default (sem indicação de recurso
	na URL). 


	3a ROTA
	http://localhost:8080/teste/QUALQUERCOISA (em que você pode
	substituir QUALQUERCOISA por qualquer outra string)
	Exemplo semelhante ao anterior, em que o texto digitado na 
	última parte da URL é apresentado no template

	4a ROTA
	http://localhost:8080/cv/fulano 

	O código está comentado para facilitar a compreensão.
	

	* IMPORTANTE! ==================================================

	Para executar o exemplo, é preciso ter o NodeJS 
	no computador (https://nodejs.org/en/download/). 

	Para instalar as dependências, configuradas em package.json, 
	execute o npm como no exemplo abaixo. 
	
			> npm i

	Será criada a pasta "node_modules" contendo as dependências. 

	Para executar o servidor, use 
	 
			 > node server.js
	
 */


/*
	Módulos importados para executar a aplicação
*/ 
const express = require('express');  // importação do express
const bodyParser = require('body-parser'); 
const app = express()  // o servidor HTTP é referenciado por app
const fs = require("fs"); 
const path = require('path');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs') // especifica o uso do ejs para templates

/* 1a ROTA  - Méto GET  

   usar: http://localhost:8080/user/xpto/books/LIVRO 	

   Exemplo para ilustrar a possibilidade de envio de dados
   pela URL de maneira alternativa ao www-url-encoded

   Voce pode substituir NOME e LIVRO por quaisquer outras
   strings. Neste exemplo, NÃO É USADO TEMPLATE EJS. A 
   resposta HTTP para esta rota é uma estrutura JSON 
   com os parâmetros extraídos da URL.  

   Na rota definida como '/user/:userId/book/:bookId', os
   ':' indicam que, nesta posição, será passad um valor 
   para a variável cujo nome vem após os ':'.  

   Por exemplo, caso seja usada a URL abaixo
   
   #####################################################
   http://localhost:8080/user/xpto/books/wyz 

   userId = xpto
   bookId = wyz

   O corpo da resposta HTTP será: 

   {"userId":"xpto","bookId":"wyz"}

*/
app.get('/user/:userId/book/:bookId', function (req, res) {
  res.send(req.params)
})

/* 2a ROTA  - Méto GET  

	usar: http://localhost:8080

	Acionada quando não há nenhum recurso na URL

	Neste caso, uma estrutura Json é passada para o template 
	index.ejs; o valor do atributo "teste" é substituído no 
	template usado para gerar dinamicamente a página HTML

	(ver index.ejs)
	
*/
app.get('/', function (req, res) {
  	/* 
  		A resposta será renderizada a partir do 
  	 	código gerado após preprocessamento de index.ejs
  	*/	
  	res.render('index', {teste: 
		 "1o exemplo de uso de templates EJS"});
})

/* 3a ROTA   

	usar: http://localhost:8080/teste/QUALQUERCOISA

	Acionada quando um recurso do tipo teste/ALGO é apresentado
	na requisição do GET no HTTP
	

	A estrutura Json é passada para o template index.ejs; 
	o valor do atributo "teste" será o que você digitar na url
	no lugar de QUALQUERCOISA. Esse valor é substituído no template 
	e apresentado na página HTML
	
*/
app.get('/teste/:tst', function (req, res) {
  	/* 
  		Como na 2a ROTA, a resposta será renderizada a partir do 
		código gerado após preprocessamento de index.ejs, mas 
		note que aqui o testo a ser atribuído ao atributo teste
		é extraído da URL. 
  	*/	
	res.render('index', {teste: req.params.tst});
})

/*4a ROTA   

	usar: http://localhost:8080/cv/fulano 

	Será usado o template cv.ejs para formatar as linhas carregadas dos arquivos
	s1.txt e s2.txt armazenados em data/fulano na estrutura deste projeto.

	Neste caso, diferentemente das 2a e 3a ROTAS, o template usado é cv.ejs.

*/
app.get('/cv/:usu', function(req,res) {
	var arr1 = [], arr2 = [];
	var diret; 

	/* 
		define o path para encontrar os arquivos cujos conteúdos serão usados
		em conjunto com o template
	*/
	diret = path.join(__dirname+'/public/data/'+req.params.usu);
	
	// Estrutura que será passada para o template cv.ejs
	var dadosCV = 
	{ 
	  userName : req.params.usu,
	  linesSec1 : [], 
      linesSec2 : []
	}	

	// Leitura (assíncrona) dos dados da 1a secao
	fs.readFile(diret+'/s1.txt',
	    function (err, data) {
		if (err) {
			res.send('Dados inexistentes ou incompletos para '+req.params.usu);
			return console.error(err);
		}  		
		dadosCV.linesSec1 = data.toString().split("\n")

		/* 
			Leitura assíncrona dos dados da 2a secao (note que é feita no 
			callback da leitura da 1a parte)
		*/
		fs.readFile(diret+'/s2.txt', 
			function (err, data) {
			if (err) {
				res.send('Dados inexistentes ou incompletos para '+req.params.usu);
				return console.error(err);
			}
			dadosCV.linesSec2 = data.toString().split("\n")
		
			// processa cv.ejs para gerar o html enviado ao cliente
			res.render('cv',dadosCV);
		});
	});
})

/*
	Inicia o servidor http na porta 8080
	Caso esta porta já esteja em uso, escolha 
	outro valor entre 1024 e 65535  
*/
const porta = 8080
app.listen(porta, function () {
  console.log('Server listening on port '+porta)
})
