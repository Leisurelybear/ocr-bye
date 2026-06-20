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

    const enableBg = document.getElementById("enable_bg").checked
    const bgColor = document.getElementById("bg_color").value
    const textColor = document.getElementById("text_color").value
    const fontFamily = document.getElementById("font_family").value

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

    // 设置文字颜色和字体
    const allInnerDivs = tb.querySelectorAll("div")
    allInnerDivs.forEach(function (div) {
        div.style.color = textColor
        div.style.fontFamily = fontFamily
    })

    toImgElement.appendChild(tb)

    // 背景颜色
    if (enableBg) {
        toImgElement.style.backgroundColor = bgColor
    } else {
        toImgElement.style.backgroundColor = "transparent"
    }

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
        const croppedCanvas = cropCanvasTransparentEdge(canvas, 2)
        const context = croppedCanvas.getContext("2d")
        for(let i = 0; i < line_nums; i++) {
            // 绘制干扰线
            drawline(croppedCanvas, context, i, line_nums, enableRandomLineWidth, lineWidthMin, lineWidthMax)
        }
        img.src = croppedCanvas.toDataURL("image/png");
        toImgElement.setAttribute("hidden", true)
    })


}

const CONFIG_STORAGE_KEY = "ocr-bye-config-v1"
const CONFIG_IDS = [
    "txt_content",
    "word_num",
    "word_size",
    "rotate_min",
    "rotate_max",
    "line_nums",
    "underline",
    "enable_random_size",
    "size_delta_min",
    "size_delta_max",
    "enable_random_line_width",
    "line_width_min",
    "line_width_max",
    "enable_martian",
    "enable_stretch",
    "stretch_x_min",
    "stretch_x_max",
    "stretch_y_min",
    "stretch_y_max",
    "enable_bg",
    "bg_color",
    "text_color",
    "font_family",
    "export_format"
]

function saveConfig() {
    const config = {}
    CONFIG_IDS.forEach(function (id) {
        const element = document.getElementById(id)
        if (!element) return
        if (element.type === "checkbox") {
            config[id] = element.checked
        } else {
            config[id] = element.value
        }
    })
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config))
}

function loadConfig() {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY)
    if (!raw) return
    try {
        const config = JSON.parse(raw)
        CONFIG_IDS.forEach(function (id) {
            if (config[id] === undefined) return
            const element = document.getElementById(id)
            if (!element) return
            if (element.type === "checkbox") {
                element.checked = !!config[id]
            } else {
                element.value = config[id]
            }
        })
    } catch (e) {
        console.warn("读取历史配置失败，已忽略。", e)
    }
}

function bindConfigPersistence() {
    CONFIG_IDS.forEach(function (id) {
        const element = document.getElementById(id)
        if (!element) return
        element.addEventListener("input", saveConfig)
        element.addEventListener("change", saveConfig)
    })
}

function initApp() {
    // 加载暗黑模式状态
    if (localStorage.getItem('ocr-bye-dark') === 'true') {
        document.body.classList.add('dark-mode');
        const toggle = document.getElementById('dark-toggle');
        if (toggle) toggle.textContent = '☀️';
    }
    loadConfig()
    // 启用背景色复选框状态同步
    const enableBg = document.getElementById('enable_bg');
    if (enableBg) {
        document.getElementById('bg_color').disabled = !enableBg.checked;
    }
    bindConfigPersistence()
    textToImg()
}

