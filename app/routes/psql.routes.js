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

exports.clientPivotRefreshDayShift = (req, res) => {
  let picking_day = {};
  const currentDateresult = [];
  const p1 = new Promise((resolve, reject) => {
    try {
      const st_arr = req.query.cur_date.split("-");
      const result_per = `${st_arr[2]}.${st_arr[1]}.${st_arr[0]}`; // formatting date to required format

      const sql_req = `SELECT users.person as worker, pick_time, volume from picking_shifts JOIN users ON users.login_id = picking_shifts.worker WHERE pick_date ='${result_per}' and pick_time >= '08:00' and pick_time <= '19:00'`;
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
    res.send(picking_day.flat(2));
  })
    .catch((e) => {
      console.log(e, "No response from the server");
    });
};

exports.clientPivotRefreshNightShift = (req, res) => {
  let picking_night = {};
  const pastDateresult = [];
  const p1 = new Promise((resolve, reject) => {
    try {
      const { cur_date, past_date } = req.query;
      const st_arr_cur = cur_date.split("-");
      const result_per_cur = `${st_arr_cur[2]}.${st_arr_cur[1]}.${st_arr_cur[0]}`; // formatting date to required format

      const st_arr_past = past_date.split("-");
      const result_per_past = `${st_arr_past[2]}.${st_arr_past[1]}.${st_arr_past[0]}`; // formatting date to required format

      const sql_req = `SELECT users.person as worker, pick_time, volume from picking_shifts JOIN users ON users.login_id = picking_shifts.worker 
        WHERE pick_date ='${result_per_cur}' and pick_time between '00:00' and '07:00'
      union all 
      SELECT users.person as worker, pick_time, volume from picking_shifts JOIN users ON users.login_id = picking_shifts.worker 
      WHERE pick_date ='${result_per_past}' and pick_time between '20:00' and '23:00'
      `;
      client.query(sql_req, (err, result) => (err
        ? console.log(err.stack)
        : pastDateresult.push(result.rows)));

      setTimeout(() => resolve(pastDateresult), 500); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 500);
    } catch (e) {
      console.log(e);
    }
  });
  p1.then(values => {
    picking_night = values;
    res.send(picking_night.flat(2));
  })
    .catch((e) => {
      console.log(e, "No response from the server");
    });
};

exports.clientStockRefresh = (req, res) => {
  let stockTotal = {};
  const resultProduct = [];
  const p1 = new Promise((resolve, reject) => {
    try {
      const sql_req = `SELECT "TV", "AUDIO", "MON", "AC", "REF", "WM", "VC", "MWO" FROM public.product_volume;`;
      client.query(sql_req, (err, result) => (err
        ? console.log(err.stack)
        : resultProduct.push(result.rows)));

      setTimeout(() => resolve(resultProduct), 500); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 500);
    } catch (e) {
      console.log(e);
    }
  });
  p1.then(values => {
    stockTotal = values;
    res.send(stockTotal.flat(2));
  })
    .catch((e) => {
      console.log(e, "No response from the server");
    });
};

exports.clientStockPercent = (req, res) => {
  let stockPercent = {};
  const resultPercent = [];
  const p1 = new Promise((resolve, reject) => {
    try {
      const sql_req = `SELECT total, "A", "B", "C" FROM public."WH_volume";`;
      client.query(sql_req, (err, result) => (err
        ? console.log(err.stack)
        : resultPercent.push(result.rows)));

      setTimeout(() => resolve(resultPercent), 500); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 500);
    } catch (e) {
      console.log(e);
    }
  });
  p1.then(values => {
    stockPercent = values;
    res.send(stockPercent.flat(2));
  })
    .catch((e) => {
      console.log(e, "No response from the server");
    });
};
