const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');


const CompanyDetails = require('../models/companyDetails');

const companyDetailsRouter = express.Router();

companyDetailsRouter.use(bodyParser.json());

var multer = require('multer');

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/images/Company");
    },
    filename: function(req, file, callback) {
        callback(null,"CompanyLogo" + "_" + Date.now() + "_" + file.originalname );
    }
});
var upload = multer({storage: Storage}).array("imgUploader", 3);

companyDetailsRouter.route('/')
.get(function(req, res) {
    if(req.session.count){
    CompanyDetails.find(function(err, company) {
        if (err){
            res.send(err);
        }
            
        res.render("company/companyManagement.ejs", { AllCompanies: company });
    });
}
else{
    res.redirect("/companyDetails/login")    
}
});

companyDetailsRouter.route('/logout')
.get(function(req, res) {
    req.session.destroy();
    res.redirect("/companyDetails")
});

companyDetailsRouter.route('/login')
.get(function (req, res) {
    res.render("adminLogin.ejs", {name: req.params.companyName });
  })
.post(function (req, res) {
    
    if(req.body.email =="admin@admin.com" && req.body.password =="admin"){
        req.session.count = 1;
        res.redirect("/companyDetails")
    }
    else{
        res.redirect("/companyDetails/login")
    }
            
})


///************Add New Company **************///\

companyDetailsRouter.route('/add')
.get(function(req, res) {
    if(req.session.count){
        res.render("company/addNewCompany.ejs");
    }
    else{
        res.redirect("/companyDetails/login")
    }
})
    .post(function(req,res){
        
        if(req.session.count){
            upload(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                  // A Multer error occurred when uploading.
                  
                } else if (err) {
                  // An unknown error occurred when uploading.
                  
                }
                
        var company = new CompanyDetails();
        
        company.companyName= req.body.companyName;
        company.companyEmail= req.body.companyEmail;
        company.companyPassword= req.body.companyPassword;
        company.companyPhoneNumber= req.body.companyPhoneNumber;
        company.companyLogo= res.req.files[0].filename;
        company.companyCity= req.body.companyCity;
        
        company.save(function(err){
            if(err){
                res.send(err);
            }
            else{
                res.redirect("/companyDetails");
            }
        })
    } )}
    else{
        res.redirect("/companyDetails/login")
    }


    });

///************Edit All Companies **************///

companyDetailsRouter.route('/edit')
.get(function(req, res) {
    if(req.session.count){
    console.log("!");
    CompanyDetails.find({}, function (err, company) {
        res.render("company/editAllCompany.ejs", { AllCompanies: company });
    })
}
else{
    res.redirect("/companyDetails/login")
}


});


///************Edit Companies according to ID **************///

companyDetailsRouter.route('/edit/:companyID')
.get(function(req, res) {
    if(req.session.count){
    CompanyDetails.findById(req.params.companyID, function (err, company) {
        res.render("company/editCompany.ejs", { AllCompanies: company });
    })

}
else{
    res.redirect("/companyDetails/login")
}
})
.post(function(req, res) {
    if(req.session.count){
    CompanyDetails.findById(req.params.companyID, function(err, company) {

        if (err)
            res.send(err);
            

        // company.companyName= req.body.companyName;
        company.companyEmail= req.body.companyEmail;
        company.companyPassword= req.body.companyPassword;
        company.companyPhoneNumber= req.body.companyPhoneNumber;
        
        company.companyCity= req.body.companyCity;
        
        company.companyStatus= companyStatus;

        // save the bear
        company.save(function(err) {
            if (err)
                res.send(err);

            res.redirect("/companyDetails");
        });


})
}
else{
    res.redirect("/companyDetails/login")
}

});

///************Delete Company **************///

companyDetailsRouter.route('/delete/:companyID')
.get(function(req, res) {
    if(req.session.count){
    CompanyDetails.remove({
        _id: req.params.companyID
    }, function(err, bear) {
        if (err)
            res.send(err);

        res.redirect("/companyDetails")
    });
}
else{
    res.redirect("/companyDetails/login")
}
});



module.exports = companyDetailsRouter;