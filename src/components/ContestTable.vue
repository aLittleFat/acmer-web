<template>
  <div>
  <Table :columns="columns" :data="contestRecordList">
    <template slot-scope="{ row }" slot="solution">
        <Button v-if="row.solution && row.solution !== ''" type="info" @click="showSolutionModal(row.solution)">查看</Button>
    </template>
    <template slot-scope="{ index }" slot="rank">
      {{index + 1}}
    </template>
    <template slot-scope="{ row }" slot="participants">
      <div>
        <router-link :to="{name:'Student',params:{id:row.studentId}}" v-if="row.studentId">{{row.participants}}</router-link>
        <router-link :to="{name:'Team',params:{id:row.teamId}}" v-if="row.teamId">{{row.participants}}</router-link>
      </div>
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
    name: 'ContestTable',
    props: {
      contestId: Number
    },
    data () {
      return {
        columns: [
          {
            title: '排名',
            slot: 'rank',
            width: 90
          },
          {
            title: '参赛者',
            slot: 'participants',
            width: 180
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
          }
        ],
        contestRecordList: [],
        problemList: [],
        tableLoading: true,
        edit_modal: false,
        readOnly: true,
        editSolution: ''
      }
    },
    created: function () {
      this.getData()
    },
    methods: {
      getData () {
        let that = this
        that.tableLoading = true
        var url = '/api/contestTable/'
        that.$http
          .get(url, {
            params: {
              contestId: that.contestId
            }
          })
          .then(res => {
            if (res.data.status === 0) {
              that.contestRecordList = res.data.data.contestRecordLines
              for (let i = 0; i < that.contestRecordList.length; ++i) {
                that.contestRecordList[i].cellClassName = Object()
                for (let j = 0; j < that.contestRecordList[i].solved.length; ++j) {
                  that.contestRecordList[i].cellClassName[that.contestRecordList[i].solved[j]] = 'table-ac-cell'
                }
                for (let j = 0; j < that.contestRecordList[i].upSolved.length; ++j) {
                  that.contestRecordList[i].cellClassName[that.contestRecordList[i].upSolved[j]] = 'table-up-cell'
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
      showSolutionModal (solution) {
        let that = this
        that.editSolution = solution
        that.readOnly = true
        that.edit_modal = true
      }
    },
    watch: {
      contestId: function () {
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
