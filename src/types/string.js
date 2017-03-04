module.exports = function(val) {
    return val && (val instanceof String || typeof val === 'string');
}