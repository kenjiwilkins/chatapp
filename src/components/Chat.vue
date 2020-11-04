<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h2>Chatter</h2>
      </div>

      <v-spacer></v-spacer>
      <v-btn
        href=""
        target="_blank"
        text
        @click="loginForm = true"
      >
        <span class="mr-2" v-if="user === undefined">login</span>
        <span class="mr-2" v-else>{{user.displayName}}</span>

        <template v-if="user !== undefined">
          <v-avatar size="36px">
            <img alt="avatar" v-bind:src=user.photoURL />
          </v-avatar>
        </template>
      </v-btn>
    </v-app-bar>

    <v-content v-if="getWidth() > 700">
      <v-container>
            <v-row
              align='alignment'
              justify='space-between'
              >
              <v-col cols='5'>
                <v-row align="center">
                  <v-col cols='8'>
                    <h2>Threads</h2>
                  </v-col>
                  <v-col cols='2'>
                    <v-btn text icon @click="createThread = !createThread">
                      <font-awesome-icon icon="plus"/>
                    </v-btn>
                  </v-col>
                  <v-col cols='2'>
                    <v-btn text icon @click="getThreads()">
                      <font-awesome-icon icon="sync"/>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-list v-if="threads.length > 0" style="max-height: 500px" class="overflow-y-auto">
                  <v-list-item v-for="(thread, index) in threads" v-bind:key="index">
                    <v-list-item-content @click="clickThread(thread.id)">
                      <v-list-item-title v-text="thread.data.title"></v-list-item-title>
                      <v-row>
                        <v-col cols="4">
                          <v-list-item-subtitle v-text="`comment:${thread.data.commentCount}`"></v-list-item-subtitle>
                        </v-col>
                        <v-col cols="8">
                          <v-list-item-subtitle v-text="`${getDate(thread.data.lastCommented)}`"></v-list-item-subtitle>
                        </v-col>
                      </v-row>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </v-list>
                <h5 v-else>loading...</h5>
              </v-col>
              <v-col cols='7'>
                <v-row align="center">
                  <v-col cols='10'>
                    <h2>Chats</h2>
                  </v-col>
                  <v-col cols='1'>
                    <v-btn text icon disabled v-if="clickedThread === undefined">
                      <font-awesome-icon icon="plus"/>
                    </v-btn>
                    <v-btn text icon @click="createComment=true" v-else>
                      <font-awesome-icon icon="plus"/>
                    </v-btn>
                  </v-col>
                  <v-col cols='1'>
                    <v-btn text icon disabled v-if="clickedThread === undefined">
                      <font-awesome-icon icon="sync"/>
                    </v-btn>
                    <v-btn text icon @click="getComments(clickedThread)" v-else>
                      <font-awesome-icon icon="sync"/>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <p v-if="clickedThread===undefined">
                  no thread selected
                </p>
                <h5 v-else-if="comments.length === 0">loading...</h5>
                <v-list v-else style="max-height: 500px" class="overflow-y-auto">
                  <v-list-item v-for="(comment, index) in comments" v-bind:key="index">
                    <v-list-item-content>
                      <v-list-item-title v-text="comment.data.comment" />
                      <v-row>
                        <v-col cols="4">
                          <v-list-item-subtitle v-text="comment.data.commenterName" />
                        </v-col>
                        <v-col cols="8">
                          <v-list-item-subtitle v-text="getDate(comment.data.commentTime)" />
                        </v-col>
                      </v-row>
                    </v-list-item-content>
                    <v-list-item-avatar>
                      <img :src="comment.data.commenterImg" :alt="comment.data.commenterName" />
                    </v-list-item-avatar>
                  </v-list-item>
                </v-list>

              </v-col>
            </v-row>
      </v-container>
      <v-dialog v-if="!login" v-model="loginForm" persistent max-width="60%" width="200px">
        <v-button icon @click="loginForm = false">
          <v-icon>mdi-close</v-icon>
        </v-button>
        <v-card outlined>
          <div class="dialog" style="text-align: center">
          <div>
            Sign Up
          </div>
          <v-form>
            <v-btn @click="signup" style="padding:8px">login</v-btn>
          </v-form>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-else-if="login" v-model="loginForm" max-width="60%" persistent>
        <v-card outlined>
          <div class="dialog">
          <div>User Info</div>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                User Name: {{user.displayName}}
              </v-list-item-content>
              <v-list-item-avatar>
                <img alt='avatar' v-bind:src=user.photoURL />
              </v-list-item-avatar>
            </v-list-item>
            <v-list-item>
              email: {{user.email}}
            </v-list-item>
          </v-list>
          <v-btn @click="logout">logout</v-btn>
          <v-btn @click="loginForm = false">close</v-btn>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="createThread" persistent max-width="60%">
        <v-button icon @click="createThread = false">
          <v-icon>mdi-close</v-icon>
        </v-button>
        <v-card outlined="true">
          <div class="dialog">
          <v-alert v-if="alert" type="error">
            Please Login First
          </v-alert>
          <v-form>
            <div class="createThreadForm">
            <div class=".display-1 .font-weight-medium">
              Create Thread...
            </div>
            <v-textarea
              label="thread title"
              single-line
              required
              autofocus
              v-model="threadTitle"
              >
            </v-textarea>
            <v-textarea
              label="body"
              required
              v-model="threadBody"
               >
            </v-textarea>
            <v-btn class='createButton' @click="postThread">Create</v-btn>
            </div>
          </v-form>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="createComment" persistent max-width="60%">
        <v-button icon @click="createComment = false">
          <v-icon>mdi-close</v-icon>
        </v-button>
        <v-card outlined="true">
          <div class="dialog">
          <v-alert v-if="alert" type="error">
            Please Login First
          </v-alert>
          <v-form>
            <div class="createThreadForm">
            <div class=".display-1 .font-weight-medium">
              Make Comment...
            </div>
            <v-textarea
              label="Comment"
              single-line
              required
              autofocus
              v-model="commentBody"
              >
            </v-textarea>
            <v-btn class='createButton' @click="postComment">Comment</v-btn>
            </div>
          </v-form>
          </div>
        </v-card>
      </v-dialog>
    </v-content>
    <v-content v-else>
      <v-container>
        <v-list v-if="clickedThread === undefined">
          <h2> Threads </h2>
          <div v-if="threads.length > 0">
          <v-list-item v-for="(thread, index) in threads" v-bind:key="index">
            <v-list-item-content @click="clickThread(thread.id)">
              <v-list-item-title v-text="thread.data.title"></v-list-item-title>
              <v-row>
                <v-col cols="4">
                  <v-list-item-subtitle v-text="`comment:${thread.data.commentCount}`"></v-list-item-subtitle>
                </v-col>
                <v-col cols="8">
                  <v-list-item-subtitle v-text="`${getDate(thread.data.lastCommented)}`"></v-list-item-subtitle>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          </div>
          <h5 v-else>loading...</h5>
        </v-list>
        <v-list v-else>
          <h2>Chat</h2>
          <div v-if="comments.length > 0">
            <v-list style="max-height: 500px" class="overflow-y-auto">
              <v-list-item v-for="(comment, index) in comments" v-bind:key="index">
                <v-list-item-content>
                  <v-list-item-title v-text="comment.data.comment" />
                  <v-row>
                    <v-col cols="4">
                      <v-list-item-subtitle v-text="comment.data.commenterName" />
                    </v-col>
                    <v-col cols="8">
                      <v-list-item-subtitle v-text="getDate(comment.data.commentTime)" />
                    </v-col>
                  </v-row>
                </v-list-item-content>
                <v-list-item-avatar>
                  <img :src="comment.data.commenterImg" :alt="comment.data.commenterName" />
                </v-list-item-avatar>
              </v-list-item>
            </v-list>
          </div>
          <h5 v-else-if="clickedThread === undefined"> no thread selected</h5>
          <h5 v-else>loading...</h5>
        </v-list>
      </v-container>
            <v-dialog v-if="!login" v-model="loginForm" persistent max-width="60%" width="200px">
        <v-button icon @click="loginForm = false">
          <v-icon>mdi-close</v-icon>
        </v-button>
        <v-card outlined>
          <div class="dialog" style="text-align: center">
          <div>
            Sign Up
          </div>
          <v-form>
            <v-btn @click="signup" style="padding:8px">login</v-btn>
          </v-form>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-else-if="login" v-model="loginForm" max-width="60%" persistent>
        <v-card outlined>
          <div class="dialog">
          <div>User Info</div>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                User Name: {{user.displayName}}
              </v-list-item-content>
              <v-list-item-avatar>
                <img alt='avatar' v-bind:src=user.photoURL />
              </v-list-item-avatar>
            </v-list-item>
            <v-list-item>
              email: {{user.email}}
            </v-list-item>
          </v-list>
          <v-btn @click="logout">logout</v-btn>
          <v-btn @click="loginForm = false">close</v-btn>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="createThread" persistent max-width="60%">
        <v-button icon @click="createThread = false">
          <v-icon>mdi-close</v-icon>
        </v-button>
        <v-card outlined="true">
          <div class="dialog">
          <v-alert v-if="alert" type="error">
            Please Login First
          </v-alert>
          <v-form>
            <div class="createThreadForm">
            <div class=".display-1 .font-weight-medium">
              Create Thread...
            </div>
            <v-textarea
              label="thread title"
              single-line
              required
              autofocus
              v-model="threadTitle"
              >
            </v-textarea>
            <v-textarea
              label="body"
              required
              v-model="threadBody"
               >
            </v-textarea>
            <v-btn class='createButton' @click="postThread">Create</v-btn>
            </div>
          </v-form>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="createComment" persistent max-width="60%">
        <v-button icon @click="createComment = false">
          <v-icon>mdi-close</v-icon>
        </v-button>
        <v-card outlined="true">
          <div class="dialog">
          <v-alert v-if="alert" type="error">
            Please Login First
          </v-alert>
          <v-form>
            <div class="createThreadForm">
            <div class=".display-1 .font-weight-medium">
              Make Comment...
            </div>
            <v-textarea
              label="Comment"
              single-line
              required
              autofocus
              v-model="commentBody"
              >
            </v-textarea>
            <v-btn class='createButton' @click="postComment">Comment</v-btn>
            </div>
          </v-form>
          </div>
        </v-card>
      </v-dialog>
      <v-bottom-navigation class="bottom-nav" fixed>
        <div v-if="clickedThread === undefined">
          <v-btn @click="returnToThreads()">
            <v-icon>mdi-keyboard-return</v-icon>
          </v-btn>
          <v-btn >
            <font-awesome-icon icon="plus" @click="createThread = true"/>
          </v-btn>
          <v-btn>
            <font-awesome-icon icon="sync" @click="getThreads()"/>
          </v-btn>
        </div>
        <div v-else>
          <v-btn @click="returnToThreads()">
            <v-icon>mdi-keyboard-return</v-icon>
          </v-btn>
          <v-btn >
            <font-awesome-icon icon="plus" @click="createComment = true"/>
          </v-btn>
          <v-btn>
            <font-awesome-icon icon="sync" @click="getComments(clickedThread)"/>
          </v-btn>
        </div>
      </v-bottom-navigation>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import firebase from 'firebase';
