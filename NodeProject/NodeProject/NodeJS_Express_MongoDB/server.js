const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongo=require('mongodb').MongoClient;
const url='mongodb://localhost:27017/NewCustomerdb'

var urlencodedParser = bodyParser.urlencoded
({
    extended: true});
app.use(express.static('public'));
var db;
mongo.connect(url,{useNewUrlParser:true},function (error,client) {
    if(error){
        return console.log(error);
    }
    db = client.db('NewCustomerdb');
    app.listen(8081,function (req,res){
        console.log('Listening 8081');
    });
});
app.get('/index.html',function (req,res) {
    res.sendFile(__dirname + "/" + "index.html");
});
app.post('/names',urlencodedParser,function (req,res) {
    db.collection('list').save(req.body,function (error,result) {
        if(error){
            return console.log(error);
        }
        console.log('Saved to Database');
        res.redirect('/index.html');
    });
});
app.get('/names',function (req,res) {
    var read = db.collection('list').find().toArray(function (error,result) {
        console.log(result);
        res.send(result);
    });
});
app.put('/names/update/:id', urlencodedParser,function(req, res, next) {
    db.collection("list").update({_id: ObjectId(req.params.id)}, {$set:{'first_name': req.body.first_name, 'last_name': req.body.last_name}}, function(error, result) {
        if(error) {
            return console.log(error);
        }
        res.send('User Updated');
    });
});
app.delete('/names/delete/:id',function(req, res, next) {
    let id = {
        _id: ObjectId(req.params.id)
    };
    db.collection('list').deleteOne(id, function(err, result){
        if(err) {
            throw err;
        }
        res.send('User Deleted');
    });
});