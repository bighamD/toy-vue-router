export function createRoute(record, location) {
    // 这个数据就是我们常常操作的$route, 表示当前匹配的
    const route = {
        name: location.name || (record && record.name),
        meta: (record && record.meta) || {},
        path: location.path || '/',
        hash: location.hash || '',
        query: location.query,
        params: location.params || {},
        fullPath: location.path,
        // matched的作用是，为了处理嵌套类型的router-view
        // 子组件存在children，那么router-view应该是先渲染父，然后父中的router-view再去渲染children
        // <router-view>
        //      <router-view></router-view>
        // </router-view>
        matched: record ? formatMatch(record) : [],
    };
    return Object.create(route);
}

function formatMatch(record) {
    const res = [];
    while (record) {
        res.unshift(record);
        record = record.parent;
    }
    return res;
}
// 一开始的初始化路由
export const START = createRoute(null, {
    path: '/',
});
