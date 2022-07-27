const app=require('express')();
const server=require('http').Server(app);
const axios=require('axios');
let io = require('socket.io-client')
  , io_server_main = require('socket.io')(server)
  ,io_server=io_server_main.of('/api/coins');
server.listen(3000);
describe('basic socket.io example', function() {
  let socket;
    beforeEach(function(done) {
        socket = io('http://localhost:3000/api/coins');
        socket.on('connect', () => {
        done();
        });

        socket.on('disconnect', () => {
        // console.log('disconnected...');
        });
    });
    afterEach((done) => {
        // Cleanup
        if(socket.connected) {
        socket.disconnect();
        }
        io_server_main.close();
        done();
    });
    expect.extend({
        toBeValidDetails(recieved){
            const isArray=recieved.isArray();
            const hasFourCoins=(recieved.length==4)||false;
            const keys=recieved.map((a)=>Object.keys(a));
            const hasKeys=keys.some(key=>key==[
                "symbol",
                "priceChange",
                "priceChangePercent",
                "weightedAvgPrice",
                "prevClosePrice",
                "lastPrice",
                "lastQty",
                "bidPrice",
                "bidQty",
                "askPrice",
                "askQty",
                "openPrice",
                "highPrice",
                "lowPrice",
                "volume",
                "quoteVolume",
                "openTime",
                "closeTime",
                "firstId",
                "lastId",
                "count"
            ]);
            const pass=hasKeys&&isArray&&hasFourCoins;
            return pass; 
        }
    })
    test('validate input coin details',  async () => {
        try {
            let coins=await axios.get('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","ENJUSDT","GRTUSDT"]')
            io_server.emit('price', coins.data);
            socket.on('price', (message) => {
                expect(message).toBeValidDetails();
            });
        } catch (error) {
            console.log(error)
        }
    });
})