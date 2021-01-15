<template>
  <view class="wrapper">
      <view class="container">
        <view class="header">
          <view class="user-avatar">
            <image :style="{width: '100%', height: '100%', resizeMode: 'cover'}" :source="{uri: response.avatar}" />
          </view>
          <text class="name">{{response.name}}</text>
        </view>
        <!-- <view class="qr-code-image">
            <text></text>
            <image v-if="qrCode" :style="{width: '100%', height: '100%', resizeMode: 'contain'}" :source="{uri: qrCode}" />
        </view> -->
        <touchable-opacity class="add-friend-btn" :on-press="addFriend">
            <image
                :style="{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0,}"
                :source="require('../assets/btn-bg.png')"
            />
            <text :style="{color: 'white'}">Добави нов приятел</text>
        </touchable-opacity>
        <!-- TABS -->
        <view class="flex-row" :style="{justifyContent: 'space-between', marginTop: 20, marginBottom: 15}">
          <view>
            <touchable-opacity class="tab-btn" :on-press="seeFriends">
              <text :style="{color: 'white'}">Твоите приятели</text>
            </touchable-opacity>
            <view class="underline">
              <image
                v-if="!friendReq"
                :style="{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}"
                :source="require('../assets/btn-bg.png')"
              />
            </view>
          </view>
          <view>
            <touchable-opacity class="tab-btn" :on-press="seeReq">
              <text :style="{color: 'white'}">Заявки за приятелство</text>
            </touchable-opacity>
            <view class="underline">
              <image
                v-if="friendReq" 
                :style="{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}"
                :source="require('../assets/btn-bg.png')"
              />
            </view>
          </view>
        </view>
        <!-- TABS END -->
        <view v-if="!friendReq" :style="{flex: 1}">
          <view v-if="isLoading" class="loading">
            <image :style="{flex: 1, width: '20%', resizeMode: 'contain'}" :source="require('../assets/loader.gif')"/>
          </view> 
          <scroll-view :content-container-style="{paddingTop: 25, paddingBottom: 100,}">
               <view v-for="(friend, i) in friends" :key="i">
                  <view v-if="friend" class="friend">
                      <view class="flex-row">
                          <view class="friend-avatar">
                              <image :style="{width: '100%', height: '100%', resizeMode: 'cover'}" :source="{uri: friend.avatar}" />
                          </view>
                          <text class="friend-name">{{friend.name}}</text>
                      </view>
                  </view>
              </view>
          </scroll-view>
        </view>
        <view v-if="friendReq" :style="{flex: 1}">
          <scroll-view :content-container-style="{paddingTop: 25, paddingBottom: 100}">
              <view v-for="(friend, i) in frReq" :key="i">
                  <view v-if="friend" class="friend">
                      <view class="flex-row">
                          <view class="friend-avatar">
                              <image :style="{width: '100%', height: '100%', resizeMode: 'cover'}" :source="{uri: friend.avatar}" />
                          </view>
                          <text class="friend-name">{{friend.name}}</text>
                      </view>
                      <view class="friend-action">
                          <touchable-opacity class="friend-action-btn">
                              <text :style="{color: 'white'}">X</text>
                          </touchable-opacity>
                          <touchable-opacity class="friend-action-btn-accept" :on-press="() => accept(reqIDs[i].user)">
                              <image :style="{width: '50%', height: '100%', resizeMode: 'contain'}" :source="require('../assets/checked.png')" />
                          </touchable-opacity>
                      </view>
                  </view>
              </view>
          </scroll-view>
        </view>
      </view>
      <!-- <Navigation /> -->
      <view class="navigation">
        <view class="nav-option">
          <touchable-opacity class="inner-nav-btn-visible" :on-press="() => navigation.push('Test')">
            <image
              :style="{width: '100%', height: '100%', resizeMode: 'contain'}"
              :source="require('../assets/home.png')"
            />
          </touchable-opacity>
        </view>
        <view class="nav-option">
          <touchable-opacity class="inner-nav-btn-visible" :on-press="() => navigation.push('Private')">
            <image
              :style="{width: '100%', height: '100%', resizeMode: 'contain'}"
              :source="require('../assets/private.png')"
            />
          </touchable-opacity>
        </view>
        <view class="center" shadowColor="#943af0" :shadowOffset="{width: 0, height: 0}" shadowOpacity="0.4" shadowRadius="8">
            <touchable-opacity class="inner-nav-btn" :on-press="() => navigation.push('addEvent')">
              <image
                  :style="{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}"
                  :source="require('../assets/btn-bg.png')"
              />
                  <text :style="{color: 'white', fontSize: 42, top: -2}">+</text>
            </touchable-opacity>
        </view>
        <view class="nav-option">
          <touchable-opacity class="inner-nav-btn-visible" :on-press="() => navigation.push('Profile')">
            <image
              :style="{width: '100%', height: '100%', resizeMode: 'contain'}"
              :source="require('../assets/user.png')"
            />
          </touchable-opacity>
        </view>
        <view class="nav-option">
          <touchable-opacity class="inner-nav-btn-visible" :on-press="logOut">
            <image
              :style="{width: '100%', height: '100%', resizeMode: 'contain'}"
              :source="require('../assets/logout.png')"
            />
          </touchable-opacity>
        </view>
      </view>
  </view>
