const express = require('express');
const router = express.Router();
const {
  addTask,
  getTaskById,
  updateTask,
  deleteTask,
  getAllTasks,
} = require('../controller/taskController');

// REST endpoints
router.post('/', addTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/',getAllTasks);

// (optional) You may also want a GET /tasks endpoint


module.exports = router;
