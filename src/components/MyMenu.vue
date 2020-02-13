<template>
  <Menu theme="light" width="auto" :open-names="['1']">
      <Submenu name="1">
          <template slot="title">
              <Icon type="ios-navigate"></Icon>
              审核
          </template>
          <MenuItem :to="{name:'RegisterVerify'}">注册审核</MenuItem>
      </Submenu>
      <Submenu name="2">
          <template slot="title">
              <Icon type="ios-navigate"></Icon>
              个人
          </template>
          <MenuItem :to="{name:'MyAcRecord'}">刷题记录</MenuItem>
          <MenuItem :to="{name:'MyContest'}">比赛记录</MenuItem>
      </Submenu>
      <Submenu name="3">
          <template slot="title">
              <Icon type="ios-keypad"></Icon>
              设置
          </template>
          <MenuItem :to="{name:'Information'}">个人信息</MenuItem>
          <MenuItem :to="{name:'OjAccount'}">OJ账号</MenuItem>
      </Submenu>
      <Submenu name="4">
          <template slot="title">
              <Icon type="ios-analytics"></Icon>
              排行榜
          </template>
          <MenuItem :to="{name:'PersonalAcRank'}">个人刷题榜</MenuItem>
          <MenuItem>Option 2</MenuItem>
      </Submenu>
      <Submenu name="5">
          <template slot="title">
              <Icon type="ios-analytics"></Icon>
              管理
          </template>
          <MenuItem :to="{name:'SeasonListAdmin'}">赛季管理</MenuItem>
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
