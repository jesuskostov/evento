import Vue from 'vue-native-core'
import Axios from 'axios'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        users: null,
        usersIds: null,
        friends: [],
        friendsLoading: true,
        events: [],
        eventsLoading: true,
        privateEvents: [],
        friendRequests: [],
        ids: [],
    },
    mutations: {
        SET_EVENTS: (state, data) => {
            if (data) {
                state.events = data
                state.eventsLoading = false
            } else {
                state.eventsLoading = false
            }
        },
        MEMBER_TO_EVENT: (state, {userName, userAvatar, userID, eventID}) => {
            Object.keys(state.events).map( event => {
                if (event == eventID) {
                    state.events[eventID].members[userID] = {user: userName, avatar: userAvatar}
                    console.log(state.events[eventID]);
                }
            })
        },
        SET_PRIVATE_EVENTS: (state, data) => {
            state.privateEvents = data
        },
        SET_FRIEND_REQUESTS: (state, {friendRequests, ids}) => {
            state.friendRequests = friendRequests
            state.ids = ids
        },
        ACCEPT_FRIEND: (state, friendReq) => {
            state.friendRequests = friendReq
        },
        SET_FRIENDS: (state, friends) => {
            if (friends) {
                state.friends = friends
                state.friendsLoading = false
            } else {
                state.friendsLoading = false
            }
        },
        SET_USERS: (state, {users, usersIDs}) => {
            state.users = users
            state.usersIds = usersIDs
        },
    },
    actions: {
        fetchPrivateEvents: ({commit}) => {
            Axios.get('https://mobile-6b27d.firebaseio.com/events/private/.json').then( res => {
                commit('SET_PRIVATE_EVENTS', res.data)
            })
        },
        fetchEvents: ({commit}) => {
            Axios.get('https://mobile-6b27d.firebaseio.com/events.json').then( res => {
                if (res.data) {
                    commit('SET_EVENTS', res.data)
                } else {
                    commit('SET_EVENTS')
                }
            })
        },
        addUserToEvent: ({commit}, {userName, userAvatar, userID, eventID}) => {
            Axios.put(`https://mobile-6b27d.firebaseio.com/events/${eventID}/members/${userID}.json`, {user: userName, avatar: userAvatar}).then(
                commit('MEMBER_TO_EVENT', {userName, userAvatar, userID, eventID})
            ).then(() => {
                Axios.get(`https://mobile-6b27d.firebaseio.com/events/${eventID}.json`).then( res => {
                    var event = res.data
                    var userAuhtor
                    Axios.get(`https://mobile-6b27d.firebaseio.com/users/${event.authorID}.json`).then( res => {
                        userAuhtor = res.data
                    }).then(() => {
                        Axios({
                            url: 'https://exp.host/--/api/v2/push/send',
                            method: 'post',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                                data: JSON.stringify({
                                to: userAuhtor.token.data,
                                sound: 'default',
                                title: event.title,
                                body: userName + ' ще дойде.'
                            })
                        })
                    })
                })
            })
        },
        getFriendRequests: ({commit}, {userID}) => {
            Axios.get(`https://mobile-6b27d.firebaseio.com/users/${userID}/friend_request.json`).then( res => {
                if (res.data) {
                    var requests = res.data
                    var friendRequests = []
                    var ids = []
                    Object.values(requests).map( users => {
                        Axios.get(`https://mobile-6b27d.firebaseio.com/users/${users.user}.json`).then( res => {
                            friendRequests.push(res.data)
                        }).then(() => {
                            ids.push(users)
                            commit('SET_FRIEND_REQUESTS', {friendRequests, ids})
                        })
                    })
                }
            })
        },
        fetchFriends: ({commit}, {userID}) => {
            Axios.get(`https://mobile-6b27d.firebaseio.com/users/${userID}/friends.json`).then( res => {
                if (res.data) {
                    var friends = []
                    Object.values(res.data).map( user => {
                        let member = user.user
                        Axios.get(`https://mobile-6b27d.firebaseio.com/users/${member}.json`).then( res => {
                            friends.push(res.data)
                        })
                    })
                } 
                commit('SET_FRIENDS', friends)
            })
        },
        acceptFriend: async ({commit}, {userID, friendID}) => {
            let isExist = await Axios.get(`https://mobile-6b27d.firebaseio.com/users/${friendID}/friends/.json`)
            if (!isExist.data) {
                await Axios.post(`https://mobile-6b27d.firebaseio.com/users/${userID}/friends.json`, {user: friendID});
                await Axios.post(`https://mobile-6b27d.firebaseio.com/users/${friendID}/friends.json`, {user: userID});
                await Axios.delete(`https://mobile-6b27d.firebaseio.com/users/${userID}/friend_request/${friendID}.json`);
                let res = await Axios.get(`https://mobile-6b27d.firebaseio.com/users/${userID}/friend_request/.json`);
                let friendReq = []
                friendReq.push(res.data)
                commit('ACCEPT_FRIEND', friendReq)
    
                let token = await Axios.get(`https://mobile-6b27d.firebaseio.com/users/${friendID}/token/data.json`);
                let userName = await Axios.get(`https://mobile-6b27d.firebaseio.com/users/${userID}/name.json`);
                Axios({
                    url: 'https://exp.host/--/api/v2/push/send',
                    method: 'post',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                        data: JSON.stringify({
                        to: token.data,
                        sound: 'default',
                        title: userName.data,
                        body: 'Прие вашата покана'
                    })
                })
            } else {
                Object.values(isExist.data).map( async id => {
                    if (id.user != userID) {
                        
                        await Axios.post(`https://mobile-6b27d.firebaseio.com/users/${userID}/friends.json`, {user: friendID});
                        await Axios.post(`https://mobile-6b27d.firebaseio.com/users/${friendID}/friends.json`, {user: userID});
                        await Axios.delete(`https://mobile-6b27d.firebaseio.com/users/${userID}/friend_request/${friendID}.json`);
                        let res = await Axios.get(`https://mobile-6b27d.firebaseio.com/users/${userID}/friend_request/.json`);
                        let friendReq = []
                        friendReq.push(res.data)
                        commit('ACCEPT_FRIEND', friendReq)
            
                        let token = await Axios.get(`https://mobile-6b27d.firebaseio.com/users/${friendID}/token/data.json`);
                        let userName = await Axios.get(`https://mobile-6b27d.firebaseio.com/users/${userID}/name.json`);
                        Axios({
                            url: 'https://exp.host/--/api/v2/push/send',
                            method: 'post',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                                data: JSON.stringify({
                                to: token.data,
                                sound: 'default',
                                title: userName.data,
                                body: 'Прие вашата покана'
                            })
                        })
                        
                    } else {
                        alert('You already have this friend')
                    }
                })
            }

        },
        sendFriendReq: async ({dispatch}, {userID, friendID, name}) => {

            await firebase.database().ref(`users/${friendID}/friend_request/`).child(`${userID}`).set({user: userID})
            dispatch('getFriendRequests', {userID})
            let res = await Axios.get(`https://mobile-6b27d.firebaseio.com/users/${friendID}/token.json`)
            let token = res.data.data
             Axios({
                url: 'https://exp.host/--/api/v2/push/send',
                method: 'post',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                    data: JSON.stringify({
                    to: token,
                    sound: 'default',
                    title: name,
                    body: 'Ви изпрати покана за приятелство'
                })
            })
        },
        fetchUsers: async ({commit}) => {
            let res = await Axios.get('https://mobile-6b27d.firebaseio.com/users.json')
            let users = res.data
            let usersIDs = Object.keys(res.data)
            commit('SET_USERS', {users, usersIDs})
        },
    }
});

export default store;