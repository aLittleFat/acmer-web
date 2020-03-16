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
