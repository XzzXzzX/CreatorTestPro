// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * xuan
 * 2020-3-9 10:39:55
 * 分帧处理管理类
 */

const { ccclass, property } = cc._decorator;

@ccclass
export class FrameHandleTaskModel {
    _params: any = null;
    _callback: any = null;
    constructor(callback: any, params?: any) {
        this._params = params;
        this._callback = callback;
    }

    excu(): void {
        if (this._callback) {
            this._callback(this._params);
        }
    }
}

@ccclass
export default class FrameHandleManager {

    static _instance: FrameHandleManager = null;

    /** 每隔多少帧运行一次 */
    LIMIT_FRAME: number = 1;

    _limitFrame: number = 1;

    /** 分帧任务列表 */
    _taskList: any[] = [];

    public static getInstace(): FrameHandleManager {
        if (!this._instance) {
            this._instance = new FrameHandleManager();
        }
        return this._instance;
    }

    init(): void {
        let sche: cc.Scheduler = cc.director.getScheduler();
        sche.schedule(this.update, this, 0, false);
    }

    update(): void {
        this._limitFrame++;
        if (this._limitFrame < this.LIMIT_FRAME) {
            return;
        }
        if (!this._taskList || this._taskList.length <= 0) {
            return;
        }
        this._limitFrame = 1;

        let task: any = this._taskList.shift();
        if (task) {
            task.excu();
        }
    }

    /**
     * 添加分帧任务
     * @param params 回调参数
     * @param callback 回调方法
     */
    addFrameTask(callback: any, params?: any): void {
        let task: FrameHandleTaskModel = new FrameHandleTaskModel(callback, params);
        this._taskList.push(task);
    }
}
