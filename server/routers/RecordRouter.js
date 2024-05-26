const express = require("express")
const router = express.Router()
const { db, genid } = require("../db/DbUtils")


// 列表接口
router.get("/_token/list", async (req, res) => {
    const search_sql = "SELECT `name_old`,`name`,`weight_old`,`weight_new`,`gramPerYuan_old`,`gramPerYuan_new`,`number_old`,`number_new`,`numberPerYuan_old`,`numberPerYuan_new`,`update_time`,`id`,`method` FROM `updateRecords` ORDER BY `update_time` DESC"

    let { err, rows } = await db.async.all(search_sql, [])

    if (err == null) {
        res.send({
            code: 200,
            msg: "查询成功",
            rows //rows:rows
        })
    } else {
        console.log(err)
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }

})



module.exports = router