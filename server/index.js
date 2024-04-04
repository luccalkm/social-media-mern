"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var mongoose_1 = require("mongoose");
var cors_1 = require("cors");
var dotenv = require("dotenv");
var multer_1 = require("multer");
var helmet_1 = require("helmet");
var morgan_1 = require("morgan");
var path_1 = require("path");
var url_1 = require("url");
var auth_1 = require("./routes/auth");
var auth_2 = require("./controllers/auth");
// Configurations
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_1.dirname)(__filename);
dotenv.config();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json({ limit: "30mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "30mb", extended: true }));
app.use((0, cors_1.default)());
app.use("/assets", express_1.default.static(path_1.default.join(__dirname, "public/assets")));
// File storage
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
var upload = (0, multer_1.default)({ storage: storage });
// ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), auth_2.register);
// ROUTES
app.use("/auth", auth_1.default);
// MONGOOSE SETUP
var PORT = process.env.PORT || 6001;
mongoose_1.default.connect(process.env.MONGO_URL || 'chill', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(function () {
    app.listen(PORT, function () { console.log("Server running on port " + PORT); });
}).catch(function (error) {
    console.error("MongoDB connection error:", error);
});
