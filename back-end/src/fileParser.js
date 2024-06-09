const csv = require("csv-parser");
const stream = require("stream");

function parseCSV(buffer, _list) {
  return new Promise((resolve, reject) => {
    const readable = new stream.Readable();
    readable._read = () => {}; // _read is required but you can noop it
    readable.push(buffer);
    readable.push(null);

    readable
      .pipe(csv({ skip_lines_with_empty_values: true }))
      .on("data", (data) => {
        if (
          data.Shotty.trim() !== "" &&
          data.Officer.trim() !== "" &&
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
