var moment = require('moment');  
const port = 3000
const express = require('express');
//const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'calculator'
});

//app.use(bodyParser.urlencoded({ extended: true }));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


app.use(express.static(__dirname+'/public'));
app.get('',(req,res) =>{
    res.sendFile(__dirname+'/views/index.html')
})

app.post('/calculate', (req, res) => {
    var result = ""
    try{
        result = req.body.operation.split(',').join('').split('[').join('').split(']').join('').split('"').join('')
        connection.query('INSERT calculator_historic (user_name,operation,result,created_at) VALUES (?,?,?,?)', [req.body['user'],result,eval(result),moment().format()],(error, results) => {
        if (error) return res.json({ error: error });
            //console.log("ERROR")
        });
        res.send({ operation: result, result: eval(result)}) 
    }catch(error) {
        res.send({ operation: "ERROR", result: "ERROR"}) 
    }
})

app.post('/historic', (req, res) => {
    connection.query(
        'SELECT * FROM `calculator_historic` ORDER BY id DESC LIMIT 8',
        function(err, results, fields) {
        res.send({ result: results})
        }
    )
})

app.listen(port, () =>   
    console.log(`Listening on port ${port}`
))