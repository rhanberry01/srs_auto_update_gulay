"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WeighingScales_1 = global[Symbol.for('ioc.use')]("App/Models/WeighingScales");
const lodash_1 = require("lodash");
const csvtojson_1 = __importDefault(require("csvtojson"));
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
const csv_stringify_1 = __importDefault(require("csv-stringify"));
const underscore_1 = require("underscore");
const child_process_1 = require("child_process");
class WeighingScalesController {
    GetPathCsv(ws_scale) {
        return `\\\\${ws_scale.w_s_path_folder_ip}\\${ws_scale.w_s_main_path_folder}\\${ws_scale.w_s_sub_path_folder}\\${ws_scale.w_s_plu_file_name}`;
    }
    GetCsvData(rowCsv, posProducts) {
        const outputExcel = [];
        lodash_1.each(rowCsv, function (row) {
            let pos_barcode = row.header2;
            let pos = underscore_1.findWhere(posProducts, { barcode: pos_barcode });
            let pos_product = (typeof pos === 'undefined') ? 0 : pos;
            let price = (pos_product == 0) ? row.header3 : pos_product.srp * 100;
            let barcode = (pos_product == 0) ? row.header2 : pos_product.barcode;
            let date_update = (pos_product == 0) ? row.header10 : moment_1.default().format('DD-MMM-YY');
            let excel = [
                row.header1,
                row.header2,
                (barcode == row.header2) ? price : row.header3,
                row.header4,
                row.header5,
                row.header6,
                row.header7,
                row.header8,
                row.header9,
                date_update
            ];
            outputExcel.push(excel);
        });
        return outputExcel;
    }
    createFile(data, csv_file_path) {
        return new Promise((resolve, reject) => {
            csv_stringify_1.default(data, function (err, output) {
                fs_1.default.writeFile(`${csv_file_path}`, output, (err) => {
                    if (err) {
                        reject(err);
                    }
                    return resolve(true);
                });
            });
        });
    }
    RunBatchFile(ws_scale) {
        const path = `C:\\${ws_scale.w_s_main_path_folder}\\${ws_scale.w_s_sub_path_folder}\\${ws_scale.w_s_transmitter_name}`;
        const bat = child_process_1.spawn('cmd.exe', ['/c', path]);
        bat.stdout.on('data', async (data) => {
            console.log(data.toString());
        });
        bat.stderr.on('data', async (data) => {
            console.log(data.toString());
        });
        bat.on('exit', (code) => {
            console.log(code + ' exit');
        });
    }
    async index() {
        const ws_scale = await WeighingScales_1.GetWeighingScale();
        const csvPath = this.GetPathCsv(ws_scale);
        const rowCsv = await csvtojson_1.default({
            noheader: true,
            headers: ['header1', 'header2', 'header3', 'header4', 'header5', 'header6', 'header7', 'header8', 'header9', 'header10'],
        }).fromFile(csvPath);
        const posProducts = await WeighingScales_1.GetPosProducts();
        const csvData = this.GetCsvData(rowCsv, posProducts);
        await fs_1.default.unlinkSync(csvPath);
        await this.createFile(csvData, csvPath);
        await this.createFile(csvData, csvPath.replace('GULAY', 'MEAT'));
        this.RunBatchFile(ws_scale);
        return { message: 'Update PLU' };
    }
    async UpdatePosSrp() {
        const fresh = await WeighingScales_1.GetFreshSrp();
        if (fresh.length > 0) {
            for (const items of fresh) {
                await WeighingScales_1.UpdatePosSrp(items);
            }
        }
        return { message: 'Update SRP POS' };
    }
}
exports.default = WeighingScalesController;
//# sourceMappingURL=WeighingScalesController.js.map