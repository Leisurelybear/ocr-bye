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

    let imgSizeX = document.getElementById("img_size_x").value
    let imgSizeY = document.getElementById("img_size_y").value


    // 找到文本框内容
    let text = document.getElementById("txt_content").value
    text = text.trim()
    let words = text.split("")

    // 找到 预转换的内容
    let toImgElement = document.getElementById("toimg")
    toImgElement.innerHTML = ""
    toImgElement.removeAttribute("hidden")
    // 設置圖片大小
    toImgElement.setAttribute("style", "width: " + imgSizeX + "px !important;height: " + imgSizeY + "px !important;")

    //创建子节点
    let tb = document.createElement("table")

    // 这么多字总共需要多少行
    let rows = words.length / rowWordNum
    let wordIndex;
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr")
        for (let j = 0; j < rowWordNum; j++) {
            wordIndex = i * rowWordNum + j
            console.log(wordIndex, words[j])
            let td = document.createElement("td")
            let innerDiv = document.createElement("div")
            innerDiv.innerText = words[wordIndex] ? words[wordIndex] : " "
            // 字體旋轉
            innerDiv.setAttribute("style", "transform:rotate(" + random(0, 360) + "deg);")
            // 字體大小
            tmpWordSize = parseInt(wordSize) + random(0, 0)
            console.log(wordSize)
            innerDiv.setAttribute("style", innerDiv.getAttribute("style") + "font-size: " + tmpWordSize + "px;")


            td.appendChild(innerDiv)
            tr.appendChild(td)
        }
        words.forEach(function (_, i) {

        })
        tb.appendChild(tr)
    }

    toImgElement.appendChild(tb)


    // html 转换 canvas，canvas转换图片
    html2canvas(document.getElementById("toimg")).then(function (canvas) {
        let img = document.getElementById("img-base64");
        img.src = canvas.toDataURL("image/png");
    })
    toImgElement.setAttribute("hidden", true)


}

function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}