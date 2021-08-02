const { Client } = require("pg");
const env = require("../config/psql_config");

const conn = `postgres://${env.username}:${env.password}@${env.host}/${env.database}`; // connection config
const client = new Client({
  connectionString: conn,
  idle_in_transaction_session_timeout: 3000,
  query_timeout: 300,
});
client.connect();
/**
 * @param req date
 * @param res array of data for the period
 */

exports.getPackingShifts = (req, res) => {
  const all_result = {};
  const currentDateresult = [];
  const p1 = new Promise((resolve, reject) => {
    try {
      const st_arr = req.query.cur_date.split("-");
      const result_per = `${st_arr[2]}.${st_arr[1]}.${st_arr[0]}`; // formatting date to required format

      console.log(result_per);

      const sql_req = `SELECT Distinct pack_time, result from "public".packing_shifts WHERE pack_date ='${result_per}' and pack_time <='19:00:00' `;
      client.query(sql_req, (err, result) => (err
        ? console.log(err.stack)
        : currentDateresult.push(result.rows)));

      setTimeout(() => resolve(currentDateresult), 500); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 500);
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

      const sql_req = `SELECT Distinct pack_time, result from "public".packing_shifts WHERE pack_date ='${result_per}' and pack_time between '20:00:00' and '23:00:00'`;
      client.query(sql_req, (err, result) => (err
        ? console.log(err.stack)
        : pastDateresult.push(result.rows)));

      setTimeout(() => resolve(pastDateresult), 500); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 500);
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

exports.clientPivotRefreshDayShift = (req, res) => {
  let picking_day = {};
  const currentDateresult = [];
  const p1 = new Promise((resolve, reject) => {
    try {
      const st_arr = req.query.cur_date.split("-");
      const result_per = `${st_arr[2]}.${st_arr[1]}.${st_arr[0]}`; // formatting date to required format

      console.log(result_per);

      const sql_req = `SELECT worker, pick_time from picking_shifts WHERE pick_date ='${result_per}' and pick_time >= '08:00:00' and pick_time <= '19:00:00'`;
      client.query(sql_req, (err, result) => (err
        ? console.log(err.stack)
        : currentDateresult.push(result.rows)));

      setTimeout(() => resolve(currentDateresult), 500); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 500);
    } catch (e) {
      console.log(e);
    }
  });
  p1.then(values => {
    picking_day = values;
    console.log(picking_day.flat(2));
    console.log(values);
    res.send(picking_day.flat(2));
  })
    .catch((e) => {
      console.log(e, "No response from the server");
    });
};

exports.clientPivotRefreshNightShift = (req, res) => {
  let picking_night = {};
  const pastDateresult = [];
  const p2 = new Promise((resolve, reject) => {
    try {
      const st_arr_cur = req.query.cur_date.split("-");
      const result_per_cur = `${st_arr_cur[2]}.${st_arr_cur[1]}.${st_arr_cur[0]}`; // formatting date to required format

      const st_arr_past = req.query.past_date.split("-");
      const result_per_past = `${st_arr_past[2]}.${st_arr_past[1]}.${st_arr_past[0]}`; // formatting date to required format

      const sql_req = `SELECT worker, pick_time from picking_shifts WHERE pick_date ='${result_per_cur}' and pick_time between '00:00:00' and '07:00:00'
      union all 
      SELECT worker, pick_time from picking_shifts WHERE pick_date ='${result_per_past}' and pick_time between '20:00:00' and '23:00:00'`;
      client.query(sql_req, (err, result) => (err
        ? console.log(err.stack)
        : pastDateresult.push(result.rows)));

      setTimeout(() => resolve(pastDateresult), 500); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 500);
    } catch (e) {
      console.log(e);
    }
  });
  p2.then(values => {
    picking_night = values;
    console.log(picking_night.flat(2));
    res.send(picking_night.flat(2));
  })
    .catch((e) => {
      console.log(e, "No response from the server");
    });
};
