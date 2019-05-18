<template>
  <div class="vue-progress-bar default-theme">
    <div class="vue-progress-bar__outer" :style="wrapStyle">
      <div class="vue-progress-bar-plus__inner" :style="plusStyle"></div>
      <div class="vue-progress-bar-minus__inner" :style="minusStyle"></div>
    </div>
  </div>
</template>
 
<script>
export default {
  props: {
    width: {
      type: Number,
      default: 100,
      validator: val => val >= 0
    },
    studentNum: {
      type: Number,
      defalut: 0,
      required: true,
      validator: val => val >= 0
    },
    color: {
      type: String,
      default: "#FF99EB"
    },
    percentage: {
      type: Number,
      default: 0,
      required: true,
      validator: val => val >= 0 && val <= 100
    }
  },
  computed: {
    wrapStyle() {
      const style = {};
      style.width = this.width + "%";
      return style;
    },
    plusStyle() {
      const style = {};
      style.backgroundColor = this.color;
      style.width = this.percentage + "%";
      style.display = "inline-block";
      return style;
    },
    minusStyle() {
      const style = {};
      style.backgroundColor = "#adecfc";
      if (this.studentNum === 0) {
        style.width = "0";
      } else {
        var negativePercentage = 100 - this.percentage;
        style.width = negativePercentage + "%";
      }
      style.display = "inline-block";
      return style;
    }
  }
};
</script>
 
<style lang="scss" scoped>
.vue-progress-bar.default-theme {
  .vue-progress-bar__outer {
    background: #eee;
    margin: 0;
    padding: 0;
    font-size: 0;
    text-align-last: justify;
  }

  .vue-progress-bar-plus__inner {
    height: 20px;
    margin: 0;
    padding: 0;
    font-size: 0;
    transition: width 1s;
    -moz-transition: width 1s; /* Firefox 4 */
    -webkit-transition: width 1s; /* Safari and Chrome */
    -o-transition: width 1s; /* Opera */
  }
  .vue-progress-bar-minus__inner {
    height: 20px;
    margin: 0;
    padding: 0;
    font-size: 0;
    transition: width 1s;
    -moz-transition: width 1s; /* Firefox 4 */
    -webkit-transition: width 1s; /* Safari and Chrome */
    -o-transition: width 1s; /* Opera */
  }
}
</style>