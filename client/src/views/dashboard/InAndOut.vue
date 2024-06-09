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
                                <n-button @click="addToSlip(sales)">添加到表</n-button>
                                <n-button @click="deleteSales(sales)">删除</n-button>
                            </n-space>
                        </td>
                    </tr>
                </tbody>
            </n-table>
            
            <p>以下为被加入销售单的内容，请在此处对商品进行必要的修改（非常不建议修改价格和数量！），然后在‘销售单’界面查看和保存销售单</p>

            <n-table :bordered="false" :single-line="false">
                
                    
                <tbody>
                    <tr>
                        <th>商品名称</th>
                        <th>重量(克)</th>
                        <th>单价</th>
                        <th>个数</th>
                        <th>每个单价</th>
                        <th>金额</th>
                        <th>备注</th>
                        <th>操作</th>
                    </tr>

                    <tr v-for="(item, index) in tempList">
                        <td>{{ item.name }}</td>
                        <td>{{ item.weight }}</td>
                        <td>{{ item.gramPerYuan }}</td>
                        <td>{{ item.number }}</td>
                        <td>{{ item.numberPerYuan }}</td>
                        <td>{{ item.money }}</td>
                        <td>{{ item.remarks }}</td>
                        <td>
                            <n-space>
                                <n-button @click="updateTemp(item)">修改</n-button>
                                <n-button @click="deleteTemp(item)">删除</n-button>
                            </n-space>
                        </td>
                    </tr>
                </tbody>
            </n-table>

            <div style="height: 100px;"></div>

            <!--updateTemp-->
            <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
                <template #header>
                    <div>修改该商品</div>
                </template>
                <div><n-input v-model:value="updateItem.name" type="text" placeholder="请输入名称" /></div>
                <div><n-input-number v-model:value="updateItem.weight"  placeholder="重量 克":min="0"  /></div>
                <div><n-input-number v-model:value="updateItem.gramPerYuan"  placeholder="价格 元/g":min="0" /></div>
                <div><n-input-number v-model:value="updateItem.number"  placeholder="数量 个":min="0" /></div>
                <div><n-input-number v-model:value="updateItem.numberPerYuan"  placeholder="价格 元/个":min="0" /></div>
                <div><n-input v-model:value="updateItem.remarks" type="text" placeholder="备注"/></div>
                <template #action>
                    <div>
                        <n-button @click="update">提交</n-button>
                    </div>
                </template>
            </n-modal>
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
const tempList = ref([])
const showUpdateModel = ref(false)
const updateItem = reactive({
    name: "",
    weight:null,
    gramPerYuan:null,
    number:null,
    numberPerYuan:null,
    remarks:null,
    id:null
    //update_time:0  后端会自动更新
})

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

    let res4 = await axios.get("/sales/_token/listslip")
    tempList.value = res4.data.rows.map(row => ({
        ...row, // 复制原始对象的所有属性
        money: countMoney(row.weight,row.gramPerYuan,row.number,row.numberPerYuan) 
    }));
}

const loadTempSlipDatas = async () => {
    let res4 = await axios.get("/sales/_token/listslip")
    tempList.value = res4.data.rows.map(row => ({
        ...row, // 复制原始对象的所有属性
        money: countMoney(row.weight,row.gramPerYuan,row.number,row.numberPerYuan) 
    }));
}

// 格式化时间
const formatTime = (timestamp) => {
    let date = new Date(timestamp);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

// 计算金额
const countMoney = (weight,gramPerYuan,number,numberPerYuan) => {
    let count=0;
    if(weight==0||weight==null){

    }else{
        count=count+weight*gramPerYuan;
    }
    if(number==0||number==null){
        
    }else{
        count=count+number*numberPerYuan;
    }
    return count;
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

const deleteTemp = async (sales) => {
  
    let res = await axios.delete(`/sales/_token/deletetemp`, {
        params: {
            id: item.id,
            time: item.time 
        }
    });
    if (res.data.code == 200) {
        loadTempSlipDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
      
}

const addToSlip = async (sales) => {
    let res = await axios.post("/sales/_token/addto", { name: sales.name, weight: sales.weight, gramPerYuan: sales.gramPerYuan, number: sales.number, numberPerYuan:sales.numberPerYuan, id:sales.id })//调用对应接口
    if (res.data.code == 200) {
        loadDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
 
}

const updateTemp = async (item) =>{//这些数据要传给服务端
    showUpdateModel.value = true 
    updateItem.name = item.name
    updateItem.weight = item.weight
    updateItem.gramPerYuan = item.gramPerYuan
    updateItem.number = item.number
    updateItem.numberPerYuan = item.numberPerYuan
    updateItem.id=item.id
    updateItem.remarks=item.remarks
}

 //更新
 const update = async ()=>{
    let res = await axios.put("/sales/_token/updatetemp", { id:updateItem.id, name: updateItem.name, weight: updateItem.weight,
        gramPerYuan: updateItem.gramPerYuan, number: updateItem.number, numberPerYuan: updateItem.numberPerYuan, remarks: updateItem.remarks
        })//服务端的更新操作
    
    if (res.data.code == 200) {
        loadTempSlipDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showUpdateModel.value = false;
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