import moment from 'moment'
export default {
  name:"chat",
  data(){
    return {
      threads: [],
      comments:[],
      createThread: false,
      threadTitle:"",
      threadBody:"",
      alert:false,
      loginForm:false,
      testState:"empty",
      success:"",
      clickedThread:undefined,
      commentBody:"",
      createComment:false,
    }
  },
  computed: mapState({
    login: state => state.login,
    token: state => state.token,
    user: state => state.user,
  }),

  methods:{
    ...mapMutations([
      'updateToken',
      'updateUser',
      'updateExpiresAt',
      'login',
      'resetState'
    ]),
    async postThread(){
      if(this.login === false){
        this.alert=true;
        return;
      }
      let db = firebase.firestore();
      await db.collection('threads').add({
        commentCount:1,
        created: Date.now(),
        lastCommented: Date.now(),
        title:this.threadTitle
      }).then(val => {
        db.collection(`threads`).doc(val.path.substr(8)).collection('comments').add({
          comment:this.threadBody,
          commentTime: Date.now(),
          commenterImg:this.user.photoURL,
          commenterName:this.user.displayName,
        }).then(this.clickThread(val.path.substr(8))).then(this.getThreads())
      })
      this.createThread = false;
      this.threadTitle = "";
      this.threadBody = "";
    },
    async postComment(){
      if(this.login === false){
        this.alert = true;
        return
      }
      this.createComment = false;
      let db = firebase.firestore();
      let increment = firebase.firestore.FieldValue.increment(1);
      await db.collection('threads').doc(this.clickedThread).collection('comments').add({
        comment:this.commentBody,
        commentTime: Date.now(),
        commenterImg: this.user.photoURL,
        commenterName: this.user.displayName,
      })
      await db.collection('threads').doc(this.clickedThread).update({
          commentCount: increment,
          lastCommented: Date.now(),
        })
       this.commentBody = "";
      await this.getComments(this.clickedThread);
      await this.getThreads();
    },
    clickThread(ID){
      this.clickedThread = ID
      this.getComments(ID);
    },
    signup(){
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then(res => {
        let token = res.credential.accessToken;
        let user = res.user;
        this.loginForm = false;
        this.$store.commit("login", this.login)
        this.$store.commit("updateExpiresAt", res.user.lastLoginAt);
        this.$store.commit("updateToken", token);
        this.$store.commit("updateUser", user);
      })
    },
    logout(){
      firebase.auth().signOut().then(() => {
        this.loginForm = false;
        this.$store.commit("resetState");
      })
    },
    getComments(ID){
      if(ID === undefined) return;
      this.comments=[];
      let db = firebase.firestore();
      db.collection(`/threads/${ID}/comments`).orderBy('commentTime',"asc").get().then(snapshot => {
        snapshot.forEach(doc => {
          this.comments.push({id:doc.id, data:doc.data()})
        })
      }).catch(error => {
        this.comments.push(error)
      })
    },
    getThreads(){
      this.threads=[];
      let db = firebase.firestore();
      db.collection('threads').orderBy('lastCommented',"desc").get().then(snapshot => {
        snapshot.forEach(doc => {
            this.threads.push({id:doc.id, data:doc.data()})
        })
      })
    },
    getDate(date){
      return moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a")
    },
    getWidth(){
      return window.innerWidth
    },
    returnToThreads(){
      this.clickedThread = undefined;
      this.comments = [];
    }
  },
  mounted(){
    this.getThreads();
  },
}
</script>

<style >
  .createThreadForm {
    padding:8px;
    text-align: center;
  }
  .dialog{
    padding: 8px;
  }
  .bottom-nav{
    bottom: 0;
  }
</style>
