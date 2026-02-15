"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlideAnimations = exports.RotateAnimations = exports.BounceAnimations = exports.ScaleAnimations = exports.FadeAnimations = exports.MotionAnimations = exports.Motion = void 0;
var motion_js_1 = require("./motion.js");
Object.defineProperty(exports, "Motion", { enumerable: true, get: function () { return motion_js_1.Motion; } });
var index_js_1 = require("./animations/index.js");
Object.defineProperty(exports, "MotionAnimations", { enumerable: true, get: function () { return index_js_1.MotionAnimations; } });
// Re-export individual animation modules for granular imports
var fade_js_1 = require("./animations/fade.js");
Object.defineProperty(exports, "FadeAnimations", { enumerable: true, get: function () { return fade_js_1.FadeAnimations; } });
var scale_js_1 = require("./animations/scale.js");
Object.defineProperty(exports, "ScaleAnimations", { enumerable: true, get: function () { return scale_js_1.ScaleAnimations; } });
var bounce_js_1 = require("./animations/bounce.js");
Object.defineProperty(exports, "BounceAnimations", { enumerable: true, get: function () { return bounce_js_1.BounceAnimations; } });
var rotate_js_1 = require("./animations/rotate.js");
Object.defineProperty(exports, "RotateAnimations", { enumerable: true, get: function () { return rotate_js_1.RotateAnimations; } });
var slide_js_1 = require("./animations/slide.js");
Object.defineProperty(exports, "SlideAnimations", { enumerable: true, get: function () { return slide_js_1.SlideAnimations; } });
