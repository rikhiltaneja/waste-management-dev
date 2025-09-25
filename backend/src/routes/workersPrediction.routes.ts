
import express from "express";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

/**
 * @swagger
 * tags:
 *   name: Workers Prediction
 *   description: Worker performance prediction APIs
 */

export const workersPredictionRouter = express.Router();
workersPredictionRouter.use(express.json());

/**
 * @swagger
 * /workers-prediction/predict:
 *   post:
 *     summary: Predict worker performance score
 *     tags: [Workers Prediction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [completion_ratio, citizen_rating, locality_rating, task_difficulty]
 *             properties:
 *               completion_ratio:
 *                 type: number
 *                 description: Task completion ratio (0-1)
 *                 example: 0.85
 *               citizen_rating:
 *                 type: number
 *                 description: Average citizen rating (1-5)
 *                 example: 4
 *               locality_rating:
 *                 type: number
 *                 description: Locality rating (1-5)
 *                 example: 3
 *               task_difficulty:
 *                 type: number
 *                 description: Task difficulty (1-10)
 *                 example: 5
 *     responses:
 *       200:
 *         description: Predicted worker score
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 predicted_score:
 *                   type: number
 *                   description: Predicted score for the worker
 *                   example: 0.92
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Python script error or invalid output
 */
workersPredictionRouter.post("/predict", (req, res) => {
  const { completion_ratio, citizen_rating, locality_rating, task_difficulty } = req.body;
  if (
    typeof completion_ratio !== 'number' ||
    typeof citizen_rating !== 'number' ||
    typeof locality_rating !== 'number' ||
    typeof task_difficulty !== 'number'
  ) {
    return res.status(400).json({ error: "All fields must be numbers." });
  }
  // Spawn Python process
  const py = spawn("python3", [
    "src/python/predict_worker.py",
    completion_ratio.toString(),
    citizen_rating.toString(),
    locality_rating.toString(),
    task_difficulty.toString(),
  ]);

  let output = "";
  let errorOutput = "";

  // Capture standard output
  py.stdout.on("data", (data) => {
    output += data.toString();
  });

  // Capture standard error
  py.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  // Handle process close
  py.on("close", (code) => {
    if (code !== 0) {
      console.error("Python script error:", errorOutput);
      return res
        .status(500)
        .json({ error: "Python script failed", details: errorOutput });
    }

    // Remove any extra whitespace or newlines from Python output
    const predicted_score = parseFloat(output.trim());

    if (isNaN(predicted_score)) {
      return res
        .status(500)
        .json({ error: "Invalid output from Python script", raw: output });
    }

    res.json({ predicted_score });
  });
});


/**
 * @swagger
 * /workers-prediction/leaderboard:
 *   get:
 *     summary: Get worker leaderboard from prediction dataset
 *     tags: [Workers Prediction]
 *     responses:
 *       200:
 *         description: CSV leaderboard data
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Python script error or failed to read leaderboard CSV
 */
workersPredictionRouter.get("/leaderboard", (req, res) => {
  const pythonScriptPath = path.join(__dirname, "../python/leaderboard.py");
  const leaderboardCsvPath = path.join(__dirname, "../../datasets/leaderboard.csv");

  const py = spawn("python3", [pythonScriptPath]);

  let output = "";
  let errorOutput = "";

  py.stdout.on("data", (data) => {
    output += data.toString();
  });

  py.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  py.on("close", (code) => {
    if (code !== 0) {
      console.error("Python script error:", errorOutput);
      return res
        .status(500)
        .json({ error: "Python script failed", details: errorOutput });
    }

    // Read leaderboard CSV
    fs.readFile(leaderboardCsvPath, "utf-8", (err, data) => {
      if (err) {
        console.error("Failed to read leaderboard CSV:", err);
        return res
          .status(500)
          .json({ error: "Failed to read leaderboard CSV", details: err.message });
      }
      res.setHeader('Content-Type', 'text/csv');
      res.send(data);
    });
  });
});






