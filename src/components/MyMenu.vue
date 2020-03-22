<template>
  <Menu ref="menu" theme="light" width="auto" @on-select="selectMenu()">
    <MenuItem name="Qualifying" :to="{name:'Qualifyings'}"><Icon type="ios-flag" />排位赛</MenuItem>
    <MenuItem name="TrainingList" :to="{name:'TrainingList'}"><Icon type="ios-train" />训练</MenuItem>
    <MenuItem name="Problem" :to="{name:'Problem'}"><Icon type="ios-book" />题库</MenuItem>
    <Submenu name="审核" v-if="roles.is_admin">
      <template slot="title">
          <Icon type="ios-paper" />
          审核
      </template>
      <MenuItem name="RegisterVerify" :to="{name:'RegisterVerify'}">注册审核</MenuItem>
      <MenuItem name="RetireVerify" :to="{name:'RetireVerify'}">退役审核</MenuItem>
      <MenuItem name="AwardVerify" :to="{name:'AwardVerify'}">获奖审核</MenuItem>
    </Submenu>
    <Submenu name="个人" v-if="roles.is_student">
      <template slot="title">
          <Icon type="ios-person" />
          个人
      </template>
      <MenuItem name="Overview" :to="{name:'Overview'}">概览</MenuItem>
      <MenuItem name="MyAcRecord" :to="{name:'MyAcRecord'}">刷题记录</MenuItem>
      <MenuItem name="MyContest" :to="{name:'MyContest'}">比赛记录</MenuItem>
      <MenuItem name="addPersonalContestRecord" >申报个人比赛</MenuItem>
      <Modal v-model="add_personal_contest_modal" width="360">
        <p slot="header" style="text-align:center">
          <span>申报个人竞赛</span>
        </p>
        <Form :model="formItem" :label-width="100" :rules="rule" ref="addPersonalContestRecordForm">
          <FormItem label="OJ" prop="oj">
            <Select v-model="formItem.oj">
              <Option v-for="item in ojList" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="竞赛ID" prop="cId">
            <Input v-model="formItem.cId" placeholder="请输入竞赛ID"></Input>
          </FormItem>
          <FormItem v-if="formItem.needPassword && formItem.oj !== 'HDU'" label="竞赛密码" prop="password">
            <Input type="password" v-model="formItem.password" placeholder="请输入参赛密码"></Input>
          </FormItem>
          <FormItem label="参赛账号" prop="account">
            <Input v-model="formItem.account" placeholder="请输入参赛账号"></Input>
          </FormItem>
          <FormItem v-if="formItem.needPassword && formItem.oj === 'HDU'" label="登录密码" prop="password">
            <Input type="password" v-model="formItem.password" placeholder="请输入登录密码"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="success" :loading="add_loading" @click="addPersonalContest()">添加</Button>
        </div>
      </Modal>
    </Submenu>
    <Submenu v-if="teamList.length > 0" name="队伍">
      <template slot="title">
        <Icon type="ios-people" />
        队伍
      </template>
      <MenuItem v-for="(item,index) in teamList" :name="'Team'+item.id" :to="{name:'Team', params:{id:item.id}}" :key="index">
        <div v-if="item.teamName">
          {{item.teamName}}({{item.seasonName}})
        </div>
        <div v-else>
          未命名({{item.seasonName}})
        </div>
      </MenuItem>
    </Submenu>
    <Submenu name="设置" v-if="roles.is_student">
      <template slot="title">
        <Icon type="ios-cog" />
        设置
      </template>
      <MenuItem name="Information" :to="{name:'Information'}">个人信息</MenuItem>
      <MenuItem name="OjAccount" :to="{name:'OjAccount'}">OJ账号</MenuItem>
    </Submenu>
    <Submenu name="排行榜">
      <template slot="title">
        <Icon type="ios-podium" />
        排行榜
      </template>
      <MenuItem name="PersonalAcRank" :to="{name:'PersonalAcRank'}">个人刷题榜</MenuItem>
      <MenuItem name="TeamContestRank" :to="{name:'TeamContestRank'}">组队训练榜</MenuItem>
    </Submenu>
    <Submenu v-if="roles.is_admin" name="管理">
      <template slot="title">
        <Icon type="ios-information-circle" />
        管理
      </template>
      <MenuItem name="SeasonListAdmin" :to="{name:'SeasonListAdmin'}">赛季管理</MenuItem>
      <MenuItem name="TrainingListAdmin" :to="{name:'TrainingListAdmin'}">训练管理</MenuItem>
    </Submenu>
  </Menu>
