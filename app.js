const app=require('express')();
const server=require('http').Server(app);
const axios=require('axios');
const io = require("socket.io")(server, {
    cors: {
        origin: '*',
      }
  });
const coinPrice=io.of('/api/coins');

setInterval(async()=>{
    try {
        var coins=await axios.get('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","ENJUSDT","GRTUSDT"]')
        coinPrice.emit('price',coins.data)
    } catch (error) {
        console.log(error)
    }
},5000)

server.listen(3000, () => {
console.log('listening on *:3000');
});
