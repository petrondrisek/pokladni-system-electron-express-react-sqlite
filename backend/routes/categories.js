const express = require('express')
const router = express.Router()
const db = require('../database');


router.get('/', (req, res) => {
    db.all('SELECT * FROM categories ORDER BY `order`', (err, rows) => {
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

    db.run('INSERT INTO `categories` (`category`, `order`) VALUES(?)', [body.category, 99999], function(err) {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        res.json({
            "id": this.lastID
        });
     });
});

router.post('/update/:id', (req, res) => {
    const id = req.params.id
    const body = req.body;

    if(body.category == null || body.order == null){
        res.status(400).send("Missing data");
        return;
    }

    db.run('UPDATE `categories` SET `category` = ?, `order` = ? WHERE id = ?', [body.category, body.order, id], (err, result) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        res.send('Success');
    })
    }
)

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