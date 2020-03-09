<template>
  <div>
    <Button type="primary" @click="showChoceModal()">添加参赛者</Button>
    <Divider />
    <Table :loading="tableLoading" stripe :height="580" :columns="columns" :data="seasonStudentList">
      <template slot-scope="{ row }" slot="action">
        <Button type="error" @click="handleDeleteStudent(row.studentId)">删除</Button>
      </template>
    </Table>
    <Modal
      v-model="choceModal">
      <p slot="header" style="text-align:center">
          <span>添加参赛者</span>
      </p>
      <Tree ref="studentChoices" :data="studentChoices" :check-directly="true" show-checkbox multiple></Tree>
      <div slot="footer">
        <Button type="success" :loading="add_loading" @click="handleAddStudent('studentChoices')">添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'SeasonStudentTable',
    props: {
      id: Number
    },
    data () {
      return {
        choceModal: false,
        add_loading: false,
        seasonStudentList: [],
        studentChoices: null,
        columns: [
          {
            title: '年级',
            key: 'grade'
          },
          {
            title: '学号',
            key: 'studentId'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '操作',
            slot: 'action'
          }
        ],
        tableLoading: true
      }
    },
    methods: {
      showChoceModal () {
        this.choceModal = true
      },
      handleAddStudent (name) {
        let that = this
        let nodes = that.$refs[name].getCheckedNodes()
        that.add_loading = true
        var students = []
        for (var i = 0; i < nodes.length; ++i) {
          var studentNode = nodes[i]
          console.log(studentNode)
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
          .post('/api/season/' + that.$route.params.id + '/student', {
                studentIds: students
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
      },
      handleDeleteStudent (studentId) {
        let that = this
        that.$http
          .delete('/api/season/' + that.$route.params.id + '/student', {
            params: {
              studentId: studentId
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
          .get('/api/season/' + that.$route.params.id + '/student')
          .then(res => {
            if (res.data.status === 0) {
              that.seasonStudentList = res.data.data
              that.tableLoading = false
            } else {
              that.$Message.error(res.data.msg)
            }
          })
        that.$http
          .get('/api/season/' + that.$route.params.id + '/studentChoice')
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
