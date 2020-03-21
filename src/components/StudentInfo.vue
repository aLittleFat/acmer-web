<template>
  <Row>
    <Col span="12">
      <Row>
        <Card>
          <h1>{{studentInfo.name}}</h1>
          <p>年级： {{studentInfo.grade}}</p>
          <p>题量： {{studentInfo.acNumber}}</p>
          <p>CFRating： {{studentInfo.cfRating}}</p>
          <p>获奖情况：</p>
          <Tooltip v-for="(item,index) in studentInfo.awardList" :key="index" :content="item.contestType + item.regional + item.level + '奖'">
            <svg class="icon" aria-hidden="true">
              <use v-if="item.level === '金'" xlink:href="#icon-jinpai"></use>
              <use v-if="item.level === '银'" xlink:href="#icon-yinpai2"></use>
              <use v-if="item.level === '铜'" xlink:href="#icon-tongpaigongchang"></use>
            </svg>
          </Tooltip>
          <!-- <p>{{studentInfo.awardList}}</p> -->
        </Card>
      </Row>
      <Divider />
      <h3>队伍：</h3>
      <Table :columns="teamColumns" :data="studentInfo.teams">
        <template slot-scope="{ row }" slot="teamName">
          <router-link v-if="row.teamName" :to="{name:'Team',params:{id: row.id}}">{{ row.teamName }}</router-link>
          <router-link v-else :to="{name:'Team',params:{id: row.id}}">未命名</router-link>
        </template>
      </Table>
    </Col>
    <Col span="12">
      <ve-pie :data="ojChartData" height="300px" :settings="chartSettings"></ve-pie>
      <Divider />
      <ve-pie :data="tagChartData" height="300px" :settings="chartSettings"></ve-pie>
    </Col>
  </Row>
</template>

<script>
import '@/assets/iconfont.js'
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
      studentInfo: null
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
  .icon {
    width: 3em;
    height: 3em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
