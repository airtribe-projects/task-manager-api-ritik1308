const fs = require('fs');
const path = require('path');

const TASK_FILE = path.join(__dirname, '../task.json');


const readTasks = () => {
  const data = fs.readFileSync(TASK_FILE, 'utf8');
  const parsed = JSON.parse(data || '{}');
  return parsed.tasks || [];
};

const writeTasks = (tasks) => {
  fs.writeFileSync(TASK_FILE, JSON.stringify({ tasks }, null, 2));
};

const getNextId = (tasks) => {
  const ids = tasks.map(t => t.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
};

const addTask = (req, res) => {
  const { title, description, completed } = req.body;

  if (typeof title !== 'string' || typeof description !== 'string' || typeof completed !== 'boolean') {
    return res.status(400).send({ message: 'Invalid task data. Expected title, description (string), and completed (boolean).' });
  }

  const tasks = readTasks();
  const newTask = {
    id: getNextId(tasks),
    title,
    description,
    completed
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).send(newTask);
};

const getTaskById = (req, res) => {
  const tasks = readTasks();
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) return res.status(404).send({ message: 'Task not found' });
  res.send(task);
};

const deleteTask = (req, res) => {
  let tasks = readTasks();
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) return res.status(404).send({ message: 'Task not found' });

  tasks.splice(index, 1);
  writeTasks(tasks);

  res.send({ message: 'Task deleted' });
};

const updateTask = (req, res) => {
  let tasks = readTasks();
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) return res.status(404).send({ message: 'Task not found' });

  const { title, description, completed } = req.body;

  if (title && typeof title !== 'string') {
    return res.status(400).send({ message: 'Title must be a string' });
  }
  if (description && typeof description !== 'string') {
    return res.status(400).send({ message: 'Description must be a string' });
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).send({ message: 'Completed must be a boolean' });
  }

  if (title) task.title = title;
  if (description) task.description = description;
  if (completed !== undefined) task.completed = completed;

  writeTasks(tasks);
  res.send(task);
};

const getAllTasks = (req, res) => {
  const tasks = readTasks();
  res.status(200).send(tasks);
};

module.exports = {
  getTaskById,
  addTask,
  deleteTask,
  updateTask,
  getAllTasks, // add this line
};
