<template>
  <view class="wrapper">
      <view class="container">
        <view class="header">
            <text-input class="input" :on-change-text="val => search = val" :default-value="search" placeholder="Име" placeholderTextColor="white" />
        </view>
         <scroll-view :content-container-style="{paddingTop: 15, paddingBottom: 150}">
            <view v-for="(friend, i) in users" :key="i">
                <view v-if="friend" class="friend">
                    <view class="flex-row">
                        <view class="friend-avatar">
                            <image :style="{width: '100%', height: '100%', resizeMode: 'cover'}" :source="{uri: friend.avatar}" />
                        </view>
                        <text class="friend-name">{{friend.name}}</text>
                        <!-- <text class="friend-name">{{userIDs[i]}}</text> -->
                    </view>
                    <view shadowColor="#943af0" :shadowOffset="{width: 0, height: 0}" shadowOpacity="0.4" shadowRadius="8">
                        <touchable-opacity v-if="!friends.includes(userIDs[i])" class="add-btn" :on-press="() => send(userIDs[i])">
                            <image
                                :style="{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}"
                                :source="require('../assets/btn-bg.png')"
                            />
                            <text :style="{color: 'white', fontSize: 18}">+</text>
                        </touchable-opacity>
                    </view>
                </view>
            </view>
        </scroll-view>
      </view>
  </view>
</template>

<script>
import firebase from '../firebase'
import Axios from 'axios'
import Store from '../store'

export default {
  props: {
    navigation: {
      type: Object
    }
  },
  data() {
    return {
      user: null,
      response: '',
      search: '',
      friends: []
    }
  },
  computed: {
    users() {
      return Object.values(Store.state.users).filter( user => {
          return user.name.match(this.search)
      })
    },
    userIDs() {
      return Store.state.usersIds
    },
  },
  methods: {
    getUser() {
      Axios.get(`https://mobile-6b27d.firebaseio.com/users/${this.user}.json`).then( res => {
        this.response = res.data
      })
    },
    async getFriends() {
      let res = await Axios.get(`https://mobile-6b27d.firebaseio.com/users/${this.user}/friends/.json`)
      if (res.data) {
        Object.values(res.data).map( id => {
          this.friends.push(id.user)
        })

        this.friends.map( id => {
          if (this.userIDs.includes(id)) {
            console.log(id);
          }
        })
      }
    },
    async send(id) {
      let friendID = id
      let name = this.response.name
      let userID = this.user
      Store.dispatch('sendFriendReq', {userID, friendID, name})
    }
  },
  created() {
    setTimeout(() => {
      let user = firebase.auth().currentUser
      if (user != null) {
        this.user = user.uid
        this.getUser();
        this.getFriends();
      } else {
        this.navigation.push('Welcome')
      }
    }, 600)
    Store.dispatch('fetchUsers')
  },
}
</script>

<style>
.add-btn {
    position: relative;
    width: 42px;
    height: 42px;
    border-radius: 99999px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.input {
    color: #fff;
    width: 100%;
    border-bottom-width: 1px;
    border-color: #943af0;
    padding-top: 8px;
    padding-bottom: 10px;
}

.friend-action {
    flex-direction: row;
    align-items: center;
}
.friend-action-btn {
    width: 36px;
    height: 36px;
    background-color: #fff;
    margin-left: 8px;
    border-radius: 99999px;
    justify-content: center;
    align-items: center;
}

.flex-row {
    flex-direction: row;
    align-items: center;
}

.friend-avatar {
    width: 60px;
    height: 60px;
    border-width: 2px;
    border-color: #943af0;
    border-radius: 99999px;
    overflow: hidden;
    margin-right: 15px;
}
.friend {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 25px;
}

.friend-name {
    font-size: 16px;
    color: #fff;
}

.add-friend-btn {
    margin-top: 30px;
    position: relative;
    width: 100%;
    height: 60px;
    margin-bottom: 0;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    overflow: hidden;
}

.header {
    margin-top: 46px;
    width: 100%;
    height: 100px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}


.wrapper {
  position: relative;
  flex: 1;
  background-color: #202243;
}

.container {
  padding-left: 15px;
  padding-right: 15px;
  flex: 1;
}

</style>
