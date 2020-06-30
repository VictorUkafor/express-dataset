const Datastore = require('nedb');
const db = new Datastore({ filename : 'database', autoload: true });

db.loadDatabase();

module.exports = db;