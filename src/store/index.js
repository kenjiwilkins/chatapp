import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage:window.localStorage
});

export default new Vuex.Store({
  state:{
    message:"DEFAULT",
    login:false,
    token:undefined,
    user:undefined,
    expiresAt:0,
  },
  getters:{
    getMessage: state => {
      return state.message
    },
    getLoginStatus: state => {
      return {
        token:state.token,
        user:state.user
      }
    },
    getExpiryTime: state => {
      return {
        expiresAt: state.expiresAt
      }
    }
  },
  mutations:{
    changeMessage(state, text){
      state.message = text;
    },
    login(state, login){
      if(login) return;
      state.login = true;
    },
    updateToken(state, token){
      state.token = token;
    },
    updateUser(state, user){
      state.user = user;
    },
    updateExpiresAt(state, expiresAt){
      state.expiresAt = expiresAt
    },
    resetState(state){
      state.message = "DEFAULT"
      state.login = false
      state.token = undefined
      state.user = undefined
      state.expiresAt = 0
    }
  },
  actions:{
    changeMessage(context){
      context.commit('changeMessage');
    },
    login(context){
      context.commit('login');
    },
    updateToken(context){
      context.commit('updateToken');
    },
    updateUser(context){
      context.commit('updateUser');
    },
    updateExpiresAt(context){
      context.commit('updateExpiresAt');
    },
    resetState(context){
      context.commit('resetState');
    }
  },
  plugins:[vuexLocal.plugin],
})
