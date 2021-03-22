import Vue from 'vue'
import Notifications from '~/components/notification/notification'

export default function (ctx, inject) {
    const component = Vue.extend({
        data() {
            return {
                notificationType: '',
                message: ''
            }
        },
        render(h) {
            return h(Notifications,
                {
                    props: {
                        notificationType: this.notificationType,
                        message: this.message
                    },
                    on: {
                        closeModal: () => this.close()
                    }
                }
            )
        },
        methods: {
            close() {
                this.$mount().$el.remove();
            }
        }
    })
    inject('notification', (notificationType, message) => {
        const notification = new component();
        notification.notificationType = notificationType
        notification.message = message

        document.body.appendChild(notification.$mount().$el)
        setTimeout(() => {
            notification.$mount().$el.remove();
        }, 2000);
    })
}