const pool = require("../db");

const getAllTasks = async (req, res, next) => {
  try {
    const allTasks = await pool.query("select * from task");
    res.json(allTasks.rows);
  } catch (error) {
    next(error)
  }
};

const getTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await pool.query("select * from task where id=$1", [id]);
    if (task.rows.length <= 0)
      return res.status(404).json({
        message: "Task not found",
      });

    res.json(task.rows[0]);
  } catch (error) {
    next(error)
  }
};

const createTask = async (req, res, next) => {
  const { title, description } = req.body;

  try {
    const result = await pool.query(
      "insert into task (title, description) values ($1,$2) returning *",
      [title, description]
    );

    res.json(result.rows[0]);
  } catch (error) {
    //res.json({ error: error.message });
    next(error)
  }
};

const deleteTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await pool.query("delete from task where id=$1", [id]);
    if (task.rowCount <= 0)
      return res.status(404).json({
        message: "Task not found",
      });
    return res.sendStatus(204);
  } catch (error) {
    //res.json({ error: error.message });
    next(error)
  }
};

const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const task = await pool.query(
      "update task set title=$2, description=$3 where id=$1 returning *",
      [id, title, description]
    );
    if (task.rowCount <= 0)
      return res.status(404).json({
        message: "Task not found",
      });
    return res.json(task.rows[0]);
  } catch (error) {
    //res.json({ error: error.message });
    next(error)
  }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
};
