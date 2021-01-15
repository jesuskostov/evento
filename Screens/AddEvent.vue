<template>
  <view class="event">
    <view class="container">
        <view class="flex">
            <view class="day-selecting">
                <DateTimePicker :value="date" mode="date" :on-change="(event, selectedDate) => pickDate(event, selectedDate)" :style="{width: 110}" />
            </view>
            <view class="time-selecting">
                <DateTimePicker class="day-time" :value="time" mode="time" :on-change="(event, selectedTime) => pickTime(event, selectedTime)" :style="{width: 70}" />
            </view>
        </view>
        <!-- Option pick -->
        <view v-if="selectingOption" class="option-container">
            <view class="box">
                <scroll-view>
                    <view class="option" v-for="(option, i) in options" :key="i">
                        <text :style="{color: 'white', fontSize: 14}">{{option.name}}</text>
                        <switch :track-color="{true: 'indigo',}" :on-value-change="(val) => handleChange(option.name, val)" :value="option.isTrue"/>
                    </view>
                </scroll-view>
            </view>
        </view>
        <view v-if="selectingOption" class="action">
            <touchable-opacity class="cancel-btn" :on-press="closeOption">
                <text :style="{color: 'white'}">Назад</text>
            </touchable-opacity>
            <touchable-opacity class="accept-btn" :on-press="openPeople">
                <text :style="{color: 'white'}">Продължи</text>
            </touchable-opacity>
        </view>
        <view v-if="selectingTitle" class="title-container">
            <view class="input-style">
                <image
                    :style="{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, opacity: 0.9}"
                    :source="require('../assets/btn-bg.png')"
                />
                <text-input class="input" :on-change-text="val => eventTitle = val" :default-value="eventTitle" placeholder="Как ще се казва събитието" placeholderTextColor="white" />
            </view>
            <touchable-opacity class="add-btn" :on-press="addEvent">
                <text :style="{color: 'white'}">Добави</text>
            </touchable-opacity>
        </view>
    </view>
    <view v-if="selectingPeople" class="people-to-invite">
        <view class="inner-invite-container">
            <view>
                <scroll-view>
                    <view v-for="(user, i) in users" :key="i" class="person">
                        <view class="flex-row">
                            <view class="avatar">
                                <image :style="{width: '100%', height: '100%'}" :source="{uri: user.avatar}" />
                            </view>
                            <text class="person-name">{{user.name}}</text>
                        </view>
                        <touchable-opacity class="invite-btn">
                            <text :style="{color: 'white', fontSize: 12}">Покани</text>
                        </touchable-opacity>
                    </view>
                </scroll-view>
            </view>
            <view class="action">
                <touchable-opacity class="forward-btn" :on-press="selectingPeople = false">
                    <image
                        :style="{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}"
                        :source="require('../assets/btn-bg.png')"
                    />
                    <text :style="{color: 'white'}" >Продължи</text>
                </touchable-opacity>
            </view>
        </view>
    </view>
  </view>
</template>

<script>
import firebase from '../firebase'
import Store from '../store'
import Axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';

