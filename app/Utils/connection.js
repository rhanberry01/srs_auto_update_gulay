"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloseConnection = exports.GetConnection = void 0;
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const GetConnection = async (config) => {
    const tenantConnectionConfig = {
        client: 'mssql',
        connection: {
            server: config.ip,
            port: 1433,
            user: config.ms_mov_user,
            password: config.ms_mov_pass,
            database: config.ms_mov_db,
        },
        healthCheck: false,
        debug: false,
    };
    const connectionName = `tenant_${config.code}`;
    console.log(tenantConnectionConfig);
    if (!Database_1.default.manager.has(connectionName)) {
        Database_1.default.manager.add(connectionName, tenantConnectionConfig);
        Database_1.default.manager.connect(connectionName);
    }
};
exports.GetConnection = GetConnection;
const CloseConnection = async (connectionName) => {
    await Database_1.default.manager.close(connectionName, true);
};
exports.CloseConnection = CloseConnection;
//# sourceMappingURL=connection.js.map