# Enterprise Warehouse Management System

## sqlite warehouse
商品名称 name varchar（100）notnull primarykey
重量（克） weight real 
单价（元/克） gramPerYuan real 
个数 number bigint
每个单价 numberPerYuan bigint
创建时间 create_time bigint notnull
最近一次修改时间 update_time bigint notnull

## sqlite updateRecords