// 下载图片（支持 PNG / JPG / WebP）
function downloadImage() {
    const img = document.getElementById("img-base64")
    const format = document.getElementById("export_format").value
    const link = document.createElement("a")
    const mimeTypes = { png: "image/png", jpeg: "image/jpeg", webp: "image/webp" }
    const ext = format === "jpeg" ? "jpg" : format

    if (format === "png") {
        link.download = "ocr-bye.png"
        link.href = img.src
    } else {
        const canvas = document.createElement("canvas")
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext("2d")
        // JPG 不支持透明，用白色填充
        if (format === "jpeg") {
            ctx.fillStyle = "#ffffff"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        ctx.drawImage(img, 0, 0)
        link.download = "ocr-bye." + ext
        link.href = canvas.toDataURL(mimeTypes[format], 0.92)
    }
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// 切换暗黑模式
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode")
    const isDark = document.body.classList.contains("dark-mode")
    localStorage.setItem("ocr-bye-dark", isDark)
    document.getElementById("dark-toggle").textContent = isDark ? "☀️" : "🌙"
}

// 重置配置（清除本地存储后刷新页面）
function resetConfig() {
    if (!confirm("确认重置所有配置？")) return
    localStorage.removeItem(CONFIG_STORAGE_KEY)
    localStorage.removeItem("ocr-bye-dark")
    location.reload()
}

// 生成随机整数（自动处理 min > max 情况）
function random(min, max) {
    if (min > max) { const t = min; min = max; max = t; }
    return Math.round(Math.random() * (max - min)) + min;
}

// 生成随机小数（自动处理 min > max 情况）
function randomFloat(min, max) {
    if (min > max) { const t = min; min = max; max = t; }
    return Math.random() * (max - min) + min;
}

// 绘制干扰线（按区域分配，保证左中右都有覆盖）
function drawline(canvas, context, index, totalLines, enableRandomLineWidth, lineWidthMin, lineWidthMax) {
    context.beginPath();

    const w = Math.max(1, canvas.width);
    const h = Math.max(1, canvas.height);
    const segments = 3;
    const segmentWidth = w / segments;
    let segmentIndex = index % segments;

    const segMinX = Math.floor(segmentIndex * segmentWidth);
    const segMaxX = Math.floor((segmentIndex + 1) * segmentWidth) - 1;
    // 当 segment 宽度 < 1 时保证有效范围
    const rangeMin = Math.min(segMinX, Math.max(0, w - 1));
    const rangeMax = Math.min(Math.max(segMinX, segMaxX), w - 1);

    const startX = random(rangeMin, rangeMax);
    const startY = random(0, h - 1);
    const endX = random(rangeMin, rangeMax);
    const endY = random(0, h - 1);

    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.lineWidth = enableRandomLineWidth ? randomFloat(lineWidthMin, lineWidthMax) : 1;
    context.strokeStyle = '#275DB3';
    context.stroke();
}

// 火星文替换（常见字符做随机替换）
function convertToMartianText(text) {
    const martianMap = {
        "的": ["d", "啲", "の", "淂"],
        "了": ["叻", "le", "ㄋ", "瞭"],
        "你": ["伱", "祢", "ní", "妮"],
        "我": ["莪", "ω", "偶", "俄"],
        "是": ["4", "惿", "si", "囨"],
        "不": ["吥", "8", "卟", "罘"],
        "很": ["狠", "hen", "哏", "鞎"],
        "吗": ["嗎", "嘛", "ma", "嬷"],
        "啊": ["吖", "阿", "a", "腌"],
        "爱": ["嗳", "愛", "ai", "艾"],
        "这": ["這", "zhe", "媞", "柘"],
        "那": ["哪", "那", "na", "娜"],
        "人": ["亽", "朲", "ren", "魜"],
        "中": ["仲", "ф", "zhong", "妕"],
        "国": ["國", "囯", "guo", "囶"],
        "有": ["冇", "you", "姷", "囿"],
        "大": ["亣", "da", "汏", "畗"],
        "小": ["尐", "晓", "尛", "𡭔"],
        "上": ["仩", "丄", "鞤", "shang"],
        "下": ["丅", "吓", "芐", "xia"],
        "一": ["1", "壹", "弌", "①"],
        "二": ["2", "贰", "弍", "②"],
        "三": ["3", "叁", "弎", "③"],
        "四": ["4", "肆", "䦉", "④"],
        "五": ["5", "伍", "㐅", "⑤"],
        "天": ["兲", "tian", "靝", "婖"],
        "地": ["坔", "di", "埊", "嶳"],
        "生": ["泩", "sheng", "甡", "鉎"],
        "死": ["屍", "si", "尐", "舓"],
        "可": ["妸", "ke", "渇", "奇"],
        "以": ["妀", "已", "佁", "苡"],
        "为": ["爲", "4", "位", "沩"],
        "在": ["茬", "扗", "囮", "zai"],
        "和": ["咊", "媧", "惒", "龢"],
        "之": ["芝", "zhi", "㞢", "膌"],
        "要": ["婹", "yao", "覞", "葽"],
        "他": ["牠", "ta", "祂", "佗"],
        "她": ["牠", "ta", "奼", "婨"],
        "都": ["嘟", "dou", "醏", "闍"],
        "好": ["嬡", "hao", "恏", "㚼"],
        "能": ["耐", "neng", "竜", "螚"],
        "会": ["會", "烩", "hui", "䢳"],
        "个": ["個", "箇", "各", "ge"],
        "看": ["睇", "kan", "䀎", "矙"],
        "得": ["淂", "de", "嘚", "鍀"],
        "就": ["僦", "jiu", "鹫", "蹴"],
        "没": ["沒", "mei", "殁", "歾"],
        "过": ["過", "guo", "菓", "鐹"],
        "把": ["靶", "ba", "鈀", "爬"],
        "对": ["對", "怼", "dui", "薱"],
        "多": ["哆", "duo", "茤", "奓"],
        "只": ["隻", "zhi", "淽", "枳"],
        "来": ["來", "徕", "涞", "lei"],
        "子": ["孑", "zi", "杍", "姉"],
        "如": ["侞", "ru", "桇", "挐"],
        "到": ["倒", "dao", "菿", "噵"],
        "说": ["説", "曰", "shuo", "烁"],
        "们": ["們", "们", "men", "扪"],
        "去": ["厺", "qu", "佉", "阹"],
        "着": ["著", "着", "zhao", "謶"],
        "出": ["齣", "chu", "岀", "絀"],
        "开": ["開", "kai", "闓", "锎"],
        "心": ["芯", "xin", "訫", "惢"],
        "风": ["風", "疯", "feng", "諷"]
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