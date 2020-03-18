const express = require('express'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// import passport from passport;
var CompanyDetail = require('../models/user');
var User = require('../models/companyDetails');
// const User = require('../models/user');

const companyDetailRouter = express.Router();
 


companyDetailRouter.use(bodyParser.json());
var multer = require('multer');
var passwordHash = require('password-hash');

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/images/Users");
    },
    filename: function(req, file, callback) {
        callback(null,"UserImage" + "_" + Date.now() + "_" + file.originalname );
    }
});


var upload = multer({storage: Storage}).array("imgUploader", 3);

///************Main Dashboard **************///

companyDetailRouter.route('/:companyName/login')
.get(function (req, res) {
    User.find({companyName: req.params.companyName}, function(err,result){
        if(result.length == 0){
            res.redirect("https://www.google.com")
        }
        else{
            res.render("companyLogin.ejs", {name: req.params.companyName });
        }
    })
    
  })
.post(function (req, res) {
    
    // var a = mongoose.model("CompanyDetails",User);        
          User.findOne({ companyEmail: req.body.email }, function(err, user) {
            if(!user ){
                res.redirect("/c/"+req.params.companyName+"/login")
            }            
            else if (user.companyPassword != req.body.password) {
                res.redirect("/c/"+req.params.companyName+"/login")
            }else{
                req.session.count = 1;
                res.redirect("/c/"+req.params.companyName)
                
            }
            
          });
})

companyDetailRouter.route('/:name/logout')
.get(function (req, res) {
    req.session.destroy();
    res.redirect("/c/"+req.params.name+"/login")
    
  })


///************Main Dashboard **************///

companyDetailRouter.route('/:companyName')

.get(function(req, res) {
    if(req.session.count){
            // console.log(req.params.companyName);
            var a = mongoose.model(req.params.companyName+"Users" , CompanyDetail);
            a.find(function(err, user) {
                if (err)
                    res.send(err);
                res.render("users/userManagement.ejs", { Users: user , name: req.params.companyName });
            });
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
});


///************Add New Company **************///

companyDetailRouter.route('/:companyName/add')
.get(function(req, res) {
    var a = mongoose.model(req.params.companyName+"Users" , CompanyDetail);
    a.find(function(err, user) {
        if (err)
            res.send(err);
        res.render("users/addNewUser.ejs", { Users: user , name: req.params.companyName });
    });
})
.post(function(req,res){
    if(req.session.count){
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
              // A Multer error occurred when uploading.
            } else if (err) {
              // An unknown error occurred when uploading.
            }
        
            // Everything went fine.
            // res.json(res.req.files);
        var a = mongoose.model(req.params.companyName+"Users" , CompanyDetail);
        var b = mongoose.model("test" , CompanyDetail);
        
        a.create({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            // userPassword: passwordHash.generate(req.body.userPassword),
            userPassword: req.body.userPassword,
            userPhoneNumber: req.body.userPhoneNumber,
            userImage: res.req.files[0].filename
    
        });
        b.create({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userPassword: req.body.userPassword,
            userPhoneNumber: req.body.userPhoneNumber,
            userImage: res.req.files[0].filename
    
        });
        
        res.redirect("/c/"+req.params.companyName);
            console.log("DONE");
          })
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }

        
        
        
    });

///************Edit All Companies **************///

companyDetailRouter.route('/:companyName/edit')
.get(function(req, res) {
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Users" , CompanyDetail);
    console.log("!");
    a.find({}, function (err, user) {
        res.render("users/editAllUser.ejs", { Users: user, name: req.params.companyName });
    })
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
});


///************Edit Companies according to ID **************///

companyDetailRouter.route('/:companyName/edit/:companyID')
.get(function(req, res) {
    var a = mongoose.model(req.params.companyName+"Users" , CompanyDetail);
    a.findById(req.params.companyID, function (err, user) {
        if(err)
            res.send(err);
        res.render("users/editUser.ejs", { Users: user , name: req.params.companyName });
    })
})
.post(function(req, res) {
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Users" , CompanyDetail);
    var user = mongoose.model("Users" , User);

    a.findById(req.params.companyID, function(err, user) {

        if (err)
            res.send(err);
        user.userEmail= req.body.userEmail;
        user.userPassword= req.body.userPassword;
        user.userPhoneNumber= req.body.userPhoneNumber;
        user.userImage= req.body.userImage;
        
        user.save(function(err) {
            if (err)
                res.send(err);

            res.redirect("/c/"+req.params.companyName);
        });

    });
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
});

///************Delete Company **************///

companyDetailRouter.route('/:companyName/delete/:companyID')
.get(function(req, res) {
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Users" , CompanyDetail);
    a.remove({
        _id: req.params.companyID
    }, function(err, user) {
        if (err)
            res.send(err);
        res.redirect("/c/"+req.params.companyName);
    });
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
});


    

module.exports = companyDetailRouter;