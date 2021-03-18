import Vue from 'vue'

const PageHeader = () => import('@/components/navigation/pageHeader')
const Notification = () => import('@/components/notification/notification')

Vue.component('PageHeader', PageHeader);
Vue.component('Notification', Notification);