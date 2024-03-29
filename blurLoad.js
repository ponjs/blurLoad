/*
*    <figure class="blur-load" data-width="1920" data-height="1080" data-thumb="thumb.png" data-src="origin.png"></figure>
*
*    class: 必须为blur-load
*    data-width: 图像宽度比
*    data-height: 图像高度比
*    data-thumb: 缩略图地址
*    data-src: 原图地址
*/

((window) => {

    'use strict';

    // 在head里声明style样式
    let styleElem = document.createElement('style'),
        styleText = '.blur-load{position:relative;overflow:hidden}.blur-load div{transition:background-color .5s ease-in}.blur-load img{position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;transition:opacity .5s ease-in}.blur-load .thumb-loaded{opacity:1;filter:blur(10px);transform:scale(1)}.blur-load .origin-loaded{opacity:1}.blur-load .thumb-hidden{opacity:0}';
         
    styleElem.type = 'text/css';

    try{
        styleElem.appendChild(document.createTextNode(styleText));
    }catch(err){
        styleElem.styleSheet.cssText = styleText;
    }

    document.getElementsByTagName('head')[0].appendChild(styleElem);

    // 通过class获取所有元素
    let containers = document.getElementsByClassName('blur-load');

    // 将class添加到相应的元素
    let setStyle = (elem, className) => {
        if (elem.classList) {
            elem.classList.add(className);
        } else {
            elem.className += ` ${className}`;
        }
    };

    // 获取图片主颜色
    let getAverageRGB = (imgElem) => {        
        let blockSize = 5, // 仅每5像素访问一次
            defaultRGB = 'rgb(0, 0, 0)', // 对于不支持的环境声明默认值
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = {r: 0, g: 0, b: 0},
            colorRGB,
            count = 0;
            
        if (!context) {
            return defaultRGB;
        }
        
        height = canvas.height = imgElem.naturalHeight || imgElem.offsetHeight || imgElem.height;
        width = canvas.width = imgElem.naturalWidth || imgElem.offsetWidth || imgElem.width;
        
        context.drawImage(imgElem, 0, 0);
        
        try {
            data = context.getImageData(0, 0, width, height);
        } catch(err) {
            return defaultRGB;
        }
        
        length = data.data.length;
        
        while ( (i += blockSize * 4) < length ) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i+1];
            rgb.b += data.data[i+2];
        }
        
        rgb.r = ~~(rgb.r/count);
        rgb.g = ~~(rgb.g/count);
        rgb.b = ~~(rgb.b/count);

        colorRGB = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
        
        return colorRGB;
    };

    // 主方法
    let blurLoad = () => {
        containers = [...containers];

        if (containers.length === 0) {
            throw new Error('You have\'t add any photo!');
        }
        
        containers.forEach((elem) => {
            let thumbSrc = elem.getAttribute('data-thumb'),
                originSrc = elem.getAttribute('data-src'),
                elemWidth = elem.getAttribute('data-width') || elem.offsetWidth,
                elemHeight = elem.getAttribute('data-height') || elem.offsetHeight,
                elemFill = document.createElement('div');

            // 设置padding-bottom纵横比填充以避免闪烁
            elemFill.style.paddingBottom = `${(elemHeight / elemWidth) * 100}%`;
            elem.appendChild(elemFill);
            
            let origin = new Image();
            origin.src = originSrc;

            // 判断原图是否已加载
            if (origin.complete || origin.naturalWidth || origin.width) {
                elemFill.style.backgroundColor = getAverageRGB(origin);
                origin.onload = () => {
                    origin.style.transition = 'none';
                    setStyle(origin, 'origin-loaded');
                };
                elem.appendChild(origin);
            } else {
                let thumb = new Image();
                thumb.src = thumbSrc;
                thumb.onload = () => {
                    elemFill.style.backgroundColor = getAverageRGB(thumb);
                    setStyle(thumb, 'thumb-loaded');
                };
                elem.appendChild(thumb);

                origin.onload = () => {
                    setStyle(origin, 'origin-loaded');
                    setStyle(thumb, 'thumb-hidden');
                };
                elem.appendChild(origin);
            }            
        });
    };

    window.blurLoad = blurLoad;

})(window);