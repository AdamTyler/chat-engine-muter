
const assert = require('chai').assert;
const mute = require('./src/plugin.js');

const ChatEngine = require('../chat-engine/src/index.js');

let pluginchat;
let CE;

describe('config', function() {

    it('should be configured', function() {

        CE = ChatEngine.create({
            publishKey: 'pub-c-01491c54-379f-4d4a-b20b-9a03c24447c7',
            subscribeKey: 'sub-c-eaf4a984-4356-11e8-91e7-8ad1b2d46395',
        });

        assert.isOk(CE);

    });

});

describe('connect', function() {

    it('should be identified as new user', function(done) {

        this.timeout(10000);

        CE.connect('robot-tester' + new Date().getTime(), {works: true}, 'auth-key');

        CE.on('$.ready', (data) => {

            assert.isObject(data.me);
            done();

        })

    });

});

describe('plugins', function() {

    it('should be created', function() {

        pluginchat = new CE.Chat('pluginchat' + new Date().getTime());
        pluginchat2 = new CE.Chat('pluginchat' + new Date().getTime());

        pluginchat.plugin(mute({}));
        pluginchat2.plugin(mute({}));

    });

    it('should be muted', function(done) {

        pluginchat.muter.mute(CE.me);

        pluginchat.on('message2', (payload) => {
            assert.fail();
        });

        pluginchat.on('$.muter.eventRejected', (payload) => {
            done();
        });

        pluginchat.emit('message2', 'test');

    });

    it('should not be muted', function(done) {

        pluginchat2.on('message2', (payload) => {
            assert.fail();
        });

        pluginchat2.emit('message2', 'test');

        done();

    });

});
