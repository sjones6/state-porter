module.exports = function(val) {
    return val && (typeof val === 'object' && !Array.isArray(val));
}
