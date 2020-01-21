<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo"></div>
                    <div class="layout-nav">
                      <Row type="flex" justify="end" class="code-row-bg">
                        <div v-if="userId === 0">
                          <MenuItem name="1" to="/auth/login">
                              <Icon type="ios-analytics"></Icon>
                              登录
                          </MenuItem>
                        </div>
                        <div v-else>
                          <MenuItem name="2">
                              <!-- <Icon type="ios-navigate"></Icon> -->
                              {{ userName }}
                          </MenuItem>
                          <Button @click="logout">注销</Button>
                        </div>
                      </Row>
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                    <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
                        <Submenu name="1">
                            <template slot="title">
                                <Icon type="ios-navigate"></Icon>
                                审核
                            </template>
                            <MenuItem name="1-1" to="registerverify">注册审核</MenuItem>
                            <MenuItem name="1-2">Option 2</MenuItem>
                            <MenuItem name="1-3">Option 3</MenuItem>
                        </Submenu>
                        <Submenu name="2">
                            <template slot="title">
                                <Icon type="ios-keypad"></Icon>
                                Item 2
                            </template>
                            <MenuItem name="2-1">Option 1</MenuItem>
                            <MenuItem name="2-2">Option 2</MenuItem>
                        </Submenu>
                        <Submenu name="3">
                            <template slot="title">
                                <Icon type="ios-analytics"></Icon>
                                Item 3
                            </template>
                            <MenuItem name="3-1">Option 1</MenuItem>
                            <MenuItem name="3-2">Option 2</MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                    <Content :style="{padding: '24px', minHeight: '480px', background: '#fff'}">
                        <router-view></router-view>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    export default {
      data () {
        return {
          logined: false,
          userId: 0,
          history: [],
          userName: ''
        }
      },
      mounted () {
        if (localStorage.userId) {
          this.userId = localStorage.userId
          this.$http
            .get('/api/common/user/getUser', {
              params: {
                id: this.userId
              }
            })
            .then(res => {
              this.userName = res.data.name
            })
        }
      },
      methods: {
        logout () {
          let that = this
          that.$http
            .get('/auth/logout')
            .then(res => {
              localStorage.removeItem('token')
              localStorage.removeItem('userId')
              that.$Message.info('注销成功')
              that.$router.push('/auth/login')
            })
        }
      }
    }
</script>
<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 300px;
    margin: 0 auto;
    margin-right: 20px;
}
</style>
