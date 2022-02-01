import { START } from '../route';

export class History {
    constructor(router) {
        this.router = router;
        this.current = START;
        this.listeners = [];
    }
    // 这个方法是让响应式数据route变化，来触发异步更新策略
    updateRoute(route) {
        this.current = route;
        this.cb && this.cb(route);
    }
    listen(cb) {
        this.cb = cb;
    }
    // 核心方法
    // 用于跳转切换路由
    transitionTo(location, onComplete) {
        // 这个match方法是是VueRouter我们自己定义的
        const route = this.router.match(location);

        // 更新路由，更新视图
        this.updateRoute(route);
        onComplete && onComplete(route);
    }
    teardown() {
        // clean up event listeners
        // https://github.com/vuejs/vue-router/issues/2341
        // 重置路由，删除监听事件
        this.listeners.forEach((cleanupListener) => {
            cleanupListener();
        });
        this.listeners = [];

        // reset current history route
        // https://github.com/vuejs/vue-router/issues/3294
        this.current = START;
        this.pending = null;
    }
}
