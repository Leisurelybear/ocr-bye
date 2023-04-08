function textToImg() {

    let rowWordNum = document.getElementById("word_num").value
    if (rowWordNum < 10) {
        rowWordNum = 10
    }
    if (rowWordNum > 40) {
        rowWordNum = 40
    }
    let wordSize = document.getElementById("word_size").value
    if (wordSize <= 0) {
        wordSize = 10
    }

    // let imgSizeX = document.getElementById("img_size_x").value
    // let imgSizeY = document.getElementById("img_size_y").value

    let wordRotateMin = parseInt(document.getElementById("rotate_min").value)
    let wordRotateMax = parseInt(document.getElementById("rotate_max").value)
    console.log("角度范围：", wordRotateMin, wordRotateMax)

    let line_nums = document.getElementById("line_nums").value

    // 找到文本框内容
    let text = document.getElementById("txt_content").value
    text = text.trim()
    let words = text.split("")

    // 找到 预转换的内容
    let toImgElement = document.getElementById("toimg")
    toImgElement.innerHTML = ""
    toImgElement.removeAttribute("hidden")




    //创建子节点
    let tb = document.createElement("table")

    // 这么多字总共需要多少行
    let rows = words.length / rowWordNum
    let wordIndex;
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr")
        for (let j = 0; j < rowWordNum; j++) {
            wordIndex = i * rowWordNum + j
            // console.log(wordIndex, words[j])
            let td = document.createElement("td")
            let innerDiv = document.createElement("div")
            innerDiv.innerText = words[wordIndex] ? words[wordIndex] : " "
            // 字體旋轉
            innerDiv.setAttribute("style", "transform:rotate(" + random(wordRotateMin, wordRotateMax) + "deg);")
            // 字體大小
            tmpWordSize = parseInt(wordSize) + random(0, 0)
            // console.log(wordSize)
            innerDiv.setAttribute("style", innerDiv.getAttribute("style") + "font-size: " + tmpWordSize + "px;")


            td.appendChild(innerDiv)
            tr.appendChild(td)
        }
        // words.forEach(function (_, i) {
        //     // 这里可以对单个字进行处理，考虑改颜色，转圈
        // })
        tb.appendChild(tr)
    }

    toImgElement.appendChild(tb)

    // 設置圖片大小
    imgSizeX = rowWordNum * wordSize*1.414
    imgSizeY = (rows + 1) * wordSize * 1.414 // 勾股定理，根號2，+1為補償，防止漢字割裂
    toImgElement.setAttribute("style", "width: " + imgSizeX + "px !important;height: " + imgSizeY + "px !important;")

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
        for(let i = 0; i < line_nums; i++) {
            // 绘制干扰线
            drawline(canvas, canvas.getContext("2d"))
        }
        img.src = canvas.toDataURL("image/png");
    })
    toImgElement.setAttribute("hidden", true)


}

// 生成随机数
function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

// 绘制干扰线
function drawline(canvas, context) {
    //若省略beginPath，则每点击一次验证码会累积干扰线的条数
    context.beginPath();
    //起点与终点在canvas宽高内随机
    context.moveTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height));
    context.lineTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height));
    context.lineWidth = 1;
    context.strokeStyle = '#275DB3';
    context.stroke();
}