import express from 'express';
const router = express.Router();
import { 
    addTask ,
    listTasks,
    updateTask,
    deleteTask
    } from '../controller/taskController.js';

router.post('/addTask', addTask);
router.get('/listTasks',listTasks)
router.post('/updateTask/:id',updateTask)
router.delete('/deleteTask/:id',deleteTask)


export default router;
