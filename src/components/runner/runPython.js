import "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";

export default async function runPython(code) {
  const pyodide = await window.loadPyodide();
  try {
    const result = await pyodide.runPythonAsync(code);
    return { stdout: String(result) };
  } catch (err) {
    return { stderr: err.message };
  }
}
