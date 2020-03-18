<template>
  <div>
    <div v-if="isMyTeam">
      <Button type="success" @click="showAddTeamContestModal()">添加竞赛</Button>
      <Modal v-model="add_team_contest_modal" width="360">
        <p slot="header" style="text-align:center">
          <span>申报组队竞赛</span>
        </p>
        <Form :model="formItem" :label-width="100" :rules="rule" ref="addTeamContestRecordForm">
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
          <Button type="success" :loading="add_loading" @click="addTeamContest()">添加</Button>
        </div>
      </Modal>
      <Divider />
    </div>
    <Table :loading="tableLoading" :columns="columns" :data="teamContestList">
      <template slot-scope="{ row }" slot="title">
          <router-link :to="{name:'Contest',params:{id:row.contestId}}">{{ row.contestTitle }}</router-link>
      </template>
      <template slot-scope="{ row }" slot="solution">
          {{ row.solution }}
      </template>
    </Table>
  </div>
</template>

<script>
  export default {
    name: 'TeamContestTable',
    props: {
      teamId: Number,
      height: Number
    },
    data () {
      return {
        columns: [
          {
            title: '比赛名称',
            slot: 'title',
            width: 300
          },
          {
            title: 'Solved',
            key: 'solvedNumber',
            width: 90
          },
          {
            title: '罚时',
            key: 'penalty',
            width: 90
          },
          {
            title: '题解',
            slot: 'solution',
            width: 80
          }
        ],
        teamContestList: [],
        problemList: [],
        problemNum: 0,
        isMyTeam: false,
        tableLoading: true,
        add_team_contest_modal: false,
        add_loading: false,
        roles: null,
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
      this.getData()
    },
    methods: {
      getData () {
        let that = this
        that.tableLoading = true
        var url = '/api/teamContest/' + that.teamId
        that.$http
          .get(url)
          .then(res => {
            if (res.data.status === 0) {
              that.teamContestList = res.data.data.contestRecord
              that.isMyTeam = res.data.data.isMyTeam
              for (let i = 0; i < that.teamContestList.length; ++i) {
                that.teamContestList[i].cellClassName = Object()
                for (let j = 0; j < that.teamContestList[i].solved.length; ++j) {
                  that.teamContestList[i].cellClassName[that.teamContestList[i].solved[j]] = 'table-ac-cell'
                }
                for (let j = 0; j < that.teamContestList[i].upSolved.length; ++j) {
                  that.teamContestList[i].cellClassName[that.teamContestList[i].upSolved[j]] = 'table-up-cell'
                }
              }
              that.problemList = res.data.data.problemList
              for (let i = 0; i < res.data.data.problemList.length; ++i) {
                that.columns.push({
                  'title': that.problemList[i],
                  'key': that.problemList[i],
                  'align': 'center',
                  width: 70
                })
              }
              that.tableLoading = false
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      addTeamContest () {
        let that = this
        that.$refs['addTeamContestRecordForm'].validate((valid) => {
          if (valid) {
            that.add_loading = true
            that.$http
              .put('/api/teamContestRecord', {
                teamId: that.teamId,
                ojName: that.formItem.oj,
                cId: that.formItem.cId,
                account: that.formItem.account,
                password: that.formItem.password
              })
              .then(res => {
                that.add_loading = false
                if (res.data.status === 0) {
                  that.$Message.success('添加成功')
                  that.getData()
                  that.add_team_contest_modal = false
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
      showAddTeamContestModal () {
        let that = this
        that.formItem.needPassword = false
        that.$refs['addTeamContestRecordForm'].resetFields()
        that.add_team_contest_modal = true
      }
    },
    watch: {
      teamId: function () {
        this.getData()
      }
    }
  }
</script>

<style>
  .ivu-table .table-ac-cell {
    background-color: #00c853;
  }
  .ivu-table .table-up-cell {
    background-color: #e3e300;
  }
</style>
