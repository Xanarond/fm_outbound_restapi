const { Client } = require("pg");
const env = require("../config/psql_config");

/**
 * @param req date
 * @param res array of data for the period
 */
exports.getPackingShifts = (req, res) => {
  const conn = `postgres://${env.username}:${env.password}@${env.host}/${env.database}`;
  const all_result = {};
  const currentDateresult = [];
  const p1 = new Promise((resolve, reject) => {
    try {
      const st_arr = req.query.cur_date.split("-");
      const result_per = `${st_arr[2]}.${st_arr[1]}.${st_arr[0]}`; // formatting date to required format

      console.log(result_per);

      const client = new Client({ connectionString: conn }); // instance of connection PostgreSQL
      client.connect();

      const sql_req = `SELECT Distinct pack_time, result from "public".packing_shifts WHERE pack_date ='${result_per}' and pack_time <='19:00:00' `;
      client.query(sql_req, (err, result) => (err ? console.log(err.stack) : currentDateresult.push(result.rows)));

      setTimeout(() => resolve(currentDateresult), 1000); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 1000);
    } catch (e) {
      console.log(e);
    }
  });

  const pastDateresult = [];
  const p2 = new Promise((resolve, reject) => {
    try {
      const st_arr = req.query.past_date.split("-");
      const result_per = `${st_arr[2]}.${st_arr[1]}.${st_arr[0]}`; // formatting date to required format

      console.log(result_per);

      const client = new Client({ connectionString: conn }); // instance of connection PostgreSQL
      client.connect();

      const sql_req = `SELECT Distinct pack_time, result from "public".packing_shifts WHERE pack_date ='${result_per}' and pack_time between '20:00:00' and '23:00:00'`;
      client.query(sql_req, (err, result) => (err ? console.log(err.stack) : pastDateresult.push(result.rows)));

      setTimeout(() => resolve(pastDateresult), 1000); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 1000);
    } catch (e) {
      console.log(e);
    }
  });
  Promise.all([p1, p2])
    .then(([firstp, secondp]) => {
      all_result.cur_date = firstp;
      all_result.past_date = secondp;
      console.log(all_result.cur_date, all_result.past_date);
      res.send(all_result);
    })
    .catch((e) => {
      console.log(e, "No response from the server");
    });
};
