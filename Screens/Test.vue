<template>
  <view class="wrapper">
      <view class="container">
        <view class="header">
          <view class="user-avatar">
            <image :style="{width: '100%', height: '100%', resizeMode: 'cover'}" :source="{uri: response.avatar}" />
          </view>
          <text class="name">{{response.name}}</text>
        </view>
        <scroll-view v-if="!isLoading" :content-container-style="{paddingTop: 25, paddingBottom: 150}">
          <view v-for="(event, i) in events" :key="i">
            <view v-if="event.title" class="card">
              <view v-if="event" class="card-header">
                <view class="card-avatar">
                  <image 
                      v-if="event.avatar"
                      :style="{width: 50, height: 50}"
                      :source="{uri: event.avatar}"
                    />
                </view>
                <view>
                  <text class="card-title">{{event.title}}</text>
                  <text class="card-date">{{event.day}} {{event.month}} в {{event.time}}ч. - {{event.author}}</text>
                </view>
              </view>
              <view v-if="event" class="options">
                <text class="option" v-for="(opt, i) in event.option" :key="i">{{opt}}, </text>
              </view>
              <view v-if="event.members" class="members">
                <view v-for="(member, i) in event.members" :key="i">
                  <view v-if="member.avatar" class="member">
                    <image :style="{width: 26, height: 26}" :source="{uri: member.avatar}" />
                  </view>
                </view>
              </view>
              <view v-if="event" class="actions">
                <touchable-opacity class="action-btn-orange">
                  <text :style="{color: 'white'}">Няма да успея</text>
                </touchable-opacity>
                <touchable-opacity class="action-btn" :on-press="() => willGo(i)">
                  <text :style="{color: 'white'}">Участвам</text>
                </touchable-opacity>
              </view>
            </view>
          </view>
        </scroll-view>
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
          <touchable-opacity class="inner-nav-btn-visible" :on-press="logout">
            <image
              :style="{width: '100%', height: '100%', resizeMode: 'contain'}"
              :source="require('../assets/logout.png')"
            />
          </touchable-opacity>
        </view>
      </view>
      <view v-if="isLoading" class="loading">
        <image :style="{flex: 1, width: '30%', resizeMode: 'contain'}" :source="require('../assets/loader.gif')"/>
      </view> 
  </view>
</template>

<script>

import firebase from '../firebase';
import Axios from 'axios';
import Store from '../store';

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
      date: new Date()
    }
  },
  computed: {
    events() {
      return Store.state.events
    },
    isLoading() {
      return Store.state.eventsLoading
    }
  },
  methods: {
    getUser() {
      Axios.get(`https://mobile-6b27d.firebaseio.com/users/${this.user}.json`).then( res => {
        this.response = res.data
      })
    },
    willGo(i) {
      let eventID = i
      let userName = this.response.name
      let userAvatar = this.response.avatar
      let userID = this.user
      Store.dispatch('addUserToEvent', {userName, userAvatar, userID, eventID})
      Store.dispatch('fetchEvents')
    },
    logout() {
      console.log(123);
    }
  },
  watch: {
    events() {
      Store.dispatch('fetchEvents')
    }
  }, 
  created() {
    setTimeout(() => {
      let user = firebase.auth().currentUser
      if (user != null) {
        this.user = user.uid
        this.getUser();
      } else {
        this.navigation.push('Welcome')
      }
      Store.dispatch('fetchEvents')
      Store.dispatch('fetchUsers')
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
  height: 100%;
  z-index: 3123121231;
  align-items: center;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-width: 3px;
  border-color: #943af0;
  border-radius: 99999px;
  overflow: hidden;
}
.flex-row {
  flex-direction: row;
}

.members {
  margin-top: 20px;
  flex-direction: row;
  justify-content: flex-start;
}

.member {
  position: relative;
  width: 26px;
  height: 26px;
  overflow: hidden;
  border-radius: 99999px;
  margin-right: 2px;
}

.actions {
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
}

.action-btn-orange {
  flex-basis: 48%;
  background-color: #0070fb;
  align-items: center;
  justify-content: center;
  height: 36px;
  border-radius: 99999px;
}

.action-btn {
  flex-basis: 48%;
  background-color: #943af0;
  align-items: center;
  justify-content: center;
  height: 36px;
  border-radius: 99999px;
}

.action-btn-100 {
  flex-basis: 100%;
  background-color: #943af0;
  align-items: center;
  justify-content: center;
  height: 36px;
  border-radius: 99999px;
}

.options {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}

.option {
  font-size: 13px;
}

.card {
  padding: 10px;
  padding-bottom: 10px;
  width: 100%;
  border-radius: 28px;
  margin-bottom: 25px;
  background-color: #fff;
}

.card-header {
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}

.card-avatar {
  overflow: hidden;
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 99999px;
}

.card-title {
  padding-top: 4px;
  font-size: 17px;
  color: rgb(49, 49, 49);
  font-weight: bold;
}

.card-date {
  color: rgb(134, 134, 134);
  padding-top: 4px;
  font-size: 14px;
}

.private-event-btn {
  background-color: orange;
  width: 56px;
  height: 56px;
  margin-right: 12px;
  border-radius: 999999px;
  align-items: center;
  justify-content: center;
}

.add-btn {
  background-color: #42b983;
  width: 56px;
  height: 56px;
  border-radius: 999999px;
  align-items: center;
  justify-content: center;
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

.avatar {
  overflow: hidden;
  width: 80px;
  height: 80px;
  border-radius: 99999px;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
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
