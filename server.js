//#region Require
const express = require("express"),cookieParser = require('cookie-parser');
const mysql = require("mysql2");
const fs = require('fs')
var config = require('./config');
const { sendStatus } = require("express/lib/response");
//#endregion

//#region Connect to MySQOL
 const pool = mysql.createConnection(config.db_connect);
//#endregion

const app = express();
app.use(cookieParser())

app.use("/assets/:uid/:file", function(req, res, next){
	var uid = req.params.uid, file = req.params.file;
    console.log(uid,file);
	if (fs.existsSync(`./assets/${uid}/${file}`)){
        if(file=="_auto_theme.css"){
            if(Object.keys(req.cookies).length){
                if(req.cookies["VismaHistoryTheme"]=="true"){
                    res.sendFile(__dirname +`/assets/css/_dark_theme.css`);
                }else{
                    res.sendFile(__dirname +`/assets/css/_light_theme.css`);
                }
            }else{
                res.sendFile(__dirname +`/assets/${uid}/${file}`);
            }
        }else{
            res.sendFile(__dirname +`/assets/${uid}/${file}`);
        }
	} else {
		res.send(403,'Sorry! you cant see that.');
	}
});
app.get("/",function (req, res) {
    res.sendFile(__dirname + "/assets/html/index.html",function(err){if(err){console.log(err)}});
});
app.get("/filters/:filter",function (req, res) {
    var fName = req.params.filter;
    var sqlreq = "";
    console.log(fName)
    switch(fName){
        case "events":
            sqlreq = "";//SQL
            break;
    }
    if(sqlreq != ""){
        pool.query(sqlreq, 
            function(err, results) {
                console.log("results:",results); 
                console.log("error:",err);
                res.send(results);
        });
    }else{
        res.sendStatus(404);
    }

});
//#endregion

app.listen(config.port, ()=>console.log("Сервер запущен..."));