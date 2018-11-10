// 绘制关卡开始的过场动画
// 主页相关逻辑以及总入口
import DRAW from '../lib/graphics';
import GameConfig from "../GameConfig";
import { getNum } from "../lib/gameData";
import DrawGame from "./drawPlace";

var Sprite = Laya.Sprite;
var Stage = Laya.Stage;
var Browser = Laya.Browser;
var Handler = Laya.Handler;
var WebGL = Laya.WebGL;
var Event = Laya.Event;
var Loader = Laya.Loader;
var Tween = Laya.Tween;
var Ease = Laya.Ease;
var SoundManager = Laya.SoundManager;
var Text = Laya.Text;
var GlowFilter = Laya.GlowFilter;
var TimeLine = Laya.TimeLine;

export default class DrawHome {
    constructor() {
        // sprite
        this.bg = ""
        this.init()
    }
    init() {
        this.drawBackground()
    }

    /**
     * 绘制画布
     */

    //绘制背景
    drawBackground() {
        console.log('ok')
        this.bg = new Sprite();
        this.bg.size(750, 1334);
        this.bg.alpha = 0;
        this.bg.zOrder = 2;
        Laya.stage.addChild(this.bg);
        this.bg.graphics.drawRect(0, 0, 750, 1334, '#aaa');
        var timeLine = new TimeLine();
        timeLine.addLabel("big", 0).to(this.bg, { alpha: 1}, 1000, null, 0);
        timeLine.play(0);
    }
    // 绘制关卡的小数
    drawLevelText(){

    }


    /**
     * 逻辑处理
     */
}