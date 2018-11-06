// 封装各种形状
export default {
    /**
     * @param sp Sprite实例
     * @param x 起始x坐标
     * @param y 起始y坐标
     * @param width 总长
     * @param height 总高
     * @param r 圆角半径
     * @param options 配置项
     */
    drawRoundedRectangle: function (sp, x, y, width, height, r, fill) {
        console.log(width, height)
        var relWidth = width - 2 * r;
        var relHeight = height - 2 * r;
        sp.graphics.drawPath(x, y, [
            ["moveTo", r, 0],
            ["lineTo", width - r, 0],
            ["arcTo", width, 0, width, r, r],
            ["lineTo", width, height - r],
            ["arcTo", width, height, width - r, height, r],
            ["lineTo", r, height],
            ["arcTo", 0, height, 0, height - r, r],
            ["lineTo", 0, r],
            ["arcTo", 0, 0, r, 0, r],
            ["closePath"]
        ], {
                fillStyle: fill || '#ff0000'
            }, )
    }
}

