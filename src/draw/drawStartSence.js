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
        this.sence_bg = ""
        this.first_text = ""
        this.next_btn = ""
        this.next_top_btn = ""

        this.textArr = [
            "十八世纪\n德国数理大师莱布尼兹发现了二进制",
            "这个由0和1组成的数字电路\n打开了一个奇幻而精分的世界",
            "由于特殊的算法\n在这个二进制世界里",
            "一个简单的小数会被编译成无限的0和1",
            "而这些无限的0和1\n就是你要面临的每重关卡",
            "记住,你要不留余力的把数字变成1",
            "究竟谁？\n才是主宰数字的主人",
            "FROM ZERO",
            "TO ONE",
        ]
        this.isShowing = false

        this.timeLine=""


        this.init()
    }
    init() {
        this.showStartSence()
    }

    /**
     * 绘制画布
     */

    // 绘制背景
    drawBg() {
        // 开始的场景
        this.sence_bg = new Laya.Sprite();
        this.sence_bg.size(750, Browser.height);
        Laya.stage.addChild(this.sence_bg);
        this.sence_bg.loadImage('assets/images/sence-0_bg.png');
        this.sence_bg.alpha = 0;
        Tween.to(this.sence_bg, {
            alpha: 1
        }, 500, Ease.linearIn, null, 200)
        // 文字的动画过场
        this.drawText(this.textArr[0]);
        let i = 1;
        let textInterval = setInterval(() => {
            // console.log(i)
            this.drawText(this.textArr[i], i);
            i++;
            if (i > this.textArr.length - 1) clearInterval(textInterval)
        }, 5000)

        if (Laya.LocalStorage.getItem('realLevel') >= 0) {
            this.drawNextTopBtn()
        }
    }
    // 绘制顶部文字
    drawText(textContent, index) {
        if (!this.first_text) {
            this.first_text = new Text()
            this.first_text.color = "#fff"
            this.first_text.fontSize = 35
            this.first_text.width = 600;
            this.first_text.align = "center";
            this.first_text.leading = 20;
            this.first_text.x = 75
            this.first_text.y = 200
            this.first_text.alpha = 0;
            Laya.stage.addChild(this.first_text);
        }
        this.first_text.text = textContent;
        // 如果是最后一个则不消失且显示下一步按钮
        if (index == this.textArr.length - 1) {
            var timeLine = new TimeLine();
            timeLine.addLabel("show", 0).to(this.first_text, { alpha: 1 }, 1000, null, 1000)
            timeLine.play(0, false);
            this.drawNextBtn()
        } else {
            this.timeLine = new TimeLine();
            this.timeLine.addLabel("show", 0).to(this.first_text, { alpha: 1 }, 1000, null, 2000)
                .addLabel("hidden", 0).to(this.first_text, { alpha: 0 }, 1000, null, 1000)
            this.timeLine.play(0, false);
        }

    }
    // 绘制下一部按钮
    drawNextBtn() {
        this.next_btn = new Sprite();
        this.next_btn.pos(304, 900);
        this.next_btn.size(142, 106);
        Laya.stage.addChild(this.next_btn);
        this.next_btn.loadImage('assets/images/next_btn.png');
        this.next_btn.on(Event.CLICK, this, this.clickNext);
        this.next_btn.zOrder = 2
        this.next_btn.alpha = 0
        // 缓慢显示
        var timeLine = new TimeLine();
        timeLine.addLabel("show", 0).to(this.next_btn, { alpha: 1 }, 1000, null, 1000);
        timeLine.play(0, false);
    }

    drawNextTopBtn() {
        this.next_top_btn = new Sprite();
        this.next_top_btn.zOrder = 3;
        this.next_top_btn.alpha = 0;
        DRAW.drawRoundedRectangle(this.next_top_btn, 0, 0, 150, 80, 40, '#fff');
        this.next_top_btn.size(150,80)
        this.next_top_btn.pos(570,30)
        Laya.stage.addChild(this.next_top_btn)
        this.next_top_btn.on(Event.CLICK, this, this.clickNext);
        Tween.to(this.next_top_btn, {
            alpha: 1
        }, 700, Ease.linearIn, null, 1000)
    }

    // 点击进入下一关
    clickNext() {
        this.timeLine.destroy()
        this.clearSp(this.sence_bg)
        this.clearSp(this.first_text)
        this.clearSp(this.next_btn)
        this.clearSp(this.next_top_btn)
        this.isShowing = false;
        SoundManager.stopAllSound();
        let realLevel = Laya.LocalStorage.getItem('realLevel');
        if (realLevel == -1) {
            Laya.LocalStorage.setItem('realLevel', 0);
            $ob.emit('nextGame', true);
        } else {
            $ob.emit('nextGame')
        }
    }

    //显示0关
    showStartSence() {
        if (this.isShowing) return;

        this.drawBg();
        SoundManager.setMusicVolume(0.1);
        SoundManager.playMusic("assets/music/troughts.mp3", 1, null, null, 13);
        // this.drawNextBtn()

        // this.sence_bg.zOrder = 1
        // this.first_text.zOrder = 2
        this.isShowing = true;
    }

    clearSp(sp, alpha = 1) {
        console.log(sp);
        if (!sp) return;
        Tween.from(sp, { alpha: alpha }, 500).to(sp, { alpha: 0 }, 800);
        setTimeout(() => {
            sp.destroy()
        }, 1500);
    }

    /**
     * 逻辑处理
     */
}