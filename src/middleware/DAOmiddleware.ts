import { Pool } from 'pg';


    // set these on the machine running under system variables for enviorment variables
export const mypool = new Pool({
    port: 5432,
    user: process.env['DB_USERNAME'],
    host: process.env['DB_URL'],
    database: process.env['DB_NAME'],
    password: process.env['DB_PASSWORD'],
    max: 5
});
