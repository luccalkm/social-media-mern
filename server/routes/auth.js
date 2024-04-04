"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../controllers/auth");
var router = express_1.default.Router();
router.post("/login", function (req, res) {
    (0, auth_1.login)(req, res);
});
exports.default = router;
