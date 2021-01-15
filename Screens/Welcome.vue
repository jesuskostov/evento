<template>
  <view class="home">
    <view class="container">
        <view class="image-box">
           <image :style="{width: '100%', height: '100%', resizeMode: 'contain'}" :source="require('../assets/welcome.png')" />
        </view>
        <touchable-opacity class="btn" :on-press="() => navigation.push('Login')">
            <image
                :style="{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}"
                :source="require('../assets/btn-bg.png')"
            />
            <text :style="{color: 'white'}">Имам акаунт</text>
        </touchable-opacity>
        <touchable-opacity class="btn-register" :on-press="() => navigation.navigate('Register')">
            <text :style="{color: '#943af0'}"><text :style="{color: '#bbbbbb'}">ИЛИ</text> СЪЗДАЙ АКАУНТ СЕГА</text>
        </touchable-opacity>
    </view>
  </view>
</template>

<script>
// import * as Facebook from 'expo-facebook'
import firebase from '../firebase'
import * as fb from 'firebase'

export default {
    props: {
        navigation: {
            type: Object
        }
    },
    data() {
        return {
            user: null
        }
    },
    methods: {
        // async loginFb() {

        //     try {
        //         await Facebook.initializeAsync({
        //             appId: '2751540728439258',
        //         });
        //         const { type, token } = await Facebook.logInWithReadPermissionsAsync({permissions: ['public_profile']});

        //         if (type === 'success') {
        //             // Get the user's name using Facebook's Graph API
        //             const response = await Axios(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`);
        //             // const credential = await firebase.auth().FacebookAuthProvider.credential(token)
                                             
                    
        //             // firebase.auth().signInWithCredential(credential).catch(err => {console.log(err);})
        //         } else {
        //         // type === 'cancel'
        //         }
        //     } catch ({ message }) {
        //         console.log(message);
        //     }
        // }
        getUser() {
            var user = firebase.auth().currentUser;
            this.user = user
            console.log(this.user);
            firebase.auth().onAuthStateChanged( user => {
                if (this.user != null) {
                    this.navigation.push('Test')
                } 
            })
        }
    },
    created() {
        // this.getUser()
    },
}
</script>

<style>

.image-box {
    width: 100%;
    flex: 1;
}

.btn {
    position: relative;
    width: 100%;
    height: 60px;
    margin-bottom: 0;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    overflow: hidden;
}

.btn-register {
    width: 100%;
    height: 60px;
    margin-bottom: 15%;
    background-color: transparent;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    overflow: hidden;
}

.home {
    position: relative;
    background-color: #fff;
    flex: 1;
}

.title {
    text-align: center;
    font-size: 64px;
    color: #B659FE;
    font-weight: bold;
    font-style: italic;
}
.container {
    padding-left: 15px;
    padding-right: 15px;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
}
</style>