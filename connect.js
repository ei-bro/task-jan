const mysql = require('mysql2');

const connect = mysql.createConnection({
    user: "task-admin",
    host: "localhost",
    database: "task-jan",
    password: "123456789",
    port: "33306"
})

// connect.connect((err) => {
//     if (err) {
//         console.log(err.message)
//     }
//     else {
//         console.log("connected")
//     }
// })

module.exports = { connect }