module.exports = function(val) {
    return typeof val !== 'undefined' && (typeof val === 'number' || val instanceof Number);
}