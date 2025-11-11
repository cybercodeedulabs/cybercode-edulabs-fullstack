export default async function runGo(code) {
  return fetch("https://go.dev/_/play/compile", {
    method: "POST",
    body: new URLSearchParams({
      version: "2",
      body: code,
    }),
  })
    .then((r) => r.json())
    .then((res) => {
      if (res.Errors) return { stderr: res.Errors };
      return { stdout: res.Events.map((e) => e.Message).join("") };
    })
    .catch((e) => ({ stderr: e.message }));
}
