<template>
    <div class="title" >出入库</div>
    <n-tabs v-model:value="tabValue" justify-content="start" type="line">
        <n-tab-pane name="list" tab="入库记录">
            <n-table :bordered="false" :single-line="false">
            <thead>
                <tr>
                    <th>名称</th>
                    <th>重量/克</th>
                    <th>元/克</th>
                    <th>数量</th>
                    <th>元/个</th>
                    <th>创建日期</th>
                    <th>更新日期</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(warehouse, index) in warehouseList">
                    <td>{{ warehouse.name }}</td>
                    <td>{{ warehouse.weight }}</td>
                    <td>{{ warehouse.gramPerYuan }}</td>
                    <td>{{ warehouse.number }}</td>
                    <td>{{ warehouse.numberPerYuan }}</td>
                    <td>{{ warehouse.create_time }}</td>
                    <td>{{ warehouse.update_time }}</td>
                    <td>
                        <n-space>
                            <n-button @click="deleteWarehouse(warehouse)">删除</n-button>
                        </n-space>
                    </td>
                </tr>
  
            </tbody>
        </n-table>

        </n-tab-pane>
        <n-tab-pane name="add" tab="出库记录">

            
        </n-tab-pane>
        <n-tab-pane name="update" tab="成本利润计算">
            
        </n-tab-pane>
    </n-tabs>
</template>

<script setup>
  
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")

const adminStore = AdminStore()

const showAddModel = ref(false)
const showUpdateModel = ref(false)

const warehouseList = ref([])
const addWarehouse = reactive({
  name: "",
  weight:null,
  gramPerYuan:null,
  number:null,
  numberPerYuan:null,
  //其他的后端自动
})

const updateWarehouse = reactive({
  name: "",
  weight:null,
  gramPerYuan:null,
  number:null,
  numberPerYuan:null,
  id:null
  //update_time:0  后端会自动更新
})

onMounted(() => {
  loadDatas()
})

const loadDatas = async () => {//加载和刷新数据
  let res = await axios.get("/warehouse/_token/list")
  warehouseList.value = res.data.rows
  console.log("list method, print warehouseList.value")
  console.log(warehouseList.value)
  for (let row of warehouseList.value) {
      // 把时间戳转换为年月日
      //这里直接改了create_time update_time
      let d1 = new Date(row.create_time)
      row.create_time = `${d1.getFullYear()}年${d1.getMonth() + 1}月${d1.getDate()}日${d1.getHours()}:${d1.getMinutes()}:${d1.getSeconds()}`
      let d2 = new Date(row.update_time)
      row.update_time = `${d2.getFullYear()}年${d2.getMonth() + 1}月${d2.getDate()}日${d2.getHours()}:${d2.getMinutes()}:${d2.getSeconds()}`
  }
}

const add = async () => {//token已经通过拦截器传入
  let res = await axios.post("/warehouse/_token/add", { name: addWarehouse.name })//调用对应接口
  if (res.data.code == 200) {
      loadDatas()
      message.info(res.data.msg)
  } else {
      message.error(res.data.msg)
  }
  //不管成功失败都关掉窗口
  showAddModel.value = false;
}

const toUpdate = async (warehouse) =>{//这些数据要传给服务端
  showUpdateModel.value = true 
  updateWarehouse.name = warehouse.name
  updateWarehouse.weight = warehouse.weight
  updateWarehouse.gramPerYuan = warehouse.gramPerYuan
  updateWarehouse.number = warehouse.number
  updateWarehouse.numberPerYuan = warehouse.numberPerYuan
  updateWarehouse.id=warehouse.id
}

//更新
const update = async ()=>{
  let res = await axios.put("/warehouse/_token/update", { id:updateWarehouse.id, name: updateWarehouse.name, weight: updateWarehouse.weight,
      gramPerYuan: updateWarehouse.gramPerYuan, number: updateWarehouse.number, numberPerYuan: updateWarehouse.numberPerYuan})//服务端的更新操作
  console.log("print updateWarehouse")
  console.log(updateWarehouse)
  if (res.data.code == 200) {
      loadDatas()
      message.info(res.data.msg)
  } else {
      message.error(res.data.msg)
  }
  showUpdateModel.value = false;
  //loadDatas()
}

//删除
const deleteWarehouse = async (warehouse) => {
  const warehouseName = warehouse.name; // 获取warehouse的name属性并存储到变量中
  console.log("print warehouse")
  console.log(warehouse)
  dialog.warning({
      title: '警告',
      content: `你确定要删除“${warehouseName}”吗?此操作不会计入出库`, // 使用模板字面量插入变量值
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
          let res = await axios.delete(`/warehouse/_token/delete?id=${warehouse.id}`)//模板写法
          if (res.data.code == 200) {
              loadDatas()
              message.info(res.data.msg)
          } else {
              message.error(res.data.msg)
          }
      },
      onNegativeClick: () => { }
  })

}

</script>

<style lang="scss" scoped>
  .title{
        font-size: 60px;
        font-weight: bold;
        text-align: left;
        margin-bottom:20px;
        margin-left:30px;
        //position: fixed;
        color: rgba(0, 0, 0, 40%);
        
    }

</style>