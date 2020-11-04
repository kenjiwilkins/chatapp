export default {
  setMessage(state, message){
    state.message = message
  },
  reset(state){
    state.message = null;
  }
}
