module.exports = function(val) {
    return val && (typeof val === 'number' || val instanceof Number);
}