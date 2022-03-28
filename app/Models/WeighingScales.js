"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePosSrp = exports.GetFreshSrp = exports.GetBranches = exports.GetWeighingScale = exports.GetPosProducts = void 0;
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const lodash_1 = require("lodash");
const moment_1 = __importDefault(require("moment"));
const GetPosProducts = async () => {
    const row = await Database_1.default.connection('mssql')
        .from('POS_Products as a')
        .select('a.description', 'a.srp', 'a.barcode', 'b.levelfield1code', 'b.levelfield2code')
        .innerJoin('products as b', 'a.productid', 'b.productid')
        .where('UOM', 'KG');
    return row;
};
exports.GetPosProducts = GetPosProducts;
const GetWeighingScale = async () => {
    const row = await Database_1.default.from('0_branch_weighing_scale')
        .andWhere('w_s_type', 1);
    return row[0];
};
exports.GetWeighingScale = GetWeighingScale;
const GetBranches = async () => {
    const connection = await Database_1.default.from('transfers.0_branches');
    if (connection.length === 0) {
        throw new Error('Failed to fetch branches');
    }
    return connection;
};
exports.GetBranches = GetBranches;
const GetFreshSrp = async () => {
    if (lodash_1.isEmpty(Env_1.default.get('BRANCH_CODE'))) {
        throw new Error('No branch code set env');
    }
    const row = await Database_1.default.connection('sales_report')
        .from('fresh_updater')
        .select('barcode', 'productid', 'markup', 'srp', 'status')
        .where('branchcode', Env_1.default.get('BRANCH_CODE'))
        .andWhere('status', 0);
    return row;
};
exports.GetFreshSrp = GetFreshSrp;
const UpdatePosSrp = async (data) => {
    await Database_1.default.connection('mssql')
        .from('POS_Products')
        .where('barcode', `${data.barcode}`)
        .andWhere('productid', `${data.productid}`)
        .update({
        productid: data.productid,
        barcode: data.barcode,
        srp: data.srp,
        markup: data.markup,
        lastdatemodified: moment_1.default().format('YYYY-MM-DD h:mm:ss')
    });
    await Database_1.default.connection('sales_report')
        .from('fresh_updater')
        .where('barcode', data.barcode)
        .andWhere('productid', data.productid)
        .andWhere('branchcode', Env_1.default.get('BRANCH_CODE'))
        .update({ status: 1 });
};
exports.UpdatePosSrp = UpdatePosSrp;
//# sourceMappingURL=WeighingScales.js.map