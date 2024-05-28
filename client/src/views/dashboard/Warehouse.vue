<template>
    <div>
        <div class="title" >仓库管理</div>
        <n-button @click="showAddModel = true"style="margin-bottom:10px;width: 150px; ">新的物品-入库</n-button><!--这个按钮不好看 但不知道怎么改-->
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
                            <n-button @click="toInput(warehouse)">入库-记录入库</n-button>
                            <n-button @click="toOutput(warehouse)">出库-记录出库</n-button>                                                                           
                            <n-button @click="toUpdate(warehouse)">修改</n-button>
                            <n-button @click="deleteWarehouse(warehouse)">删除</n-button>
                        </n-space>
                    </td>
                </tr>
  
            </tbody>
        </n-table>
  
        <!--新的物品-入库   添加的模态框-->
        <n-modal v-model:show="showAddModel" preset="dialog" title="Dialog">
            <template #header>
                <div>新的物品-入库</div>
            </template>
            <div><n-input v-model:value="addWarehouse.name" type="text"placeholder="请输入名称" /></div>
            <div><n-input-number v-model:value="addWarehouse.weight"  placeholder="重量 克":min="0" /></div>
            <div><n-input-number v-model:value="addWarehouse.gramPerYuan"  placeholder="价格 元/g":min="0" /></div>
            <div><n-input-number v-model:value="addWarehouse.number"  placeholder="数量 个":min="0" /></div>
            <div><n-input-number v-model:value="addWarehouse.numberPerYuan"  placeholder="价格 元/个":min="0" /></div>
            <template #action>
                <div>
                    <n-button @click="add">提交</n-button>
                </div>
            </template>
        </n-modal>
        <!--修改   的模态框-->
        <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
            <template #header>
                <div>修改该物品-不计入出入库</div>
            </template>
            <div><n-input v-model:value="updateWarehouse.name" type="text" placeholder="请输入名称" /></div>
            <div><n-input-number v-model:value="updateWarehouse.weight_new"  placeholder="重量 克":min="0"  /></div>
            <div><n-input-number v-model:value="updateWarehouse.gramPerYuan_new"  placeholder="价格 元/g":min="0" /></div>
            <div><n-input-number v-model:value="updateWarehouse.number_new"  placeholder="数量 个":min="0" /></div>
            <div><n-input-number v-model:value="updateWarehouse.numberPerYuan_new"  placeholder="价格 元/个":min="0" /></div>
            <template #action>
                <div>
                    <n-button @click="update">提交</n-button>
                </div>
            </template>
        </n-modal>
  
        <!--input的模态框-->
        <n-modal v-model:show="showInputModel" preset="dialog" title="Dialog">
            <template #header>
                <div>入库-记录入库</div>
            </template>
            <div v-if="thewarehouse">入库商品:{{ thewarehouse.name }}</div>
            <div v-if="thewarehouse">已有重量:{{ thewarehouse.weight }} 克</div>
            <div v-if="thewarehouse">元/克:{{ thewarehouse.gramPerYuan }}</div>
            <div v-if="thewarehouse">已有个数:{{ thewarehouse.number }}</div>
            <div v-if="thewarehouse">元/个:{{ thewarehouse.numberPerYuan }}</div>
            <div><n-input-number v-model:value="inputWarehouse.addWeight"  placeholder="新增 克":min="0" /></div>
            <div><n-input-number v-model:value="inputWarehouse.addNumber"  placeholder="新增 个":min="0" /></div>
            <template #action>
                <div>
                    <n-button @click="input">入库</n-button>
                </div>
            </template>
        </n-modal>

        <!--output的模态框-->
        <n-modal v-model:show="showOutputModel" preset="dialog" title="Dialog">
            <template #header>
                <div>出库-记录出库</div>
            </template>
            <div v-if="thewarehouse">出库商品:{{ thewarehouse.name }}</div>
            <div v-if="thewarehouse">已有重量:{{ thewarehouse.weight }} 克</div>
            <div v-if="thewarehouse">元/克:{{ thewarehouse.gramPerYuan }}</div>
            <div v-if="thewarehouse">已有个数:{{ thewarehouse.number }}</div>
            <div v-if="thewarehouse">元/个:{{ thewarehouse.numberPerYuan }}</div>
            <div>超出原有商品数量的出库请求将被拒绝！</div>
            <div><n-input-number v-model:value="outputWarehouse.reduceWeight"  placeholder="出库 克":min="0" /></div>
            <div><n-input-number v-model:value="outputWarehouse.reduceNumber"  placeholder="出库 个":min="0" /></div>
            
            
            
            <template #action>
                <div>
                    <n-button @click="output">出库</n-button>
                </div>
            </template>
        </n-modal>
    </div>
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
  const showInputModel = ref(false)
  const showOutputModel = ref(false)
  let thewarehouse= ref([])
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
    name_old: "",
    weight_old:null,
    gramPerYuan_old:null,
    number_old:null,
    numberPerYuan_old:null,
    name: "",
    weight_new:null,
    gramPerYuan_new:null,
    number_new:null,
    numberPerYuan_new:null,
    id:null
    //update_time:0  后端会自动更新
  })
  
  const inputWarehouse = reactive({
    name: "",
    weight:null,
    gramPerYuan:null,
    number:null,
    numberPerYuan:null,
    id:null,
    addWeight:null,
    addNumber:null
  })

  const outputWarehouse = reactive({
    name: "",
    weight:null,
    gramPerYuan:null,
    number:null,
    numberPerYuan:null,
    id:null,
    reduceWeight:null,
    reduceNumber:null
  })

  onMounted(() => {
    loadDatas()
  })
  
  const loadDatas = async () => {//加载和刷新数据
    let res = await axios.get("/warehouse/_token/list")
    warehouseList.value = res.data.rows
    console.log("list method, print res")
    console.log(res)
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
    if (addWarehouse.weight ==null) {
        addWarehouse.weight=0;
    }
    if (addWarehouse.gramPerYuan ==null) {
        addWarehouse.gramPerYuan=0;
    }
    if (addWarehouse.number ==null) {
        addWarehouse.number=0;
    }
    if (addWarehouse.numberPerYuan ==null) {
        addWarehouse.numberPerYuan=0;
    }
    let res = await axios.post("/warehouse/_token/add", { name: addWarehouse.name, weight: addWarehouse.weight, gramPerYuan: addWarehouse.gramPerYuan, number: addWarehouse.number, numberPerYuan:addWarehouse.numberPerYuan })//调用对应接口
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
    updateWarehouse.name_old = warehouse.name
    updateWarehouse.weight_old = warehouse.weight
    updateWarehouse.gramPerYuan_old = warehouse.gramPerYuan
    updateWarehouse.number_old = warehouse.number
    updateWarehouse.numberPerYuan_old = warehouse.numberPerYuan
    updateWarehouse.name = warehouse.name
    updateWarehouse.weight_new = warehouse.weight
    updateWarehouse.gramPerYuan_new = warehouse.gramPerYuan
    updateWarehouse.number_new = warehouse.number
    updateWarehouse.numberPerYuan_new = warehouse.numberPerYuan
    updateWarehouse.id=warehouse.id
  }

  const toInput = async (warehouse) =>{
    showInputModel.value = true 
    inputWarehouse.name = warehouse.name
    inputWarehouse.weight = warehouse.weight
    inputWarehouse.gramPerYuan = warehouse.gramPerYuan
    inputWarehouse.number = warehouse.number
    inputWarehouse.numberPerYuan = warehouse.numberPerYuan
    inputWarehouse.id=warehouse.id
    thewarehouse = warehouse
  }

  const toOutput = async (warehouse) =>{
    showOutputModel.value = true 
    outputWarehouse.name = warehouse.name
    outputWarehouse.weight = warehouse.weight
    outputWarehouse.gramPerYuan = warehouse.gramPerYuan
    outputWarehouse.number = warehouse.number
    outputWarehouse.numberPerYuan = warehouse.numberPerYuan
    outputWarehouse.id=warehouse.id
    thewarehouse = warehouse
  }
  
  //更新
  const update = async ()=>{
    let res = await axios.put("/warehouse/_token/update", { id:updateWarehouse.id, name: updateWarehouse.name, weight_new: updateWarehouse.weight_new,
        gramPerYuan_new: updateWarehouse.gramPerYuan_new, number_new: updateWarehouse.number_new, numberPerYuan_new: updateWarehouse.numberPerYuan_new,
        name_old: updateWarehouse.name_old, weight_old: updateWarehouse.weight_old, gramPerYuan_old: updateWarehouse.gramPerYuan_old, 
        number_old: updateWarehouse.number_old, numberPerYuan_old: updateWarehouse.numberPerYuan_old})//服务端的更新操作
    console.log("print updateWarehouse")
    console.log(updateWarehouse)
    if (res.data.code == 200) {
        loadDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showUpdateModel.value = false;
  }
  
  //删除
  const deleteWarehouse = async (warehouse) => {
    const warehouseName = warehouse.name;
    console.log("print warehouse");
    console.log(warehouse);

    dialog.warning({
        title: '警告',
        content: `你确定要删除“${warehouseName}”吗?此操作不会计入出库`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            // 请求包含所有需要参数的对象
            let res = await axios.delete(`/warehouse/_token/delete`, {
                data: { 
                    id: warehouse.id, 
                    name: warehouse.name, 
                    weight: warehouse.weight,
                    gramPerYuan: warehouse.gramPerYuan,
                    number: warehouse.number,
                    numberPerYuan: warehouse.numberPerYuan
                } 
            }); // 注意：并非所有后端都支持DELETE方法携带请求体，需确认API设计

            if (res.data.code == 200) {
                loadDatas();
                message.info(res.data.msg);
            } else {
                message.error(res.data.msg);
            }
        },
        onNegativeClick: () => {}
    });
}
  //input
  const input = async ()=>{
    let res = await axios.put("/warehouse/_token/input", {  id: inputWarehouse.id, name: inputWarehouse.name, 
        weight: inputWarehouse.weight, gramPerYuan: inputWarehouse.gramPerYuan,number: inputWarehouse.number,
        numberPerYuan: inputWarehouse.numberPerYuan, addWeight:inputWarehouse.addWeight, addNumber:inputWarehouse.addNumber})//服务端的更新操作
    console.log("print inputWarehouse")
    console.log(inputWarehouse)
    if (res.data.code == 200) {
        loadDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showInputModel.value = false;
  }

  //output
  const output = async ()=>{
    if (outputWarehouse.reduceWeight > outputWarehouse.weight) {
        message.error('出库重量不能大于原有重量！');
        return; // 结束函数，不再执行后续的API调用
    }
    if (outputWarehouse.reduceNumber > outputWarehouse.number) {
        message.error('出库重量不能大于原有重量！');
        return; // 结束函数，不再执行后续的API调用
    }

    let res = await axios.put("/warehouse/_token/output", {  id: outputWarehouse.id, name: outputWarehouse.name, 
        weight: outputWarehouse.weight, gramPerYuan: outputWarehouse.gramPerYuan,number: outputWarehouse.number,
        numberPerYuan: outputWarehouse.numberPerYuan, reduceWeight:outputWarehouse.reduceWeight, reduceNumber:outputWarehouse.reduceNumber})//服务端的更新操作
    console.log("print outputWarehouse")
    console.log(outputWarehouse)
    if (res.data.code == 200) {
        loadDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showOutputModel.value = false;
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