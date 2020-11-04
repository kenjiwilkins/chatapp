import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueChatScroll from 'vue-chat-scroll';
import firebase from 'firebase';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { MediaQueries } from 'vue-media-queries'

import store from './store/index';
import router from './router';

const config = {
  apiKey:"YOUR_API_KEY",
  authDomain:"mkw-chatbox.firebaseapp.com",
  databaseURL:"https://mkw-chatbox.firebaseio.com",
  projectId:"mkw-chatbox",
  storageBucket:"mkw-chatbox.appspot.com",
  messagingSenderId:"186981207058",
}
firebase.initializeApp(config)

const mediaQueries = new MediaQueries();

library.add(faPlus, faSync);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false
Vue.use(VueChatScroll)

new Vue({
  vuetify,
  router,
  store,
  mediaQueries:mediaQueries,
  render: h => h(App)
}).$mount('#app')
