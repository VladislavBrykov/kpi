import {Knex, knex} from 'knex'


const config: Knex.Config = {
  client: 'pg',
  debug: false,
  connection: {
    user: 'colt',
    database: 'datawarehousedev',
    password: 'Z4puf8K0uj',
    port: 5439,
    host: 'datawarehousedev.cjvot3egkzt4.us-east-1.redshift.amazonaws.com'
  }
};
const KnexClient = knex(config)

export default KnexClient

