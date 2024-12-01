/* jshint esversion: 11 */

require("dotenv").config();
require("app-module-path").addPath(__dirname);

const Express = require("express");
const cluster = require("cluster");
const os = require("os");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");


const productRoutes = require("routes/ProductRoutes");
const authRoutes = require("routes/AuthRoutes");


if (cluster.isPrimary) {
    const numberOfCpus = os.cpus().length;
    console.log(`Master process is running. Forking for ${numberOfCpus} CPUs`);
    for (let i = 0; i < numberOfCpus; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    const app = Express();

    const port = process.env.PORT || 5000;

    // app.use(cors());
    app.use(cors({
        credentials: true,
        origin: "http://localhost:3000"
    }));
    app.use(helmet());
    app.use(cookieParser());
    app.use(Express.json());

    // Rate Limiting Configuration
    const rateLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "Too many requests from this IP, please try again after 15 minutes.",
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use("/api", rateLimiter);

    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);

    mongoose.set('strictQuery', false);
    const connectWithRetry = () => {
        mongoose.connect(process.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 5000, // Timeout for selecting a server (default is 30000 ms)
                socketTimeoutMS: 45000, // Timeout for the socket (default is 360000 ms)
            })
            .then(() => console.log("MongoDB connected!"))
            .catch((error) => {
                console.error(error);
                setTimeout(connectWithRetry, 5000);
            });
    };
    connectWithRetry();
    
    app.listen(port, () => console.log(`Server running on port ${port}`));
}

