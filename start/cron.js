"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const request_promise_1 = __importDefault(require("request-promise"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const API_URL = 'http://' + Env_1.default.get('HOST', '') + ':' + Env_1.default.get('PORT', '');
const RequestCron = (obj) => {
    node_cron_1.default.schedule(obj.time, function () {
        request_promise_1.default(obj.url)
            .then((data) => {
            console.log(data);
        })
            .catch((err) => {
            console.log('error', err);
        });
        console.log('scheduler running ...');
    });
};
const RequestCronApiGulay = () => {
    const url = API_URL + '/update_weighing_scale';
    const time = '*/10 * * * *';
    RequestCron({ url, time });
};
const RequestCronApiPosSrp = () => {
    const url = API_URL + '/update_pos_srp';
    const time = '*/5 * * * *';
    RequestCron({ url, time });
};
RequestCronApiPosSrp();
RequestCronApiGulay();
//# sourceMappingURL=cron.js.map