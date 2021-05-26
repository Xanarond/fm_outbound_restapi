const { Client } = require("pg");
const env = require("../config/psql_config");

exports.getPackingShifts = (req, res) => {
  try {
    let st_arr = req.query.start.split("-");
    let start_result = st_arr[2] + "." + st_arr[1] + "." + st_arr[0];

    let en_arr = req.query.end.split("-");
    let end_result = en_arr[2] + "." + en_arr[1] + "." + en_arr[0];
    console.log(start_result, end_result);

    const client = new Client(env);
    client.connect();
    let sql_req = `SELECT * from "public".packing_shifts WHERE pack_date between ${start_result} and ${end_result}`;
    client.query(sql_req, (err, result) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(result.rows[0]);
        res.send(result);
      }
    });
    // res.send(result); // Hello world!
    client.end();
  } catch (e) {
    return e;
  }

  /*let p1 = new Promise((resolve, reject) => {
    let total = [];
    let result = {};
    let sql_req = `SELECT * from "public".packing_shifts WHERE pack_date between ${start_result} and ${end_result}`;
    let query = client.query(sql_req);
    query.on(row => console.log(row));
    setTimeout(() => resolve(total), 1000);
  });
  p1.then(values => {
    result = values;
    res.send(result);
  }).catch(e => {
    return e === "Нет ответа от сервера";
  });*/
};
