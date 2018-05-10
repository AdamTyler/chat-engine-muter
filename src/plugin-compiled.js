'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Prevent a {@link Chat} from emitting events from a specific {@link User}.
* @module chat-engine-mute
* @requires {@link ChatEngine}
*/

/**
* @function
* @example
* userObject = chat.users['user-uuid'];
* chat.plugin(ChatEngineCore.plugin['chat-engine-mute']());
*
* // mute user
* chat.muter.mute(userObject);
*
* // unmute user
* chat.muter.unmute(userObject);
*
* // mute status
* chat.muter.isMuted(userObject);
* // false
*/
module.exports = function () {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var extension = function () {
        function extension() {
            _classCallCheck(this, extension);
        }

        _createClass(extension, [{
            key: 'construct',
            value: function construct() {
                this.muted = {};
            }

            /**
            * Check if a {@link User} is muted within the {@link Chat}.
            * @method muter"."isMuted
            * @ceextends Chat
            */

        }, {
            key: 'isMuted',
            value: function isMuted(user) {
                var muted = this.muted[user.uuid] || false;
                return muted;
            }

            /**
            * Prevent all events emitted from this {@link User} from reaching {@link Chat}.
            * @method muter"."mute
            * @ceextends Chat
            */

        }, {
            key: 'mute',
            value: function mute(user) {
                this.muted[user.uuid] = true;
            }

            /**
            * Allow events from a {@link User} to be emitted again.
            * @method muter"."unmute
            * @ceextends Chat
            */

        }, {
            key: 'unmute',
            value: function unmute(user) {
                this.muted[user.uuid] = false;
            }
        }]);

        return extension;
    }();

    ;

    var muteFilter = function muteFilter(payload, next) {

        var isOwnEvent = false;

        if (payload && payload.event && payload.event.indexOf('$.muter') > -1) {
            isOwnEvent = true;
        }

        if (!isOwnEvent && payload && payload.sender && payload.chat && payload.chat.muter && payload.chat.muter.isMuted(payload.sender)) {

            payload.chat.trigger('$.muter.eventRejected', {
                originalEvent: payload.event,
                sender: payload.sender.uuid,
                chat: payload.chat.objectify()
            });

            next(true); // reject message and stop it from emitting
        } else {
            next(null, payload);
        }
    };

    return {
        namespace: 'muter',
        extends: {
            Chat: extension
        },

        middleware: {
            on: {
                '*': muteFilter
            }
        }
    };
};
