<template>
  <div>
    <h1>
      {{teamInfo.team.nameCn?teamInfo.team.nameCn:'未命名'}}
      <small style="color: #9ea7b4;">{{teamInfo.team.nameEn?teamInfo.team.nameEn:'Untitled'}}</small>
      <Button v-if="teamInfo.isMyTeam" @click="showChangeTeamNameModal" type="success" style="margin-left: 2rem;">修改队名</Button>
    </h1>
    <Modal v-model="change_team_name_modal" width="360">
      <p slot="header" style="text-align:center">
        <span>修改队名</span>
      </p>
      <Form :model="formItem" :label-width="100">
        <FormItem label="中文名">
          <Input v-model="formItem.nameCn" placeholder="请输入中文队名"></Input>
        </FormItem>
        <FormItem label="英文名">
          <Input v-model="formItem.nameEn" placeholder="请输入英文队名"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="change_loading" @click="changeTeamName()">修改</Button>
      </div>
    </Modal>
    <Divider />
    <h2>成员列表</h2>
    <Table :columns="columns" :data="teamInfo.students" style="margin-top: 1rem;">
      <template slot="name" slot-scope="{row}">
        <router-link :to="{name:'Student',params:{id:row.studentId}}">
          {{row.name}}
        </router-link>
      </template>
    </Table>
    <!-- <Divider /> -->
    <h2 style="margin-top: 2rem;">获奖列表<Button v-if="teamInfo.isMyTeam" type="success" @click="showAddAwardModal" style="margin-left: 1.5rem;">添加奖项</Button></h2>
    <Modal v-model="add_award_modal" width="360">
      <p slot="header" style="text-align:center">
        <span>添加奖项</span>
      </p>
      <Form :model="formItem" :label-width="100" :rules="rule" ref="addAwardForm">
        <FormItem label="比赛类型" prop="contestType">
          <Select v-model="formItem.contestType" style="width:200px">
            <Option v-for="item in contestTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="赛区" prop="regional">
          <Input v-model="formItem.regional" placeholder="请输赛区" style="width:200px"></Input>
        </FormItem>
        <FormItem label="奖项等级" prop="level">
          <Select v-model="formItem.level" style="width:200px">
            <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="时间" prop="time">
          <DatePicker v-model="formItem.time" type="date" placeholder="Select date" style="width: 200px"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" :loading="add_loading" @click="addAward()">添加</Button>
      </div>
    </Modal>
    <Table v-if="teamInfo.isMyTeam" :columns="columns2" :data="teamInfo.awards" style="margin-top: 1rem;">
      <template slot="verified" slot-scope="{row}">
        {{row.verified===1?'审核通过':'审核中'}}
      </template>
      <template slot="time" slot-scope="{row}">
        {{row.time.split('T')[0]}}
      </template>
      <template slot="action" slot-scope="{row}">
        <Button type="error" @click="deleteAward(row.id)">删除</Button>
      </template>
    </Table>
    <Table v-else :columns="columns1" :data="teamInfo.awards" style="margin-top: 1rem;">
      <template slot="time" slot-scope="{row}">
        {{row.time.split('T')[0]}}
      </template>
    </Table>
  </div>
</template>

