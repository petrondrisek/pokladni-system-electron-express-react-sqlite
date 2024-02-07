const express = require('express')
const router = express.Router()
const db = require('../database');
const fs = require('fs');
const Functions = require('../functions')
const fce = new Functions();

function errorHandle(data){
    const filePath = `./backend/logs/orders/error-${fce.getCurrentDateTime()}.txt`;
    const fileContent = data;

    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.error('Error log writing file wasn\'t successful:', err);
        } else {
            console.log('Error log written successfully');
        }
    });

    console.log("Nezapsáno - chybějící data: " + item)
}


router.get('/date/:date', (req, res) => {
    const date = req.params.date;

    db.all('SELECT * FROM `logs` WHERE `type` = ? AND `date` = ?', ['order', date], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        res.json(rows);
    })
});

router.put('/add', (req, res) => {
    const body = req.body;
    const id = fce.uniqueId();

    if (!body.items) {
        res.status(400).send("Missing data");
        errorHandle("Nezapsáno - neexistující data items: " + JSON.stringify(body));
        return;
    }

    body.items.forEach(item => {
        if (!item.id || !item.name || !item.price) {
            errorHandle("Nezapsáno - chybějící data: " + JSON.stringify(item));
            return;
        }

        db.run('INSERT INTO `logs` (`type`, `log_id`, `product_id`, `product_name`, `price`, `amount`, `date`) VALUES(?, ?, ?, ?, ?, ?, ?)', ['order', id, item.id, item.name, item.price, 1, fce.getCurrentDateTime()], function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).send(err.message);
            }

            db.run('UPDATE `products` SET `amount` = `amount` - 1 WHERE id = ?', item.id, (err, result) => {
                if (err) {
                    console.error(err.message);
                    errorHandle("Nepodařilo se odebrat množství při prodaném produktu" + JSON.stringify(item));
                } else console.log(`[${fce.getCurrentDateTime()}] Produktu  ${item.name} (ID: ${item.id}) odebrán kus.`);
            });
    
            console.log(`[${fce.getCurrentDateTime()}] Záznam objednávky byl uložen, ID: ${this.lastID}`);
        });
    });

    res.json({});
});

module.exports = router