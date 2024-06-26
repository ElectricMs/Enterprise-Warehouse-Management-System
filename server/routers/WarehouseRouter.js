const express = require("express")
const router = express.Router()
const { db, genid } = require("../db/DbUtils")


router.get("/detail", async (req, res) => {//特定链接点进去用的 不一定有用-----------------------------

    let { id } = req.query
    let detail_sql = "SELECT * FROM `warehouse` WHERE `id` = ? "
    let { err, rows } = await db.async.all(detail_sql, [id]) ;

    if (err == null) {
        res.send({
            code: 200,
            msg: "获取成功",
            rows
        })
    } else {
        res.send({
            code: 500,
            msg: "获取失败"
        })
    }

})

//查询 包含模糊查询-------------------------------------------
router.get("/search", async (req, res) => {


    /**
     * keyword 关键字  在name中查找
     * 
     * 分页： 
     * page 页码
     * pageSize 分页大小
     * //分页的传给前端定制  事实上有点无关紧要
     */
    let { keyword, page, pageSize } = req.query//query和body不一样！

    page = page == null ? 1 : page;//增加默认值
    pageSize = pageSize == null ? 10 : pageSize

    keyword = keyword == null ? "" : keyword

    let params = []//查询参数
    let whereSqls = []//查询语句的条件


    if (keyword != "") {
        whereSqls.push(" (`name` LIKE ? ) ")//查name
        params.push("%" + keyword + "%")
    }

    let whereSqlStr = ""//拼装查询语句
    if (whereSqls.length > 0) {
        whereSqlStr = " WHERE " + whereSqls.join(" AND ")//事实上不会拼接
    }

    //查分页数据 时间排序
    let searchSql = " SELECT `name`,`weight`,`gramPerYuan`,`number`,`numberPerYuan`,`create_time`,`update_time` FROM `warehouse` " + whereSqlStr + " ORDER BY `update_time` DESC LIMIT ?,? "
    // 1 10  2,10    3,5
    // 0,10  10,10   10,5
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])//分页 每页有多少 

    //查询数据总数
    let searchCountSql = " SELECT count(*) AS `count` FROM `warehouse` " + whereSqlStr;
    let searchCountParams = params

    //分页数据
    let searchResult = await db.async.all(searchSql, searchSqlParams)
    let countResult = await db.async.all(searchCountSql, searchCountParams)

    console.log(searchSql, countResult)

    if (searchResult.err == null && countResult.err == null) {
        res.send({//返回给前端
            code: 200,
            msg: "查询成功",
            data: {
                keyword,
                page,
                pageSize,
                rows: searchResult.rows,
                count: countResult.rows[0].count
            }
        })

    } else {
        res.send({
            code: 500,
            msg: "查询失败",
        })
    }

})

// 删除接口 /warehouse/delete?id=xxx
router.delete("/_token/delete", async (req, res) => {//  /_token/delete
    

    try{
        let { id,name,weight,gramPerYuan,number,numberPerYuan } = req.body;
        const delete_sql = "DELETE FROM `warehouse` WHERE `id` = ?"
        await db.async.run(delete_sql, [id])

        // 执行记录操作
        let operationMethod="删除"
        let update_time = new Date().getTime();
        const insert_sql2 = "INSERT INTO `updateRecords` (`id`,`name_old`,`weight_old`,`gramPerYuan_old`,`number_old`,`numberPerYuan_old`,`update_time`,`method`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        let params3 = [ id, name, weight, gramPerYuan, number, numberPerYuan, update_time, operationMethod];
        await db.async.run(insert_sql2, params3);

        res.send({
            code: 200,
            msg: "删除成功"
        })
    }catch(error){
        console.log(error)
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }



})

//修改
router.put("/_token/update", async (req, res) => {//  /_token/update

    try{
        let { id,name_old,weight_old,gramPerYuan_old,number_old,numberPerYuan_old,name,weight_new,gramPerYuan_new,number_new,numberPerYuan_new } = req.body;
        let update_time = new Date().getTime();
        const update_sql = "UPDATE `warehouse` SET `name` = ?,`weight` = ?,`gramPerYuan` = ?,`number` = ?,`numberPerYuan` = ?,`update_time`=? WHERE `id` = ?"
        let params = [name, weight_new, gramPerYuan_new, number_new, numberPerYuan_new,update_time,id]
        await db.async.run(update_sql, params)

        // 执行记录操作
        let operationMethod="修改"
        const insert_sql2 = "INSERT INTO `updateRecords` (`name_old`,`name`,`weight_old`,`weight_new`,`gramPerYuan_old`,`gramPerYuan_new`,`number_old`,`number_new`,`numberPerYuan_old`,`numberPerYuan_new`,`update_time`,`id`,`method`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let params3 = [ name_old, name, weight_old, weight_new, gramPerYuan_old, gramPerYuan_new, number_old, number_new, numberPerYuan_old, numberPerYuan_new, update_time, id, operationMethod];
        await db.async.run(insert_sql2, params3);

        res.send({
            code: 200,
            msg: "修改成功"
        })
    }catch(error){
        console.log(error)
        res.send({
            code: 500,
            msg: "修改失败"
        })
    }

})

