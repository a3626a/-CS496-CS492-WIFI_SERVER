var http = require('http');
var url = require('url');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var mUrl = 'mongodb://127.0.0.1:27017/test';

var insertDocument = function(db, json, callback) {
	db.collection('wifi').insertOne(
			json, 
			function(err, result) {
				assert.equal(err, null);
				console.log("[Post]Inserted a data into the wifi collection.");
				callback();
				});
	};

const server = http.createServer((req,res) => {
	var data = '';
	var verb = req.method;
	req.on('data',(chunk) => {
		data += chunk.toString();
	});
	req.on('end',() => {
		var json = JSON.parse(data);
		MongoClient.connect(mUrl, function(err, db) {
			assert.equal(null, err);
			insertDocument(db, json, function() {
				db.close();
				res.setHeader('Content-Type', 'text/plain');
				res.writeHead(200);
				res.write('Insert the data to the wifi collection.');
				res.end();
			});
		});
	});
});
server.listen(8080);