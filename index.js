const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const fs = require('fs');

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
var favicon = require('serve-favicon');
var path = require('path');
 
var con = mysql.createConnection({
    host: "localhost",
    // user: "prani",
    // user: "pooj",
    user: "root",
    password: "abc123",
    database: "schema"
});

var currentfid;
var maximum;
var maximumland;
var sno;


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

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/login/login.html");
});

app.post("/", function(req, res) {
    if(req.body.email=="admin@gmail.com" && req.body.pwd=="abc123"){
        res.redirect("/admin");
    }
    else {
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
    }
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

            con.query("Insert into "+"farmer"+" (FID, Name, PhoneNumber, Age, EmailID, Gender, Line1, Pincode, Password, DoB) VALUES ('"+(maximum+1)+"','"+req.body.full_name+"','"+req.body.phone+"','"+0+"','"+req.body.your_email+"','"+req.body.Gender+"','"+req.body.Address+"','"+req.body.zip+"', '"+req.body.Password+"', '"+req.body.DoB+"')",function(err, result){
                if (err) throw err;
                console.log("1 record inserted into farmer");
            });

            con.query("update farmer set Age = FLOOR(DATEDIFF(CURDATE(), DoB)/365.25) where fid ="+"'"+(maximum+1)+"'", function(err, result){
                if (err) throw err;
                a = result[0];
                console.log("age " + a);
                console.log(result);
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
	//res.sendFile(__dirname + "/home/index.html");
    con.connect(function(err) {
        con.query("SELECT Subject,Content from notifs",function(err, result){
            if (err) throw err;
            console.log(result);
            const notifs = result;
            //res.render('index', {notif1: result[0].Content, notif2: result[1].Content, sub1: result[0].Subject, sub2: result[1].Subject});
            res.render('index',{ notifs});
        });
    });
});

app.post("/home", function (req, res) {
    const keyword = req.body.keyword;
    con.connect(function(err) {
        con.query("UPDATE keyword_freq SET freq=freq+1 WHERE keyword_freq.keyword="+"'"+keyword+"'",function(err, result){
            if (err) throw err;
            console.log(result);
        });
    });
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
        con.query("SELECT distinct Name FROM crop INNER JOIN learns ON crop.CID = learns.CIDL WHERE learns.FID="+"'"+currentfid+"'",function(err, result){
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

app.get("/admin", function (req, res){
    var path = 'C:/Users/akshi/Documents/CSE @ RV/V SEM/DBD/Lab/farmer-portal-upgrade/public/';
    con.connect(function(err) {
        con.query("SELECT CropName, count(*) AS Count FROM land_cropname WHERE LID in (SELECT LID FROM land, farmer WHERE land.FID = farmer.FID) GROUP BY CropName",function(err, result){
            if (err) throw err;
            console.log(result);
            let buffer = 'var crops = [';
            fs.open(path+'pie-chart.js', 'w+', function(err, fd){
                if (err) console.log('cant open file');
                else {
                    result.forEach(function(ele){
                        buffer = buffer + '[' + "'" + ele.CropName + "', " + String(ele.Count) + '],';
                    });
                    buffer += '];'
                    fs.write(fd, buffer, function (err, bytes) {
                        if (err) console.log(err);
                        else console.log("written");
                });}
            });
        });
    });
    con.connect(function(err) {
        con.query("SELECT State, CropName, COUNT(*) AS cropNo FROM pin_details INNER JOIN farmer ON pin_details.Pincode = farmer.Pincode INNER JOIN land ON land.FID =  farmer.FID INNER JOIN land_cropname ON land.LID = land_cropname.LID GROUP BY State, CropName ORDER BY State, CropName;",function(err, result){
            if (err) throw err;
            var crops = ["Cotton", "Sunflower", "Paddy", "Ragi", "GroundNut", "Jowar", "Bajra", "Maize"];
            var andhra = {}, telangana = {}, andhralist = [], tellist = [];
            let buffer = "var cropsStatewise = [['CropType', ";
            fs.open(path+'column-chart.js', 'w+', function(err, fd){
                if (err) console.log('cant open file');
                else {
                    crops.forEach(function(ele){
                        buffer = buffer + "'" + ele + "', ";
                    });
                    result.forEach(function(ele){
                        if(ele.State=="Andhra Pradesh")
                            andhra[ele.CropName] = ele.cropNo;
                    });
                    crops.forEach(function(ele){
                        var val = andhra[ele] === undefined ? 0 : andhra[ele];
                        andhralist.push(val);
                    });
                    result.forEach(function(ele){
                        if(ele.State=="Telangana")
                            telangana[ele.CropName] = ele.cropNo;
                    });
                    crops.forEach(function(ele){
                        var val = telangana[ele] === undefined ? 0 : telangana[ele];
                        tellist.push(val);
                    });
                    buffer += "{ role: 'annotation' } ]," + '[' + "'Andhra Pradesh', ";
                    andhralist.forEach(function(ele){
                        buffer = buffer + String(ele) +", ";
                    });
                    buffer += "''], ['Telangana', ";
                    tellist.forEach(function(ele){
                        buffer = buffer + String(ele) +", ";
                    });
                    buffer += "'']];"
                    fs.write(fd, buffer, function (err, bytes) {
                        if (err) console.log(err);
                        else console.log("written-cropstate");
                });}
            });
        });
    });
    con.connect(function(err) {
        con.query("SELECT  map.Lat, map.Long, map.City, group_concat(crop.Name) as 'Crops' from crop_location, map, crop where Clocation = City and CIDL=CID group by map.City order by map.City",function(err, result){
            if (err) throw err;
            console.log(result);
            let buffer = "var map = [['Lat', 'Long', 'Name'],";
            fs.open(path+'map.js', 'w+', function(err, fd){
                if (err) console.log('cant open file');
                else {
                    result.forEach(function(ele){
                        // [37.4232, -122.0853, 'Work'],
                        buffer = buffer + '[' + ele.Lat + ", " + ele.Long + ", '" + ele.City + " - " + ele.Crops + "'], ";
                    });
                    buffer += '];'
                    fs.write(fd, buffer, function (err, bytes) {
                        if (err) console.log(err);
                        else console.log("written");
                });}
            });
        });
    });
    con.connect(function(err) {
        con.query("SELECT * FROM keyword_freq",function(err, result){
            if (err) throw err;
            let buffer = 'var keyWord = [';
            fs.open(path+'keyword.js', 'w+', function(err, fd){
                if (err) console.log('cant open file');
                else {
                    result.forEach(function(ele){
                        buffer = buffer + '{ x: ' + "'" + ele.keyword + "', value: '" + String(ele.freq) + "', category: '" + ele.topic + "' }, ";
                    });
                    buffer += '];'
                    fs.write(fd, buffer, function (err, bytes) {
                        if (err) console.log(err);
                        else console.log("written");
                });}
            });
        });
    });
    res.sendFile(__dirname + "/admin/admin_analytics.html");
});

app.get("/adminUserDetails", function (req, res){
    var path = 'C:/Users/akshi/Documents/CSE @ RV/V SEM/DBD/Lab/farmer-portal-upgrade/public/';
    con.connect(function(err) {
        con.query("SELECT Name, PhoneNumber, EmailID, City, State FROM farmer, pin_details WHERE farmer.Pincode = pin_details.Pincode",function(err, result){
            if (err) throw err;
            console.log(result);
            let buffer = 'var userData = [';
            fs.open(path+'table.js', 'w+', function(err, fd){
                if (err) console.log('cant open file');
                else {
                    result.forEach(function(ele){
                        buffer = buffer + '[' + "'" + ele.Name + "', '" + String(ele.PhoneNumber) + "', '" + ele.EmailID + "', '" + ele.City + "', '" + ele.State + "'],";
                    });
                    buffer += '];'
                    fs.write(fd, buffer, function (err, bytes) {
                        if (err) console.log(err);
                        else console.log("written");
                });}
            });
        });
    });
    res.sendFile(__dirname + "/admin/farmer_details.html");
});

app.get("/alerts", function (req, res){
    res.sendFile(__dirname + "/admin/send-alert.html");
});

app.post("/alerts", function (req, res) {
    console.log(req.body);
    con.connect(function(err) {
        con.query("select SNo from notifs where SNo = (SELECT MAX(SNo) from notifs)", function(err, result){
            if (err) throw err;
            sno = result[0].SNo;
            
            con.query("Insert into "+"notifs"+"(SNo, Subject, Content) VALUES ('"+(sno+1)+"','"+req.body.subject+"','"+req.body.message+"')",function(err, result){
                if (err) throw err;
                alert("Successfully Sent Notification!");
                console.log("1 record inserted into notifs");
            });
        });
        
        // con.query("INSERT into notifs(SNo, Subject, Content) VALUES("+(sno+1)+",'"+req.body.subject+"','"+req.body.message+"')",function(err, result){
        //     if (err) throw err;
        //     console.log(result);
           
        // });
    });
});



app.get("/keywords", function (req, res){
    var path = 'C:/Users/akshi/Documents/CSE @ RV/V SEM/DBD/Lab/farmer-portal-upgrade/public/';
    con.connect(function(err) {
        con.query("SELECT * FROM keyword_freq",function(err, result){
            if (err) throw err;
            console.log(result);
            let buffer = 'var keyWord = [';
            fs.open(path+'keyword.js', 'w+', function(err, fd){
                if (err) console.log('cant open file');
                else {
                    // { x: "Organic", value: 109, category: "Organic Farming" },
                    result.forEach(function(ele){
                        buffer = buffer + '{ x: ' + "'" + ele.keyword + "', value: '" + String(ele.freq) + "', category: '" + ele.topic + "' }, ";
                    });
                    buffer += '];'
                    fs.write(fd, buffer, function (err, bytes) {
                        if (err) console.log(err);
                        else console.log("written");
                });}
            });
        });
    });
    res.sendFile(__dirname + "/admin/wordcloud.html");
});

app.listen(port, function() {
	console.log(`Hello world app listening on port ${port}!`);
});