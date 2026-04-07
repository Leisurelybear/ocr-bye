function textToImg() {

    let rowWordNum = parseInt(document.getElementById("word_num").value)
    if (rowWordNum < 10) {
        rowWordNum = 10
    }
    if (rowWordNum > 40) {
        rowWordNum = 40
    }
    let wordSize = parseInt(document.getElementById("word_size").value)
    if (wordSize <= 0) {
        wordSize = 10
    }

    // let imgSizeX = document.getElementById("img_size_x").value
    // let imgSizeY = document.getElementById("img_size_y").value

    let wordRotateMin = parseInt(document.getElementById("rotate_min").value)
    let wordRotateMax = parseInt(document.getElementById("rotate_max").value)
    console.log("角度范围：", wordRotateMin, wordRotateMax)

    let line_nums = parseInt(document.getElementById("line_nums").value)
    if (line_nums < 0 || Number.isNaN(line_nums)) {
        line_nums = 0
    }

    const enableRandomSize = document.getElementById("enable_random_size").checked
    let sizeDeltaMin = parseInt(document.getElementById("size_delta_min").value)
    let sizeDeltaMax = parseInt(document.getElementById("size_delta_max").value)
    if (Number.isNaN(sizeDeltaMin)) sizeDeltaMin = 0
    if (Number.isNaN(sizeDeltaMax)) sizeDeltaMax = 0
    if (sizeDeltaMin > sizeDeltaMax) {
        const tmp = sizeDeltaMin
        sizeDeltaMin = sizeDeltaMax
        sizeDeltaMax = tmp
    }

    const enableRandomLineWidth = document.getElementById("enable_random_line_width").checked
    let lineWidthMin = parseFloat(document.getElementById("line_width_min").value)
    let lineWidthMax = parseFloat(document.getElementById("line_width_max").value)
    if (Number.isNaN(lineWidthMin)) lineWidthMin = 1
    if (Number.isNaN(lineWidthMax)) lineWidthMax = 1
    if (lineWidthMin > lineWidthMax) {
        const tmp = lineWidthMin
        lineWidthMin = lineWidthMax
        lineWidthMax = tmp
    }
    lineWidthMin = Math.max(0.1, lineWidthMin)
    lineWidthMax = Math.max(0.1, lineWidthMax)

    const enableMartian = document.getElementById("enable_martian").checked
    const enableStretch = document.getElementById("enable_stretch").checked
    let stretchXMin = parseFloat(document.getElementById("stretch_x_min").value)
    let stretchXMax = parseFloat(document.getElementById("stretch_x_max").value)
    let stretchYMin = parseFloat(document.getElementById("stretch_y_min").value)
    let stretchYMax = parseFloat(document.getElementById("stretch_y_max").value)
    if (Number.isNaN(stretchXMin)) stretchXMin = 1
    if (Number.isNaN(stretchXMax)) stretchXMax = 1
    if (Number.isNaN(stretchYMin)) stretchYMin = 1
    if (Number.isNaN(stretchYMax)) stretchYMax = 1
    if (stretchXMin > stretchXMax) {
        const tmp = stretchXMin
        stretchXMin = stretchXMax
        stretchXMax = tmp
    }
    if (stretchYMin > stretchYMax) {
        const tmp = stretchYMin
        stretchYMin = stretchYMax
        stretchYMax = tmp
    }
    stretchXMin = Math.max(0.5, stretchXMin)
    stretchXMax = Math.max(0.5, stretchXMax)
    stretchYMin = Math.max(0.5, stretchYMin)
    stretchYMax = Math.max(0.5, stretchYMax)

    // 找到文本框内容
    let text = document.getElementById("txt_content").value
    text = text.trim()
    if (enableMartian) {
        text = convertToMartianText(text)
    }
    let words = text.split("")

    // 找到 预转换的内容
    let toImgElement = document.getElementById("toimg")
    toImgElement.innerHTML = ""
    toImgElement.removeAttribute("hidden")




    //创建子节点
    let tb = document.createElement("table")

    // 这么多字总共需要多少行
    let rows = Math.ceil(words.length / rowWordNum)
    let wordIndex;
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr")
        const currentRowWordNum = Math.min(rowWordNum, words.length - i * rowWordNum)
        for (let j = 0; j < currentRowWordNum; j++) {
            wordIndex = i * rowWordNum + j
            // console.log(wordIndex, words[j])
            let td = document.createElement("td")
            let innerDiv = document.createElement("div")
            innerDiv.innerText = words[wordIndex]
            // 字體旋轉 + 拉升變形
            const rotateDeg = random(wordRotateMin, wordRotateMax)
            const scaleX = enableStretch ? randomFloat(stretchXMin, stretchXMax) : 1
            const scaleY = enableStretch ? randomFloat(stretchYMin, stretchYMax) : 1

            // 字體大小（可選隨機）
            const sizeDelta = enableRandomSize ? random(sizeDeltaMin, sizeDeltaMax) : 0
            const tmpWordSize = Math.max(1, parseInt(wordSize) + sizeDelta)
            innerDiv.style.cssText = "transform: rotate(" + rotateDeg + "deg) scale(" + scaleX + "," + scaleY + ");font-size: " + tmpWordSize + "px;"


            td.appendChild(innerDiv)
            tr.appendChild(td)
        }
        // words.forEach(function (_, i) {
        //     // 这里可以对单个字进行处理，考虑改颜色，转圈
        // })
        tb.appendChild(tr)
    }

    toImgElement.appendChild(tb)

    // 讓容器尺寸由實際內容決定，避免右側/底部多餘空白
    toImgElement.style.width = "fit-content"
    toImgElement.style.height = "fit-content"

    // 添加橫格綫
    if (document.getElementById("underline").checked){
        const trList = document.querySelectorAll('tr');
        trList.forEach(tr => {
            tr.style.borderBottom = '1px solid #000000';
        });
    }

    // html 转换 canvas，canvas转换图片
    html2canvas(document.getElementById("toimg")).then(function (canvas) {
        let img = document.getElementById("img-base64");
        const context = canvas.getContext("2d")
        for(let i = 0; i < line_nums; i++) {
            // 绘制干扰线
            drawline(canvas, context, i, line_nums, enableRandomLineWidth, lineWidthMin, lineWidthMax)
        }
        const croppedCanvas = cropCanvasTransparentEdge(canvas, 2)
        img.src = croppedCanvas.toDataURL("image/png");
        toImgElement.setAttribute("hidden", true)
    })


}

