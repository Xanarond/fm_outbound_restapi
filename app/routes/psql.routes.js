const { Client } = require("pg");
const env = require("../config/psql_config");

const conn = `postgres://${env.username}:${env.password}@${env.host}/${env.database}`; // connection config
const client = new Client({
  connectionString: conn,
  idle_in_transaction_session_timeout: 3000,
  // query_timeout: 300,
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

      // console.log(result_per);
      //
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

      // console.log(result_per);

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
      // console.log(all_result.cur_date, all_result.past_date);
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
    /* console.log(picking_day.flat(2));
        console.log(values); */
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
  p1.then(values => {
    picking_night = values;
    // console.log(picking_night.flat(2));
    res.send(picking_night.flat(2));
  })
    .catch((e) => {
      console.log(e, "No response from the server");
    });
};

exports.clientProgressMonitoring = (req, res) => {
  let progress_monitoring = {};
  const progress_buff = [];
  const p1 = new Promise((resolve, reject) => {
    try {
      const sql_req = `SELECT "Picking Consol No." as "Con No", "PGI Datetime", "Number of Tasks" as "Total", "To Be Picked", "To Be Consolidated" as "To Be Consol", "Mezzanine ULD" as "Mezz", "HVA ULD" as "HVA", "Final ULD" as "Rack", "Packing Status", "Manifest Packing Status",
        (CASE
            WHEN "To Be Picked" = '0'
            AND "To Be Consolidated" = '0' THEN 'All Consoled'
            WHEN "To Be Picked" != '0' AND
            "To Be Consolidated" != '0' OR
            "To Be Consolidated" = '0' THEN 'Progress' WHEN "To Be Picked" = '0' AND
            "To Be Consolidated" != '0' THEN 'All Picked' END) as "Status"
            FROM "public".progress_monitoring`;
      client.query(sql_req, (err, result) => (err
        ? console.log(err.stack)
        : progress_buff.push(result.rows)));

      setTimeout(() => resolve(progress_buff), 500); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 500);
    } catch (e) {
      console.log(e);
    }
  });
  p1.then(values => {
    progress_monitoring = values;
    // console.log(progress_monitoring);
    res.send(progress_monitoring);
  })
    .catch((e) => {
      console.log(e, "No response from the server");
    });
};

exports.clientPivotNotPicked = (req, res) => {
  let not_picked = {};
  const cur_not_picked = [];
  const p1 = new Promise((resolve, reject) => {
    try {
      const st_arr = req.query.cur_date.split("-");
      const result_per = `${st_arr[2]}.${st_arr[1]}.${st_arr[0]}`; // formatting date to required format

      // console.log(result_per);

      const sql_req = `SELECT "PGI", "B01", "B03-04", "B16-18", "DUMMY", "ENT", "HVA", "MEZ", "TOF" FROM "Not_Picked" WHERE "PGI" like '${result_per}%'`;
      client.query(sql_req, (err, result) => (err
        ? console.log(err.stack)
        : cur_not_picked.push(result.rows)));

      setTimeout(() => resolve(cur_not_picked), 500); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 500);
    } catch (e) {
      console.log(e);
    }
  });
  p1.then(values => {
    not_picked = values;
    /* console.log(not_picked.flat(2));
        console.log(values); */
    res.send(not_picked.flat(2));
  })
    .catch((e) => {
      console.log(e, "No response from the server");
    });
};

exports.ClientPivotPickTask = (req, res) => {
  let pick_task = {};
  const cur_pick = [];
  const p1 = new Promise((resolve, reject) => {
    try {
      const st_arr = req.query.cur_date.split("-");
      const result_per = `${st_arr[2]}.${st_arr[1]}.${st_arr[0]}`; // formatting date to required format

      console.log(result_per);

      const sql_req = `SELECT "Operation Area Code", "Number of Pick Task", "Not Picked", "Pick Consolidated", "Not Pick Consolidated", Concat("Progress", '%') as "Progress" FROM "Pick_Task" WHERE "Date" = '${result_per}'`;
      client.query(sql_req, (err, result) => (err
        ? console.log(err.stack)
        : cur_pick.push(result.rows)));

      setTimeout(() => resolve(cur_pick), 500); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 500);
    } catch (e) {
      console.log(e);
    }
  });
  p1.then(values => {
    pick_task = values;
    /* console.log(pick_task.flat(2));
        console.log(values); */
    res.send(pick_task.flat(2));
  })
    .catch((e) => {
      console.log(e, "No response from the server");
    });
};

exports.clientInboundDashboard = (req, res) => {
  let Inbound = {};
  const cur_inb = [];
  const p1 = new Promise((resolve, reject) => {
    try {
      // console.log(result_per);

      const sql_req = `SELECT "Num", type_postavki, plan_date, nomer_truck, status, date_startunload, time_startunload, time_endunload, nomer_postavki FROM public.rninbound`;
      client.query(sql_req, (err, result) => (err
        ? console.log(err.stack)
        : cur_inb.push(result.rows)));

      setTimeout(() => resolve(cur_inb), 500); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 500);
    } catch (e) {
      console.log(e);
    }
  });
  p1.then(values => {
    Inbound = values;
    /* console.log(pick_task.flat(2));
            console.log(values); */
    res.send(Inbound.flat(2));
  })
    .catch((e) => {
      console.log(e, "No response from the server");
    });
};
