<template>
  <el-container>
    <el-main>
      <div style="padding-top: 10px; margin: 0 auto; width: 900px; min-height: 650px" align="start">
        <h4>学生列表</h4>
        <el-row :gutter="30">
          <el-col :span="8"><el-input placeholder="按学号查找" v-model="searchId" size="small"></el-input></el-col>
          <el-col :span="3"><el-button type="primary" size="small"><i class="el-icon-search" style="margin-right: 10px"></i>搜索</el-button></el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-table :data="studentInfo">
            <el-table-column label="学号" align="center">
              <template slot-scope="scope">
                {{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column label="姓名" align="center">
              <template slot-scope="scope">
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column label="联系方式" align="center">
              <template slot-scope="scope">
                {{scope.row.email}}
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top: 30px">
          <div align="center">
            <el-pagination
              :page-size="20"
              :pager-count="11"
              layout="prev, pager, next"
              :total="1000">
            </el-pagination>
          </div>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
    export default {
      name: "studentList",
      data() {
        return {
          // 学生信息
          studentInfo: [
            {
              id: '1612341',
              name: '学生1',
              email: '11111@qq.com'
            },
            {
              id: '1612342',
              name: '学生2',
              email: '11111@qq.com'
            },
            {
              id: '1612343',
              name: '学生3',
              email: '11111@qq.com'
            },
            {
              id: '1612344',
              name: '学生4',
              email: '11111@qq.com'
            }
          ],
          listLoading: false,
          searchId: '',
        }
      },
      methods: {

      }
    }
</script>

<style scoped>

</style>
