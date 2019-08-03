function locate = (fullkey, obj) => {
    let keys = fullkey.split('.');
    let val = obj[keys.shift()];
    if (!val) return null;
    for (let key of keys) {
        if (!val[key]) return val;
        val = val[key];
        if (Array.isArray(val)) return val.join('\n');
    }
    return val || null;
}

module.exports = (string, options = {}) => {
    if(!string) return string;
    return string.split(' ').map(str => (
        str.replace(/\{\{(.+)\}\}/gi, (matched, key) => (
            locate(key, options) || matched
        ))
    )).join(' ');
};