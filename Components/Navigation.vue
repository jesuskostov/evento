<template>
  <view class="navigation">
      <view class="option"></view>
      <view class="option"></view>
      <view class="center" shadowColor="#943af0" :shadowOffset="{width: 0, height: 0}" shadowOpacity="0.4" shadowRadius="8" elevation="5">
          <touchable-opacity class="inner" :on-press="navToAddEvent">
            <image
                :style="{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}"
                :source="require('../assets/btn-bg.png')"
            />
                <text :style="{color: 'white', fontSize: 42, top: -2}">+</text>
          </touchable-opacity>
      </view>
      <view class="option"></view>
      <view class="option"></view>
  </view>
</template>

<script>

export default {
    props: {
        navigation: {
            type: Object
        }
    },
    methods: {
        navToAddEvent() {
            console.log(this.navigation);
        }
    }
}
</script>

<style>
.navigation {
    position: absolute;
    width: 100%;
    height: 70px;
    background-color: transparent;  
    bottom: 0;
    left: 0;
    right: 0;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 10px;
}
.option {
    width: 56px;
    height: 56px;
    border-width: 2px;
    border-radius: 99999px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
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
</style>