</template>

<script>
import firebase from '../firebase'
import Axios from 'axios'
import Store from '../store'

export default {
  components: {
    // Navigation
  },
  props: {
    navigation: {
      type: Object
    }
  },
  data() {
    return {
      user: null,
      response: '',
      friendReq: false
    //   qrCode: null,
    }
  },
  computed: {
      frReq() {
        return Store.state.friendRequests
      },
      reqIDs() {
        return Store.state.ids
      },
      friends() {
        return Store.state.friends
      },
      isLoading() {
        return Store.state.friendsLoading
      }
  },
  watch: {
    frReq() {
      let userID = this.userID
      Store.dispatch('getFriendRequests', {userID})
    }
  },
  methods: {
    getUser() {
      Axios.get(`https://mobile-6b27d.firebaseio.com/users/${this.user}.json`).then( res => {
        this.response = res.data
      })
    },
  // generateQr() {
  //     this.qrCode = `https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=${this.user}`
  // },
    getFriendRequests() {
        let userID = this.user
        Store.dispatch('getFriendRequests', {userID})
    },
    addFriend() {
        this.navigation.push('SearchFriend')
    },
    accept(id) {
        let friendID = id
        let userID = this.user
        Store.dispatch('acceptFriend', {userID, friendID})
    },
    getFriends() {
        let userID = this.user
        Store.dispatch('fetchFriends', {userID})
    },
    seeFriends() {
      let userID = this.user
      this.friendReq = false
      Store.dispatch('fetchFriends', {userID})
    },
    seeReq() {
      let userID = this.userID
      this.friendReq = true
      Store.dispatch('getFriendRequests', {userID})
    },
    logOut() {
        console.log(1232);
    }
  },
  created() {
    setTimeout(() => {
      let user = firebase.auth().currentUser
      if (user != null) {
        this.user = user.uid
        this.getUser();
        // this.generateQr();
        this.getFriendRequests();
        this.getFriends();
      } else {
        this.navigation.push('Welcome')
      }
    }, 600)
  },
}
</script>

<style>
.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 50%;
  z-index: 3123121231;
  align-items: center;
}

.underline {
  position: relative;
  height: 4px;
  border-radius: 99999px;
  overflow: hidden;
}

.tab-btn {
  overflow: hidden;
  align-items: center;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
  height: 40px;
  border-radius: 16px;
}

.friend-action {
    flex-direction: row;
    align-items: center;
}
.friend-action-btn {
    width: 36px;
    height: 36px;
    background-color: #0070fb;
    margin-left: 8px;
    border-radius: 99999px;
    justify-content: center;
    align-items: center;
}

.friend-action-btn-accept {
    width: 36px;
    height: 36px;
    background-color: #943af0;
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
    margin-bottom: 15px;
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
.qr-code-image {
    margin-top: 30px;
    height: 200px;
}

.header {
    margin-top: 46px;
    width: 100%;
    height: 100px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.name {
  font-size: 32px;
  font-weight: bold;
  color: #fff;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-width: 3px;
  border-color: #943af0;
  border-radius: 99999px;
  overflow: hidden;
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

.navigation {
    position: absolute;
    width: 100%;
    height: 70px;
    background-color: transparent;  
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 0;
    background-color: #202243;
}
.nav-option {
    width: 36px;
    height: 36px;
    border-radius: 99999px;
    align-items: center;
    justify-content: center;
}

.center {
    position: relative;
    top: -30px;
    width: 70px;
    height: 70px;
}

.inner-nav-btn {
    border-radius: 99999px;
    position: relative;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.inner-nav-btn-visible {
    border-radius: 99999px;
    position: relative;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
}
</style>
