//页面加载的时候，获取用户数据，得到头像数据，如果为空，使用我们准备好的备用图片，如果有数据，显示用户头像数据
$.ajax({
    url: "/my/userinfo",
    success: function(res) {
        if (res.status == 0 && res.data.user_pic) {
            $('#image').attr('src', res.data.user_pic);
        }

        // -------------------------------------:查文档，初始化方法
        // 插件：https://www.jq22.com/jquery-info9322
        //      看演示、读文档；
        // 参数：需要仔细读文档；
        $('#image').cropper({
            // 纵横比(宽高比)
            aspectRatio: 1, // 正方形
            // 指定预览区域
            preview: '.img-preview' // 指定预览区的类名（选择器）
        })
    }
})

// -----------------------------------------上传图片：
// 本来：自带按钮：点击后可以上传图片；选择图片！
// 设计：<input type="file" id="file" style="display: none;">
//      默认样式改不了！很丑！隐藏起来！默认样式看不见！用户从界面上点击不了
//      自己写按钮，用户点击这个按钮的时候，通过JS代码触发上面 input[type="file"] 默认行为！
$(".upload").on("click", function() {
    $("#file").click();
});

// 需求：真的打开选择图片文件框：要是选择后，页面对应得显示选择的照片
//       change：改变，事件：文件、下拉选择框  input输入，只要发生改变，就能监听到；
$("#file").change(function() {
    // 生僻：把刚才选择的文件，抽取出来文件地址！了解
    //    1.首先拿到文件对象，this.files 所有选中文件伪数组，现在选择一个，第一个对象：图片对象；
    var obj = this.files[0];

    //    2.把选择的图片对象生成一个临时的url
    //    URL：JS语法内置构造函数。和Object  Array 一样都是构造函数
    var url = URL.createObjectURL(obj);

    //    3.结合插件：把图片地址进行替换；查文档；
    $('#image').cropper("replace", url);

    // 大家先找个地儿，生僻很有用知识，收集起来！
});

// ---------------------------------------------------------点击确定：
// 1.把图片转化为base64 图片流;生僻的知识，配合cropper插件使用
// 2.提交数据
$('button:contains("确定")').click(function() {
    // 1.cropper插件：配置，返回canvas对象；有个方法就可以把当前图片转换为base64格式，得到超长字符串
    var canvas = $('#image').cropper('getCroppedCanvas', {
        width: 100,
        height: 100
    });
    // 2) 把canvas图片转成base64格式，得到超长字符串
    var base64 = canvas.toDataURL('image/png');

    // 3) ajax提交url编码 提交字符串，完成更新
    $.ajax({
        type: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: base64
        },
        success: function(res) {
            layer.msg(res.message);
            if (res.status === 0) {
                // 重新渲染父页面的头像
                window.parent.getInfo();
            }
        }
    });
});