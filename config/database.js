"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const databaseConfig = {
    connection: Env_1.default.get('DB_CONNECTION'),
    connections: {
        mysql: {
            client: 'mysql',
            connection: {
                host: Env_1.default.get('MYSQL_HOST'),
                port: Env_1.default.get('MYSQL_PORT'),
                user: Env_1.default.get('MYSQL_USER'),
                password: Env_1.default.get('MYSQL_PASSWORD', ''),
                database: Env_1.default.get('MYSQL_DB_NAME'),
            },
            healthCheck: false,
            debug: false,
        },
        sales_report: {
            client: 'mysql',
            connection: {
                host: Env_1.default.get('MYSQL_HOST_1'),
                port: Env_1.default.get('MYSQL_PORT_1'),
                user: Env_1.default.get('MYSQL_USER'),
                password: Env_1.default.get('MYSQL_PASSWORD_1', ''),
                database: Env_1.default.get('MYSQL_DB_NAME_1'),
            },
            healthCheck: false,
            debug: false,
        },
        mssql: {
            client: 'mssql',
            connection: {
                user: Env_1.default.get('MSSQL_USER'),
                port: parseInt(Env_1.default.get('MSSQL_PORT')),
                server: Env_1.default.get('MSSQL_SERVER'),
                password: Env_1.default.get('MSSQL_PASSWORD', ''),
                database: Env_1.default.get('MSSQL_DB_NAME'),
            },
            healthCheck: false,
            debug: false,
        }
    },
    orm: {},
};
exports.default = databaseConfig;
//# sourceMappingURL=database.js.map