//添加
router.post("/_token/add", async (req, res) => {//  /_token/add

    try{
        let { name,weight,gramPerYuan,number,numberPerYuan } = req.body;
        let id = genid.NextId();
        let create_time = new Date().getTime();
        let update_time = new Date().getTime();

        const insert_sql = "INSERT INTO `warehouse` (`id`,`name`,`weight`,`gramPerYuan`,`number`,`numberPerYuan`,`create_time`,`update_time`) VALUES (?,?,?,?,?,?,?,?)"
        let params = [id, name, weight, gramPerYuan, number, numberPerYuan, create_time, update_time]
        await db.async.run(insert_sql, params)//异步执行SQL插入操作

        // 执行记录操作
        let operationMethod="添加"
        const insert_sql2 = "INSERT INTO `updateRecords` (`name_old`,`name`,`weight_old`,`weight_new`,`gramPerYuan_old`,`gramPerYuan_new`,`number_old`,`number_new`,`numberPerYuan_old`,`numberPerYuan_new`,`update_time`,`id`,`method`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let params3 = [ null, name, null, weight, null, gramPerYuan, null, number, null, numberPerYuan, update_time, id, operationMethod];
        await db.async.run(insert_sql2, params3);

        res.send({
            code: 200,
            msg: "添加成功"
        })
    }catch(error){
        console.log(error)
        res.send({
            code: 500,
            msg: "添加失败"
        })
    }
    
})

// 列表接口
router.get("/_token/list", async (req, res) => {
    const search_sql = "SELECT `name`,`weight`,`gramPerYuan`,`number`,`numberPerYuan`,`create_time`,`update_time`,`id` FROM `warehouse` ORDER BY `update_time` DESC"

    let { err, rows } = await db.async.all(search_sql, [])

    if (err == null) {
        res.send({
            code: 200,
            msg: "查询成功",
            rows //rows:rows
        })
    } else {
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }

})

//修改-入库
router.put("/_token/input", async (req, res) => {
    try {
        let { id, name, weight, gramPerYuan, number, numberPerYuan, addWeight, addNumber } = req.body;
        let updateTime = new Date().getTime();

        // 执行更新操作
        const update_sql = "UPDATE `warehouse` SET `weight` = ?, `number` = ?, `update_time` = ? WHERE `id` = ?";
        let params1 = [weight + addWeight, number + addNumber, updateTime, id];
        await db.async.run(update_sql, params1);

        // 执行插入操作
        let inputTime = new Date().getTime();
        const insert_sql = "INSERT INTO `input` (`time`, `name`, `weight`, `gramPerYuan`, `number`, `numberPerYuan`, `id`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        let params2 = [inputTime, name, addWeight, gramPerYuan, addNumber, numberPerYuan, id];
        await db.async.run(insert_sql, params2);

        // 执行记录操作
        let operationMethod="入库"
        const insert_sql2 = "INSERT INTO `updateRecords` (`name_old`,`name`,`weight_old`,`weight_new`,`gramPerYuan_old`,`gramPerYuan_new`,`number_old`,`number_new`,`numberPerYuan_old`,`numberPerYuan_new`,`update_time`,`id`,`method`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let params3 = [ name, name, weight, weight+addWeight, gramPerYuan, gramPerYuan, number, number+addNumber, numberPerYuan, numberPerYuan, inputTime, id, operationMethod];
        await db.async.run(insert_sql2, params3);

        // 如果三个操作都成功，则发送成功的响应
        res.send({
            code: 200,
            msg: "入库数据更新成功且入库数插入表成功"
        });
    } catch (error) {
        // 如果任一操作失败，捕获错误并发送失败的响应
        console.error(error);
        res.status(500).send({
            code: 500,
            msg: "入库数据处理过程中发生错误，请报告管理员"
        });
    }
});

//修改-出库
router.put("/_token/output", async (req, res) => {
    try {
        let { id, name, weight, gramPerYuan, number, numberPerYuan, reduceWeight, reduceNumber } = req.body;
        let updateTime = new Date().getTime();

        // 执行更新操作
        const update_sql = "UPDATE `warehouse` SET `weight` = ?, `number` = ?, `update_time` = ? WHERE `id` = ?";
        let params1 = [weight - reduceWeight, number - reduceNumber, updateTime, id];
        await db.async.run(update_sql, params1);

        // 执行插入出库表操作
        let outputTime = new Date().getTime();
        const insert_sql = "INSERT INTO `output` (`time`, `name`, `weight`, `gramPerYuan`, `number`, `numberPerYuan`, `id`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        let params2 = [outputTime, name, reduceWeight, gramPerYuan, reduceNumber, numberPerYuan, id];
        await db.async.run(insert_sql, params2);

        //执行插入销售单操作
        const insert_sql2 = "INSERT INTO `salesSlip` (`time`, `name`, `weight`, `gramPerYuan`, `number`, `numberPerYuan`, `id`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        let params3 = [outputTime, name, reduceWeight, gramPerYuan, reduceNumber, numberPerYuan, id];
        await db.async.run(insert_sql2, params3);

        // 执行记录操作
        let operationMethod="出库"
        const insert_sql3 = "INSERT INTO `updateRecords` (`name_old`,`name`,`weight_old`,`weight_new`,`gramPerYuan_old`,`gramPerYuan_new`,`number_old`,`number_new`,`numberPerYuan_old`,`numberPerYuan_new`,`update_time`,`id`,`method`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        let params4 = [ name, name, weight, weight-reduceWeight, gramPerYuan, gramPerYuan, number, number-reduceNumber, numberPerYuan, numberPerYuan, outputTime, id, operationMethod];
        await db.async.run(insert_sql3, params4);

        // 如果四个操作都成功，则发送成功的响应
        res.send({
            code: 200,
            msg: "出库成功"
        });
    } catch (error) {
        // 如果任一操作失败，捕获错误并发送失败的响应
        console.error(error);
        res.status(500).send({
            code: 500,
            msg: "出库数据处理过程中发生错误，请报告管理员"
        });
    }
});

module.exports = router