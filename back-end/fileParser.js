const csv = require("csv-parser");
const fs = require("fs");

function parseCSV(file, _list) {
  return new Promise((resolve, reject) => {
    fs.access(file, fs.constants.F_OK, (err) => {
      if (err) {
        reject(new Error("File does not Exist"));
        return;
      }
    });

    fs.createReadStream(file)
      .pipe(csv({ skip_lines_with_empty_values: true }))
      .on("data", (data) => {
        if (
          data.Shotty.trim() !== "" &&
          data.Officer.trim() != "" &&
          data.Driver.trim() !== ""
        ) {
          data.Date = new Date(data.Date);
          _list.push(data);
        }
      })
      .on("end", () => {
        resolve(_list);
      })
      .on("error", (err) => {
        reject(new Error(err.message));
      });
  });
}

module.exports = parseCSV;
