<template>
  <view class="home">
    <scroll-view :contentContainerStyle="{ justifyContent: 'center', flex: 1}">
        <view class="container">
            <view class="avatar">
                <image v-if="!avatar" :style="{width: '100%', height: '100%', resizeMode: 'cover'}" :class="{'low-opacity': loader}" :source="require('../assets/batman.png')" />
                <image v-else :style="{width: '100%', height: '100%', resizeMode: 'cover'}" :source="{uri: avatar}" />
                <image v-if="loader" :style="{width: '100%', height: '100%', resizeMode: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 123123}" :source="{uri: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/cd514331234507.564a1d2324e4e.gif'}" />
            </view>
            <text class="title">Здравей {{username}}</text>
            <touchable-opacity class="btn-token" v-if="!token">
                <image :style="{flex: 1, width: '50%', resizeMode: 'cover'}" :source="{uri: 'https://wpamelia.com/wp-content/uploads/2018/11/ezgif-2-6d0b072c3d3f.gif'}"/>
            </touchable-opacity>
            <touchable-opacity class="btn" v-if="!avatar && token" :on-press="imagePick">
                <image
                    :style="{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}"
                    :source="require('../assets/btn-bg.png')"
                />
                <text :style="{color: 'white'}">КАЧИ ТВОЯ АВАТАР</text>
            </touchable-opacity>
            <touchable-opacity class="btn" v-if="avatar && token" :on-press="start">
                <image
                    :style="{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}"
                    :source="require('../assets/btn-bg.png')"
                />
                <text :style="{color: 'white'}">ЗАПОЧНИ</text>
            </touchable-opacity>
        </view>
    </scroll-view>
  </view>
</template>

<script>
import firebase from '../firebase'
import Axios from 'axios'
import * as Permission from 'expo-permissions'
import * as Notification from 'expo-notifications'
import * as ImagePicker from 'expo-image-picker'

export default {
    props: {
        navigation: {
            type: Object
        }
    },
    data() {
        return {
            visible: false,
            user: '',
            userID: '',
            token: '',
            username: '',
            avatar: '',
            loader: false
        }
    },
    methods: {
        async imagePick() {
            
            setTimeout(() => {
                this.loader = true
            }, 1000)

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,
            });

            if (!result.cancelled) {
                this.uploadImage(result.uri, this.username);
            } else {
                this.loader = false
            }

        },
        async uploadImage(uri, name) {
            const res = await fetch(uri)
            const blob = await res.blob();

            let ref = firebase.storage().ref().child('avatar/' + name);
            let upload = ref.put(blob)
            upload.on(
                "state_changed",
                () => {},
                () => {
                // Handle unsuccessful uploads
                },
                () => {
                // Handle successful uploads on complete
                    upload.snapshot.ref.getDownloadURL().then(downloadURL => {
                        // console.log("File available at", downloadURL);
                        this.avatar = downloadURL
                        this.loader = false
                    })
                }
            );
        },
        async start() {
            await Axios.put(`https://mobile-6b27d.firebaseio.com/users/${this.userID}.json`, {
                name: this.username,
                avatar: this.avatar,
                token: this.token
            })
            this.navigation.push('Test')
        }
    },
    watch: {
        userID() {
            this.visible = true
        }
    },
    async created() {
        let user = await firebase.auth().currentUser;
        if (user) {
            this.userID = await user.uid
        } 
        this.username = this.navigation.getParam('name');
        // Get token -------------------------------------------------------
        const status = await Permission.getAsync(Permission.NOTIFICATIONS);
        var finalStatus = status
    
        if (status !== 'grented' || Platform.OS === 'android') {
            const status = await Permission.askAsync(Permission.NOTIFICATIONS);
            finalStatus = status
        }

        let tokena = await Notification.getExpoPushTokenAsync();
        this.token = tokena        
    }
}
</script>

<style>
.low-opacity {
    opacity: 0.6;
}

.loader {
    width: 100%;
    height: 100%;
    z-index: 123123;
    position: absolute;
}

.avatar {
    overflow: hidden;
    width: 140px;
    height: 140px;
    border-width: 8px;
    border-color: #943af0;
    border-radius: 99999px;
    margin-bottom: 30px;
}

.input {
    width: 100%;
    border-bottom-width: 2px;
    border-color: white;
    padding-top: 8px;
    padding-bottom: 8px;
    margin-bottom: 26px;
}

.btn-token {
    margin-top: 60px;
    width: 100%;
    height: 50px;
    background-color: transparent;
    align-items: center;
    justify-content: center;
    border-radius: 999999px;
}

.btn {
    margin-top: 60px;
    width: 100%;
    height: 60px;
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

.title {
    font-size: 38px;
    color: #fff;
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