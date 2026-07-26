const LEVEL_PRIORITY = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const configuredLevel = (process.env.LOG_LEVEL || "info").toLowerCase();
const minimumPriority = LEVEL_PRIORITY[configuredLevel] ?? LEVEL_PRIORITY.info;

const serializeError = (error) => {
  if (!(error instanceof Error)) {
    return error;
  }

  return {
    name: error.name,
    message: error.message,
    code: error.code,
    stack: error.stack,
  };
};

const write = (level, event, details = {}) => {
  if (LEVEL_PRIORITY[level] < minimumPriority) return;

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    service: process.env.SERVICE_NAME || "kamari-api",
    environment: process.env.NODE_ENV || "development",
    ...details,
  };

  for (const [key, value] of Object.entries(entry)) {
    if (value === undefined) delete entry[key];
    if (value instanceof Error) entry[key] = serializeError(value);
  }

  const output = JSON.stringify(entry);
  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
};

export const logger = {
  debug: (event, details) => write("debug", event, details),
  info: (event, details) => write("info", event, details),
  warn: (event, details) => write("warn", event, details),
  error: (event, details) => write("error", event, details),
};
