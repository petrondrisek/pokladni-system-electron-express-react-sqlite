const express = require('express')
const router = express.Router()
const db = require('../database');
const fs = require('fs');
const multer = require('multer');
const Functions = require('../functions')
const fce = new Functions();

function errorHandle(data){
    const filePath = `./backend/logs/products/error-${fce.getCurrentDateTime()}.txt`;
    const fileContent = data;

    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.error('Error log writing file wasn\'t successful:', err);
        } else {
            console.log('Error log written successfully');
        }
    });

    console.log("Nezapsáno: " + fileContent)
}

router.get('/', (req, res) => {
    db.all('SELECT * FROM products', (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        res.json(rows);
    });
})

router.get('/category/:category', (req, res) => {
    const category = req.params.category

    db.all('SELECT * FROM `products` WHERE `category` = ?', [category], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        res.json(rows);
    });
})

router.put('/add', (req, res) => {
    const body = req.body;

    if(body.name == null || body.price == null || body.amount == null || body.category == null) {
        res.status(400).send('Missing data!');
        return;
    }

    db.run('INSERT INTO `products` (`name`, `price`, `amount`, `category`, `image`) VALUES(?, ?, ?, ?, ?)', 
        [
            body.name, 
            parseFloat(body.price), 
            parseInt(body.amount), 
            body.category,
            body.image ? body.image : null
        ], function (err) {
            if (err) {
                res.status(500).send(err.message);
            }

            res.json({
                id: this.lastID
            });
        });
});

router.delete('/delete/:id', (req, res) => {
    const id = req.params.id

    db.run('DELETE FROM `products` WHERE id = ?', id, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        
        res.send('Success');
    });
})

router.post('/:id/add', (req, res) => {
    const id = req.params.id
    const body = req.body;

    db.run('UPDATE `products` SET `amount` = `amount` + 1 WHERE id = ?', id, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        db.run('INSERT INTO `logs` (`type`, `log_id`, `product_id`, `product_name`, `price`, `amount`, `date`) VALUES(?, ?, ?, ?, ?, ?, ?)',
        [
            'amount-add',
            fce.uniqueId(),
            id,
            body.name,
            body.price,
            "1",
            fce.getCurrentDateTime()
        ], function(err) {
            if (err) {
                errorHandle(`ERROR: nepovedlo se přidat množství u produktu ${id} - ${body.name}, ${err.message}: ` + JSON.stringify(body))
            } else console.log(`[${fce.getCurrentDateTime()}}] přidalo se množství u produktu ${id} - ${body.name}, zalogováno`)
        });
        
        res.send('Success');
    });
})

router.post('/:id/minus', (req, res) => {
    const id = req.params.id
    const body = req.body;

    db.run('UPDATE `products` SET `amount` = `amount` - 1 WHERE id = ?', id, (err, result) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        db.run('INSERT INTO `logs` (`type`, `log_id`, `product_id`, `product_name`, `price`, `amount`, `date`) VALUES(?, ?, ?, ?, ?, ?, ?)',
        [
            'amount-minus',
            fce.uniqueId(),
            id,
            body.name,
            body.price,
            "1",
            fce.getCurrentDateTime()
        ], function(err) {
            if (err) {
                errorHandle(`ERROR: nepovedlo se odebrat množství u produktu ${id} - ${body.name}, ${err.message}: ` + JSON.stringify(body))
            } else console.log(`[${fce.getCurrentDateTime()}}] odebralo se množství u produktu ${id} - ${body.name}, zalogováno`)
        });
        
        res.send('Success');
    });
})

module.exports = router