<template>
  <Row>
    <Col span="12">
      <Row>
        <Col span="10">
          <Card>
            <h1>{{studentInfo.name}}</h1>
            <p>年级： {{studentInfo.grade}}</p>
            <p>题量： {{studentInfo.acNumber}}</p>
            <p>CFRating： {{studentInfo.cfRating}}</p>
            <p>获奖情况：</p>
            <!-- <p>{{studentInfo.awardList}}</p> -->
          </Card>
        </Col>
        <Col span="10" offset="1">
          <h3>队伍：</h3>
          <Table :columns="teamColumns" :data="studentInfo.teams">
            <template slot-scope="{ row }" slot="teamName">
              <router-link v-if="row.teamName" :to="{name:'Team',params:{id: row.id}}">{{ row.teamName }}</router-link>
              <router-link v-else :to="{name:'Team',params:{id: row.id}}">未命名</router-link>
            </template>
          </Table>
        </Col>
      </Row>
      <Divider />
    </Col>
    <Col span="12">
      <ve-pie :data="ojChartData" :settings="chartSettings"></ve-pie>
      <Divider />
      <ve-pie :data="tagChartData" :settings="chartSettings"></ve-pie>
    </Col>
  </Row>
</template>

<script>
export default {
  name: 'StudentInfo',
  props: {
    studentId: String
  },
  data () {
    this.chartSettings = {
      limitShowNum: 10
    }
    return {
      teamColumns: [
        {
          title: '赛季',
          key: 'seasonName'
        },
        {
          title: '队名',
          slot: 'teamName'
        }
      ],
      ojChartData: {
        columns: ['ojName', 'number'],
        rows: []
      },
      tagChartData: {
        columns: ['tagName', 'number'],
        rows: []
      },
      studentInfo: Object()
    }
  },
  created: function () {
    this.getData()
  },
  methods: {
    getData () {
      let that = this
      that.$http
        .get('/api/studentInfo', {
          params: {
            studentId: that.studentId
          }
        })
        .then(res => {
          if (res.data.status === 0) {
            that.ojChartData.rows = res.data.data.ojAcCharts
            that.tagChartData.rows = res.data.data.tagAcCharts
            that.studentInfo = res.data.data
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
