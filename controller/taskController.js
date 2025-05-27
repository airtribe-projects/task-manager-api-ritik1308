const fs = require('fs').promises;
const path = require('path');

const tasksFilePath = path.join(__dirname, '../tasks.json');

// Initialize with test data
const initialTasks = [
  {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true
  }
];

async function readTasks() {
  try {
    const data = await fs.readFile(tasksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeTasks(initialTasks);
      return initialTasks;
    }
    throw error;
  }
}

async function writeTasks(tasks) {
  await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
}

module.exports = {
  createTask: async (req, res) => {
    try {
      const { title, description, completed } = req.body;
      
      // Strict validation - all fields required for POST
      if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).send();
      }

      const tasks = await readTasks();
      const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        title,
        description,
        completed
      };

      tasks.push(newTask);
      await writeTasks(tasks);

      return res.status(201).send();
    } catch (error) {
      return res.status(500).send();
    }
  },

  getAllTasks: async (req, res) => {
    try {
      const tasks = await readTasks();
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).send();
    }
  },

  getTaskById: async (req, res) => {
    try {
      const tasks = await readTasks();
      const task = tasks.find(t => t.id === parseInt(req.params.id));
      
      if (!task) {
        return res.status(404).send();
      }
      
      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).send();
    }
  },

  updateTask: async (req, res) => {
    try {
      const { title, description, completed } = req.body;
      
      // All fields required for update
      if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).send();
      }

      const tasks = await readTasks();
      const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
      
      if (taskIndex === -1) {
        return res.status(404).send();
      }
      
      tasks[taskIndex] = {
        id: parseInt(req.params.id),
        title,
        description,
        completed
      };
      
      await writeTasks(tasks);
      return res.status(200).send();
    } catch (error) {
      return res.status(500).send();
    }
  },

  deleteTask: async (req, res) => {
    try {
      const tasks = await readTasks();
      const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
      
      if (taskIndex === -1) {
        return res.status(404).send();
      }
      
      tasks.splice(taskIndex, 1);
      await writeTasks(tasks);
      return res.status(200).send();
    } catch (error) {
      return res.status(500).send();
    }
  }
};