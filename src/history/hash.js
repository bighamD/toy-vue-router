import { History } from './base';
import { supportsPushState } from '../utils';
export class HashHistory extends History {
    constructor(router) {
        super(router); // 继承父类
    }
    setupListeners() {
        if (this.listeners.length > 0) {
            return;
        }
        const router = router;
        const handleRoutingEvent = (e) => {
            // 父类base的跳转方法
            this.transitionTo(getHash(), (route) => {
                // 完成后同步同步更新下url地址
                this.ensureURL();
            });
        };
        // 之前说过改变锚点，实际上就是使用hash的时候改变hash，也会触发popstate事件
        const eventType = supportsPushState ? 'popstate' : 'hashchange';
        window.addEventListener(eventType, handleRoutingEvent);
        this.listeners.push(() => {
            window.removeEventListener(eventType, handleRoutingEvent);
        });
    }
    // 确保hash是更新了
    ensureURL() {
        const { fullPath } = this.current.fullPath;
        const hash = location.hash;
       
        if (hash.substr(1) === fullPath) {
            return false;
        }
        window.location.hash = hash;
    }
    push(location) {
        this.transitionTo(location, (route) => {
            // 更新hash
            pushHash(route.fullPath);
        });
    }
    replace(location) {
        this.transitionTo(location, (route) => {
            // 替换url
            window.location.replace(getUrl(route.fullPath));
        });
    }
    getCurrentLocation() {
        return getHash();
    }
    go(n) {
        window.history.go(n);
    }
}

// 更新hash
function pushHash(path) {
    window.location.hash = path;
}

export function getHash() {
    // hack一下浏览器的差异
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    let href = window.location.href;
    const index = href.indexOf('#');
    // empty path
    if (index < 0) {
        location.hash = '#/';
        return '/';
    }

    href = href.slice(index + 1);
    return href;
}

// 获取当前完整url
function getUrl(path) {
    const href = window.location.href;
    const i = href.indexOf('#');
    const base = i >= 0 ? href.slice(0, i) : href;
    return `${base}#${path}`;
}
