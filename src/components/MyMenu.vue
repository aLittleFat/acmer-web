<template>
  <Menu theme="light" width="auto" :open-names="['1']">
      <Submenu name="1">
          <template slot="title">
              <Icon type="ios-navigate"></Icon>
              审核
          </template>
          <MenuItem to="registerverify">注册审核</MenuItem>
      </Submenu>
      <Submenu name="2">
          <template slot="title">
              <Icon type="ios-navigate"></Icon>
              个人
          </template>
          <MenuItem to="myacrecord">刷题记录</MenuItem>
      </Submenu>
      <Submenu name="3">
          <template slot="title">
              <Icon type="ios-keypad"></Icon>
              设置
          </template>
          <MenuItem to="information">个人信息</MenuItem>
          <MenuItem to="ojaccount">OJ账号</MenuItem>
      </Submenu>
      <Submenu name="4">
          <template slot="title">
              <Icon type="ios-analytics"></Icon>
              排行榜
          </template>
          <MenuItem to="personalacrank">个人刷题榜</MenuItem>
          <MenuItem>Option 2</MenuItem>
      </Submenu>
  </Menu>
</template>

<script>
  export default {
    name: 'MyMenu'
  }
</script>

<style>
</style>
