"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const memo_routes_js_1 = __importDefault(require("./routes/memo.routes.js"));
const app = (0, express_1.default)();
const port = process.env.BACKEND_PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://run.club012.com', 'https://run.club012.com', 'http://localhost:4001', 'http://192.168.219.40:4001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Routes
app.use('/api/memos', memo_routes_js_1.default);
app.listen(port, () => {
    console.log(`🚀 Backend API server (Restructured TS) listening on port ${port}`);
});
