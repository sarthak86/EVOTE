const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const CompanyDetail = require('../models/voting');

const companyDetailRouter = express.Router();

companyDetailRouter.use(bodyParser.json());



//////////////////////////////////////// VOTING /////////////////////////////




///************Main Dashboard **************///


companyDetailRouter.route('/:companyName')   

.get(function(req, res) {
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);
        a.find(function(err, user) {
            if (err)
                res.send(err);
            res.render("voting/editAllVoting.ejs", { Voting: user , name: req.params.companyName });
        });
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
});


///************Add New Company **************///

companyDetailRouter.route('/:companyName/add')
.get(function(req, res) {
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);
    a.find(function(err, user) {
        if (err)
            res.send(err); 
            
        res.render("voting/addNewVote.ejs", { VotingDetail: user , name: req.params.companyName });
    });
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
})
    .post(function(req,res){
        if(req.session.count){
            var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);
            var user = new a();
            var companyStatus = "";
    
    
            a.create({
                votingName: req.body.votingName,
                votingStartDate: req.body.votingStartDate,
                votingEndDate: req.body.votingEndDate,
                // votingStartTime: req.body.votingStartTime,
                // votingEndTime: req.body.votingEndTime
            }, function(req, res, err){
                if(err){
                    res.send(err);
                }        });
    
            res.redirect("/voting/"+req.params.companyName);
        }
        else{
            res.redirect("/c/"+req.params.companyName+"/login")
        }
});

///************Edit All Companies **************///

companyDetailRouter.route('/:companyName/edit')
.get(function(req, res) {
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);
    console.log("!");
    a.find({}, function (err, user) {
        res.render("voting/editAllVoting.ejs", { Voting: user, name: req.params.companyName });
    })
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
});


///************Edit Companies according to ID **************///

companyDetailRouter.route('/:companyName/edit/:companyID')
.get(function(req, res) {
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);
    a.findById(req.params.companyID, function (err, user) {
        if(err){
            console.log(err);
            res.send(err);
        }
            
        res.render("voting/editVote.ejs", { Voting: user , name: req.params.companyName });
    })
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
})
.post(function(req, res) {
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);

        a.findById(req.params.companyID, function(err, company) {
    
            if (err)
                res.send(err);
    
            company.votingName= req.body.votingName;
            company.votingStartDate= req.body.votingStartDate;
            company.votingEndDate= req.body.votingEndDate;
            company.votingStartTime= req.body.votingStartTime;
            company.votingEndTime = req.body.votingEndTime;
            
            company.save(function(err) {
                if (err){
                    console.log(err);
                    res.send(err);
                }
                    
    
                res.redirect("/voting/"+req.params.companyName);
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
        var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);
        a.remove({
            _id: req.params.companyID
        }, function(err, user) {
            if (err)
                res.send(err);
    
            res.redirect("/voting/"+req.params.companyName);
        });
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
});




module.exports = companyDetailRouter;