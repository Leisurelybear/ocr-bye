
function textToImg() {

    // 找到文本框内容
    let text = document.getElementById("txt_content").value
    console.log(text)
    text = text.trim()
    let words = text.split("")

    // 找到 预转换的内容
    let toImgElement = document.getElementById("toimg")
    toImgElement.innerHTML = ""

    //创建子节点
    let tb = document.createElement("table")
    let tr = document.createElement("tr")
    words.forEach(function (w, i) {
        let td = document.createElement("td")
        let innerDiv = document.createElement("div")
        innerDiv.innerText = w
        innerDiv.setAttribute("class", "icon-over")
        innerDiv.setAttribute("style", "transform:rotate(" + random(0, 360) + "deg)")
        td.appendChild(innerDiv)
        tr.appendChild(td)
    })
    tb.appendChild(tr)
    toImgElement.appendChild(tb)


    // html 转换 canvas，canvas转换图片
    html2canvas(document.getElementById("toimg")).then(function (canvas) {
        let img = document.getElementById("img-base64");
        img.src = canvas.toDataURL("image/png");
    })

}

function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}