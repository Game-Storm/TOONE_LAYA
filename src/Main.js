import DrawGame from './draw/drawPlace'
import DrawHome from './draw/drawHome'

(function () {
    var Sprite = Laya.Sprite;
    var Stage = Laya.Stage;
    var Texture = Laya.Texture;
    var Browser = Laya.Browser;
    var Handler = Laya.Handler;
    var WebGL = Laya.WebGL;
    var Event = Laya.Event;
    var Loader = Laya.Loader;
    var SoundManager = Laya.SoundManager;

    // var pageWidth  = Browser.clientWidth;
    // var pageHeight = Browser.clientHeight;
    var pageWidth = 750;
    var pageHeight = 1334;
    var loadBG, loadTiao;

    (function () {
        // 不支持WebGL时自动切换至Canvas
        Laya.init(pageWidth, pageHeight, WebGL);
        //性能统计面板的调用
        //Laya.Stat.show(0,0);
        Laya.stage.alignV = Stage.ALIGN_MIDDLE;
        Laya.stage.alignH = Stage.ALIGN_CENTER;
        Laya.stage.screenAdaptationEnabled = false;
        Laya.stage.scaleMode = "fixedwidth";
        Laya.stage.bgColor = "#4c58ae";
        downLoadMedia()
    })();

    // 加载文件以及滚动条
    function downLoadMedia() {
        //加载静态文件资源
        var assets = ['assets/comp/btn_close.png'];
        // 加载images下的文件
        let imgNames = ['item-0-active.png', 'item-0.png', 'item-1-active.png', 'item-1-lock.png', 'item-1.png', 'refresh_btn.png', 'return_btn.png', 'game-bg.png', 'top_num_screen.png', 'card-bg.png'];
        imgNames.map(item => {
            assets.push({
                url: 'assets/images/' + item,
                type: Loader.IMAGE  // type类型一定要加！！
            });
        })
        // 加载动画库里的素材
        let imgAniNames = ['card.png'];
        imgAniNames.map(item => {
            assets.push({
                url: 'images/' + item,
                type: Loader.IMAGE  // type类型一定要加！！
            });
        })

        // 添加音效
        let soundNames = ['shua.mp3', 'dong.mp3']
        soundNames.map(item => {
            assets.push({
                url: 'assets/music/' + item,
                type: Loader.SOUND
            });
        })

        // console.log(assets)
        //加载
        Laya.loader.load(assets, Handler.create(this, init), Handler.create(this, onLoading, null, false), Loader.TEXT);
        // 侦听加载失败
        Laya.loader.on(Event.ERROR, this, onError);

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //绘制进度条
        loadBG = new Sprite();
        Laya.stage.addChild(loadBG);
        var path = [
            ["moveTo", 8, 0], //画笔的起始点，
            ["arcTo", 0, 0, 0, 8, 8], //p1（500,0）为夹角B，（500,30）为端点p2
            ["arcTo", 0, 16, 8, 16, 8],
            ["lineTo", 200, 16],
            ["arcTo", 208, 16, 208, 8, 8],
            ["arcTo", 208, 0, 200, 0, 8],
            ["lineTo", 8, 0]
        ];
        //绘制圆角矩形
        loadBG.graphics.drawPath((pageWidth - 208) / 2, Math.round(pageHeight / 2.5) - 10, path, { fillStyle: "#cbefff" });
        loadTiao = new Sprite();
        Laya.stage.addChild(loadTiao);
        var path = [
            ["moveTo", 4, 0], //画笔的起始点，
            ["arcTo", 0, 0, 0, 4, 4], //p1（500,0）为夹角B，（500,30）为端点p2
            ["arcTo", 0, 8, 4, 8, 4],
            ["lineTo", 4, 8],
            ["arcTo", 8, 8, 8, 4, 4],
            ["arcTo", 8, 0, 4, 0, 4],
            ["lineTo", 4, 0]
        ];
        loadTiao.graphics.drawPath((pageWidth - 208) / 2 + 4, Math.round(pageHeight / 2.5) - 6, path, { fillStyle: "#4892b3" });
    }

    //加载静态资源完成，开始初始化游戏
    function init() {
        clearLoading()
        console.log('初始化游戏');
        console.log(DrawGame);
        // new DrawGame();
        new DrawHome();
        // Laya.stage.on(Event.KEY_DOWN, this, function(){
        //     console.log('按下了')
        // });

        // 播放bgm
        // SoundManager.playMusic("http://p70gzm2sm.bkt.clouddn.com/troughts.mp3", 1, new Handler(this, onComplete));
    }

    // 
    function onComplete() {
        console.log("播放完成");
    }

    // 加载进度侦听器
    function onLoading(progress) {
        progress = Math.round(progress * 100);
        //console.log("加载进度: " + progress);
        // loadTiao.graphics.clear();
        var OnePercent = (192 - 4) / 100;//每百分之一进度的距离
        var addPercent = Math.round(progress * OnePercent);//需要增加的百分比
        var path = [
            ["moveTo", 4, 0], //画笔的起始点，
            ["arcTo", 0, 0, 0, 4, 4], //p1（500,0）为夹角B，（500,30）为端点p2
            ["arcTo", 0, 8, 4, 8, 4],
            ["lineTo", 192, 8],
            ["arcTo", 200, 8, 200, 4, 4],
            ["arcTo", 200, 0, 192, 0, 4],
            ["lineTo", 4, 0]
        ];
        var path = [
            ["moveTo", 4, 0], //画笔的起始点，
            ["arcTo", 0, 0, 0, 4, 4], //p1（500,0）为夹角B，（500,30）为端点p2
            ["arcTo", 0, 8, 4, 8, 4],
            ["lineTo", 4 + addPercent, 8],
            ["arcTo", 8 + addPercent, 8, 8 + addPercent, 4, 4],
            ["arcTo", 8 + addPercent, 0, 4 + addPercent, 0, 4],
            ["lineTo", 4, 0]
        ];
        loadTiao.graphics.drawPath((pageWidth - 208) / 2 + 4, Math.round(pageHeight / 2.5) - 6, path, { fillStyle: "#4892b3" });
    }

    // 清除滚动条
    function clearLoading() {
        loadTiao.graphics.clear();
        loadBG.graphics.clear();
    }

    //打印加载失败日志
    function onError(err) {
        console.log("加载失败: " + err);
    }

})();