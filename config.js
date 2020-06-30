const Datastore = require('nedb');
const db = new Datastore({ filename : 'events', autoload: true });

db.loadDatabase();

module.exports = db;