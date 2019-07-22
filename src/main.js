import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import Vuetify from './plugins/vuetify'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader

global._cloneDeep = require('lodash/cloneDeep')
global._isEqual = require('lodash/isEqual')
global._isEmpty = require('lodash/isEmpty')
global.appControl = {
	firebase_DB: null,
}

let config = {
  apiKey: "AIzaSyAGY5OL9nqB8yb3DfD-x6MQsuB1jEudzXs",
  authDomain: "igprize.firebaseapp.com",
  databaseURL: "https://igprize.firebaseio.com",
  projectId: "igprize",
  storageBucket: "igprize.appspot.com",
  messagingSenderId: "642766889945",
  appId: "1:642766889945:web:cf117b1e09f6ec3a"
};
firebase.initializeApp(config);
appControl.firebase_DB = firebase.database()

Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
