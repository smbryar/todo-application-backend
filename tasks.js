const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

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
  res.status(200).send(exampleTasks);
});

app.post("/tasks", function(req, res) {
  const name = req.body.name;
  res.status(201).send({
    "message": `Received a request to add task: ${name}`
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

module.exports.handler = serverless(app);