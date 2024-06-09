<!--测试用 一个模板-->
<template>
    <div class="title" >销售统计</div>
    <div>
        <p style="font-size: 20px;color: black;">成本利润计算范围为入库和出库记录中的内容,结果如下：</p>

        <p style="font-size: 20px;color: black;">查询到入库记录 {{ inputCount }} 条</p>
        <p style="font-size: 20px;color: black;">查询到出库记录 {{ outputCount }} 条</p>
        
        <p style="font-size: 20px;color: black;">入库总金额：{{ inputTotal }} 元</p>
        <p style="font-size: 20px;color: black;">出库总金额：{{ outputTotal }} 元</p>

        <p style="font-size: 15px;color: black;">商品金额计算方法：如果重量不为0或不为空，则重量乘以单价记为金额；如果个数不为0或不为空，则个数乘以每个价格记为金额。
            如果该商品的出库记录既包含重量出库又包含个数出库，则两种出库方式产生的金额会叠加（但不建议这么做，我们建议你不同的计量方式分成两次出库）。同时，我们也不建议
            将单价和每个单价设为小于等于零的值，这样可能导致一些奇怪的异常。如果上方的总金额数字出现一些极小的的小数（比如123.00000001这样）请忽略即可。
        </p>

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

    const inputCount = ref(-1)
    const outputCount = ref(-1)
    const inputTotal = ref(-1)
    const outputTotal = ref(-1)

    onMounted(() => {
        loadDatas()
        loadCountMoney()
    })


    const loadDatas = async () => {
        let res = await axios.get("/input/listcount")
        inputCount.value = res.data.rows[0].count;

        let res2 = await axios.get("/output/listcount")
        outputCount.value = res2.data.rows[0].count;
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

    const loadCountMoney = async () => {
        let res = await axios.get("/input/_token/list")
        let count=0

        res.data.rows.forEach(row => {
            count += countMoney(row.weight,row.gramPerYuan,row.number,row.numberPerYuan) 
        });
        inputTotal.value=count

        let res2 = await axios.get("/output/_token/list")
        let count2=0

        res2.data.rows.forEach(row => {
            count2 += countMoney(row.weight,row.gramPerYuan,row.number,row.numberPerYuan) 
        });
        outputTotal.value=count2
    }


</script>

<style lang="scss" scoped>
    .title{
        font-size: 60px;
        font-weight: bold;
        text-align: left;
        margin-bottom:20px;
        margin-left:30px;
        color: rgba(0, 0, 0, 40%);  
    }
</style>