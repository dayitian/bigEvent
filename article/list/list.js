var laypage = layui.laypage;
var layer = layui.layer;
var form = layui.form;

// ------------------------------列表
// 接口参数：分页查询；
//     pagenum：页码
//     pagesize:每页要求返回几条数据

// 后台设计：
//     商品列表：1W
//     加载1W，显示出来，用户看起来费劲；
//     刚好要的数据 第11条；无形后面数据白白加载了！
//     减少请求次数、数据量，怕服务器！怕服务器：百万并发！同时请求！
var data = {
    pagenum: 1, // 获取第1页的数据 
    pagesize: 2, // 每页显示2条数据 
};
//获取列表
function list() {
    $.ajax({
        url: "/my/article/list",
        data: data,
        success: function(res) {
            if (res.status == 0) {
                var str = "";
                $.each(res.data, function(index, item) {
                    // 对时间处理：JS基础  字符串操作方法
                    //   item.pub_date  2020-01-03 12:19:57.690   需要对这个值 截取处理  长度-4
                    //   str.slice(0,str.length-4)
                    //   item.pub_date.slice(0, item.pub_date.length - 4)
                    str += `<tr>
                      <td>${item.title}</td>
                      <td>${item.cate_name}</td>
                      <td>${item.pub_date.slice(0, item.pub_date.length - 4)}</td>
                      <td>${item.state}</td>
                      <th>
                        <a href="/article/edit/edit.html?id=${item.Id}" class="layui-btn layui-btn-xs">编辑</a>
                        <button data-id="${item.Id}" type="button" class="layui-btn layui-btn-xs layui-btn-danger">删除</button>
                      </th>
                    </tr>`;
                });
                $("tbody").html(str);
                page(res.total)
            }
        }
    })
}
list();

//分页加载
function page(total) {
    laypage.render({
        elem: 'page', //page是分页器容器的id，dom节点的id，但是不用加#
        count: total, //从服务端获取的总数
        limit: data.pagesize, //每页显示的条数
        curr: data.pagenum, //在第几页
        jump: function(obj, first) {
            // first:ture；模块初始化的第一次加载，页面打开的时候会自动执行一遍
            //first:undefined 的时候，是用户自己点击的
            if (!first) {
                //1.obj对象里有一个 curr，是当前页面是第几页
                //2.然后修改data.pagenum,再次请求重新加载列表数据
                data.pagenum = obj.curr;
                list();
            }
        }
    })
}


//删除
$('tbody').on('click', '.layui-btn-danger', function() {
    var id = $(this).attr('data-id');
    layer.confirm('您确定要删除吗', function(index) {
        $.ajax({
            url: '/my/article/delete/' + id,
            success: function(res) {
                if (res.status == 0) {
                    layer.close(index);
                    //业务：重新加载数据，回到第一页
                    data.pagenum = 1;
                    list();
                }
            }
        })
    })
})


// -------------------------------加载分类数据
$.ajax({
    url: "/my/article/cates",
    success: function(res) {
        if (res.status == 0) {
            // 初始化默认空选项
            var str = `<option value="">请选择一个类别</option>`;
            // 遍历数据：累加
            $.each(res.data, function(index, item) {
                str += `<option value="${item.Id}">${item.name}</option>`;
            });
            // 设置HTML结构
            $("#category").html(str);

            // 现在：基于layui.form 
            // 特性：更新渲染；layui语法规定  了解；
            form.render('select');
        }
    }
});

// 点击筛选的时候，收集数据
$("form").on("submit", function(e) {
    e.preventDefault();

    // 1.收集数据
    // var params = $(this).serialize();   // url拼接好字符串：请求发送的数据
    var params = $(this).serializeArray(); // 数组对象：想从里面获取某些数据
    console.log(params);

    // 2.发生请求 重新添加筛选条件，重新加载列表
    //   需要给data设置新的键值对 cate_id  state
    //   问题：params是个字符串，解析出来？
    data.cate_id = params[0].value;
    data.state = params[1].value;
    // 业务设计：默认显示第一页
    data.pagenum = 1;
    list();
})