import Redshift from 'node-redshift'
import dotenv from 'dotenv'

dotenv.config()

// const client = {
//     user: process.env.REDSHIFT_USER,
//     database: process.env.REDSHIFT_DATABASE,
//     password: process.env.REDSHIFT_PASSWORD,
//     port: process.env.REDSHIFT_PORT,
//     host: process.env.REDSHIFT_HOST,
// }

const client = {
    user: 'colt',
    database: 'datawarehousedev',
    password: 'Z4puf8K0uj',
    port: 5439,
    host: 'datawarehousedev.cjvot3egkzt4.us-east-1.redshift.amazonaws.com'
}

const RedshiftClient = new Redshift(client)

export default RedshiftClient