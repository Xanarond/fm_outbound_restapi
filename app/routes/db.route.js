const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database('outm_db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

exports.clientDBRefresh = (req, res) => {
    let result = {}
    let statusData = []
    let p1 = new Promise((resolve, reject) => {
        db.parallelize(() => {
            db.each(`SELECT time, result
                     FROM shifts ORDER BY time ASC`, (err, row) => {
                if (err) {
                    console.error(err.message);
                }
                statusData.push(row)
                setTimeout(() => resolve(statusData), 100);
                // console.log(row.time + "\t" + row.result);
            });
        });
    })
    let shiftResp = []
    let p2 = new Promise(((resolve, reject) => {
        db.parallelize(() => {
            db.each(`SELECT id, name, shift
                     FROM resp_persons
                     ORDER BY id ASC`, (err, row) => {
                if (err) {
                    console.error(err.message);
                }
                shiftResp.push(row)
                setTimeout(() => resolve(shiftResp), 100);
                // console.log(row.id + "\t" + row.name + "\t" + row.shift);
            });
        });
    }))


    Promise.all([
        p1,//передача данных для target
        p2// ответственные на смену
    ]).then(values => {
        result.shift_stat = values[0];
        result.persons = values[1];
        res.send(result);
    })
}