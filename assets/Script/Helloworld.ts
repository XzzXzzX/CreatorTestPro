import FrameHandleManager from "./Helper/FrameHandleManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Node)
    nodeTest: cc.Node = null;

    onLoad(): void {
        FrameHandleManager.getInstace().init();
    }

    start() {
        // init logic
        this.label.string = this.text;

        this.testFrameHanle();
    }

    testFrameHanle(): void {
        FrameHandleManager.getInstace().addFrameTask(this.testFrame1.bind(this));
        FrameHandleManager.getInstace().addFrameTask(this.testFrame2.bind(this), 2);
        FrameHandleManager.getInstace().addFrameTask(this.testFrame2.bind(this), { a: 'aa', b: 10 });
    }

    testFrame1(): void {
        cc.log("testFrame1 _____ ");
    }


    testFrame2(prama: number): void {
        cc.log("testFrame2 _____ prama: ", prama);
    }

    testFrame3(param: any): void {
        cc.log("testFrame3 _____ prama: ", param);
    }

    testAni(): void {
        let p1: cc.Vec2 = cc.v2(10, 10);
        let p2: cc.Vec2 = cc.v2(20, 40);
        let p = p2.sub(p1);
        let ac: cc.ActionInterval = cc.moveTo(1, p);
        this.nodeTest.runAction(ac);
    }

    onTestBtnClick(): void {
        // this.playMoveAction();
        this._testRunTable();
    }

    _posCfgList = [
        cc.v2(-100, 100),
        cc.v2(0, 100),
        cc.v2(100, 100),
        cc.v2(100, 0),
        cc.v2(100, -100),
        cc.v2(0, -100),
        cc.v2(-100, -100),
        cc.v2(-100, 0),
    ];

    //#region 大富翁移动
    _getMovePos(): any[] {
        let nextIndex: number = (this._curIndex + 1) % this._posCfgList.length;
        let curDiceNum: number = 5;
        let maxLen: number = this._curIndex + curDiceNum;
        let movePos: any[] = [];
        for (let index = this._curIndex + 1; index <= maxLen; index++) {
            let realIndex: number = index % this._posCfgList.length;
            const pos: cc.Vec2 = this._posCfgList[realIndex];
            movePos.push(pos);
        }

        return movePos;
    }

    _curIndex: number = 1;
    _posList: any[] = [];

    playMoveAction(): void {
        this._posList = this._getMovePos();
        this.doMove(this.nodeTest, this._posList.shift());
        this._curIndex++;
        this._curIndex = this._curIndex % this._posCfgList.length;
    }

    doMove(node: cc.Node, pos: cc.Vec2): void {
        if (null == node || null == pos) {
            return;
        }
        let act: cc.ActionInterval = cc.sequence(cc.moveTo(0.5, pos), cc.delayTime(0.2), cc.callFunc(this._onMoveCb.bind(this)));
        node.runAction(act);
    }

    _onMoveCb(): void {
        if (this._posList && this._posList.length > 0) {
            this.doMove(this.nodeTest, this._posList.shift());
            this._curIndex++;
            this._curIndex = this._curIndex % this._posCfgList.length;
        } else {

        }
    }
    //#endregion

    /** 测试转盘 */
    _testRunTable(): void {
        var action = new cc.RunTurntable(6, this._posCfgList, 3, 2);
        var easeAction = action.easing(cc.easeSineOut());
        this.nodeTest.runAction(easeAction);
    }
}
