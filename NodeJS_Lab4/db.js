const mysql = require('mysql2/promise');

const query = async(query, params=[])=>{
let connection;
    try{
     connection=await mysql.createConnection({
  host: 'localhost',
  user: '',     
  password: '',
    database: 'users'               

});
const[results, fields]=await connection.execute(query,params);
return results;
}
catch (err) {
    console.error('Database query error:', err);
    throw err;
  } finally {
    if (connection) await connection.end(); 
  }
};


module.exports = query;
