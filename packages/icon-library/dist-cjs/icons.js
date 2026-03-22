"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MINUS = exports.PLUS = exports.SEARCH = exports.CODE = exports.LIST = exports.SLIDERS = exports.POINTER = exports.MOUSE_POINTER = exports.MOVE_HORIZONTAL = exports.ACCESSIBILITY = exports.EYE_OFF = exports.EYE = exports.PLAY = exports.ROTATE_CCW = exports.ROTATE_CW = exports.ACTIVITY = exports.MINIMIZE = exports.MAXIMIZE = exports.MOON = exports.SUN = exports.MESSAGE_SQUARE = exports.LIST_ORDERED = exports.TOGGLE_LEFT = exports.FILE_TEXT = exports.BOX = exports.MENU = exports.BELL = exports.LOCK = exports.USER = exports.SETTINGS = exports.STAR = exports.IMAGE = exports.LAYERS = exports.LAYOUT = exports.HOME = exports.LOADER = exports.WARNING = exports.SUCCESS = exports.ERROR = exports.ALERT_CIRCLE = exports.INFO = exports.ARROW_RIGHT = exports.ARROW_LEFT = exports.ARROW_DOWN = exports.ARROW_UP = exports.CHEVRON_UP = exports.CHEVRON_RIGHT = exports.CHEVRON_LEFT = exports.CHEVRON_DOWN = exports.CLOSE = void 0;
exports.COMPONENT_ICONS = exports.ALL_ICONS = exports.TYPE = exports.MOVE = exports.COLUMNS = exports.SKIP_BACK = exports.CIRCLE = exports.CIRCLE_DOT = exports.BOOK_OPEN = exports.HASH = exports.ZAP = exports.COMPASS = exports.AWARD = exports.FOLDER_OPEN = exports.TEXT_CURSOR = exports.GALLERY = exports.CREDIT_CARD = exports.APP_WINDOW = exports.PANEL_TOP = exports.PANEL_LEFT_OPEN = exports.PANEL_LEFT = exports.SMARTPHONE = exports.MONITOR = exports.TERMINAL = exports.FILTER = exports.REFRESH_CW = exports.UPLOAD = exports.DOWNLOAD = exports.COPY = exports.SHARE = exports.HEART = exports.MAIL = exports.GITHUB = exports.EXTERNAL_LINK = exports.EDIT = exports.TRASH = exports.CHECK = void 0;
// Basic icons
exports.CLOSE = '<g><path d="M18 6 6 18" /><path d="m6 6 12 12" /></g>';
exports.CHEVRON_DOWN = '<path d="m6 9 6 6 6-6" />';
exports.CHEVRON_LEFT = '<path d="m15 18-6-6 6-6" />';
exports.CHEVRON_RIGHT = '<path d="m9 18 6-6-6-6" />';
exports.CHEVRON_UP = '<path d="m18 15-6-6-6 6" />';
exports.ARROW_UP = '<g><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></g>';
exports.ARROW_DOWN = '<g><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></g>';
exports.ARROW_LEFT = '<g><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></g>';
exports.ARROW_RIGHT = '<g><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></g>';
exports.INFO = '<g><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></g>';
exports.ALERT_CIRCLE = '<g><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></g>';
exports.ERROR = '<g><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></g>';
exports.SUCCESS = '<g><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></g>';
exports.WARNING = '<g><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></g>';
exports.LOADER = '<path d="M21 12a9 9 0 1 1-6.219-8.56" />';
exports.HOME = '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />';
exports.LAYOUT = '<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />';
exports.LAYERS = '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />';
exports.IMAGE = '<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />';
exports.STAR = '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />';
exports.SETTINGS = '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />';
exports.USER = '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />';
exports.LOCK = '<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />';
exports.BELL = '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />';
exports.MENU = '<g><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" /></g>';
exports.BOX = '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />';
exports.FILE_TEXT = '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />';
exports.TOGGLE_LEFT = '<rect width="20" height="12" x="2" y="6" rx="6" ry="6" />';
exports.LIST_ORDERED = '<g><line x1="10" x2="21" y1="6" y2="6" /><line x1="10" x2="21" y1="12" y2="12" /><line x1="10" x2="21" y1="18" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></g>';
exports.MESSAGE_SQUARE = '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />';
exports.SUN = '<g><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></g>';
exports.MOON = '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />';
exports.MAXIMIZE = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>';
exports.MINIMIZE = '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>';
exports.ACTIVITY = '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>';
exports.ROTATE_CW = '<polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>';
exports.ROTATE_CCW = '<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>';
exports.PLAY = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
exports.EYE = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
exports.EYE_OFF = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
exports.ACCESSIBILITY = '<circle cx="12" cy="4" r="1.5"></circle><path d="M4 8v16M20 8v16M16 8v3a6 6 0 0 1-8 0V8"></path><path d="M4 11h16"></path>';
// Motion icons
exports.MOVE_HORIZONTAL = '<polyline points="18 8 22 12 18 16"></polyline><polyline points="6 8 2 12 6 16"></polyline><line x1="2" y1="12" x2="22" y2="12"></line>';
exports.MOUSE_POINTER = '<path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path><path d="m13 13 6 6"></path>';
exports.POINTER = '<path d="M22 14a8 8 0 0 1-8 8"></path><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path><path d="M14 10V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>';
exports.SLIDERS = '<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="2" y1="14" x2="6" y2="14"></line><line x1="10" y1="8" x2="14" y2="8"></line><line x1="18" y1="16" x2="22" y2="16"></line>';
exports.LIST = '<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>';
exports.CODE = '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>';
// Additional common icons
exports.SEARCH = '<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />';
exports.PLUS = '<path d="M5 12h14" /><path d="M12 5v14" />';
exports.MINUS = '<path d="M5 12h14" />';
exports.CHECK = '<path d="m20 6-11 11-5-5" />';
exports.TRASH = '<path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />';
exports.EDIT = '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />';
exports.EXTERNAL_LINK = '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />';
exports.GITHUB = '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />';
exports.MAIL = '<rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />';
exports.HEART = '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />';
exports.SHARE = '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />';
exports.COPY = '<rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />';
exports.DOWNLOAD = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />';
exports.UPLOAD = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />';
exports.REFRESH_CW = '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" />';
exports.FILTER = '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />';
exports.TERMINAL = '<polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />';
exports.MONITOR = '<rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />';
exports.SMARTPHONE = '<rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />';
// UI / Layout icons
exports.PANEL_LEFT = '<g><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></g>';
exports.PANEL_LEFT_OPEN = '<g><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /><path d="m14 9 3 3-3 3" /></g>';
exports.PANEL_TOP = '<g><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /></g>';
exports.APP_WINDOW = '<g><rect width="20" height="16" x="2" y="4" rx="2" /><path d="M10 4v4" /><path d="M2 8h20" /><path d="M6 4v4" /></g>';
exports.CREDIT_CARD = '<g><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></g>';
exports.GALLERY = '<g><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></g>';
exports.TEXT_CURSOR = '<g><path d="M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1" /><path d="M7 22h1a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4H7" /><line x1="9" y1="12" x2="15" y2="12" /></g>';
exports.FOLDER_OPEN = '<g><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" /></g>';
exports.AWARD = '<g><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></g>';
exports.COMPASS = '<g><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></g>';
exports.ZAP = '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />';
exports.HASH = '<g><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></g>';
exports.BOOK_OPEN = '<g><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></g>';
exports.CIRCLE_DOT = '<g><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="1" /></g>';
exports.CIRCLE = '<circle cx="12" cy="12" r="10" />';
exports.SKIP_BACK = '<g><polygon points="19 20 9 12 19 4 19 20" /><line x1="5" y1="19" x2="5" y2="5" /></g>';
exports.COLUMNS = '<g><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M12 3v18" /></g>';
exports.MOVE = '<g><path d="m12 2 3 3-3 3-3-3 3-3Z" /><path d="m12 22 3-3-3-3-3 3 3 3Z" /><path d="m2 12 3-3 3 3-3 3-3-3Z" /><path d="m22 12-3-3-3 3 3 3 3-3Z" /><path d="M12 8v8" /><path d="M8 12h8" /></g>';
exports.TYPE = '<g><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></g>';
/**
 * A comprehensive map of all available icons.
 *
 * **WARNING:** Importing `ALL_ICONS` bundles every icon and defeats tree-shaking.
 * For production apps, import individual icon constants instead:
 *
 * ```ts
 * import { CLOSE, CHEVRON_DOWN } from '@andersseen/icon';
 * ```
 *
 * Use `registerAllIcons()` only in demo apps or when you truly need every icon.
 */
