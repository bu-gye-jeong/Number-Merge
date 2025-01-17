import MergeField from "./merge/MergeField.js";
import contextMenu from "./contextmenu/data.js"
import * as Levels from "./Levels/_init.js";

/**
 * @typedef {object} EventCache
 * @property {HTMLElement?} target
 * @property {boolean} isMouseDown
 */
/** @type {EventCache} */
const EventCache = {
    isMouseDown: false,
    target: null
};
export default EventCache;
document.addEventListener("mousedown", (e) => {
    /** @type {HTMLElement} */
    const target = e.target;
    EventCache.target = target;
    EventCache.isMouseDown = true;
    
    if (
        !e.target.classList.contains("context-menu") &&
        !e.target.parentElement.classList.contains("context-menu") &&
        !e.target.parentElement.parentElement.classList.contains("context-menu")
    ) contextMenu.close();
}, false);
document.addEventListener("mouseup", (e) => {
    if (!EventCache.target) {
        EventCache.target = null;
        EventCache.isMouseDown = false;
        return;
    }
    const Item = MergeField.items[EventCache.target.dataset.id];
    MergeField.collisionCheck(Item);

    EventCache.target = null;
    EventCache.isMouseDown = false;
}, false);
document.addEventListener("mousemove", (e) => {
    const dL = { x: e.movementX, y: e.movementY };
    const MergeFieldSize = MergeField.size;
    const dP = {
        x: dL.x / MergeFieldSize.width,
        y: dL.y / MergeFieldSize.height
    };

    if (
        EventCache.target !== null &&
        EventCache.target.classList.contains("merge-item")
    ) {
        const Item = MergeField.items[EventCache.target.dataset.id];
        if (!Item) {
            EventCache.target = null;
            EventCache.isMouseDown = false;
            return;
        }
        const cur = Item.position;
        
        Item.position = {
            x: cur.x + dP.x,
            y: cur.y + dP.y
        };
    }
}, false);

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    contextMenu.close();
    contextMenu.openAt(e.clientX, e.clientY);
}, false);

window.addEventListener("blur", (e) => {
    EventCache.target = null;
    EventCache.isMouseDown = false;
    contextMenu.close();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "r") {
        MergeField.reloadStage();
    }
});