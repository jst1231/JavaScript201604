//->n存储的是当前页 ->total存储的总页数
var boxList = document.getElementById("boxList"),
    pageList = document.getElementById("pageList"),
    pageLi = pageList.getElementsByTagName("li"),
    boxBtn = document.getElementById("boxBtn"),
    search = document.getElementById("search"),
    total = 0,
    n = 1;

//->开始加载页面首先把第一页的数据请求回来进行数据绑定
bindData();
function bindData() {
    //->jsonData:就是我们请求回来的数据
    function callback(jsonData) {
        if (!jsonData) {//->如果获取的内容不存在的话,我们就不在进行绑定了
            return;
        }
        total = jsonData["total"];
        var data = jsonData["data"],
            str = '';

        //->绑定列表区域的数据
        for (var i = 0, len = data.length; i < len; i++) {
            var curData = data[i];
            str += '<li>';
            str += '<span>' + curData["num"] + '</span>';
            str += '<span>' + curData["name"] + '</span>';
            str += '<span>' + (curData["sex"] == 1 ? "女" : "男") + '</span>';
            str += '<span>' + curData["score"] + '</span>';
            str += '</li>';
        }
        boxList.innerHTML = str;

        //->绑定页码区域的数据
        str = '';
        for (i = 1; i <= total; i++) {
            str += '<li>' + i + '</li>';
        }
        pageList.innerHTML = str;

        //->让页码和当前页对应
        for (i = 0, len = pageLi.length; i < len; i++) {
            pageLi[i].className = (i + 1) == n ? "bg" : null;
        }

        //->让文本框中的文字显示当前页
        search.value = n;
    }

    //->发送Ajax请求,请求成功后执行callback方法
    ajax({
        url: "/getData?n=" + n + "&_=" + Math.random(),
        success: callback
    });
}

//->使用事件委托处理boxBtn下的所有的点击操作
boxBtn.onclick = function (ev) {
    ev = ev || window.event;
    var tar = ev.target || ev.srcElement,
        tarTag = tar.tagName.toUpperCase();

    if (tarTag === "SPAN") {
        if (tar.innerHTML === "FIRST") {
            //->如果当前已经是第一页,在点击应该什么都不做
            if (n == 1) {
                return;
            }
            n = 1;
        }
        if (tar.innerHTML === "LAST") {
            //->如果当前已经是最后一页,在点击也应该什么都不做
            if (n == total) {
                return;
            }
            n = total;
        }

        if (tar.innerHTML === "PREV") {
            //->当前已经是第一页则不需要上一页了
            if (n == 1) {
                return;
            }
            n--;
        }
        if (tar.innerHTML === "NEXT") {
            //->当前已经是最后一页则不需要下一页了
            if (n == total) {
                return;
            }
            n++;
        }
    }

    if (tarTag === "LI") {
        //->如果当前页和点击的LI内容一样,则不需要重新的处理
        if (n == tar.innerHTML) {
            return;
        }
        n = parseFloat(tar.innerHTML);
    }

    bindData();
};

//->给文本框的keyup事件绑定方法实现跳转到第几页
search.onkeyup = function (ev) {
    ev = ev || window.event;

    //->只有按ENTER键才触发操作
    if (ev.keyCode === 13) {
        var val = this.value.replace(/^ +| +$/g, "");

        //->验证输入内容的格式：
        //1)如果不是数字,就显示当前页即可
        var reg = /^-?(?:\d|(?:[1-9]\d+))(?:\.\d+)?$/;
        if (!reg.test(val)) {
            this.value = n;
            return;
        }

        //2)如果是小数,让其四舍五入
        reg = /^-?(?:\d|(?:[1-9]\d+))(?:\.\d+)$/;
        if (reg.test(val)) {
            val = Math.round(val);
        }

        //3)如果小于1,让其等于1
        if (val < 1) {
            val = 1;
        }

        //4)如果大于总页数,让其等于最后一页
        if (val > total) {
            val = total;
        }

        //5)如果输入的值和当前页相等,则不进行任何的操作
        if (n == val) {
            n = val;
            this.value = val;
            return;
        }

        //6)正常的话,只需要让n=val
        n = val;
        this.value = val;

        bindData();
    }
};