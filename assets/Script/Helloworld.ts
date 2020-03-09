import FrameHandleManager from "./Helper/FrameHandleManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

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
}