exports.ALL_ICONS = {
    close: exports.CLOSE,
    "chevron-down": exports.CHEVRON_DOWN,
    "chevron-left": exports.CHEVRON_LEFT,
    "chevron-right": exports.CHEVRON_RIGHT,
    "chevron-up": exports.CHEVRON_UP,
    "arrow-up": exports.ARROW_UP,
    "arrow-down": exports.ARROW_DOWN,
    "arrow-left": exports.ARROW_LEFT,
    "arrow-right": exports.ARROW_RIGHT,
    info: exports.INFO,
    "alert-circle": exports.ALERT_CIRCLE,
    error: exports.ERROR,
    success: exports.SUCCESS,
    warning: exports.WARNING,
    loader: exports.LOADER,
    home: exports.HOME,
    layout: exports.LAYOUT,
    layers: exports.LAYERS,
    image: exports.IMAGE,
    star: exports.STAR,
    settings: exports.SETTINGS,
    user: exports.USER,
    lock: exports.LOCK,
    bell: exports.BELL,
    menu: exports.MENU,
    box: exports.BOX,
    "file-text": exports.FILE_TEXT,
    "toggle-left": exports.TOGGLE_LEFT,
    "list-ordered": exports.LIST_ORDERED,
    "message-square": exports.MESSAGE_SQUARE,
    sun: exports.SUN,
    moon: exports.MOON,
    maximize: exports.MAXIMIZE,
    minimize: exports.MINIMIZE,
    activity: exports.ACTIVITY,
    "rotate-cw": exports.ROTATE_CW,
    "rotate-ccw": exports.ROTATE_CCW,
    play: exports.PLAY,
    eye: exports.EYE,
    "eye-off": exports.EYE_OFF,
    accessibility: exports.ACCESSIBILITY,
    "move-horizontal": exports.MOVE_HORIZONTAL,
    "mouse-pointer": exports.MOUSE_POINTER,
    pointer: exports.POINTER,
    sliders: exports.SLIDERS,
    list: exports.LIST,
    code: exports.CODE,
    search: exports.SEARCH,
    plus: exports.PLUS,
    minus: exports.MINUS,
    check: exports.CHECK,
    trash: exports.TRASH,
    edit: exports.EDIT,
    "external-link": exports.EXTERNAL_LINK,
    github: exports.GITHUB,
    mail: exports.MAIL,
    heart: exports.HEART,
    share: exports.SHARE,
    copy: exports.COPY,
    download: exports.DOWNLOAD,
    upload: exports.UPLOAD,
    "refresh-cw": exports.REFRESH_CW,
    filter: exports.FILTER,
    terminal: exports.TERMINAL,
    monitor: exports.MONITOR,
    smartphone: exports.SMARTPHONE,
    "panel-left": exports.PANEL_LEFT,
    "panel-left-open": exports.PANEL_LEFT_OPEN,
    "panel-top": exports.PANEL_TOP,
    "app-window": exports.APP_WINDOW,
    "credit-card": exports.CREDIT_CARD,
    gallery: exports.GALLERY,
    "text-cursor": exports.TEXT_CURSOR,
    "folder-open": exports.FOLDER_OPEN,
    award: exports.AWARD,
    compass: exports.COMPASS,
    zap: exports.ZAP,
    hash: exports.HASH,
    "book-open": exports.BOOK_OPEN,
    "circle-dot": exports.CIRCLE_DOT,
    circle: exports.CIRCLE,
    "skip-back": exports.SKIP_BACK,
    columns: exports.COLUMNS,
    move: exports.MOVE,
    type: exports.TYPE,
};
/**
 * Icons required internally by `@andersseen/web-components` components.
 * Register these at minimum for internal component rendering.
 *
 * ```ts
 * import { registerIcons } from '@andersseen/icon';
 * import { COMPONENT_ICONS } from '@andersseen/icon';
 * registerIcons(COMPONENT_ICONS);
 * ```
 */
exports.COMPONENT_ICONS = {
    close: exports.CLOSE,
    "chevron-down": exports.CHEVRON_DOWN,
    "chevron-up": exports.CHEVRON_UP,
    "chevron-left": exports.CHEVRON_LEFT,
    "chevron-right": exports.CHEVRON_RIGHT,
    menu: exports.MENU,
};
