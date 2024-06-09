<!--测试用 一个模板-->
<template>
    <div>
        <div class="title" >销售单</div>

        <div class="input">
            <p>在这里修改销售单的一些内容</p>
            <n-input v-model:value="s1Info.customerName" type="text" placeholder="客户名称" />
            <n-input v-model:value="s1Info.date" type="text" placeholder="日期" />
            <n-input v-model:value="s1Info.number" type="text" placeholder="编号" />
            <n-divider />
            <n-input v-model:value="s2Info.toAg" type="text" placeholder="兑银" />
            <n-input v-model:value="s2Info.abstract" type="text" placeholder="摘要" />
            <n-input v-model:value="s2Info.else" type="text" placeholder="其他" />
            <n-divider />
            <n-input v-model:value="lastTdInfo.count" type="text" placeholder="合计" />
            <n-input v-model:value="lastTdInfo.countNumber" type="text" placeholder="比如Ag 100g" />
            <n-input v-model:value="lastTdInfo.remarks" type="text" placeholder="可以在这里写一些备注" />
            <n-divider />
            <n-input v-model:value="lastScInfo.receiver" type="text" placeholder="收货人" />
            <n-input v-model:value="lastScInfo.maker" type="text" placeholder="制单" />
            <n-input v-model:value="lastScInfo.checker" type="text" placeholder="审核人" />
        </div>
        
        
        <div class="THESLIP" ref="downloadRef">               
            <h1>齐鼎配件销售单</h1>
            <img src="../../medias/logo.png" alt="齐鼎标志">
            <main>
                <section class="s1">
                    <table>
                        <tr>
                            <td>{{ s1Info.customerName }}</td>
                            <td>{{ s1Info.date }}</td>
                            <td>{{ s1Info.number }}</td>
                        </tr>
                    </table>
                </section>
                <section class="s1">
                    <table>
                        <tr>
                            <td>{{ s2Info.toAg }}</td>
                            <td>{{ s2Info.abstract }}</td>
                            <td>{{ s2Info.else }}</td>
                        </tr>
                    </table>
                </section>


                <section class="s3">
                    <table>
                        <thead>
                            <tr>
                                <th>商品名称</th>
                                <th>重量（克）</th>
                                <th>单价</th>
                                <th>个数</th>
                                <th>每个单位</th>
                                <th>金额</th>
                                <th>备注</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(item, index) in itemList">
                                <td>{{ item.name }}</td>
                                <td>{{ item.weight }}</td>
                                <td>{{ item.gramPerYuan }}</td>
                                <td>{{ item.number }}</td>
                                <td>{{ item.numberPerYuan }}</td>
                                <td>￥{{ item.money }}</td>
                                <td>{{ item.remarks }}</td>
                                
                            </tr>
                        </tbody>

                        <tfoot>
                            <tr>
                                <td>{{ lastTdInfo.count }}</td>
                                <td>{{ lastTdInfo.countNumber }}</td>
                                <td colspan="3"></td>
                                <td>￥{{ lastTdInfo.totalprice }}</td>
                                <td>{{ lastTdInfo.remarks }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </section>

                

                

            </main>
            <footer>
                <p>说明：贵公司收到货后如有数量及品质问题请于24小时内回复本公司（超过24小时不予更换，如有不便敬请谅解！）</p>
                <p>地址：义乌市工人北路642号 Tel：0579—8587515</p>
                    
            </footer>

            <main>
                <section class="s1">
                    <table>
                        <tr>
                            <td>{{ lastScInfo.receiver }}</td>
                            <td>{{ lastScInfo.maker }}</td>
                            <td>{{ lastScInfo.checker }}</td>
                        </tr>
                    </table>
                </section>
            </main>
            
            


            <section class="s5"></section>
        </div>

        <n-button @click="downloadElementAsImage" style="width: 200px;margin-top:20px;">下载图片</n-button>

    </div>
    <section class="s5"></section>
</template>

<script setup>
    import { AdminStore } from '../../stores/AdminStore'
    import { ref, reactive, inject, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import html2canvas from 'html2canvas';
    const router = useRouter()
    const route = useRoute()
    
    const message = inject("message")
    const dialog = inject("dialog")
    const axios = inject("axios")

    const adminStore = AdminStore()

    

    onMounted(() => {
        loadItems()
    })

    const s1Info = reactive({
        customerName:"客户：",
        date:"日期：",
        number:"编号："
    })

    const s2Info = reactive({
        toAg:"兑银：",
        abstract:"摘要：",
        else:"其他："
    })

    const lastTdInfo = reactive({
        count:"合计：",
        countNumber:"",
        remarks:"",
        totalprice:null,
    })

    const lastScInfo = reactive({
        receiver:"收货人：",
        maker:"制单：胡",
        checker:"审核人：",
    })

    const itemList=ref([])

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

    const loadItems = async () => {
        let res = await axios.get("/sales/_token/listslip")
        let count=0
        itemList.value = res.data.rows.map(row => ({
            ...row, // 复制原始对象的所有属性
            money: countMoney(row.weight,row.gramPerYuan,row.number,row.numberPerYuan) 
        }));

        res.data.rows.forEach(row => {
            count += countMoney(row.weight,row.gramPerYuan,row.number,row.numberPerYuan) 
        });
        lastTdInfo.totalprice=count
    }

    // 假设你有一个ref来引用需要转换为图片的元素
    const downloadRef = ref(null);

    const downloadElementAsImage = async () => {
        try {
            // 使用ref的value来获取DOM元素
            const element = downloadRef.value;
            if (!element) return console.error('Element not found.');

            const canvas = await html2canvas(element);
            const base64Image = canvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.href = base64Image;
            link.download = 'element-screenshot.png';
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to convert element to image:', error);
        }
    };
    
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

    .input{
        width: 500px;
        margin-bottom: 20px;
        border: 1px solid gray;
        border-radius: 20px;
        padding: 10px;
    }

    .input p{
        color: black;
        font-size: 20px;
        margin-left:20px;
    }

    .THESLIP{
        border: 1px solid black;
        position: relative;
        min-width: 700px;
    }

    h1{
        text-align: center;
        color: black;
        margin-top: 15px;
        margin-bottom: 0px;
    }

    img{
        position:absolute;
        top:10px;
        right: 10px;
        width:50px;
        height: auto;
    }

    main{
        display: flex; /* 将父元素设为Flex容器 */
        justify-content: center;
        flex-direction: column;
        align-items: center;
        color: black;
    }

    .s1{
        width: 90%;
        display: flex; /* 将父元素设为Flex容器 */
        justify-content: space-between; 
        align-items: center; /* 垂直居中对齐 */
        height: 30px;
    }

    .s1 table{
        border-collapse: collapse; /* 合并单元格边框 */
        border: none; /* 移除外边框 */
    }

    .s1 table td {
        font-weight: normal; /* 字体为正常（非粗体） */
        font-size: 14px;
        border: none; /* 隐藏内边框 */
        padding-left: 30px;
    }


    .s2{
        width: 90%;
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        height: 30px;
    }
 
    .s3{
        width: 90%;
        display: flex; 
        align-items: center; 
        justify-content: center;
    }

    table{
        width: 100%;
        border-collapse: collapse; /* 合并单元格边框 */
        font-size: 12px;
    }

    table, th, td {
        border: 2px solid black; /* 给表格、表头和单元格都加上边框 */
    }

    th, td{
        height: 30px;
    }

    table td{
        padding-left: 5px;
    }

    footer{
        color:black;
        margin-left:5%;
    }

    footer p{
        margin-bottom: 0px;
        margin-top: 5px;
        height: auto;
    }

    .s4{
        margin-top: 10px;
        width: 70%;
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        height: 30px;
    }

    .s5{
        height: 100px;
    }





</style>