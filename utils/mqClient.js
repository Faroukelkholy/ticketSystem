const amqplib = require('amqplib');
const EventEmitter = require('events');


class mqClient extends EventEmitter {

    constructor() {
        super();
    }

    connect(rabitmqSettings) {
        let _this = this;
        console.log('connect rabitmqSettings :', rabitmqSettings);
        return new Promise(function (resolve, reject) {
            amqplib.connect(rabitmqSettings.host).then(function (conn) {
                _this.conn = conn.createChannel();
                return resolve();
            }).catch((error) => {
                console.error('open connection error:', error);
                return reject();
            });
        });
    }

    disconnect() {
        console.log('disconnecting a mq connection');
        this.conn.close();
    }

    publishMsg(queue, msg) {
        let _this = this;
        this.conn.then(function (ch) {
            return ch.assertQueue(queue).then(function (ok) {
                return ch.sendToQueue(queue, Buffer.from(msg));
            });
        }).catch(console.warn);
    }

    consumeMsq(queue){
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.conn.then(function (ch) {
            return ch.assertQueue(queue).then(function (ok) {
                return ch.consume(queue, function (msg) {
                    if (msg !== null) {
                        console.log('mqclient.consumeMsq msg.content.toString() ', msg.content.toString());
                        // const data = JSON.parse(msg.content);
                        // console.log('data ', data);
                        ch.ack(msg);
                        // _this.emit('event',JSON.parse(msg.content));
                        return resolve(JSON.parse(msg.content));
                    }
                });
            });
        }).catch(console.warn);
    });
    }



}




module.exports = mqClient;