/**
 * @swagger
 * /workers-prediction/recommend:
 *   get:
 *     summary: Get recommended workers for tasks with optional filtering
 *     tags: [Workers Prediction]
 *     parameters:
 *       - in: query
 *         name: locality
 *         schema:
 *           type: string
 *         description: Filter workers by locality
 *       - in: query
 *         name: workerType
 *         schema:
 *           type: string
 *           enum: [SWEEPER, WASTE_COLLECTOR]
 *         description: Filter workers by type
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Limit number of recommended workers (default 10)
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, json]
 *         description: Response format (default csv)
 *     responses:
 *       200:
 *         description: Recommended workers data
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Python script error or failed to read recommended CSV
 */
workersPredictionRouter.get("/recommend", (req, res) => {
  const { locality, workerType, limit, format = "csv" } = req.query;
  
  const pythonScriptPath = path.join(__dirname, "../python/recommendation.py");
  const recommendedCsvPath = path.join(__dirname, "../../datasets/recommended.csv");

  // Run the Python script (without parameters since we're not changing it)
  const py = spawn("python3", [pythonScriptPath]);

  let output = "";
  let errorOutput = "";

  py.stdout.on("data", (data) => {
    output += data.toString();
  });

  py.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  py.on("close", (code) => {
    if (code !== 0) {
      console.error("Python script error:", errorOutput);
      return res
        .status(500)
        .json({ error: "Python script failed", details: errorOutput });
    }

    // Read recommended CSV and apply filtering in Node.js
    fs.readFile(recommendedCsvPath, "utf-8", (err, data) => {
      if (err) {
        console.error("Failed to read recommended CSV:", err);
        return res
          .status(500)
          .json({ error: "Failed to read recommended CSV", details: err.message });
      }

      // Parse CSV data
      const lines = data.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      let workers = lines.slice(1).map(line => {
        const values = line.split(',');
        const worker: any = {};
        headers.forEach((header, index) => {
          const value = values[index]?.trim() || '';
          // Convert numeric fields
          if (['assigned_tasks', 'avg_difficulty', 'locality_rating', 'citizen_rating', 'predicted_score'].includes(header)) {
            worker[header] = parseFloat(value) || 0;
          } else {
            worker[header] = value;
          }
        });
        
        // Add mock data for filtering (since original dataset doesn't have these)
        // In a real app, this would come from a proper database join
        const mockLocalities = ['MG Road', 'Brigade Road', 'Koramangala', 'Indiranagar', 'Whitefield'];
        const mockWorkerTypes = ['SWEEPER', 'WASTE_COLLECTOR'];
        worker.locality = mockLocalities[parseInt(worker.worker_id) % mockLocalities.length];
        worker.worker_type = mockWorkerTypes[parseInt(worker.worker_id) % mockWorkerTypes.length];
        worker.name = `Worker ${worker.worker_id}`;
        
        return worker;
      });

      // Apply filters
      if (locality) {
        workers = workers.filter(w => w.locality && w.locality.toLowerCase().includes(locality.toString().toLowerCase()));
      }
      
      if (workerType) {
        workers = workers.filter(w => w.worker_type === workerType);
      }
      
      // Apply limit
      if (limit && parseInt(limit.toString()) > 0) {
        workers = workers.slice(0, parseInt(limit.toString()));
      }

      if (format === "json") {
        res.json(workers);
      } else {
        // Convert back to CSV
        const csvHeaders = Object.keys(workers[0] || {}).join(',');
const csvRows = workers.map(worker => 
  Object.values(worker as Record<string, any>)
    .map(val => val.toString())
    .join(',')
);
        const csvData = [csvHeaders, ...csvRows].join('\n');
        
        res.setHeader("Content-Type", "text/csv");
        res.send(csvData);
      }
    });
  });
});






/**
 * @swagger
 * /workers-prediction/assign-task:
 *   post:
 *     summary: Update worker task count when a task is assigned
 *     tags: [Workers Prediction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [workerId, complaintId]
 *             properties:
 *               workerId:
 *                 type: string
 *                 description: ID of the worker being assigned
 *                 example: "worker_123"
 *               complaintId:
 *                 type: number
 *                 description: ID of the complaint being assigned
 *                 example: 456
 *               taskDifficulty:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *                 description: Difficulty level of the task (optional)
 *                 example: 5
 *     responses:
 *       200:
 *         description: Task assignment recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Task assigned successfully"
 *                 workerId:
 *                   type: string
 *                   example: "worker_123"
 *                 newTaskCount:
 *                   type: number
 *                   example: 6
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Failed to update worker data
 */
