const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "todo"
});


// Tasks table

app.get("/tasks", function (req, res) {
  const userIDValue = req.query.userID;
  
  if (userIDValue) {
    const queryGet = "SELECT * FROM Tasks WHERE userID = ?;";
    connection.query(queryGet, userIDValue, function (error, data) {
      if (error) {
        console.log("Error fetching tasks", error);
        res.status(500).json({
          error: error
        })
      }
      else {
        res.status(200).json({
          tasks: data
        })
      }
    });
  }
  else {
    const queryGet = "SELECT * FROM Tasks;"
    connection.query(queryGet, function (error, data) {
      if (error) {
        console.log("Error fetching tasks", error);
        res.status(500).json({
          error: error
        })
      }
      else {
        res.status(200).json({
          tasks: data
        })
      }
    });
  }
});

app.post("/tasks", function (req, res) {
  const task = req.body

  connection.query("INSERT INTO Tasks SET ?;", task, function (error, data) {
    if (error) {
      console.log("Error adding task", error);
      res.status(500).json({
        error: error
      })
    }
    else {
      connection.query("SELECT * FROM Tasks WHERE taskID = ?;", [data.insertId], function (error, data) {
        if (error) {
          console.log("Error selecting new task", error);
          res.status(500).json({
            error: error
          })
        }
        else {
          res.status(201).json({
            newTask: data
          })
        }
      })
    }
  });
});

app.delete("/tasks/:taskId", function (req, res) {
  const taskIDValue = req.params.taskId;

  connection.query("DELETE FROM Tasks WHERE taskID = ?;", taskIDValue, function (error, data) {
    if (error) {
      console.log("Error deleting task", error);
      res.status(500).json({
        error: error
      })
    }
    else if (data.affectedRows === 0) {
      console.log("Task being deleted does not exist");
      res.status(404).send("Task being deleted does not exist");
    }
    else {
      res.sendStatus(200);
    }
  });
});

app.put("/tasks/:taskId", function (req, res) {
  const task = req.body;

  connection.query("UPDATE Tasks SET ? WHERE taskID = ?;", [task, req.params.taskId], function (error, data) {
    if (error) {
      console.log("Error updating task", error);
      res.status(500).json({
        error: error
      })
    }
    else if (data.affectedRows === 0) {
      console.log("Task being updated does not exist");
      res.status(404).send("Task being updated does not exist");
    }
    else if (data.changedRows === 0) {
      console.log("No changes were made to the task");
      res.status(500).send("No changes were made to the task");
    }
    else {
      res.sendStatus(200)
    }
  })
});


// Users table

app.get("/users", function (req, res) {
  const usernameValue = req.query.username;
  const userID = req.query.userID;

  if (usernameValue) {
    connection.query("SELECT * FROM Users WHERE username = ?;", usernameValue, function (error, data) {
      if (error) {
        console.log("Error fetching user", error);
        res.status(500).json({
          error: error
        })
      }
      else {
        res.status(200).json({
          user: data
        })
      }
    });
  }
  else if (userID) {
    connection.query("SELECT * FROM Users WHERE userID = ?;", userID, function (error, data) {
      if (error) {
        console.log("Error fetching user", error);
        res.status(500).json({
          error: error
        })
      }
      else {
        res.status(200).json({
          user: data
        })
      }
    });
  }
  else {
    connection.query("SELECT * FROM Users;", function (error, data) {
      if (error) {
        console.log("Error fetching users", error);
        res.status(500).json({
          error: error
        })
      }
      else {
        res.status(200).json({
          users: data
        })
      }
    });
  }

});

app.post("/users", function (req, res) {
  const user = req.body

  connection.query("INSERT INTO Users SET ?;", user, function (error, data) {
    if (error) {
      console.log("Error adding user", error);
      res.status(500).json({
        error: error
      })
    }
    else {
      connection.query("SELECT * FROM Users WHERE userID = ?;", [data.insertId], function (error, data) {
        if (error) {
          console.log("Error selecting new user", error);
          res.status(500).json({
            error: error
          })
        }
        else {
          res.status(201).json({
            newUser: data
          })
        }
      })
    }
  });
});

app.delete("/users/:userId", function (req, res) {
  connection.query("DELETE FROM Users WHERE userID = ?;", req.params.userId, function (error, data) {
    if (error) {
      console.log("Error deleting user", error);
      res.status(500).json({
        error: error
      })
    }
    else if (data.affectedRows === 0) {
      console.log("User being deleted does not exist");
      res.status(404).send("User being deleted does not exist");
    }
    else {
      res.sendStatus(200);
    }
  });
});

app.put("/users/:userId", function (req, res) {
  const userIDValue = req.params.userId;
  const usernameValue = req.body.username;

  connection.query("UPDATE Users SET username = ? WHERE userID = ?;", [usernameValue, userIDValue], function (error, data) {
    if (error) {
      console.log("Error updating user", error);
      res.status(500).json({
        error: error
      })
    }
    else if (data.affectedRows === 0) {
      console.log("User being updated does not exist");
      res.status(404).send("User being updated does not exist");
    }
    else if (data.changedRows === 0) {
      console.log("No changes were made to the user");
      res.status(500).send("No changes were made to the user");
    }
    else {
      res.sendStatus(200)
    }
  })
});


module.exports.tasks = serverless(app);
module.exports.users = serverless(app);