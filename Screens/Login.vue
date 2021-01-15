<template>
  <view class="home">
    <scroll-view :contentContainerStyle="{ justifyContent: 'center', flex: 1}">
        <view class="container">
            <!-- <view class="image-box">
                <image
                    :style="{width: '100%', height: '100%', resizeMode: 'contain'}"
                    :source="require('../assets/login.png')"
                />
            </view> -->
            <text-input class="input" :on-change-text="val => email = val" :default-value="email" placeholder="Email" placeholderTextColor="white" />
            <text-input class="input" :on-change-text="val => password = val" :secureTextEntry="true" :default-value="password" placeholder="Password" placeholderTextColor="white" />
            <touchable-opacity v-if="!pressed" class="btn" :on-press="login">
                <image
                    :style="{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}"
                    :source="require('../assets/btn-bg.png')"
                />
                <text v-if="!pressed" :style="{color: 'white', fontSize: 14}">ВЛЕЗ</text>
            </touchable-opacity>
            <touchable-opacity v-if="pressed"  class="btn-load">
                <image :style="{flex: 1, width: '100%', resizeMode: 'contain'}" :source="require('../assets/loader.gif')"/>
            </touchable-opacity>

        </view>
    </scroll-view>
  </view>
</template>

<script>
import firebase from '../firebase'

export default {
    props: {
        navigation: {
            type: Object
        }
    },
    data() {
        return {
            email: 'isus@abc.bg',
            password: '123456',
            pressed: false
        }
    },
    methods: {
        async login() {
            this.pressed = true
            const val = await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            let userID = val.user.uid
            this.navigation.navigate('Test', {id: userID})
        },
        handleEmail(val) {
            this.email = val
        },
        handlePass(val) {
            this.password = val
        }
    },
}
</script>

<style>
.image-box {
    width: 100%;
    height: 30%;
    margin-bottom: 30px;
}

.input {
    color: #fff;
    width: 100%;
    border-bottom-width: 1px;
    border-color: #fff;
    padding-top: 8px;
    padding-bottom: 8px;
    margin-bottom: 26px;
}

.btn-load {
    width: 100%;
    height: 60px;
    background-color: transparent;
    margin-bottom: 15px;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
}

.btn {
    position: relative;
    width: 100%;
    height: 60px;
    margin-bottom: 15px;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    overflow: hidden;
}
.home {
    position: relative;
    flex: 1;
    background-color: #202243;
}
.image {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
}
.title {
    text-align: center;
    font-size: 38px;
    color: #fff;
    margin-bottom: 20%;
}
.container {
    height: 100%;
    padding-left: 15px;
    padding-right: 15px;
    flex: 1;
    align-items: center;
    justify-content: center;
}
</style>