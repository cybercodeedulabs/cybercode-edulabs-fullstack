// src/components/simulations/python-absolute-beginners/GuessNumberSimulator.jsx
import React, { useState, useEffect } from "react";

export default function GuessNumberSimulator() {
  const [secret, setSecret] = useState(0);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("🎯 Choose difficulty to start the game!");
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [range, setRange] = useState(10);
  const [difficulty, setDifficulty] = useState("");
  const [gameOver, setGameOver] = useState(false);

  // Function to initialize game
  const startGame = (mode) => {
    let newRange = 10;
    let newAttempts = 5;

    if (mode === "medium") {
      newRange = 50;
      newAttempts = 7;
    } else if (mode === "hard") {
      newRange = 100;
      newAttempts = 10;
    }

    setDifficulty(mode);
    setRange(newRange);
    setMaxAttempts(newAttempts);
    setSecret(Math.floor(Math.random() * newRange) + 1);
    setAttempts(0);
    setGuess("");
    setGameOver(false);
    setMessage(
      `🎮 New Game Started [${mode.toUpperCase()}] — Guess a number between 1 and ${newRange}. You have ${newAttempts} attempts.`
    );
  };

  // Function to reset the game fully
  const resetGame = () => {
    setSecret(0);
    setGuess("");
    setMessage("🎯 Choose a difficulty level to begin!");
    setAttempts(0);
    setGameOver(false);
    setDifficulty("");
  };

  // Function to check the player's guess
  const checkGuess = () => {
    const num = parseInt(guess);

    if (gameOver) {
      setMessage("⚠️ Game over! Please start a new game.");
      return;
    }

    if (isNaN(num)) {
      setMessage("❌ Please enter a valid number!");
      return;
    }

    if (num < 1 || num > range) {
      setMessage(`⚠️ Number must be between 1 and ${range}.`);
      return;
    }

    setAttempts((prev) => prev + 1);

    if (num === secret) {
      setMessage(
        `✅ Correct! The number was ${secret}. You guessed it in ${attempts + 1} tries! 🏆`
      );
      setGameOver(true);
      return;
    }

    if (attempts + 1 >= maxAttempts) {
      setMessage(
        `💀 Out of attempts! The number was ${secret}. Better luck next time!`
      );
      setGameOver(true);
      return;
    }

    if (num < secret) {
      setMessage(`⬆️ Try a higher number! Attempts left: ${maxAttempts - (attempts + 1)}`);
    } else {
      setMessage(`⬇️ Try a lower number! Attempts left: ${maxAttempts - (attempts + 1)}`);
    }
  };

  return (
    <div className="p-6 mt-8 rounded-2xl border bg-white dark:bg-gray-900 border-indigo-200 dark:border-indigo-800 shadow-lg">
      <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">
        🎲 Guess the Number Game — Difficulty Mode
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Choose your difficulty level and try to guess the secret number!
      </p>

      {/* Difficulty Selection */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => startGame("easy")}
          className={`px-5 py-2 rounded-lg font-medium ${
            difficulty === "easy"
              ? "bg-green-600 text-white"
              : "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-700"
          }`}
        >
          🟢 Easy (1–10)
        </button>
        <button
          onClick={() => startGame("medium")}
          className={`px-5 py-2 rounded-lg font-medium ${
            difficulty === "medium"
              ? "bg-yellow-600 text-white"
              : "bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-700"
          }`}
        >
          🟡 Medium (1–50)
        </button>
        <button
          onClick={() => startGame("hard")}
          className={`px-5 py-2 rounded-lg font-medium ${
            difficulty === "hard"
              ? "bg-red-600 text-white"
              : "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700"
          }`}
        >
          🔴 Hard (1–100)
        </button>
      </div>

      {/* Guess Input Area */}
      {difficulty && !gameOver && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="number"
            placeholder={`Enter your guess (1–${range})`}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white"
          />
          <button
            onClick={checkGuess}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
          >
            Check ▶
          </button>
        </div>
      )}

      {/* Reset Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={resetGame}
          className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
        >
          🔁 Reset Game
        </button>
      </div>

      {/* Message Display */}
      <div
        className={`mt-4 rounded-lg p-4 font-mono text-sm ${
          message.includes("✅")
            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
            : message.includes("💀")
            ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
            : "bg-gray-100 dark:bg-gray-800 text-indigo-700 dark:text-indigo-300"
        }`}
      >
        {message}
      </div>

      {/* Attempts Counter */}
      {difficulty && (
        <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
          Attempts: {attempts} / {maxAttempts}
        </div>
      )}
    </div>
  );
}
