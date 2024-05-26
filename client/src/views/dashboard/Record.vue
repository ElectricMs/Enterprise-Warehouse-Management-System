<!--测试用 一个模板-->
<template>
    <div>
        <div class="title" >操作记录</div>
        <n-table :bordered="false" :single-line="false">
            <thead>
                <tr>
                    <th>更新前名称</th>
                    <th>更新后名称</th>
                    <th>更新前重量</th>
                    <th>更新后重量</th>
                    <th>更新前元/克</th>
                    <th>更新后元/克</th>
                    <th>更新前数量</th>
                    <th>更新后数量</th>
                    <th>更新前元/个</th>
                    <th>更新后元/个</th>
                    <th>操作</th>
                    <th>操作日期</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(operation, index) in operationList">
                    <td>{{ operation.name_old }}</td>
                    <td>{{ operation.name }}</td>
                    <td>{{ operation.weight_old }}</td>
                    <td>{{ operation.weight_new }}</td>
                    <td>{{ operation.gramPerYuan_old }}</td>
                    <td>{{ operation.gramPerYuan_new }}</td>
                    <td>{{ operation.number_old }}</td>
                    <td>{{ operation.number_new }}</td>
                    <td>{{ operation.numberPerYuan_old }}</td>
                    <td>{{ operation.numberPerYuan_new }}</td>
                    <td>{{ operation.method }}</td>
                    <td>{{ operation.update_time }}</td>
                </tr>
            </tbody>
        </n-table>
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

    const operationList = ref([])

    onMounted(() => {
        loadDatas()
    })

    const loadDatas = async () => {//加载和刷新数据
        let res = await axios.get("/record/_token/list")
        operationList.value = res.data.rows
        console.log("list method, print operationList.value")
        console.log(operationList.value)
        for (let row of operationList.value) {
            // 把时间戳转换为年月日
            let d1 = new Date(row.update_time)
            row.update_time = `${d1.getFullYear()}年${d1.getMonth() + 1}月${d1.getDate()}日${d1.getHours()}:${d1.getMinutes()}:${d1.getSeconds()}`
        }
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