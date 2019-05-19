const express = require('express');
const router = express.Router();
const fs = require('fs');

const availbleFlightPerCountry = require('../models/availbleFlightPerCountry.json');

router.get('/countriesToFlight', (req, res, next) => {
    res.status(200).json(
        [
            "Israel",
            "England",
            "France"
        ]
    );
});

router.get('/availableFlightByCountry/:country', (req, res, next) => {
    const country = req.params.country;
    if(!country){
        res.status(500).json(
            {"message": "country is required"}
        );
        return;
    }
    let list = availbleFlightPerCountry.filter(item => item.country.toLowerCase() === country.toLowerCase());
    if(list.length === 0){
        res.status(500).json(
            {"message": "country not found"}
        );
        return;
    }
    res.status(200).json(list);
});

router.post("/toggleSelectedFlight", (req, res, next) => {
    
    const selectedId = req.body.id;
    if(!selectedId){
        res.status(500).json(
            {"message": "id is required"}
        );
        return;
    }
    let newJson = [...availbleFlightPerCountry];
    let country;
    newJson.forEach((item, index)=>{        
        if(item.id && (item.id == selectedId)){
            item.isSelected = !item.isSelected;
            country = item.country;  
        }
    });

    if(!country){
        res.status(500).json(
            {"message": "id not found"}
        );
        return;
    }

    fs.writeFile("api/models/availbleFlightPerCountry.json", JSON.stringify(newJson), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
        res.status(200).json(
            newJson.filter(item => item.country.toLowerCase() === country.toLowerCase())
        );
    }); 

});



module.exports = router;