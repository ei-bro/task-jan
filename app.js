console.clear();
const express = require('express');
const app = express()
const port = 5000

// mysql connecction
const { connect } = require('./connect');

// table schema
app.get("/install", (req, res) => {
    const installTable = ` CREATE TABLE if not exists Task (
    id INT NOT NULL AUTO_INCREMENT,
	task_name VARCHAR(255),
	completed BOOLEAN DEFAULT false,
	PRIMARY KEY (id)
) `;
    connect.query(installTable, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.send("table create");
        }
    });
});


app.use(express.json())



// create task
app.post("/create", (req, res) => {
    const name = req.body.name;
    console.log(req.body);
    if (!name) {
        return res.status(401).send("plese provide data");
    }
    const createTask = `INSERT INTO task (task_name) VALUES ("${name}") `;

    connect.query(createTask, (err, result) => {
        if (err) {
            console.log(err);
            return res.send(err);
        } else {
            return res.status(201).send("task created");
        }
    });
});


// get all tasks
app.get("/all-tasks", (req, res) => {
    const allTasks = `SELECT * FROM Task;`;
    connect.query(allTasks, (err, result) => {
        if (err) {
            return res.status(500).json({ msg: err });
        } else {
            return res.status(200).json({ result });
        }
    });
});


// get single task
app.get("/task/:id", (req, res) => {
    const id = req.params.id;

    const singleTask = `SELECT * FROM Task WHERE id ="${id}";`;
    connect.query(singleTask, (err, result) => {
        if (err) {
            return res.status(500).json({ msg: err });
        }

        if (result.length < 1) {
            return res.status(404).send(`No task with id : ${id}`);
        } else {
            return res.status(200).json({ result });
        }
    });
});


// update task
app.patch("/task/:id", (req, res) => {
    const id = req.params.id;
    // console.log(id);
    let name = req.body.name;
    let completed = req.body.completed;

    if (completed) {
        completed = 1;
    }
    // console.log(req.body);

    const updateTask = `UPDATE task
	SET ${name ? `task_name = "${name}",` : ""}
		completed = ${completed}
		WHERE id=${id}`;
    console.log(updateTask)

    connect.query(updateTask, (err, result) => {
        if (err) {
            console.log(err);
            return res.send(err.message);
        } else {
            if (result.affectedRows == 0) {
                return res.status(404).send(`No task with id : ${id}`);
            }
            const singleTask = `SELECT * FROM Task WHERE id ="${id}";`;
            connect.query(singleTask, (err, result) => {
                if (err) {
                    return res.status(500).json({ msg: err });
                } else {
                    return res.status(200).json({ result });
                }
            });
        }
    });
});


app.listen(port, (err) => {
    if (err) {
        console.log(err.message)
    }
    else {
        console.log(`http://localhost:${port}`)
    }
})