
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
 *     summary: Get recommended workers for tasks
 *     tags: [Workers Prediction]
 *     responses:
 *       200:
 *         description: CSV recommended workers data
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Python script error or failed to read recommended CSV
 */
workersPredictionRouter.get("/recommend", (req, res) => {
  const pythonScriptPath = path.join(__dirname, "../python/recommendation.py");
  const leaderboardCsvPath = path.join(__dirname, "../../datasets/recommended.csv");

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

    // Read leaderboard CSV and send as response
    fs.readFile(leaderboardCsvPath, "utf-8", (err, data) => {
      if (err) {
        console.error("Failed to read leaderboard CSV:", err);
        return res
          .status(500)
          .json({ error: "Failed to read leaderboard CSV", details: err.message });
      }

      res.setHeader("Content-Type", "text/csv");
      res.send(data);
    });
  });
});






export default workersPredictionRouter;
