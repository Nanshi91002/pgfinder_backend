const fs = require("fs");
const net = require("net");
const path = require("path");
const { spawn } = require("child_process");
const mongoose = require("mongoose");
require("dotenv").config();

const LOCAL_MONGO_PORT = 27017;
const LOCAL_MONGO_HOSTS = new Set(["127.0.0.1", "localhost"]);
const MONGOD_PATH = "C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe";
const localMongoRoot = path.join(process.cwd(), ".mongodb-local");
const localMongoDataPath = path.join(localMongoRoot, "data");
const localMongoLogPath = path.join(localMongoRoot, "log", "mongod.log");

let listenersRegistered = false;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ensureMongoDirectories = () => {
  fs.mkdirSync(localMongoDataPath, { recursive: true });
  fs.mkdirSync(path.dirname(localMongoLogPath), { recursive: true });
};

const canAutoStartLocalMongo = (mongoUrl) => {
  try {
    const parsed = new URL(mongoUrl);
    return (
      process.platform === "win32" &&
      parsed.protocol.startsWith("mongodb") &&
      LOCAL_MONGO_HOSTS.has(parsed.hostname) &&
      Number(parsed.port || LOCAL_MONGO_PORT) === LOCAL_MONGO_PORT &&
      fs.existsSync(MONGOD_PATH)
    );
  } catch {
    return false;
  }
};

const isPortOpen = (host, port) =>
  new Promise((resolve) => {
    const socket = net.createConnection({ host, port });

    socket.setTimeout(1000);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => {
      resolve(false);
    });
  });

const waitForMongoPort = async (host, port, attempts = 15) => {
  for (let index = 0; index < attempts; index += 1) {
    if (await isPortOpen(host, port)) {
      return true;
    }

    await delay(1000);
  }

  return false;
};

const startLocalMongo = async () => {
  ensureMongoDirectories();

  if (await isPortOpen("127.0.0.1", LOCAL_MONGO_PORT)) {
    return;
  }

  const child = spawn(
    MONGOD_PATH,
    [
      "--dbpath",
      localMongoDataPath,
      "--logpath",
      localMongoLogPath,
      "--bind_ip",
      "127.0.0.1",
      "--port",
      String(LOCAL_MONGO_PORT),
    ],
    {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    }
  );

  child.unref();

  const started = await waitForMongoPort("127.0.0.1", LOCAL_MONGO_PORT);

  if (!started) {
    throw new Error(
      `Local MongoDB did not start. Check ${localMongoLogPath} for details.`
    );
  }

  console.log(`Started local MongoDB at ${localMongoDataPath}`);
};

const registerConnectionListeners = () => {
  if (listenersRegistered) {
    return;
  }

  listenersRegistered = true;

  mongoose.connection.on("connected", () => {
    console.log("DB CONNECTED!!");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });
};

const DBConnection = async () => {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    throw new Error("MONGO_URL is not configured");
  }

  registerConnectionListeners();

  try {
    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    if (!canAutoStartLocalMongo(mongoUrl)) {
      throw error;
    }

    console.warn("MongoDB was unreachable. Attempting to start a local MongoDB instance...");
    await startLocalMongo();

    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 5000,
    });
  }
};

module.exports = DBConnection;
