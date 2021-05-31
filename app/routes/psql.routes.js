const { Client } = require("pg");
const env = require("../config/psql_config");

exports.getPackingShifts = (req, res) => {
  const conn = `postgres://${env.username}:${env.password}@${env.host}/${env.database}`;
  let result = {};
  let total = [];
  let p1 = new Promise((resolve, reject) => {
    try {
      let st_arr = req.query.period.split("-");
      let result_per = st_arr[2] + "." + st_arr[1] + "." + st_arr[0];

      console.log(result_per);

      const client = new Client({ connectionString: conn });
      client.connect();

      let sql_req = `SELECT * from "public".packing_shifts WHERE pack_date ='${result_per}'`;
      client.query(sql_req, (err, result) => {
        if (err) {
          console.log(err.stack);
        } else {
          console.log(result.rows);
          total.push(result.rows);
        }
      });
      setTimeout(() => resolve(total), 1000);
    } catch (e) {
      console.log(e);
    }
  });
  p1.then(values => {
    result = values;
    res.send(result);
  }).catch(e => {
    console.log(e, "Нет ответа от сервера");
  });
};