</template>

<script>
  export default {
    name: 'MyMenu',
    data () {
      return {
        add_personal_contest_modal: false,
        add_loading: false,
        roles: null,
        teamList: [],
        formItem: {
          oj: '',
          account: '',
          password: '',
          cId: '',
          needPassword: false
        },
        rule: {
          oj: [{
            required: true,
            tigger: 'blur'
          }],
          cId: [{
            required: true,
            tigger: 'blur',
            message: '请输入竞赛ID'
          }],
          account: [{
            required: true,
            tigger: 'blur',
            message: '请输入参赛账号'
          }],
          password: [{
            required: true,
            tigger: 'blur',
            message: '请输入密码'
          }]
        },
        ojList: [
          {
            value: 'VJ',
            label: 'VJ'
          },
          {
            value: 'HDU',
            label: 'HDU'
          },
          {
            value: 'CodeForces',
            label: 'CodeForces'
          },
          {
            value: 'Gym',
            label: 'Gym'
          },
          {
            value: '计蒜客',
            label: '计蒜客'
          },
          {
            value: '牛客',
            label: '牛客'
          }
        ]
      }
    },
    created: function () {
       this.getRoles()
    },
    methods: {
      addPersonalContest () {
        let that = this
        that.$refs['addPersonalContestRecordForm'].validate((valid) => {
          if (valid) {
            that.add_loading = true
            that.$http
              .put('/api/personalContestRecord', {
                ojName: that.formItem.oj,
                cId: that.formItem.cId,
                account: that.formItem.account,
                password: that.formItem.password
              })
              .then(res => {
                that.add_loading = false
                if (res.data.status === 0) {
                  that.$Message.success('添加成功')
                  that.add_personal_contest_modal = false
                } else {
                  that.$Message.error(res.data.msg)
                  if (res.data.msg === '需要密码') {
                    that.formItem.needPassword = true
                  }
                  if (res.data.msg === '该比赛需要登录') {
                    that.formItem.needPassword = true
                  }
                }
              })
          } else {
            that.$Message.error('请正确填写表单')
          }
        })
      },
      selectMenu () {
        let that = this
        console.log(that.$refs['menu'])
        if (that.$refs['menu'].currentActiveName === 'addPersonalContestRecord') {
          that.formItem.needPassword = false
          that.$refs['addPersonalContestRecordForm'].resetFields()
          that.add_personal_contest_modal = true
        }
      },
      getRoles () {
        let that = this
        that.$http
          .get('/api/auth/roles')
          .then(res => {
            if (res.data.status === 0) {
              that.roles = res.data.data
              if (that.roles.is_student) {
                that.getTeams()
              }
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      getTeams () {
        let that = this
        that.$http
          .get('/api/team')
          .then(res => {
            if (res.data.status === 0) {
              that.teamList = res.data.data
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      }
    },
    computed: {
      oj () {
        return this.formItem.oj
      }
    },
    watch: {
      oj: function () {
        let that = this
        that.formItem.needPassword = false
        that.formItem.password = ''
        that.formItem.cId = ''
        that.$http
          .get('/api/ojAccount', {
            params: {
              ojName: that.formItem.oj
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.formItem.account = res.data.data
            }
          })
      }
    }
  }
</script>

<style>
</style>
