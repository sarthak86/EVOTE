const express = require('express'); 
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// console.log(req.params.companyName);
const CompanyDetail = require('../models/question');
const CompanyDetail1 = require('../models/candidateDetails');


const companyDetailRouter = express.Router();

companyDetailRouter.use(bodyParser.json());

var multer = require('multer');

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/images/Candidates");
    },
    filename: function(req, file, callback) {
        callback(null,"CandidateImage" + "_" + Date.now() + "_" + file.originalname );
    }
});

var upload = multer({storage: Storage}).array("imgUploader", 3);



//////////////////////////////////////// VOTING /////////////////////////////




///************Main Dashboard **************///

companyDetailRouter.route('/:companyName')   

.get(function(req, res) {
    if(req.session.count){
        // console.log(req.params.companyName);
    var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail);
    a.find(function(err, user) {
        if (err)
            res.send(err);
        res.render("voting/votingManagement.ejs", { Voting: user , name: req.params.companyName });
    });
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
});


///************Add New Company **************///

companyDetailRouter.route('/:companyName/add/:questionID')
.get(function(req, res) {
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Question" , CompanyDetail);
    var b = mongoose.model(req.params.companyName+"Candidate" , CompanyDetail1);
    console.log(req.params.questionID+"HELLO");
    // a.find(function(err, user) {
        a.findById(req.params.questionID,function(err, voting){
            if (err)
                res.send(err);
            
            res.render("candidates/addNewCandidate.ejs", { Voting: voting , name: req.params.companyName });
        // })
    });
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
})
.post(function(req,res){
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Question" , CompanyDetail);
        var b = mongoose.model(req.params.companyName+"Candidate" , CompanyDetail1);
        
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
              // A Multer error occurred when uploading.
            } else if (err) {
              // An unknown error occurred when uploading.
            }
        
        a.findById(req.params.questionID,function(err, result){
            if(err){

            }
            else{
                b.create({
                    candidateName: req.body.candidateName,
                    candidateQualification: req.body.candidateQualification,
                    candidateAbout: req.body.candidateAbout,
                    questionId: req.params.questionID,
                    candidateImage: res.req.files[0].filename

                }, function(err, result1){
                    
                    if(err){
                        res.send(err);
                    }        
                    else{
                    console.log("R1"+result1+"R1");
                    console.log("R"+result+"R");
                        result.candidates.push(result1);
                        result.save();  
                    }
                    res.redirect("/voting/"+req.params.companyName);
                    
                });
            }
            
        })


          })

    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }

        
    });



////View questionss

companyDetailRouter.route('/:companyName/view/:questionId/:postName')
    .get(function(req, res) {
        if(req.session.count){
            var a = mongoose.model(req.params.companyName+"Candidate" , CompanyDetail1);
        var b = mongoose.model(req.params.companyName+"Question" , CompanyDetail);
        a.find({questionId:req.params.questionId}, function (err, user) {
            // console.log(user.question);
            res.render("candidates/candidateManagement.ejs", { Voting: user, name: req.params.companyName , postName: req.params.postName});
        })
        }
        else{
            res.redirect("/c/"+req.params.companyName+"/login")
        }
    });


    ///************Edit All Companies **************///

companyDetailRouter.route('/:companyName/edit/')
.get(function(req, res) {
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Voting" , CompanyDetail1);
    console.log("!");
    a.find({}, function (err, user) {
        res.render("voting/editAllVoting.ejs", { Voting: user, name: req.params.companyName });
    })
    }
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
});


///************Edit Companies accordisng to ID **************///

companyDetailRouter.route('/:companyName/edit/:questionID/:postName')
.get(function(req, res) {
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Candidate" , CompanyDetail1);
        a.findById(req.params.questionID, function (err, user) {
            if(err){
                console.log(err);
                res.send(err);
            }
                console.log("EDIT QIESTIOMs");
                console.log(user);
            res.render("candidates/editCandidate.ejs", { Voting: user , name: req.params.companyName,postName : req.params.postName });
        })
    
    }    
    else{
        res.redirect("/c/"+req.params.companyName+"/login")
    }
})
.post(function(req, res) {
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Candidate" , CompanyDetail1);

    a.findById(req.params.questionID, function(err, company) {


        if (err)
            res.send(err);


        company.candidateName= req.body.candidateName;
        company.candidateQualification= req.body.candidateQualification;
        company.candidateAbout= req.body.candidateAbout;
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

companyDetailRouter.route('/:companyName/delete/:questionID')
.get(function(req, res) {
    if(req.session.count){
        var a = mongoose.model(req.params.companyName+"Candidate" , CompanyDetail1);
    a.remove({
        _id: req.params.questionID
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