export default {
    components: {
        DateTimePicker
    },
    props: {
        navigation: {
            type: Object
        }
    },
    data() {
        return {
            date: new Date(),
            time: new Date(),
            eventTitle: '',
            options: [
                {
                    'name': 'Алкохол',
                    'isTrue': false
                },
                {
                    'name': 'Wi-Fi',
                    'isTrue': false
                },
                {
                    'name': 'Ще може да се спи',
                    'isTrue': false
                }
            ],
            selectingOption: false,
            selectingTitle: true,
            selectingPeople: false,
            userID: '',
            username: '',
            avatar: '',
            notify: [],
            private: false,
            users: [],
            invited: []
        }
    },
    methods: {
        handleChange: function(name, val) {
            this.options.map( item => {
                if (item.name == name) {
                    item.isTrue = !item.isTrue   
                }
            })
        },
        pickDate(event, selectedDate) {
            console.log(event);
            console.log(selectedDate);
            this.date = selectedDate
        },
        pickTime(event, selectedTime) {
            console.log(event);
            console.log(selectedTime);
        },
        openOption() {
            this.selectingTime = false
            this.selectingOption = true
        },
        closeOption() {
            this.selectingTime = true
            this.selectingOption = false
        },
        openTitle() {
            this.selectingTitle = true
            this.selectingPeople = false
        },
        closeTitle() {
            this.selectingTitle = false
            this.selectingPeople = true
        },
        openPeople() {
            this.selectingPeople = true
            this.selectingOption = false
        },
        closePeople() {
            this.selectingPeople = false
            this.selectingOption = true
        },
        async getUserName() {
            let userID = await this.userID;
            let res = await Axios.get(`https://mobile-6b27d.firebaseio.com/users/${userID}.json`);
            this.username = res.data.name;
            this.avatar = res.data.avatar;
        },
        test() {
            if (this.invited != 0) {
                
                // var notifyInvited = []
                // this.invited.map( invitedID => {
                //     Axios.get(`https://mobile-6b27d.firebaseio.com/users/${invitedID}.json`).then( res => {
                //         notifyInvited.push(res.data.token.data)
                //     })
                // })
                // // Tokens of the invited people
                // console.log(notifyInvited);
            }
        },
        addEvent() {

            Axios.get(`https://mobile-6b27d.firebaseio.com/users.json`).then( res => {
                Object.values(res.data).map( user => {
                    this.notify.push(user.token.data)
                });
                
                let avatar = this.avatar
                let author = this.username
                let title = this.eventTitle
                let day = this.selectedDay
                let month = this.selectedMonth
                let time = this.selectedHour + ':' + this.selectedMinutes
                var option = []
                this.options.map( item => {
                    if (item.isTrue) {
                        option.push(item.name)
                    }
                });

                if (this.invited != 0) {
                    firebase.database().ref('events/private').push({
                        avatar: avatar,
                        author: author,
                        authorID: this.userID,
                        title: title,
                        day: day,
                        month: month,
                        time: time,
                        members: {'test': {'test': '123'}},
                        option: option,
                        invited: this.invited
                    });
                } else {
                    firebase.database().ref('events').push({
                        avatar: avatar,
                        author: author,
                        authorID: this.userID,
                        title: title,
                        day: day,
                        month: month,
                        time: time,
                        members: {'test': {'test': '123'}},
                        option: option
                    });
                }
                
                Axios({
                        url: 'https://exp.host/--/api/v2/push/send',
                        method: 'post',
                        headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                        data: JSON.stringify({
                        to: this.notify,
                        sound: 'default',
                        title: title,
                        body: day + ' ' + month + ' в ' + time + ' - ' + author
                    })
                });
                this.navigation.push('Test');
            })
        },
        async invite(i) {
            await this.invited.push(i)
        }
    },
    async created() {
        let user = await firebase.auth().currentUser;

        if (user) {
            this.userID = await user.uid;
            this.getUserName();
        };
        Axios.get(`https://mobile-6b27d.firebaseio.com/users.json`).then( res => {
            this.users = res.data
        });
    }
}
</script>

<style>
.input-style {
    border-radius: 16px;
    height: 60px;
    overflow: hidden;
}

.forward-btn {
    position: relative;
    width: 100%;
    height: 60px;
    border-radius: 16px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-top: 30px;
}

.invite-btn {
    height: 30px;
    background-color: #0070fb;
    align-items: center;
    justify-content: center;
    padding-left: 12px;
    padding-right: 12px;
    border-radius: 8px;
}

.avatar {
    width: 70px;
    height: 70px;
    border-width: 1px;
    border-color: #0070fb;
    border-radius: 999999px;
    overflow: hidden;
    margin-right: 15px;
}

.person-name {
    font-size: 16px;
    color: #fff;
}

.flex-row {
    flex-direction: row;
    align-items: center;
}

.person {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
}
.inner-invite-container {
    margin-top: 50px;
}

.people-to-invite {
    padding-left: 15px;
    padding-right: 15px;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(32, 34, 67, 0.8);
}

.title-container {
    width: 100%;
}

.input {
    width: 100%;
    height: 100%;
    padding-left: 8px;
    color: #fff;
}

.flex {
    width: 100%;
    margin-top: 20%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
}
.day-selecting {
    flex-basis: 45%;
    align-items: center;
    justify-content: center;
    height: 60px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #fff;
}

.time-selecting {
    flex-basis: 45%;
    align-items: center;
    justify-content: center;
    height: 60px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #fff;
}

.container {
    padding-left: 15px;
    padding-right: 15px;
    align-items: center;
    flex: 1;
    background-color:#202243;
}

.image {
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-top: 60px;
    margin-bottom: 30px;
    width: 100%;
    height: 200px;
}

.event {
  background-color: #fff;
  position: relative;
  flex: 1;
}
</style>