workersPredictionRouter.post("/assign-task", (req, res) => {
  const { workerId, complaintId, taskDifficulty = 5 } = req.body;

  if (!workerId || !complaintId) {
    return res.status(400).json({ 
      error: "workerId and complaintId are required" 
    });
  }

  if (typeof complaintId !== 'number') {
    return res.status(400).json({ 
      error: "complaintId must be a number" 
    });
  }

  try {
    // Read current workers data
    const workersDataPath = path.join(__dirname, "../../datasets/workers.csv");
    
    fs.readFile(workersDataPath, "utf-8", (err, data) => {
      if (err) {
        console.error("Failed to read workers CSV:", err);
        return res.status(500).json({ 
          error: "Failed to read workers data", 
          details: err.message 
        });
      }

      const lines = data.trim().split('\n');
      const headers = lines[0].split(',');
      let workerFound = false;
      let newTaskCount = 0;

      // Update the worker's task count
      const updatedLines = lines.map((line, index) => {
        if (index === 0) return line; // Keep headers

        const values = line.split(',');
        const currentWorkerId = values[0]?.trim();

        if (currentWorkerId === workerId) {
          workerFound = true;
          // Find the assigned_tasks column (try different possible names)
          let assignedTasksIndex = headers.findIndex(h => h.trim().toLowerCase() === 'assigned_tasks');
          if (assignedTasksIndex === -1) {
            assignedTasksIndex = headers.findIndex(h => h.trim().toLowerCase() === 'tasks_assigned');
          }
          
          if (assignedTasksIndex !== -1) {
            const currentTasks = parseInt(values[assignedTasksIndex]) || 0;
            newTaskCount = currentTasks + 1;
            values[assignedTasksIndex] = newTaskCount.toString();
          }

          // Update average difficulty if provided
          if (taskDifficulty && taskDifficulty >= 1 && taskDifficulty <= 10) {
            const avgDifficultyIndex = headers.findIndex(h => h.trim().toLowerCase() === 'avg_difficulty');
            if (avgDifficultyIndex !== -1) {
              const currentAvgDifficulty = parseFloat(values[avgDifficultyIndex]) || 0;
              
              // Find current tasks count (use the updated value)
              let currentTasksIndex = headers.findIndex(h => h.trim().toLowerCase() === 'assigned_tasks');
              if (currentTasksIndex === -1) {
                currentTasksIndex = headers.findIndex(h => h.trim().toLowerCase() === 'tasks_assigned');
              }
              
              const currentTasks = currentTasksIndex !== -1 ? parseInt(values[currentTasksIndex]) || 1 : 1;
              
              // Calculate new average difficulty
              const newAvgDifficulty = ((currentAvgDifficulty * (currentTasks - 1)) + taskDifficulty) / currentTasks;
              values[avgDifficultyIndex] = newAvgDifficulty.toFixed(2);
            }
          }
        }

        return values.join(',');
      });

      if (!workerFound) {
        return res.status(404).json({ 
          error: "Worker not found", 
          workerId 
        });
      }

      // Write updated data back to CSV
      const updatedData = updatedLines.join('\n');
      fs.writeFile(workersDataPath, updatedData, 'utf-8', (writeErr) => {
        if (writeErr) {
          console.error("Failed to update workers CSV:", writeErr);
          return res.status(500).json({ 
            error: "Failed to update worker data", 
            details: writeErr.message 
          });
        }

        // Log the assignment for tracking
        console.log(`Task assigned: Worker ${workerId} assigned complaint ${complaintId}. New task count: ${newTaskCount}`);

        res.json({
          success: true,
          message: "Task assigned successfully",
          workerId,
          complaintId,
          newTaskCount
        });
      });
    });

  } catch (error) {
    console.error("Error in assign-task endpoint:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

export default workersPredictionRouter;
