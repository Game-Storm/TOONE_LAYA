// 主页相关逻辑以及总入口
import DRAW from '../lib/graphics';
import GameConfig from "../GameConfig";
import { getNum, getBlock, getSkinBg, skinLevel } from "../lib/gameData";
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

export default class DrawSkin {
    constructor() {
        this.sence_bg = ""
        this.top_bg = ""
        this.top_btn = ""
        this.items_bg = []
        this.itemLists = []
        this.itemTextLists = []
        this.init();
    }

    init() {
        this.drawBg();
        setTimeout(() => {
            this.drawTop();
            this.drawItemsBg();
            this.drawItems();
        }, 800);
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
        this.sence_bg.loadImage('assets/images/game_bg1.png');
        this.sence_bg.alpha = 0;
        this.sence_bg.zOrder = 1;
        Tween.to(this.sence_bg, {
            alpha: 1
        }, 500, Ease.linearIn, null, 200)
    }
    // 绘制顶部返回
    drawTop() {
        this.top_bg = new Sprite();
        Laya.stage.addChild(this.top_bg);
        this.top_bg.graphics.drawRect(0, 0, 750, 136, '#4d2f8a');
        this.top_bg.alpha = 0;
        this.top_bg.zOrder = 1;
        Tween.to(this.top_bg, { alpha: 0.5 }, 500, Ease.linearIn, null, 200);

        this.top_btn = new Sprite();
        Laya.stage.addChild(this.top_btn)
        this.top_btn.loadImage('assets/images/return_btn.png');
        this.top_btn.pos(20, 20);
        this.top_btn.size(142, 96);
        this.top_btn.on(Event.CLICK, this, this.returnHome);
        this.top_btn.zOrder = 2;
        this.top_btn.alpha = 0;
        Tween.to(this.top_btn, { alpha: 1 }, 500, Ease.linearIn, null, 200);
    }

    // 绘制区块
    drawItemsBg(closewAni) {
        console.log('ok')
        for (let i = 0; i < 6; i++) {
            let col = i > 2 ? 1 : 0;
            let row = i - col * 3;
            this.items_bg[i] = new Sprite();
            this.items_bg[i].alpha = 0;
            this.items_bg[i].zOrder = 3;
            Laya.stage.addChild(this.items_bg[i]);
            this.items_bg[i].size(220, 323);
            this.items_bg[i].pos(32 + row * (220 + 17), 172 + col * (323 + 33));
            this.items_bg[i].on(Event.CLICK, this, this.clickBlock, [i]);
            DRAW.drawRoundedRectangle(this.items_bg[i], 0, 0, 220, 323, 15, getSkinBg(i + 1));
            Tween.to(this.items_bg[i], {
                alpha: 0.4
            }, 500, Ease.linearIn, null, 200);
        }

    }
    // 绘制方块
    drawItems() {
        for (let i = 0; i < 6; i++) {
            let col = i > 2 ? 1 : 0;
            let row = i - col * 3;
            // 绘制色块
            this.itemLists[i] = new Sprite()
            Laya.stage.addChild(this.itemLists[i]);
            this.itemLists[i].loadImage(`assets/images/block-mini/item-1-active${i == 0 ? '' : '-' + i}.png`);
            this.itemLists[i].size(157, 157);
            this.itemLists[i].pos(32 + row * 237 + 33, 172 + col * 356 + 33);
            this.itemLists[i].zOrder = 4;
            this.itemLists[i].alpha = 0;
            Tween.to(this.itemLists[i], { alpha: 1 }, 500, Ease.linearIn, null, 200);

            this.itemTextLists[i] = new Text();
            Laya.stage.addChild(this.itemTextLists[i]);
            let lock = Laya.LocalStorage.getItem('realLevel') < (skinLevel[i] - 1);
            this.itemTextLists[i].text = `${skinLevel[i]}关\n${lock ? '未解锁' : '已解锁'}`;
            this.itemTextLists[i].width = 157;
            this.itemTextLists[i].x = 32 + row * 237 + 33;
            this.itemTextLists[i].y = 172 + col * 356 + 215;
            this.itemTextLists[i].zOrder = 4;
            this.itemTextLists[i].alpha = 0;
            this.itemTextLists[i].color = lock ? '#6b6a6a' : '#fff';
            this.itemTextLists[i].fontSize = 30;
            this.itemTextLists[i].align = "center";
            this.itemTextLists[i].leading = 17;
            Tween.to(this.itemTextLists[i], { alpha: 1 }, 500, Ease.linearIn, null, 200);
        }
    }

    /**
     * 逻辑处理
     */

    // 点击色块
    clickBlock(i) {
        console.log('zhixing')
        let lock = Laya.LocalStorage.getItem('realLevel') < (skinLevel[i] - 1);
        if (lock) return;
        let oldi = Laya.LocalStorage.getItem('skin') - 1;
        if (oldi == -1) oldi = 0;
        Laya.LocalStorage.setItem("skin", i + 1);
        this.items_bg[i].graphics.clear();
        // console.log(oldi);
        if (oldi >= 0) this.items_bg[oldi].graphics.clear();
        DRAW.drawRoundedRectangle(this.items_bg[i], 0, 0, 220, 323, 15, getSkinBg(i + 1));
        DRAW.drawRoundedRectangle(this.items_bg[oldi], 0, 0, 220, 323, 15, getSkinBg(oldi + 1));
    }
    // 返回 Home
    returnHome() {
        $ob.emit('returnHome')
        this.clearPlaceAll()
        // new DrawHome()
    }
    // 清除画布
    clearPlaceAll() {
        this.clearSp(this.sence_bg)
        this.clearSp(this.top_bg)
        this.clearSp(this.top_btn)

        for (let i = 0; i < 6; i++) {
            this.clearSp(this.items_bg[i], 0.4)
            this.clearSp(this.itemTextLists[i])
            this.clearSp(this.itemLists[i])
        }
    }
    // 封装clear的事件
    clearSp(sp, alpha = 1) {
        // console.log(sp);
        if (!sp) return;
        Tween.from(sp, { alpha: alpha }, 500).to(sp, { alpha: 0 }, 800);
        setTimeout(() => {
            sp.destroy()
        }, 1500);
    }
}