// 生成随机数
function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

// 生成随机小数
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// 绘制干扰线（按区域分配，保证左中右都有覆盖）
function drawline(canvas, context, index, totalLines, enableRandomLineWidth, lineWidthMin, lineWidthMax) {
    //若省略beginPath，则每点击一次验证码会累积干扰线的条数
    context.beginPath();

    // 将画布横向分成3个区域，优先保证左中右都至少有线
    const segments = Math.min(3, Math.max(1, canvas.width > 0 ? 3 : 1));
    const segmentWidth = canvas.width / segments;
    let segmentIndex = 0;
    if (totalLines <= 1) {
        segmentIndex = 1;
    } else if (totalLines === 2) {
        segmentIndex = index === 0 ? 0 : 2;
    } else {
        segmentIndex = index % segments;
    }
    const startMinX = Math.floor(segmentIndex * segmentWidth);
    const startMaxX = Math.floor((segmentIndex + 1) * segmentWidth) - 1;

    // 起点终点都优先落在当前分区，确保各区域密度更均衡
    const startX = random(startMinX, Math.max(startMinX, startMaxX));
    const startY = random(0, Math.max(0, canvas.height - 1));
    const endX = random(startMinX, Math.max(startMinX, startMaxX));
    const endY = random(0, Math.max(0, canvas.height - 1));

    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.lineWidth = enableRandomLineWidth ? randomFloat(lineWidthMin, lineWidthMax) : 1;
    context.strokeStyle = '#275DB3';
    context.stroke();
}

// 火星文替换（常见字符做随机替换）
function convertToMartianText(text) {
    const martianMap = {
        "的": ["d", "啲", "の"],
        "了": ["叻", "le", "ㄋ"],
        "你": ["伱", "祢", "ní"],
        "我": ["莪", "ω", "偶"],
        "是": ["4", "惿", "si"],
        "不": ["吥", "8", "卟"],
        "很": ["狠", "hen", "哏"],
        "吗": ["嗎", "嘛", "ma"],
        "啊": ["吖", "阿", "a"],
        "爱": ["嗳", "愛", "ai"],
        "这": ["這", "zhe", "媞"],
        "那": ["哪", "那", "na"],
        "人": ["亽", "朲", "ren"],
        "中": ["仲", "ф", "zhong"],
        "国": ["國", "囯", "guo"]
    }

    return text.split("").map(function (ch) {
        if (!martianMap[ch]) {
            return ch
        }
        // 并非100%替换，保留部分原文可读性
        if (Math.random() < 0.35) {
            return ch
        }
        const candidates = martianMap[ch]
        return candidates[random(0, candidates.length - 1)]
    }).join("")
}

// 裁剪透明边，讓輸出圖片更貼合文字區域
function cropCanvasTransparentEdge(canvas, padding) {
    const context = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height
    const imageData = context.getImageData(0, 0, width, height).data

    let minX = width
    let minY = height
    let maxX = -1
    let maxY = -1

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = imageData[(y * width + x) * 4 + 3]
            if (alpha > 0) {
                if (x < minX) minX = x
                if (x > maxX) maxX = x
                if (y < minY) minY = y
                if (y > maxY) maxY = y
            }
        }
    }

    if (maxX < minX || maxY < minY) {
        return canvas
    }

    const extra = Math.max(0, parseInt(padding) || 0)
    minX = Math.max(0, minX - extra)
    minY = Math.max(0, minY - extra)
    maxX = Math.min(width - 1, maxX + extra)
    maxY = Math.min(height - 1, maxY + extra)

    const croppedWidth = maxX - minX + 1
    const croppedHeight = maxY - minY + 1

    const croppedCanvas = document.createElement("canvas")
    croppedCanvas.width = croppedWidth
    croppedCanvas.height = croppedHeight
    const croppedContext = croppedCanvas.getContext("2d")
    croppedContext.drawImage(canvas, minX, minY, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight)
    return croppedCanvas
}