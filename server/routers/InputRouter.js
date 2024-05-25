const express = require("express")
const router = express.Router()
const { db, genid } = require("../db/DbUtils")



//查询 包含模糊查询--------------------------------
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

// 删除接口 /input/delete?id=xxx
router.delete("/_token/delete", async (req, res) => {//  /_token/delete
    let id = req.query.id
    let time=req.query.time
    const delete_sql = "DELETE FROM `input` WHERE `id` = ? and time=?"
    let { err, rows } = await db.async.run(delete_sql, [id,time])

    if (err == null) {
        res.send({
            code: 200,
            msg: "删除成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }

})


// 列表接口
router.get("/_token/list", async (req, res) => {
    const search_sql = "SELECT `name`,`weight`,`gramPerYuan`,`number`,`numberPerYuan`,`time`,`id` FROM `input` ORDER BY `time` DESC"

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



module.exports = router