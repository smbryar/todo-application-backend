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

const exampleTasks = [
  {
    id: 1,
    name: "Tidying",
    taskDetails: "Sort through paperwork",
    startDate: "2020-06-06",
    endDate: "2020-06-11",
    completed: false,
    repeats: false
  },
  {
    id: 2,
    name: "Cleaning",
    taskDetails: "Clean bathrooms",
    startDate: "2020-06-05",
    endDate: "2020-06-10",
    completed: false,
    repeats: true,
    repeatType: "repeatsAfterCompletion",
    repeatAfterCompletionFrequency: 7,
    repeatAfterCompletionFrequencyType: "days"
  },
  {
    id: 3,
    name: "Hoovering",
    taskDetails: "Downstairs",
    startDate: "2020-06-03",
    endDate: "2020-06-04",
    completed: true,
    completeDate: "2020-04-26",
    repeats: false
  },
  {
    id: 4,
    name: "Post Letter",
    taskDetails: "Return to sender",
    startDate: "2020-06-03",
    endDate: "2020-06-10",
    completed: false,
    repeats: false
  },
  {
    id: 5,
    name: "Tesco Order",
    startDate: "2020-06-01",
    endDate: "2020-06-03",
    completed: false,
    repeats: false
  }
];

app.get("/tasks", function(req, res) {
  const query = "SELECT * FROM Tasks;";

  connection.query(query, function (error, data) {
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

});

app.post("/tasks", function(req, res) {
  const userIDValue = req.body.userID;
  const nameValue = req.body.name;
  const taskDetailsValue = req.body.taskDetails;
  const startDateValue = req.body.startDate;
  const endDateValue = req.body.endDate;
  const repeatsValue = req.body.repeats;
  const repeatTypeValue = req.body.repeatType;
  const repeatAfterCompletionFrequencyValue = req.body.repeatAfterCompletionFrequency;
  const repeatAfterCompletionFrequencyTypeValue = req.body.repeatAfterCompletionFrequencyType;
  const completedValue = req.body.completed;
  
  const query = "INSERT INTO Tasks (userID, name, taskDetails, startDate, endDate, repeats, repeatType, repeatAfterCompletionFrequency, repeatAfterCompletionFrequencyType, completed) VALUES (?,?,?,?,?,?,?,?,?,?);";
  const querySelect = "SELECT * FROM Tasks WHERE taskID = ?"

  connection.query(query, [userIDValue, nameValue, taskDetailsValue, startDateValue, endDateValue, repeatsValue, repeatTypeValue, repeatAfterCompletionFrequencyValue, repeatAfterCompletionFrequencyTypeValue, completedValue], function (error, data) {
    if (error) {
      console.log("Error adding task", error);
      res.status(500).json({
        error: error
      })
    }
    else {
      connection.query(querySelect, [data.insertId], function(error, data) {
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

app.delete("/tasks/:taskId", function(req, res) {
  const taskId = req.params.taskId;  

  if (exampleTasks.some(task => task.id.toString() === taskId)) {
    res.status(200).send({
      "message": `You issued a delete request for ID: ${taskId}`
    });
  }
  else {
    res.status(404).send({
      "message": `Task with id ${taskId} does not exist`
    });
  }
});

app.put("/tasks/:taskId", function(req, res) {
  const taskId = req.params.taskId;
  
  if (exampleTasks.some(task => task.id.toString() === taskId)) {
    res.status(200).send({
      "message": `You issued a put request for ID: ${taskId}`
    });
  }
  else {
    res.status(404).send({
      "message": `Task with id ${taskId} does not exist`
    });
  }
});

module.exports.tasks = serverless(app);