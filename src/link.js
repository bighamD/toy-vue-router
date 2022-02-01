export default {
    name: 'RouterLink',
    props: {
        to: {
            type: String,
            require: true,
        },
        tag: {
            type: String,
            default: 'a',
        },
    },
    render(h) {
        const onClick = (e) => {
            e.preventDefault();
            this.$router.push(this.to);
        };
        
        return h(
            this.tag,
            {
                on: {
                    click: onClick,
                },
            },
            this.$slots.default
        );
    },
};
