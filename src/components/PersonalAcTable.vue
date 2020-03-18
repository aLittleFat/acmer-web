<template>
  <Table :loading="tableLoading" stripe :columns="columns" :data="personalAcList">
    <template slot-scope="{ row, index }" slot="rank">
      {{ index+1 }}
    </template>
    <template slot-scope="{ row }" slot="grade">
      {{ row.user.grade }}
    </template>
    <template slot-scope="{ row }" slot="name">
      <router-link :to="{name:'Student',params:{id: row.user.studentId}}">{{ row.user.name }}</router-link>
    </template>
    <template slot-scope="{ row }" slot="acNum">
      {{ row.acNum }}
    </template>
    <template slot-scope="{ row }" slot="awards">
      <Tooltip v-for="(item,index) in row.awards" :key="index" :content="item.contestType + item.regional + item.level + '奖'">
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
    name: 'PersonalAcTable',
    props: {
      grade: Number
    },
    data () {
      return {
        columns: [
          {
            title: '排名',
            slot: 'rank'
          },
          {
            title: '年级',
            slot: 'grade'
          },
          {
            title: '姓名',
            slot: 'name'
          },
          {
            title: '题量',
            slot: 'acNum'
          },
          {
            title: '获奖情况',
            slot: 'awards'
          }
        ],
        personalAcList: [],
        tableLoading: true
      }
    },
    created: function () {
      let that = this
      that.$http
        .get('/api/personalProblemAcRank', {
          params: {
            grade: that.grade
          }
        })
        .then(res => {
          if (res.data.status === 0) {
            that.personalAcList = res.data.data
            that.tableLoading = false
          } else {
            that.$Message.error(res.data.msg)
          }
        })
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
