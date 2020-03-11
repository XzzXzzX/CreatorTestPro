/*
 * @Author: Xuan
 * @Description: 旋转移动动作，转盘动画 (延时动作，继承于cc.ActionInterval)
 * @Date: 2020-03-11 17:11:58
 */

cc.RunTurntable = cc.Class({
    name: 'cc.RunTurntable',
    extends: cc.ActionInterval,
    properties: {
        _posList: null,
        _startPosIndex: null,
        _endPosIndex: null,
        _round: null,
        _deltaPosIndex: null,
        _timePassed: null,
    },

    /**
     * 
     * @param {Number} duration(持续时间) duration in seconds
     * @param {[Vec2]} posList(坐标列表)
     * @param {Vec2} endPos(终点坐标)
     * @param {Number} round(圈数)
     */
    ctor(duration, posList, endPosIndex, round) {
        this._timePassed = 0;
        this._startPosIndex = null;
        posList !== undefined && posList.length > 0 && cc.RunTurntable.prototype.initWithDuration.call(this, duration, posList, endPosIndex, round);
    },

    /*
     * Initializes the action.
     * @param {Number} duration(持续时间) duration in seconds
     * @param {[Vec2]} posList(坐标列表)
     * @param {Vec2} endPos(终点坐标)
     * @param {Number} round(圈数)
     * @return {Boolean}
     */
    initWithDuration(duration, posList, endPosIndex, round) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this._posList = posList;
            this._endPosIndex = endPosIndex;
            this._round = round;
            return true;
        }
        return false;
    },

    clone() {
        var action = new cc.RunTurntable();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._posList, this._endPosIndex);
        return action;
    },

    startWithTarget(target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._timePassed = 0;
        if (!this._startPosIndex) {
            this._startPosIndex = this._computeCurPos();
        }
        var round = this._posList.length;
        var lastRoundSteps;
        if (this._endPosIndex === this._startPosIndex) {
            lastRoundSteps = round;
        } else {
            lastRoundSteps = (round + this._endPosIndex - this._startPosIndex) % round;
        }
        this._deltaPosIndex = this._round * round + lastRoundSteps;
    },

    /**
     * 距离的平方
     * @param {*} a 
     * @param {*} b 
     */
    distanceSQ: function (a, b) {
        return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
    },

    _computeCurPos() {
        var pos = this.target.getPosition();
        for (var i = 0; i < this._posList.length; i++) {
            var ipos = this._posList[i];
            if (this.distanceSQ(pos, ipos) <= 4) {
                return i;
            }
        }
    },

    update(dt) {
        dt = this._computeEaseTime(dt);
        if (!!this.target) {
            var targetPos = this._startPosIndex + Math.floor(this._deltaPosIndex * dt);
            var position = this._posList[targetPos % this._posList.length];
            if (position.x !== this.target.x || position.y !== this.target.y) {
                // td.EventUtil.dispatchEvent(td.EventNameEnum.PLAY_SOUND, td.SoundEnum.Roulette);
            }
            this.target.setPosition(position);
        }
    },

    reverse() {
        if (!this._startPosIndex) {
            this._startPosIndex = this._computeCurPos();
        }
        var endPosIndex = this._startPosIndex;
        var posList = this._posList.reverse();
        var action = new cc.RunTurntable(this._duration, posList, endPosIndex, this._round);
        action._startPosIndex = this._endPosIndex;

        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    }
});