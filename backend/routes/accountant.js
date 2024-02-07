const express = require('express')
const router = express.Router()
const db = require('../database');
const fs = require('fs');
const Functions = require('../functions')
const fce = new Functions();

function errorHandle(data){
    const filePath = `./backend/logs/accountant/error-${fce.getCurrentDateTime()}.txt`;
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


router.get('/date/:date', (req, res) => {
    const date = req.params.date;

    db.all('SELECT * FROM `logs` WHERE `date` LIKE ?', [`${date}%`], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        res.json(rows);
    });
})

router.get('/summary/:date', (req, res) => {
    const date = req.params.date;
    const jsonData = {
        "product_sold": 0,
        "receipt_count": 0,
        "total_income": 0,
        "product_wasted": 0,
        "product_wasted_money": 0,
        "product_bought": 0,
        "product_bought_money": 0,
        "missing_money_end": 0,
        "cash_end": 0,
        "ended": false
    };

    db.all('SELECT * FROM `logs` WHERE `date` LIKE ?', [`${date}%`], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        let receipt = new Set();
        for(let row in rows){
            if(rows[row].type === 'order') {
                receipt.add(rows[row].log_id);
                jsonData.product_sold += 1;
                jsonData.total_income += rows[row].price;
            }
            if(rows[row].type === 'amount-add') {
                jsonData.product_bought += 1;
                jsonData.product_bought_money += rows[row].price;
            }
            if(rows[row].type === 'amount-minus') {
                jsonData.product_wasted += 1;
                jsonData.product_wasted_money += rows[row].price;
            }
            if(rows[row].type === 'day-end') {
                jsonData.ended = true;
                jsonData.missing_money_end = rows[row].amount;
                jsonData.cash_end = rows[row].price;
            }
        }

        jsonData.receipt_count = receipt.size;

        res.json(jsonData);
    });
})

router.get('/summary/:date/product_sold', (req, res) => {
    const date = req.params.date;
    
    db.all('SELECT `product_name`, COUNT(*) as `count`, SUM(`price`) as `price` FROM `logs` WHERE `type` = ? AND `date` LIKE ?GROUP BY `product_id` ORDER BY `count` DESC;', [`order`, `${date}%`], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }

        res.json(rows);
    });
});

router.get('/is-ended/:date', (req, res) => {
    const date = req.params.date;
    db.get('SELECT EXISTS(SELECT 1 FROM `logs` WHERE `type` = ? and `date` = ?) AS result', ['day-end', `${date}`], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        
        res.json(row.result);
    });
})

router.post('/end/:date', (req, res) => {
    const date = req.params.date;
    const body = req.body;

    db.get('SELECT EXISTS(SELECT 1 FROM `logs` WHERE `type` = ? and `date` = ?) AS result', ['day-end', `${date}`], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        
        if(!row.result) {

            db.run('INSERT INTO `logs` (`type`, `log_id`, `product_id`, `product_name`, `price`, `amount`, `date`) VALUES(?, ?, ?, ?, ?, ?, ?)',
            [
                'day-end',
                fce.uniqueId(),
                -1,
                "UZÁVĚRKA",
                body.cash_end,
                body.missing_money_end,
                date
            ], function(err) {
                if (err) {
                    errorHandle(`ERROR: nepovedlo se uzavřít datum ${date} - ${err.message}: ` + JSON.stringify(body))
                } else {
                    console.log(`[${fce.getCurrentDateTime()}}] uzavřeno datum ${date}, zalogováno`)
                }
            });

            res.send("Success");

        } else res.status(400).send('Already ended');
    });
})

module.exports = router