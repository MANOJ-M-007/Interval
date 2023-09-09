import db from "../config/db.js";
import asyncHandler from 'express-async-handler';
import { cloudinary } from '../config/cloudinary.js';

export const addTask = asyncHandler(async (req, res) => {
    try {
        const { heading, description, date, time, priority, image } = req.body;
        const url = await cloudinary.uploader.upload(image, {
            folder: "interval",
        });
        const imageUrl = url.secure_url
        const query = 'INSERT INTO tasks (heading, description, date, time, image, priority, createat) VALUES (?, ?, ?, ?, ?, ?, ?)';

        db.query(query, [heading, description, date, time, imageUrl, priority, new Date()], (err, result) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(201).json({ message: 'Task added successfully' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

export const listTasks = asyncHandler(async (req, res) => {
    try {
        const sql = "SELECT * FROM tasks";
        db.query(sql, (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.status(200).json(data);
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

export const updateTask = asyncHandler(async (req, res) => {
    try {
        const taskId = req.params.id;
        const { heading, description, date, time, image } = req.body;
        const updateValues = [];
        const updateColumns = [];

        if (heading) {
            updateValues.push(heading);
            updateColumns.push('heading = ?');
        }
        if (description) {
            updateValues.push(description);
            updateColumns.push('description = ?');
        }
        if (date) {
            updateValues.push(date);
            updateColumns.push('date = ?');
        }
        if (time) {
            updateValues.push(time);
            updateColumns.push('time = ?');
        }
        if (image.length) {
            const url = await cloudinary.uploader.upload(image, {
                folder: "interval",
            });
            const imageUrl = url.secure_url
            updateValues.push(imageUrl);
            updateColumns.push('image = ?');
        }
        if (updateValues.length === 0) {
            return res.status(400).json({ error: 'No valid data provided for update' });
        }
        const updateColumnsStr = updateColumns.join(', ');

        const updateSql = `UPDATE tasks SET ${updateColumnsStr} WHERE id = ?`;

        updateValues.push(taskId);

        db.query(updateSql, updateValues, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }
            return res.status(200).json({ message: 'Task updated successfully..' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export const deleteTask = asyncHandler(async (req, res) => {
    try {
        const taskId = req.params.id
        const deleteSql = 'DELETE FROM tasks WHERE  id=?'

        db.query(deleteSql, [taskId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' })
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Task not found' })
            }
            return res.status(200).json({ message: 'Task deleted successfully' })
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
