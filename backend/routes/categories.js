const express = require('express')
const router = express.Router()
const db = require('../database');


router.get('/', (req, res) => {
    db.all('SELECT * FROM categories', (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        res.json(rows);
    });
})

router.put('/add', (req, res) => {
    const body = req.body;

    if(body.category == null){
        res.status(400).send("Missing data");
        return;
    }

    db.run('INSERT INTO `categories` (`category`) VALUES(?)', body.category, function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        res.json({
            "id": this.lastID
        });
     });
});

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id

    db.run('DELETE FROM `categories` WHERE id = ?', id, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        
        res.send('Success');
    });
})

module.exports = router