"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const app = (0, express_1.default)();
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
// Create a new connection to the MySQL database
// const connection: Connection = createConnection({
//   host: 'localhost',
//   user: 'your_username',
//   password: 'your_password',
//   database: 'your_database',
// });
// Open the .csv file and create a new csv parser instance
const fileStream = fs.createReadStream(`${__dirname}/data.csv`);
const csvParser = (0, csv_parser_1.default)({
    headers: true,
});
// Store the records in an array
const records = [];
csvParser.on("data", (row) => {
    console.log(row);
    records.push(row);
});
// Insert the records into the database using a bulk insert method
csvParser.on("end", () => {
    const placeholders = records.map(() => "(?, ?)").join(",");
    const values = records.reduce((acc, row) => acc.concat([row.column1, row.column2]), []);
    console.log("placeholder::", placeholders);
    // const query = `INSERT INTO table_name (column1, column2) VALUES ${placeholders}`;
    // connection.query(query, values, (err: any, res: any) => {
    //   if (err) {
    //     console.error(err.stack);
    //   } else {
    //     console.log(res.affectedRows);
    //   }
    // });
    console.log("Finished parsing CSV file");
});
// Start the parsing process
fileStream.pipe(csvParser);
//# sourceMappingURL=server.js.map