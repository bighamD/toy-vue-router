import { normalizePath } from './utils';
import { createRoute } from './route';

export function createMatcher(routes) {
    // 创建一个路由映射表
    // {
    //     '/a': {
    //         path: '/a',
    //         component: { render: f },
    //         meta: {},
    //         parent: null
    //     },
    //     '/b': {
    //         path: '/b',
    //         component: { render: f },
    //         meta: {},
    //         parent: null
    //     },
    // }
    const pathMap = createRouteMap(routes);

    const getRoutes = () => {
        return pathMap;
    };
    const match = (raw) => {
        // 兼容path是对象的情况，$router.push({path: '/a'})
        const pathConfig = typeof raw === 'string' ? { path: raw } : raw;

        // matchRoute是暴露给用户的路由，我们修改当前路由属性都是操作这个对象
        // 结构是这样的，是不是很熟悉，使用vue-devtool的时候
        // {
        //     fullPath: "/b"
        //     hash: ""
        //     matched: [{…}]
        //     meta: {}
        //     name: undefined
        //     params: {}
        //     path: "/b"
        //     query: undefined
        // }
        const matchRoute =  createRoute(pathMap[pathConfig.path], pathConfig);
        return matchRoute;
    };
    // 暴露路由匹配的方法
    return {
        getRoutes,
        match,
    };
}

export function createRouteMap(routes) {
    const pathMap = Object.create(null);
    routes.forEach((route) => {
        addRouteRecord(pathMap, route, null);
    });
    return pathMap;
}

// dfs生成路由键值对
export function addRouteRecord(pathMap, route, parent) {
    const path = route.path;
    // 如果当前是children，那么要拼接上父的path,
    // {
    // '/b/child': {
    //         path: 'b',
    //         component: { render: f },
    //         meta: {},
    //         parent: {path: '/b', component: { render: f }, }
    //     },
    // }

    // 拼接父的path '/b/child'
    const normalizedPath = normalizePath(path, parent);

    const record = {
        path: normalizedPath,
        component: route.component,
        meta: route.meta,
        parent,
    };
    if (route.children) {
        route.children.forEach((child) => {
            addRouteRecord(pathMap, child, record);
        });
    }
    // 设置键值对
    if (!pathMap[record.path]) {
        pathMap[record.path] = record;
    }
}
