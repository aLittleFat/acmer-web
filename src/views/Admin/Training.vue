<template>
  <div>
    <h1>{{training.title}}</h1>
    <h3 style="color: #9ea7b4;">{{contestInfo.title}}</h3>
    <Divider/>
    <Dropdown style="margin-left: 20px">
      <Button type="primary">
        添加参赛者
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem><Button @click="choceStudentModal=true">添加队员</Button></DropdownItem>
        <DropdownItem><Button @click="choceTeamModal=true">添加队伍</Button></DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Modal
      v-model="choceStudentModal">
      <p slot="header" style="text-align:center">
          <span>添加队员</span>
      </p>
      <Tree ref="studentChoices" :data="studentChoices" :check-directly="true" show-checkbox multiple></Tree>
      <div slot="footer">
        <Button type="success" :loading="add_loading" @click="handleAddStudent('studentChoices')">添加</Button>
      </div>
    </Modal>
    <Modal
      v-model="choceTeamModal">
      <p slot="header" style="text-align:center">
          <span>添加队伍</span>
      </p>
      <Tree ref="teamChoices" :data="teamChoices" :load-data="loadData" :check-directly="true" show-checkbox multiple></Tree>
      <div slot="footer">
        <Button type="success" :loading="add_loading" @click="handleAddTeam('teamChoices')">添加</Button>
      </div>
    </Modal>
    <Table :data="trainingParticipantList" :columns="columns" style="margin-top: 2rem;">
      <template slot-scope="{ row }" slot="action">
        <Button type="error" @click="handleDeleteTrainingParticipant(row.id)">删除</Button>
      </template>
    </Table>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        training: null,
        contestInfo: null,
        studentChoices: null,
        teamChoices: null,
        choceStudentModal: false,
        choceTeamModal: false,
        trainingParticipantList: [],
        add_loading: false,
        columns: [
          {
            title: '参赛者',
            key: 'students'
          },
          {
            title: '操作',
            slot: 'action'
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
        that.$http
          .get('/api/training/' + that.$route.params.id)
          .then(res => {
            if (res.data.status === 0) {
              that.training = res.data.data
              that.$http
                .get('/api/contestInfo/', {
                  params: {
                    contestId: that.training.contestId
                  }
                })
                .then(res => {
                  if (res.data.status === 0) {
                    that.contestInfo = res.data.data
                  }
                })
            }
          })
        that.$http
          .get('/api/training/' + that.$route.params.id + '/studentChoice')
          .then(res => {
            if (res.data.status === 0) {
              that.studentChoices = res.data.data
            }
          })
        that.$http
          .get('/api/seasonChoice')
          .then(res => {
            if (res.data.status === 0) {
              that.teamChoices = res.data.data
            }
          })
        that.$http
          .get('/api/trainingParticipant', {
            params: {
              trainingId: that.$route.params.id
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.trainingParticipantList = res.data.data
            }
          })
      },
      handleAddStudent (name) {
        let that = this
        let nodes = that.$refs[name].getCheckedNodes()
        that.add_loading = true
        var students = []
        for (var i = 0; i < nodes.length; ++i) {
          var studentNode = nodes[i]
          if (studentNode.id) {
            students.push(studentNode.id)
          }
        }
        if (students.length === 0) {
          that.$Message.error('未选择队员')
          that.add_loading = false
          return
        }
        that.$http
          .put('/api/training/' + that.$route.params.id + '/student', {
                studentIds: students
            })
          .then(res => {
            that.add_loading = false
            if (res.data.status === 0) {
              that.$Message.success('添加成功')
              that.getData()
              that.choceStudentModal = false
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      handleAddTeam (name) {
        let that = this
        let nodes = that.$refs[name].getCheckedNodes()
        that.add_loading = true
        var teams = []
        for (var i = 0; i < nodes.length; ++i) {
          var teamNode = nodes[i]
          if (teamNode.id && teamNode.isTeam) {
            teams.push(teamNode.id)
          }
        }
        if (teams.length === 0) {
          that.$Message.error('未选择队伍')
          that.add_loading = false
          return
        }
        that.$http
          .put('/api/training/' + that.$route.params.id + '/team', {
                teamIds: teams
            })
          .then(res => {
            that.add_loading = false
            if (res.data.status === 0) {
              that.$Message.success('添加成功')
              that.getData()
              that.choceStudentModal = false
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      handleDeleteTrainingParticipant (id) {
        let that = this
        that.$http
          .delete('/api/trainingParticipant', {
            params: {
              trainingParticipantId: id
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.$Message.success('删除成功')
              that.getData()
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      loadData (item, callback) {
        let that = this
        that.$http
          .get('/api/training/' + that.$route.params.id + '/teamChoice', {
            params: {
              seasonId: item.id
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              callback(res.data.data)
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      }
    }
  }
</script>

<style>
</style>
