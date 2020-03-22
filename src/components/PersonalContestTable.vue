<template>
  <div>
  <Table :loading="tableLoading" :height="height" :columns="columns" :data="personalContestList">
    <template slot-scope="{ row }" slot="title">
        <router-link :to="{name:'Contest',params:{id:row.contestId}}">{{ row.contestTitle }}</router-link>
    </template>
    <template slot-scope="{ row }" slot="solution">
        <Button v-if="studentId===''" type="info" @click="showEditModal(row.contestRecordId, row.solution)">编辑</Button>
        <Button v-else-if="row.solution && row.solution !== ''" type="info" @click="showSolutionModal(row.solution)">查看</Button>
    </template>
    <template slot-scope="{ row }" slot="action">
        <Button v-if="studentId===''" type="error" @click="deleteContestRecord(row.contestRecordId)">删除</Button>
    </template>
  </Table>
  <Modal v-model="edit_modal" width="360">
    <p slot="header" style="text-align:center">
      <span>题解</span>
    </p>
    <Input v-model="editSolution" :readonly="readOnly" type="textarea" rows="20"></Input>
    <div slot="footer">
      <Button v-if="!readOnly" type="success" :loading="edit_loading" @click="handleChangeSolution()">修改</Button>
    </div>
  </Modal>
  </div>
</template>

<script>
  export default {
    name: 'PersonalContestTable',
    props: {
      studentId: String,
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
            width: 100
          },
          {
            title: '操作',
            slot: 'action',
            width: 100
          }
        ],
        edit_modal: false,
        readOnly: false,
        editId: 0,
        editSolution: '',
        edit_loading: false,
        personalContestList: [],
        problemList: [],
        problemNum: 0,
        tableLoading: true
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      getData () {
        let that = this
        that.tableLoading = true
        var url = ''
        if (that.studentId === '') {
          url = '/api/personalContest'
        } else {
          url = '/api/personalContest/' + that.studentId
        }
        that.$http
          .get(url)
          .then(res => {
            if (res.data.status === 0) {
              that.personalContestList = res.data.data.contestRecord
              for (let i = 0; i < that.personalContestList.length; ++i) {
                that.personalContestList[i].cellClassName = Object()
                for (let j = 0; j < that.personalContestList[i].solved.length; ++j) {
                  that.personalContestList[i].cellClassName[that.personalContestList[i].solved[j]] = 'table-ac-cell'
                }
                for (let j = 0; j < that.personalContestList[i].upSolved.length; ++j) {
                  that.personalContestList[i].cellClassName[that.personalContestList[i].upSolved[j]] = 'table-up-cell'
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
      deleteContestRecord (id) {
        let that = this
        that.$http
          .delete('/api/contestRecord', {
            params: {
              contestRecordId: id
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
      showEditModal (id, solution) {
        let that = this
        that.editSolution = solution
        that.editId = id
        that.readOnly = false
        that.edit_modal = true
      },
      showSolutionModal (solution) {
        let that = this
        that.editSolution = solution
        that.readOnly = true
        that.edit_modal = true
      },
      handleChangeSolution () {
        let that = this
        that.$http
          .put('/api/solution', {
            contestRecordId: that.editId,
            solution: that.editSolution
          })
          .then(res => {
            if (res.data.status === 0) {
              that.$Message.success('修改成功')
              that.getData()
              that.edit_modal = false
            } else {
              that.$Message.error(res.data.msg)
            }
          })
      }
    },
    watch: {
      studentId: function () {
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