<script>
export default {
  name: 'TeamInfo',
  props: {
    teamId: Number
  },
  data () {
    return {
      teamInfo: null,
      change_team_name_modal: false,
      change_loading: false,
      add_award_modal: false,
      add_loading: false,
      formItem: {
        nameCn: '',
        nameEn: '',
        level: '',
        regional: '',
        time: '',
        contestType: ''
      },
      rule: {
        contestType: [{
          required: true,
          message: '请选择比赛类型'
        }],
        regional: [{
          required: true,
          tigger: 'blur',
          message: '请输入赛区'
        }],
        level: [{
          required: true,
          message: '请选择奖项等级'
        }],
        time: [{
          required: true,
          message: '请选择获奖时间'
        }]
      },
      levelList: [
        {
          value: '金',
          label: '金'
        },
        {
          value: '银',
          label: '银'
        },
        {
          value: '铜',
          label: '铜'
        }
      ],
      contestTypeList: [
        {
          value: 'ICPC亚洲区域赛',
          label: 'ICPC亚洲区域赛'
        },
        {
          value: 'ICPC EC Finals',
          label: 'ICPC EC Finals'
        },
        {
          value: 'ICPC World Finals',
          label: 'ICPC World Finals'
        },
        {
          value: 'CCPC',
          label: 'CCPC'
        },
        {
          value: 'CCPC Finals',
          label: 'CCPC Finals'
        },
        {
          value: '省赛',
          label: '省赛'
        }
      ],
      columns: [
        {
          title: '年级',
          key: 'grade'
        },
        {
          title: '姓名',
          slot: 'name'
        },
        {
          title: '学号',
          key: 'studentId'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '手机',
          key: 'phone'
        },
        {
          title: 'QQ',
          key: 'qq'
        },
        {
          title: 'ICPC_Email',
          key: 'icpcEmail'
        }
      ],
      columns1: [
        {
          title: '类型',
          key: 'contestType'
        },
        {
          title: '赛区',
          key: 'regional'
        },
        {
          title: '奖项',
          key: 'level'
        },
        {
          title: '时间',
          slot: 'time'
        }
      ],
      columns2: [
        {
          title: '类型',
          key: 'contestType'
        },
        {
          title: '赛区',
          key: 'regional'
        },
        {
          title: '奖项',
          key: 'level'
        },
        {
          title: '时间',
          slot: 'time'
        },
        {
          title: '审核状态',
          slot: 'verified'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ]
    }
  },
  methods: {
    getData () {
      let that = this
      that.$http
        .get('/api/teamInfo/' + that.teamId)
        .then(res => {
          if (res.data.status === 0) {
            that.teamInfo = res.data.data
          } else {
            that.$Message.error(res.data.msg)
          }
        })
    },
    showChangeTeamNameModal () {
      let that = this
      that.change_team_name_modal = true
      that.formItem.nameCn = that.teamInfo.team.nameCn
      that.formItem.nameEn = that.teamInfo.team.nameEn
    },
    showAddAwardModal () {
      let that = this
      that.$refs['addAwardForm'].resetFields()
      that.add_award_modal = true
    },
    changeTeamName () {
      let that = this
      that.change_loading = true
      that.$http
        .put('/api/team/' + that.teamId + '/teamName', {
          nameCn: that.formItem.nameCn,
          nameEn: that.formItem.nameEn
        })
        .then(res => {
          that.change_loading = false
          if (res.data.status === 0) {
            that.$Message.success('修改成功')
            that.change_team_name_modal = false
            that.getData()
          } else {
            that.$Message.error(res.data.msg)
          }
        })
    },
    addAward () {
      let that = this
      that.$refs['addAwardForm'].validate((valid) => {
        if (valid) {
          that.add_loading = true
          that.$http
            .post('/api/award', {
              level: that.formItem.level,
              regional: that.formItem.regional,
              time: that.formItem.time,
              contestType: that.formItem.contestType,
              teamId: that.teamId
            })
            .then(res => {
              that.add_loading = false
              if (res.data.status === 0) {
                that.$Message.success('添加成功')
                that.add_award_modal = false
                that.getData()
              } else {
                that.$Message.error(res.data.msg)
              }
            })
        } else {
          that.$Message.error('请正确填写表单')
        }
      })
    },
    deleteAward (awardId) {
      let that = this
      that.$Modal.confirm({
        title: '删除获奖记录',
        content: '<p>确认删除此条获奖记录？</p>',
        loading: true,
        onOk: () => {
          that.$http
            .delete('/api/award/' + awardId)
            .then(res => {
              that.$Modal.remove()
              if (res.data.status === 0) {
                that.$Message.info('删除成功')
                that.getData()
              } else {
                that.$Message.error(res.data.msg)
              }
            })
        }
      })
    }
  },
  created: function () {
    this.getData()
  },
  watch: {
    teamId: function () {
      this.getData()
    }
  }
}
</script>

<style>
</style>
