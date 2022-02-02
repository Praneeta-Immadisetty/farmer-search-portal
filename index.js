const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const port = 3000;

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/textDB", {useNewUrlParser: true});

const TextSchema = new mongoose.Schema ({
    topic: String,
    subTopic: String,
    keywords: [String],
    data: String
});

const Text = mongoose.model("Text", TextSchema);

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "prani",
    password: "abc123",
    database: "schema"
});

var currentfid;
var maximum;
var maximumland;

const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'esspro.invoice@gmail.com',
      pass: 'Asdf123$'
    }
  });
  
  var mailOptions = {
    from: 'esspro.invoice@gmail.com',
    to: 'pran1133.star@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };

const translate = require('translate-google');

let alert = require('alert'); 

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/login/login.html");
});

app.post("/", function(req, res) {
    con.connect(function(err){
        con.query("SELECT FID,Password FROM farmer WHERE " + "'"+req.body.email+"'= farmer.EmailID", function (err, result, fields) {
            if (err) throw err;
            if (result.length==0){
                alert("User does not exist! SignUp!");
                res.redirect("/");
            }
            else if (result[0].Password != req.body.pwd){
                alert("Email and password mismatch!");
                res.redirect("/");
            }
            else {
                currentfid = result[0].FID;
                console.log(currentfid);
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                res.redirect("/home");
            }
        });
    });
});

app.get("/register", function (req, res) {
    res.sendFile(__dirname + "/register/register.html");
});

app.post("/register", function (req, res) {
    console.log(req.body);

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

        con.query("select FID from farmer where FID = (SELECT MAX(FID) from farmer)", function(err, result){
            if (err) throw err;
            maximum = result[0].FID;
            console.log("max value of FID set " + maximum);

            con.query("Insert into "+"farmer"+" (FID, Name, PhoneNumber, Age, EmailID, Gender, Line1, Pincode, Password) VALUES ('"+(maximum+1)+"','"+req.body.full_name+"','"+req.body.phone+"', '"+req.body.Age+"','"+req.body.your_email+"','"+req.body.Gender+"','"+req.body.Address+"','"+req.body.zip+"', '"+req.body.Password+"')",function(err, result){
                if (err) throw err;
                console.log("1 record inserted into farmer");
            });

            con.query("Insert into "+"pin_details"+" (Pincode, State, City) VALUES ('"+req.body.zip+"','"+req.body.State+"','"+req.body.district+"')",function(err, result){
                if (err) throw err;
                console.log("1 record inserted into pin_details");
            });

            con.query("select LID from land where LID = (SELECT MAX(LID) from land)", function(err, result){
                if (err) throw err;
                maximumland = result[0].LID;
                console.log("max value of LID set " + maximumland);

                con.query("Insert into "+"land"+" (LID, SoilType, Area, FID) VALUES ('"+(maximumland+1)+"','"+req.body.SoilType+"','"+parseInt(req.body.Area)+"','"+maximum+"')",function(err, result){
                    if (err) throw err;
                    console.log("1 record inserted into land");
                });
                
                con.query("Insert into "+"land_cropname"+" (LID, CropName) VALUES ('"+(maximumland+1)+"','"+req.body.CropType+"')",function(err, result){
                    if (err) throw err;
                    console.log("1 record inserted into land_cropname");
                });
            });

            con.query("INSERT INTO learns SELECT CIDL, FID FROM crop_location JOIN farmer ON crop_location.CLocation IN (Select pin_details.city from pin_details where pin_details.Pincode = farmer.Pincode and farmer.FID=" +"'"+(maximum+1)+"')",function(err, result){
                if (err) throw err;
                console.log(result);
            });
            res.redirect('/');
        });
    });
});

app.get("/home", function (req, res) {
	res.sendFile(__dirname + "/home/index.html");
});

app.post("/home", function (req, res) {
    const keyword = req.body.keyword;
    Text.find({keywords: keyword}, function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
            console.log("First function call : ", docs[0].data);
            translate([docs[0].topic, docs[0].subTopic, docs[0].data], {from: 'en', to: 'te'}).then(telugu => {
                res.render('text', {topic: telugu[0], subtopic: telugu[1], text: telugu[2]});
            }).catch(err => {
                console.error(err);
            });
        }
    });
});

app.get("/crops", function (req, res) {
    con.connect(function(err) {
        con.query("SELECT Name FROM crop INNER JOIN learns ON crop.CID = learns.CIDL WHERE learns.FID="+"'"+currentfid+"'",function(err, result){
            if (err) throw err;
            console.log(result);
            res.render('crop', {crop1: result[0].Name, crop2: result[1].Name, img1: result[0].Name, img2: result[1].Name});
        });
    });
});

app.get("/aboutcrop1", function (req, res) {
    con.connect(function(err) {
        con.query("SELECT * FROM crop INNER JOIN learns ON crop.CID = learns.CIDL WHERE learns.FID="+"'"+currentfid+"'",function(err, result){
            if (err) throw err;
            console.log(result);
            con.query("SELECT Data FROM text_crop WHERE text_crop.CIDT="+"'"+result[0].CID+"'",function(err, result1){
                if (err) throw err;
                console.log(result1);
                translate([result1[0].Data, result[0].Name], {from: 'en', to: 'te'}).then(telugu => {
                    res.render('cropAbout', {cropTitle: result[0].Name + " ("+telugu[1]+")", cropText: telugu[0], humidity: result[0].Humidity, rainfall: result[0].Rainfall, temp: result[0].Temperature, soil: result[0].SoilType, img1: result[0].Name});
                }).catch(err => {
                    console.error(err);
                });
            });
        });
    });
});

app.get("/aboutcrop2", function (req, res) {
    con.connect(function(err) {
        con.query("SELECT * FROM crop INNER JOIN learns ON crop.CID = learns.CIDL WHERE learns.FID="+"'"+currentfid+"'",function(err, result){
            if (err) throw err;
            console.log(result);
            con.query("SELECT Data FROM text_crop WHERE text_crop.CIDT="+"'"+result[1].CID+"'",function(err, result1){
                if (err) throw err;
                console.log(result1);
                translate([result1[0].Data, result[1].Name], {from: 'en', to: 'te'}).then(telugu => {
                    res.render('cropAbout', {cropTitle: result[1].Name + " ("+telugu[1]+")", cropText: telugu[0], humidity: result[1].Humidity, rainfall: result[1].Rainfall, temp: result[1].Temperature, soil: result[1].SoilType, img1: result[1].Name});
                }).catch(err => {
                    console.error(err);
                });
            });
        });
    });
});

app.get("/schemes", function (req, res) {
	res.sendFile(__dirname + "/schemedets/scheme.html");
});

app.get("/aboutscheme1", function (req, res) {
	res.sendFile(__dirname + "/schemedets/about1.html");
});

app.get("/aboutscheme2", function (req, res) {
	res.sendFile(__dirname + "/schemedets/about2.html");
});

app.get("/aboutscheme3", function (req, res) {
	res.sendFile(__dirname + "/schemedets/about3.html");
});

app.get("/aboutscheme4", function (req, res) {
	res.sendFile(__dirname + "/schemedets/about4.html");
});

app.get("/aboutscheme5", function (req, res) {
	res.sendFile(__dirname + "/schemedets/about5.html");
});

app.get("/stats", function (req, res){
    res.render('stats');
});

app.listen(port, function() {
	console.log(`Hello world app listening on port ${port}!`);
});