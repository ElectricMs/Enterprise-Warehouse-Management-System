<template>
    <div class="title" >出入库</div>
    <n-tabs v-model:value="tabValue" justify-content="start" type="line">
        <n-tab-pane name="InputTable" tab="入库记录">
            <n-table :bordered="false" :single-line="false">
            <thead>
                <tr>
                    <th>名称</th>
                    <th>重量/克</th>
                    <th>元/克</th>
                    <th>数量</th>
                    <th>元/个</th>
                    <th>入库日期</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(input, index) in inputList">
                    <td>{{ input.name }}</td>
                    <td>{{ input.weight }}</td>
                    <td>{{ input.gramPerYuan }}</td>
                    <td>{{ input.number }}</td>
                    <td>{{ input.numberPerYuan }}</td>
                    <td>{{ input.displayTime }}</td>
                    <td>
                        <n-space>
                            <n-button @click="deleteInput(input)">删除</n-button>
                        </n-space>
                    </td>
                </tr>
            </tbody>
        </n-table>

        </n-tab-pane>
        <n-tab-pane name="OutputTable" tab="出库记录">
            <n-table :bordered="false" :single-line="false">
                <thead>
                    <tr>
                        <th>名称</th>
                        <th>重量/克</th>
                        <th>元/克</th>
                        <th>数量</th>
                        <th>元/个</th>
                        <th>出库日期</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(output, index) in outputList">
                        <td>{{ output.name }}</td>
                        <td>{{ output.weight }}</td>
                        <td>{{ output.gramPerYuan }}</td>
                        <td>{{ output.number }}</td>
                        <td>{{ output.numberPerYuan }}</td>
                        <td>{{ output.displayTime }}</td>
                        <td>
                            <n-space>
                                <n-button @click="deleteOutput(output)">删除</n-button>
                            </n-space>
                        </td>
                    </tr>
                </tbody>
            </n-table>
        </n-tab-pane>

        <n-tab-pane name="CreateSalesSlip" tab="生成出库销售单">
            <n-table :bordered="false" :single-line="false">
                <thead>
                    <tr>
                        <th>名称</th>
                        <th>重量/克</th>
                        <th>元/克</th>
                        <th>数量</th>
                        <th>元/个</th>
                        <th>出库日期</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(sales, index) in salesList">
                        <td>{{ sales.name }}</td>
                        <td>{{ sales.weight }}</td>
                        <td>{{ sales.gramPerYuan }}</td>
                        <td>{{ sales.number }}</td>
                        <td>{{ sales.numberPerYuan }}</td>
                        <td>{{ sales.displayTime }}</td>
                        <td>
                            <n-space>
                                <n-button @click="deleteSales(sales)">删除</n-button>
                            </n-space>
                        </td>
                    </tr>
                </tbody>
            </n-table>
            <n-button @click="CreateSalesSlip()"style="margin-top:10px;width: 150px; ">生成出库销售单</n-button>
            <n-button @click="ClearData()"style="margin-top:10px;width: 150px;margin-left:30px; ">清空记录</n-button>
        </n-tab-pane>

        <n-tab-pane name="Count" tab="成本利润计算">
            
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


const inputList = ref([])
const outputList = ref([])
const salesList = ref([])

onMounted(() => {
  loadDatas()
})

const loadDatas = async () => {
    let res = await axios.get("/input/_token/list")
    inputList.value = res.data.rows.map(row => ({
        ...row, // 复制原始对象的所有属性
        displayTime: formatTime(row.time) // 添加新属性displayTime，存储格式化后的时间
    }));

    let res2 = await axios.get("/output/_token/list")
    outputList.value = res2.data.rows.map(row => ({
        ...row, // 复制原始对象的所有属性
        displayTime: formatTime(row.time) // 添加新属性displayTime，存储格式化后的时间
    }));

    let res3 = await axios.get("/sales/_token/list")
    salesList.value = res3.data.rows.map(row => ({
        ...row, // 复制原始对象的所有属性
        displayTime: formatTime(row.time) // 添加新属性displayTime，存储格式化后的时间
    }));
}

// 新增一个函数用于格式化时间
const formatTime = (timestamp) => {
    let date = new Date(timestamp);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}


//删除
const deleteInput = async (input) => {
  const inputName = input.name; // 获取warehouse的name属性并存储到变量中
  console.log("print input")
  console.log(input)
  dialog.warning({
      title: '警告',
      content: `你确定要删除“${inputName}”的这条入库记录吗?此操作无法撤回！`, // 使用模板字面量插入变量值
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let res = await axios.delete(`/input/_token/delete`, {
            params: {
                id: input.id,
                time: input.time // 确保这里替换为你要传递的具体时间值
            }
        });//模板写法
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

const deleteOutput = async (output) => {
  const outputName = output.name; // 获取warehouse的name属性并存储到变量中
  console.log("print output")
  console.log(output)
  dialog.warning({
      title: '警告',
      content: `你确定要删除“${outputName}”的这条出库记录吗?此操作无法撤回！`, // 使用模板字面量插入变量值
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let res = await axios.delete(`/output/_token/delete`, {
            params: {
                id: output.id,
                time: output.time 
            }
        });//模板写法
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

const deleteSales = async (sales) => {
  const salesName = sales.name; // 获取warehouse的name属性并存储到变量中
  console.log("print sales")
  console.log(sales)
  dialog.warning({
      title: '警告',
      content: `你确定要删除“${salesName}”的这条出库销售记录吗?此操作无法撤回！`, // 使用模板字面量插入变量值
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let res = await axios.delete(`/sales/_token/delete`, {
            params: {
                id: sales.id,
                time: sales.time 
            }
        });//模板写法
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