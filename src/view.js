export default {
    name: 'RouterView',
    functional: true,
    render(_, { parent, data, _c }) {
        data.routeView = true;

        let depth = 0;
        const route = parent.$route;

        while (parent) {
            const vnodeData = parent.$vnode ? parent.$vnode.data : {};
            if (vnodeData.routeView) {
                depth++;
            }
            parent = parent.$parent;
        }

        const component = route.matched[depth];
        return _c(component.component, data);
    },
};
