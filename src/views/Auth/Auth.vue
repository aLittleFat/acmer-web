<template>
  <Row style="margin-top: 10rem;">
      <Col span="12" offset="8">
          <Card style="width:280px">
              <div style="text-align:center">
                  <img src="../../assets/images.png">
              </div>
              <div>
              <router-view></router-view>
              </div>
              <p style="color: #b0b0b0;">请使用Chrome或360极速浏览器访问</p>
          </Card>
      </Col>
  </Row>
</template>

<script>
  export default {

  }
</script>

<style>
</style>
