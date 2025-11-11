export default async function runJS(code) {
  try {
    const output = eval(code);
    return { stdout: String(output) };
  } catch (err) {
    return { stderr: err.message };
  }
}
