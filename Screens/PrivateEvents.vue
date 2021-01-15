<template>
  <view class="wrapper">
      <image
        class="image"
        :style="{flex: 1, width: '100%', resizeMode: 'cover'}"
        :source="require('../assets/camp2.jpg')"
      />
      <view class="container">
        <view class="header">
          <text class="name">Private events</text>
        </view>
        <scroll-view :content-container-style="{paddingTop: 25, paddingBottom: 150}">
          <view v-for="(event, i) in events" :key="i">
            <view v-for="(id, i) in event.invited" :key="i">
                <view v-if="event.title && user == id" class="card">
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
          </view> 
        </scroll-view>
      </view>
  </view>
</template>

<script>
import firebase from '../firebase'
import Axios from 'axios'
import Store from '../store'
import * as Permission from 'expo-permissions'
import * as Notification from 'expo-notifications'

export default {
  props: {
    navigation: {
      type: Object
    }
  },
  data() {
    return {
      user: '',
      response: '',
      isVisible: '',
    }
  },
  computed: {
    events() {
      return Store.state.privateEvents
    },
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
      Store.dispatch('fetchPrivateEvents')
    },
  },
  watch: {
    events() {
      Store.dispatch('fetchPrivateEvents')
    }
  }, 
  async created() {
    let user = await firebase.auth().currentUser;

    if (user) {
      this.user = await user.uid
      this.getUser();
    } else {
      this.navigation.push('Welcome')
    }

    setTimeout(() => {
      Store.dispatch('fetchPrivateEvents')
    }, 600)

    Object.values(this.events).map( event => {
        event.invited.map( id => {
            if (this.user == id) {
                this.isVisible = id
                console.log(id);
            }
        })
    })
  },
}
</script>

<style>
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
  background-color: #e69d3f;
  align-items: center;
  justify-content: center;
  height: 36px;
  border-radius: 99999px;
}

.action-btn {
  flex-basis: 48%;
  background-color: #42b983;
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
}

.container {
  padding-left: 15px;
  padding-right: 15px;
  flex: 1;
}
</style>
