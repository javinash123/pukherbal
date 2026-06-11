const level = process.env.LOG_LEVEL ?? "info";
const levels = ["trace", "debug", "info", "warn", "error", "fatal"];
const minLevel = levels.indexOf(level);

function log(lvl: string, msg: string, extra?: object) {
  if (levels.indexOf(lvl) < minLevel) return;
  const line = JSON.stringify({ time: new Date().toISOString(), level: lvl, msg, ...extra });
  if (lvl === "error" || lvl === "fatal") process.stderr.write(line + "\n");
  else process.stdout.write(line + "\n");
}

export const logger = {
  trace: (obj: object | string, msg?: string) => typeof obj === "string" ? log("trace", obj) : log("trace", msg ?? "", obj),
  debug: (obj: object | string, msg?: string) => typeof obj === "string" ? log("debug", obj) : log("debug", msg ?? "", obj),
  info:  (obj: object | string, msg?: string) => typeof obj === "string" ? log("info",  obj) : log("info",  msg ?? "", obj),
  warn:  (obj: object | string, msg?: string) => typeof obj === "string" ? log("warn",  obj) : log("warn",  msg ?? "", obj),
  error: (obj: object | string, msg?: string) => typeof obj === "string" ? log("error", obj) : log("error", msg ?? "", obj),
  fatal: (obj: object | string, msg?: string) => typeof obj === "string" ? log("fatal", obj) : log("fatal", msg ?? "", obj),
};
