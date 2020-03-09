<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <div class="layout-logo"></div>
                    <div class="layout-nav">
                      <Row type="flex" justify="end" class="code-row-bg">
                        <div v-if="userName === ''">
                          <MenuItem name="1" :to="{name:'Login'}">
                              <Icon type="ios-analytics"></Icon>
                              登录
                          </MenuItem>
                        </div>
                        <div v-else>
                          <MenuItem name="2">
                              {{ userName }}
                          </MenuItem>
                          <Button @click="logout">注销</Button>
                        </div>
                      </Row>
                    </div>
                </Menu>
            </Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}" >
                  <MyMenu />
                </Sider>
                <Layout :style="{padding: '24px 24px 0px'}">
                  <Content :style="{padding: '24px', minHeight: '810px', background: '#fff'}">
                      <router-view></router-view>
                  </Content>
                  <Footer class="layout-footer-center">2020 &copy; Fat</Footer>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>
  import MyMenu from '../components/MyMenu.vue'
  export default {
    data () {
      return {
        history: [],
        userName: ''
      }
    },
    components: {
      MyMenu
    },
    created: function () {
      if (localStorage.token) {
        this.$http
          .get('/api/info')
          .then(res => {
            this.userName = res.data.data.name
          })
      }
    },
    methods: {
      logout () {
        let that = this
        that.$http
          .get('/api/auth/logout')
          .then(res => {
            localStorage.removeItem('token')
            that.$Message.info('注销成功')
            that.$router.push('/login')
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
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
</style>
