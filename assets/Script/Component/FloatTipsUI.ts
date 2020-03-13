/**
 * xuan
 * 2020-3-9 11:53:54
 * 浮动文字UI
 */
const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu('MyComponent/Component/FloatTipsUI')
export default class FloatTipsUI extends cc.Component {

    @property(cc.Label)
    labTip: cc.Label = null;

    public static showTips(parentNode: cc.Node, prama: string): void {
        // 对应的ui预制件资源需要预先加载 
        // cc.loader.loadRes('prefabs/CommonView/FloatTipsUI', cc.Prefab);
        let tipsNode: cc.Node = cc.loader.getRes('prefabs/CommonView/FloatTipsUI');
        tipsNode = cc.instantiate(tipsNode);
        let cmp: FloatTipsUI = tipsNode.getComponent(FloatTipsUI);
        cmp.setData(prama);
        cmp.show();

        tipsNode.position = cc.Vec2.ZERO;
        parentNode.addChild(tipsNode, 100);
        var children = parentNode.children;
        for (var i = 0; i < children.length; i++) {
            children[i].y += (children[i].height + 5);
        }
    }

    setData(str: string): void {
        this.labTip.string = str;
    }

    show(seconds?) {
        this.node.opacity = 255;
        this.node.x = cc.winSize.width / 2;
        this.node.y = cc.winSize.height / 2 + 25;
        let delay = cc.delayTime(seconds || 1.5);
        let moveBy = cc.moveBy(1, cc.v2(0, this.node.height * 3));
        let fadeOut = cc.fadeOut(1);
        let seq = cc.sequence(delay, cc.spawn(moveBy, fadeOut), cc.callFunc(this._dismiss, this));
        this.node.runAction(seq);
    }

    _dismiss() {
        this.node.stopAllActions();
        this.node.removeFromParent();
    }
}