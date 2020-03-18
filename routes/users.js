const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const UserDetails = require('../models/companyDetails');

const userDetailsRouter = express.Router();

userDetailsRouter.use(bodyParser.json());

///************Main Dashboard **************///

userDetailsRouter.route('/')

.get(function(req, res) {
    UserDetails.find(function(err, user) {
        if (err)
            res.send(err);
        res.render("users/userManagement.ejs", { AllCompanies: user });
    });
});


///************Add New Company **************///

userDetailsRouter.route('/add')
.get(function(req, res) {
    res.render("users/addNewUser.ejs");
})
    .post(function(req,res){
        var user = new UserDetails();
        // var companyStatus = "";
        // if(req.body.companyStatus == "on"){
        //     companyStatus = "Active"
        // }
        // else{
        //     companyStatus = "Inactive"    
        // }
        user.companyName= req.body.userName;
        user.companyEmail= req.body.userEmail;
        user.companyPassword= req.body.userPassword;
        user.companyPhoneNumber= req.body.userPhoneNumber;
        user.companyImage= req.body.userImage;
        
        user.save(function(err){
            if(err){
                res.send(err);
            }
            else{
                res.redirect("/users");
            }
        })
    });

///************Edit All Companies **************///

userDetailsRouter.route('/edit')
.get(function(req, res) {
    console.log("!");
    UserDetails.find({}, function (err, company) {
        res.render("users/editAllUser.ejs", { AllCompanies: company });
    })
});


///************Edit Companies according to ID **************///

userDetailsRouter.route('/edit/:companyID')
.get(function(req, res) {
  UserDetails.findById(req.params.companyID, function (err, company) {
        res.render("company/editCompany.ejs", { AllCompanies: company });
    })
})
.post(function(req, res) {

  UserDetails.findById(req.params.companyID, function(err, company) {
        var companyStatus = "";
        if(req.body.companyStatus == "on"){
            companyStatus = "Active"
        }
        else{
            companyStatus = "Inactive"    
        }

        if (err)
            res.send(err);

        // company.companyName= req.body.companyName;
        company.companyEmail= req.body.companyEmail;
        company.companyPassword= req.body.companyPassword;
        company.companyPhoneNumber= req.body.companyPhoneNumber;
        company.companyStampID= req.body.companyStampID;
        company.companyImage= req.body.companyImage;
        company.companyLogo= req.body.companyLogo;
        company.companyCity= req.body.companyCity;
        
        company.companyStatus= companyStatus;

        // save the bear
        company.save(function(err) {
            if (err)
                res.send(err);

            res.redirect("/companyDetails");
        });

    });
});

///************Delete Company **************///

userDetailsRouter.route('/delete/:companyID')
.get(function(req, res) {
    UserDetails.remove({
        _id: req.params.companyID
    }, function(err, bear) {
        if (err)
            res.send(err);

        res.render("company/editAllCompany.ejs")
    });
});



module.exports = userDetailsRouter;