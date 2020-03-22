<template>
  <div>
    <Button type="primary" @click="showAddTeamModal('addTeamForm')">添加队伍</Button>
    <Divider />
    <Table :loading="tableLoading" stripe :height="580" :columns="columns" :data="seasonTeamList">
      <template slot-scope="{ row }" slot="rank">
        {{row.team.rank}}队
      </template>
      <template slot-scope="{ row }" slot="nameCn">
        <router-link :to="{name:'Team', params:{id:row.team.id}}">
          <div v-if="row.team.nameCn">
            {{row.team.nameCn}}
          </div>
          <div v-else>未命名</div>
        </router-link>
      </template>
      <template slot-scope="{ row }" slot="nameEn">
        <div>
          <div v-if="row.team.nameEn">
            {{row.team.nameEn}}
          </div>
          <div v-else>Untitled</div>
        </div>
      </template>
      <template slot-scope="{ row }" slot="vjAccount">
        {{row.team.vjAccount}}
      </template>
      <template slot-scope="{ row }" slot="student1">
        <div v-if="row.users[0]">
          {{row.users[0].name}}
          <Button type="error" @click="handleDeleteStudent(row.team.id,row.users[0].studentId)">删除</Button>
        </div>
        <div v-else>
          <Button type="success" @click="showChoceModal(row.team.id)">添加</Button>
        </div>
      </template>
      <template slot-scope="{ row }" slot="student2">
        <div v-if="row.users[1]">
          {{row.users[1].name}}
          <Button type="error" @click="handleDeleteStudent(row.team.id,row.users[1].studentId)">删除</Button>
        </div>
        <div v-else>
          <Button type="success" @click="showChoceModal(row.team.id)">添加</Button>
        </div>
      </template>
      <template slot-scope="{ row }" slot="student3">
        <div v-if="row.users[2]">
          {{row.users[2].name}}
          <Button type="error" @click="handleDeleteStudent(row.team.id,row.users[2].studentId)">删除</Button>
        </div>
        <div v-else>
          <Button type="success" @click="showChoceModal(row.team.id)">添加</Button>
        </div>
      </template>
      <template slot-scope="{ row }" slot="action">
        <Button type="error" @click="handleDeleteTeam(row.team.id)">删除</Button>
      </template>
    </Table>
    <Modal
      v-model="addTeamModal">
      <p slot="header" style="text-align:center">
          <span>添加队伍</span>
      </p>
      <Form :model="formItem" :label-width="120" :rules="rule" ref="addTeamForm">
        <FormItem label="队伍编号" prop="rank">
          <Input v-model="formItem.rank" placeholder="请输入队伍编号"></Input>
        </FormItem>
        <FormItem label="VJ账号" prop="vjAccount">
          <Input v-model="formItem.vjAccount" placeholder="请输入vj账号"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="add_team_loading" @click="handleAddTeam('addTeamForm')">添加</Button>
      </div>
    </Modal>
    <Modal
      v-model="choceModal">
      <p slot="header" style="text-align:center">
          <span>添加参赛者</span>
      </p>
      <Tree ref="studentChoices" :data="studentChoices"></Tree>
      <div slot="footer">
        <Button type="success" :loading="add_student_loading" @click="handleAddStudent('studentChoices')">添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'SeasonTeamTable',
    props: {
      id: Number
    },
    data () {
      return {
        choceModal: false,
        addTeamModal: false,
        add_student_loading: false,
        tableLoading: true,
        add_team_loading: false,
        seasonTeamList: [],
        formItem: {
          rank: '',
          vjAccount: ''
        },
        rule: {
          rank: [{
            required: true,
            type: 'number',
            message: '请输入数字',
            trigger: 'blur'
          }],
          vjAccount: [{
            required: true,
            type: 'string',
            message: '请输入VJ账号',
            trigger: 'blur'
          }]
        },
        handleTeamId: {
          type: Number
        },
        studentChoices: {
          type: Object
        },
        columns: [
          {
            title: '编号',
            slot: 'rank'
          },
          {
            title: '中文名',
            slot: 'nameCn'
          },
          {
            title: '英文名',
            slot: 'nameEn'
          },
          {
            title: 'VJ账号',
            slot: 'vjAccount'
          },
          {
            title: '队员1',
            slot: 'student1'
          },
          {
            title: '队员2',
            slot: 'student2'
          },
          {
            title: '队员3',
            slot: 'student3'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ]
      }
    },
    methods: {
      showChoceModal (teamId) {
        this.choceModal = true
        this.handleTeamId = teamId
      },
      showAddTeamModal (name) {
        let that = this
        that.$refs[name].resetFields()
        if (that.seasonTeamList.length > 0) {
          that.formItem.rank = that.seasonTeamList[that.seasonTeamList.length - 1].team.rank + 1
        } else {
          that.formItem.rank = 1
        }
        that.formItem.vjAccount = ''
        that.addTeamModal = true
      },
      handleAddTeam (name) {
        let that = this
        that.$refs[name].validate((valid) => {
          if (valid) {
            that.$http
              .post('/api/season/' + that.$route.params.id + '/team', {
                rank: that.formItem.rank,
                vjAccount: that.formItem.vjAccount
              })
              .then(res => {
                if (res.data.status === 0) {
                   that.$Message.success('添加成功')
                   that.$router.go(0)
                   that.add_team_loading = false
                   that.addTeamModal = false
                } else {
                  that.$Message.error(res.data.msg)
                }
              })
          } else {
            that.$Message.error('请正确输入表单!')
          }
        })
      },
      handleAddStudent (name) {
        let that = this
        let selectedNode = that.$refs[name].getSelectedNodes()
        that.add_loading = true
        if (selectedNode.length > 0 && selectedNode[0].id) {
          that.$http
            .post('/api/team/' + that.handleTeamId + '/student', {
                  studentId: selectedNode[0].id
              })
            .then(res => {
              that.add_loading = false
              if (res.data.status === 0) {
                that.$Message.success('添加成功')
                that.getData()
                that.choceModal = false
              } else {
                that.$Message.error(res.data.msg)
              }
            })
        } else {
          that.$Message.error('未选中队员')
        }
      },
      handleDeleteStudent (teamId, studentId) {
        let that = this
        that.$http
          .delete('/api/team/' + teamId + '/student', {
            params: {
              studentId: studentId
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.$Message.success('删除成功')
              that.$router.go(0)
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      },
      handleDeleteTeam (teamId) {
        let that = this
        that.$http
          .delete('/api/team', {
            params: {
              teamId: teamId
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
      getData () {
        let that = this
        that.tableLoading = true
        that.$http
          .get('/api/season/' + that.$route.params.id + '/team')
          .then(res => {
            if (res.data.status === 0) {
              that.seasonTeamList = res.data.data
              that.tableLoading = false
            } else {
              that.$Message.error(res.data.msg)
            }
          })
        that.$http
          .get('/api/season/' + that.$route.params.id + '/teamStudentChoice')
          .then(res => {
            if (res.data.status === 0) {
              that.studentChoices = res.data.data
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      }
    },
    created: function () {
      this.getData()
    }
  }
</script>

<style>
</style>
