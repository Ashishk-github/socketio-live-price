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

    test('should communicate',  async () => {
        try {
            io_server.emit('price', 'connected');
            socket.on('price', (message) => {
                expect(message).toBe('connected');
            });
        } catch (error) {
            console.log(error)
        }
    });
    test("check object contains all keys", async () => {
        try {
            let coins=await axios.get('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","ENJUSDT","GRTUSDT"]')
            io_server.emit('check', coins.data[0]);
            socket.on('check', (message) => {
                console.log(message);
                expect(message).objectContaining({
                "symbol":expect.any(String),
                "priceChange":expect.any(String),
                "priceChangePercent":expect.any(String),
                "weightedAvgPrice":expect.any(String),
                "prevClosePrice":expect.any(String),
                "lastPrice":expect.any(String),
                "lastQty":expect.any(String),
                "bidPrice":expect.any(String),
                "bidQty":expect.any(String),
                "askPrice":expect.any(String),
                "askQty":expect.any(String),
                "openPrice":expect.any(String),
                "highPrice":expect.any(String),
                "lowPrice":expect.any(String),
                "volume":expect.any(String),
                "quoteVolume":expect.any(String),
                "openTime":expect.any(Number),
                "closeTime":expect.any(Number),
                "firstId":expect.any(Number),
                "lastId":expect.any(Number),
                "count":expect.any(Number)
                });
            });
        } catch (error) {
            console.log(error)
        }
        });
    test('should have length 4',  async () => {
        try {
            io_server.emit('length', coins.data);
            socket.on('length', (message) => {
                expect(message).toHaveLength(4);
            });
        } catch (error) {
            console.log(error)
        }
    });
})