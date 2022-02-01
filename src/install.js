import View from './view';
import Link from './link';
export default function install(Vue) {
    Vue.mixin({
        beforeCreate() {
            // 说明当前组件是vue的根实例
            if (this.$options.router) {
                // 增加一个属性指向自己
                this._routerRoot = this;
                this._router = this.$options.router;
                this._router.init(this);
                Vue.util.defineReactive(this, '_route', this._router.history.current);
            } else {
                // 多叉树
                // 如果是子组件，使子组件的_routerRoot都指向父组件实例
                // 最终所有的子组件的_routerRoot都指向都指向根组件实例
                this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
            }
        },
    });
    // 原型上定义响应式属性$router, 当我们在子组件组件使用时都是指向根组件上的_routerRoot的_router
    Object.defineProperty(Vue.prototype, '$router', {
        get() {
            return this._routerRoot._router;
        },
    });
    // 原型上定义响应式属性$route, 当我们在子组件组件使用时都是指向根组件上的_routerRoot的_route
    Object.defineProperty(Vue.prototype, '$route', {
        get() {
            return this._routerRoot._route;
        },
    });
    // 注册组件
    Vue.component('router-view', View);
    Vue.component('router-link', Link);
}
