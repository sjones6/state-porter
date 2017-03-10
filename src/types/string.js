module.exports = function(val) {
    return typeof val !== 'undefined' && (val instanceof String || typeof val === 'string');
}