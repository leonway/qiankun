// 微前端基座应用
const express = require('express')

const app = express()


app.get('*',function (req,res,next) {
  res.header("Access-control-Allow-Origin","*")
  res.header("Access-control-Allow-Methods","PUT, GET, POST, DELETE, OPTIONS")
  res.header("Access-control-Allow-Headers","X-Requested-Width")
  res.header("Access-control-Allow-Headers","Content-Type")
  next()
})

app.use(express.static('./app1'))


app.listen(9001,()=>{
  console.log('app1 at port 9001');
})
