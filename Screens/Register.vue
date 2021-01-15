<template>
  <view class="home">
    <scroll-view :contentContainerStyle="{ justifyContent: 'center', flex: 1}">
        <view class="container">
            <!-- <view class="image-box">
                <image
                    :style="{width: '100%', height: '100%', resizeMode: 'contain'}"
                    :source="require('../assets/register.png')"
                />
            </view> -->
            <text-input class="input" :on-change-text="val => email = val" :default-value="email" placeholder="Email" placeholderTextColor="white" />
            <text-input class="input" :on-change-text="val => name = val" :default-value="name" placeholder="Name" placeholderTextColor="white" />
            <text-input class="input" :on-change-text="val => password = val" :default-value="password" placeholder="Password" placeholderTextColor="white" />
            <touchable-opacity class="btn" :on-press="register">
                <image
                    :style="{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}"
                    :source="require('../assets/btn-bg.png')"
                />
                <text :style="{color: 'white', fontSize: 16}">Готово</text>
            </touchable-opacity>
        </view>
    </scroll-view>
  </view>
</template>

<script>
import firebase from '../firebase'
import Axios from 'axios'

export default {
    props: {
        navigation: {
            type: Object
        }
    },
    data() {
        return {
            email: '',
            name: '',
            password: '',
        }
    },
    methods: {
        async register() {
            const user = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            this.navigation.push('Intro', {name: this.name})
        }
    }
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

.btn {
    margin-top: 20px;
    width: 100%;
    height: 60px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    overflow: hidden;
}
.home {
    background-color: #202243;
    position: relative;
    flex: 1;
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