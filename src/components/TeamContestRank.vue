<template>
  <Table :columns="columns" :data="teamContestRankList">
    <template slot-scope="{ index }" slot="rank">
      {{index + 1}}
    </template>
    <template slot-scope="{ row }" slot="nameCn">
      <router-link :to="{name:'Team',params:{id:row.teamId}}">{{row.nameCn?row.nameCn:'未命名'}}</router-link>
    </template>
    <template slot-scope="{ row }" slot="awards">
      <Tooltip v-for="(item,index) in row.awardList" :key="index" :content="item.contestType + item.regional + item.level + '奖'">
        <svg class="icon" aria-hidden="true">
          <use v-if="item.level === '金'" xlink:href="#icon-jinpai"></use>
          <use v-if="item.level === '银'" xlink:href="#icon-yinpai2"></use>
          <use v-if="item.level === '铜'" xlink:href="#icon-tongpaigongchang"></use>
        </svg>
      </Tooltip>
    </template>
  </Table>
</template>

<script>
  import '@/assets/iconfont.js'
  export default {
    name: 'TeamContestRank',
    props: {
      seasonId: Number
    },
    data () {
      return {
        columns: [
          {
            title: '排名',
            slot: 'rank'
          },
          {
            title: '中文名',
            slot: 'nameCn'
          },
          {
            title: '英文名',
            key: 'nameEn'
          },
          {
            title: '队员',
            key: 'students'
          },
          {
            title: '训练数量',
            key: 'contestNumber'
          },
          {
            title: '获奖记录',
            slot: 'awards'
          }
        ],
        teamContestRankList: [],
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
        that.$http
          .get('/api/season/' + that.seasonId + '/teamContestRank')
          .then(res => {
            if (res.data.status === 0) {
              that.teamContestRankList = res.data.data
              that.tableLoading = false
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
