export const normalizePath = (path, parent) => {
    // 说明是一级路由
    if (/^\//.test(path)) {
        return path;
    }
    if (parent === null) {
        return path;
    }
    return cleanPath(parent.path + '/' + path);
};

function cleanPath(path) {
    return path.replace(/\/\//g, '/');
}

export const supportsPushState = window.history && typeof window.history.pushState === 'function';
