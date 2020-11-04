<template>
  <div id='app'>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data(){
    return {
      loggedIn:false,
      threads:[
       {id:0,topicName:'Best Movie'},
       {id:1,topicName:'News of 2019'},
       {id:2,topicName:'Politics'}
      ],
      users:[
        {id:0, name: "John Wick", online: true},
        {id:1, name: "Ethan Hunt", online: false},
        {id:2, name: "Brad Pitt", online: false}
      ]
    }
  }
};
</script>
