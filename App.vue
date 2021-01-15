<template>
  <app-navigator></app-navigator>
</template>

<script>
import {
  createAppContainer,
  createStackNavigator,
} from "vue-native-router";

import WelcomeScreen from "./Screens/Welcome";
import RegisterScreen from "./Screens/Register";
import LoginScreen from "./Screens/Login";
import IntroScreen from "./Screens/Intro";
import EventScreen from "./Screens/AddEvent";
import TestScreen from "./Screens/Test";
import PrivateScreen from "./Screens/PrivateEvents";
import NavigationScreen from "./Components/Navigation";
import ProfileScreen from "./Screens/Profile";
import SearchFriendScreeen from "./Screens/SearchFriend";

const StackNavigator = createStackNavigator(
  {
    Welcome: {
      screen: WelcomeScreen,
      navigationOptions: {
        header: null
      },
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: {
        header: null
      }
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: null
      },
    },
    Intro: {
      screen: IntroScreen,
      navigationOptions: {
        header: null
      }
    },
    addEvent: {
      screen: EventScreen,
      navigationOptions: {
        header: null
      }
    },
    Test: {
      screen: TestScreen,
      navigationOptions: {
        header: null
      },
    },
    Private: {
      screen: PrivateScreen,
      navigationOptions: {
        header: null
      },
    },
    Navigation: {
      screen: NavigationScreen,
      navigationOptions: {
        header: null
      },
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        header: null
      },
    },
    SearchFriend: {
      screen: SearchFriendScreeen,
      navigationOptions: {
        header: null
      },
    },
  },
  {
    initialRouteName: 'SearchFriend',
    initialRouteName: 'Profile',
    initialRouteName: 'Navigation',
    initialRouteName: 'Private',
    initialRouteName: 'Test',
    initialRouteName: 'addEvent',
    initialRouteName: 'Intro',
    initialRouteName: 'Login',
    initialRouteName: 'Register',
    initialRouteName: 'Welcome',
  }
);

const AppNavigator = createAppContainer(StackNavigator);

export default {
  components: { AppNavigator },
}
</script>
