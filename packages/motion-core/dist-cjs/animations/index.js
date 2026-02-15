"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MotionAnimations = exports.SlideAnimations = exports.RotateAnimations = exports.BounceAnimations = exports.ScaleAnimations = exports.FadeAnimations = void 0;
var fade_js_1 = require("./fade.js");
Object.defineProperty(exports, "FadeAnimations", { enumerable: true, get: function () { return fade_js_1.FadeAnimations; } });
var scale_js_1 = require("./scale.js");
Object.defineProperty(exports, "ScaleAnimations", { enumerable: true, get: function () { return scale_js_1.ScaleAnimations; } });
var bounce_js_1 = require("./bounce.js");
Object.defineProperty(exports, "BounceAnimations", { enumerable: true, get: function () { return bounce_js_1.BounceAnimations; } });
var rotate_js_1 = require("./rotate.js");
Object.defineProperty(exports, "RotateAnimations", { enumerable: true, get: function () { return rotate_js_1.RotateAnimations; } });
var slide_js_1 = require("./slide.js");
Object.defineProperty(exports, "SlideAnimations", { enumerable: true, get: function () { return slide_js_1.SlideAnimations; } });
const fade_js_2 = require("./fade.js");
const scale_js_2 = require("./scale.js");
const bounce_js_2 = require("./bounce.js");
const rotate_js_2 = require("./rotate.js");
const slide_js_2 = require("./slide.js");
/**
 * Pre-defined animation constants for use with the `Motion` class.
 * Aggregated from all animation modules for backward compatibility.
 *
 * @example
 * ```ts
 * Motion.enter(element, MotionAnimations.FadeIn);
 * Motion.leave(element, MotionAnimations.FadeOut);
 * ```
 */
exports.MotionAnimations = {
    ...fade_js_2.FadeAnimations,
    ...scale_js_2.ScaleAnimations,
    ...bounce_js_2.BounceAnimations,
    ...rotate_js_2.RotateAnimations,
    ...slide_js_2.SlideAnimations,
};
