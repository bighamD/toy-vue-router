import install from './install';
import { createMatcher } from './create-matcher';
import { HashHistory } from './history/hash';

export default class VueRouter {
    constructor(options) {
        this.apps = [];
        this.options = options;
        this.matcher = createMatcher(options.routes);
        this.mode = options.mode;
        switch (options.mode) {
            case 'hash':
                // 咋们只处理一个hash路由即可
                this.history = new HashHistory(this);
                break;
            default:
                console.error('invalid mode: ', mode);
        }
    }
    match(raw) {
        return this.matcher.match(raw);
    }

    init(app) {
        // 为什么apps是一个数组，主要是有可能会出现一种全局的模态框，他是通过new Vue构造出来后拿到节点手动挂载到body尾部
        // 那么这个vue实例跟根组件Root是隔离的，同时也想使用router的能力
        // 那么此时路由更新，应该同时更新两个实例的状态，因此apps是一个数组
        // 比如下面
        // const globalDiaglog = props => {
        //     const vm = new Vue({
        //         router,
        //         store,
        //         render: h => h(Dialog, props)
        //     });

        //     const component = vm.$mount();
        //     // 将dialog的内容追加到body尾部
        //     document.body.appendChild(component.$el);
        //     return vm.$children[0];
        // };

        this.apps.push(app);

        // 只监听一次卸载时间
        app.$once('hook:destoryed', () => {
            // 重置路由
            // 移除监听事件
            this.history.teardown();
        });

        // 防止多次初始化跳转和事件监听
        if (this.app) {
            return
        }
        this.app = app;
        const history = this.history;

        // 首次主动渲染router-view
        history.transitionTo(history.getCurrentLocation(), () => {
            history.setupListeners();
        });
        // 当更改hash或者history，主动更新视图
      
        history.listen((route) => {
            // 批量更新
            this.apps.forEach((app) => {
                // 之前说过_route是通过defineProperty设置的响应式属性，
                // 当_route被修改的时候会触发根实例的渲染watcher更新，从而更新视图
                app._route = route;
            });
        });
    }
    replace(location, onComplete) {
        this.history.replace(location, onComplete);
    }
    push(location, onComplete) {
        this.history.push(location, onComplete);
    }
    go(n) {
        this.history.go(n);
    }
}

VueRouter.install = install;
