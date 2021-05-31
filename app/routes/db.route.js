const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("outm_db", err => {
  if (err) {
    return console.error(err.message);
  }
  return console.log("Connected to the in-memory SQlite database.");
});

exports.clientDBRefresh = (req, res) => {
  const result = {};
  const statusData = [];
  const p1 = new Promise((resolve, reject) => {
    db.parallelize(() => {
      db.each(
        `SELECT time, result
                     FROM shifts ORDER BY time ASC`,
        (err, row) => {
          if (err) {
            console.error(err.message);
          }
          statusData.push(row);
          setTimeout(() => resolve(statusData), 100);
          setTimeout(() => reject(new Error("Something went wrong!")), 1000);
          // console.log(row.time + "\t" + row.result);
        },
      );
    });
  });
  const shiftResp = [];
  const p2 = new Promise((resolve, reject) => {
    db.parallelize(() => {
      db.each(
        `SELECT id, name, shift
                     FROM resp_persons
                     ORDER BY id ASC`,
        (err, row) => {
          if (err) {
            console.error(err.message);
          }
          shiftResp.push(row);
          setTimeout(() => resolve(shiftResp), 100);
          setTimeout(() => reject(new Error("Something went wrong!")), 1000);
          // console.log(row.id + "\t" + row.name + "\t" + row.shift);
        },
      );
    });
  });

  Promise.all([
    p1, // передача данных для target
    p2, // ответственные на смену
  ]).then(([firstp, secondp]) => {
    result.shift_stat = firstp;
    result.persons = secondp;
    res.send(result);
  });
};

exports.clientPivotRefreshDay = (req, res) => {
  let resultPivot = {};
  const pivotData = [];
  const p1 = new Promise((resolve, reject) => {
    db.serialize(() => {
      db.each(
        `SELECT person, pick_time
                     FROM day_pivot Where pick_time >= '08:00' and pick_time <= '19:00' ORDER BY person ASC`,
        (err, row) => {
          if (err) {
            console.error(err.message);
          }
          pivotData.push(row);
          setTimeout(() => resolve(pivotData), 1000);
          setTimeout(() => reject(new Error("Something went wrong!")), 1000);
        },
      );
    });
  });
  p1.then(values => {
    resultPivot = values;
    res.send(resultPivot);
  });
};

exports.clientPivotRefreshNight = (req, res) => {
  let result = {};
  const pivotData = [];
  const p1 = new Promise((resolve, reject) => {
    db.serialize(() => {
      db.each(
        `SELECT * FROM (
            SELECT * FROM day_pivot Where pick_time between '20:00' and '23:00' Order by pick_time ASC
            ) a
        UNION ALL
    select * from (
            SELECT * FROM day_pivot Where pick_time between '00:00' and '07:00' Order by pick_time ASC
   )`,
        (err, row) => {
          if (err) {
            console.error(err.message);
          }
          pivotData.push(row);
          setTimeout(() => resolve(pivotData), 1000);
          setTimeout(() => reject(new Error("Something went wrong!")), 1000);
        },
      );
    });
  });
  p1.then(values => {
    result = values;
    res.send(result);
  });
};

exports.clientProgressMonitoring = (req, res) => {
  let result = {};
  const pivotData = [];
  const p1 = new Promise((resolve, reject) => {
    db.serialize(() => {
      db.each(
        `SELECT [Picking Consol No.] AS [Con No],
       [PGI Datetime],
       [Number of Tasks] AS Total,
       [To Be Picked],
       [To Be Consolidated] AS [To Be Consol],
       [Mezzanine ULD] AS Mezz,
       [HVA ULD] AS HVA,
       [Final ULD] AS Rack,
       [Packing Status],
       [Manifest Packing Status],
       (CASE WHEN [To Be Picked] = 0 AND 
                  [To Be Consolidated] = 0 THEN 'All Consoled' WHEN [To Be Picked] != 0 AND 
                  [To Be Consolidated] != 0 OR 
                  [To Be Consolidated] = 0 THEN 'Progress' WHEN [To Be Picked] = 0 AND 
                  [To Be Consolidated] != 0 THEN 'All Picked' END) AS Status
  FROM progress_monitoring`,
        (err, row) => {
          if (err) {
            console.error(err.message);
          }
          pivotData.push(row);
          setTimeout(() => resolve(pivotData), 1000);
          setTimeout(() => reject(new Error("Something went wrong!")), 1000);
        },
      );
    });
  });
  p1.then(values => {
    result = values;
    res.send(result);
  });
};
