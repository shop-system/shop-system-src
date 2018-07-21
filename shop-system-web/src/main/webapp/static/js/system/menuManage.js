$(function(){
    initMenuTree();
    /**
     * 保存菜单
     * */
    $(".saveMenu").on("click",function () {
        //校验非空
        var temp = validateNoNull($("#addMenuForm")[0]);
        if(!temp){
            return false;
        };
        //校验数字
        if(!/^[0-9]*$/.test($("input[name=orders]").val())){
            layer.tips('请输入数字',$("input[name=orders]"), {
                tips: 3
            });
            return false;
        }
        //校验如果上级目录非父目录类型,则提示不能提交
        if("false" === $("input[name=isheaderTest]").val()){
            layer.msg("选择的目录非父目录类型,请重新选择!");
            return false;
        }
        //二次弹框
        layer.confirm('确定要保存吗?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                url:"/system/MenuManageCtrl/saveMenu",
                datatype:"json",
                data:$("#addMenuForm").serialize(),
                type:"post",
                success:function (data) {
                    if(data.error!=null && data.error!=''){
                        layer.msg(data.error,{icon: 5});
                    }else{
                        //添加成功
                        layer.msg("添加权限成功",{icon: 1});
                        //此处重新生成菜单树
                        initMenuTree();

                    }

                }
            });

            layer.close(index); //请求成功关掉弹框
        });

    })


});

/**屏蔽显示菜单根目录*/
function isMenuOrPorint(value){
    //alert(value);
    //0是菜单,1是权限点
    if("0" === value){
        $(".com-isHeaderDiv").show("slow");
    }else{
        layer.msg("请从右侧树选择上级菜单!");
        $(".com-isHeaderDiv").hide("slow");
    }
}
/**选择是否是根目录校验上级权限*/
function isHeader(value){
    //0是有父级目录,1是没有父级目录
    if("1"===value){
        //清空上级目录值
        $("input[name=parentname]").val("");
        $("input[name=parentid]").val("");
        $("input[name=isheaderTest]").val("");
    }else{
        layer.msg("请从右侧树选择上级菜单!");
    }
}



function initMenuTree(){
    $("#treeDemo").innerHTML = "";
    var zTreeObj;
    var setting = {
        view: {
            selectedMulti: true
        },
        async:{
            enable:true,
            url:"/system/MenuManageCtrl/loadSonMenu",
            autoParam:["id","name"]
        },
        /*check: {
            enable: true,
            chkStyle: "checkbox",
            chkDisabledInherit: true,
            chkboxType: { "Y": "ps", "N": "ps" }
        },*/
        data: {
            simpleData: {
                enable: true
            }
        },
        edit: {
            enable: true,
            editNameSelectAll: true,
            removeTitle: "删除节点",
            renameTitle: "编辑节点名称",
            showRemoveBtn: true,
            showRenameBtn: true
        },
        callback: {
            onClick:zTreeOnClick,
            beforeAsync: zTreeBeforeAsync,
            onAsyncSuccess:zTreeOnAsyncSuccess,
            onRename: zTreeOnRename,
            beforeRemove: zTreeBeforeRemove,
            onRemove: zTreeOnRemove
        }
    };
    var zNodes ;
    $.ajax({
        url: "/system/MenuManageCtrl/returnZtreeData",
        type: "post",
        datatype:"json",
        success: function (data) {
            if(data == null || data == ''){
                layer.msg(data.error);
                return false;
            }else{
                zNodes = data.data;
                $.fn.zTree.init($("#treeDemo"), setting, eval('(' + zNodes + ')')); //zNodes需要 转换成json对象
            }
        }
    })
}

/**鼠标点击节点前触发事件,判断该点击节点是否是父节点*/
function zTreeBeforeAsync(treeId, treeNode) {
    return treeNode.isParent;
};

/**异步请求成功调用的方法*/
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    if("undefined" === msg){
        return false;
    }
};

/**点击菜单时候把对应的id和名称赋值给input文本框*/
function zTreeOnClick(event, treeId, treeNode) {
    $("input[name=parentname]").val(treeNode.name);
    $("input[name=parentid]").val(treeNode.id);
    $("input[name=isheaderTest]").val(treeNode.isParent);
};



/**给树节点更改名字后触发的函数*/
function zTreeOnRename(event, treeId, treeNode, isCancel) {
    $.ajax({
        url:"/system/MenuManageCtrl/editPer",
        type:"post",
        datatype:"json",
        data:{
            "per_id":treeNode.id,
            "new_per_name":treeNode.name
        },
        success:function (data) {
            if(data.error != null && data.error != ''){
                $("#"+treeNode.tId).find("span[id$='_span']").text(data.oldPerName);
                layer.msg(data.error,{icon: 5});
            }else{ //修改成功,重新加载树菜单
                initMenuTree();
                layer.msg("修改成功!",{icon: 1});
            }
        }
    });
}

/**点击删除前的回调函数,判断如果有子节点,则必须删除完子节点再进行删除该父节点*/
function zTreeBeforeRemove(treeId, treeNode) {
    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
    var flag = false;
    $.ajax({
        url:"/system/MenuManageCtrl/isHasSonNodes",
        type:"post",
        datatype:"json",
        data:{
            "per_id":treeNode.id
        },
        success:function (data) {
            if(data.error != null && data.error != ''){
                layer.msg(data.error,{icon: 5});
            }else{ //若有子节点,则返回false,并打开节点数据,若没有,则直接删除
               var temp = data.temp;
               if(temp){
                   layer.msg("该节点[ "+treeNode.name+" ]有子节点,请先删除子节点!");
                   treeObj.expandNode(treeNode, true, false, true);
               }else{
                   zTreeOnRemove(null,treeId, treeNode);
               }

            }
        }
    });
    return flag;
}

/**点击树菜单删除按钮回调函数*/
function zTreeOnRemove(event, treeId, treeNode) {
    $.ajax({
        url:"/system/MenuManageCtrl/delPer",
        type:"post",
        datatype:"json",
        data:{
            "per_id":treeNode.id
        },
        success:function (data) {
            if(data.error != null && data.error != ''){
                layer.msg(data.error,{icon: 5});
            }else{ //删除成功,重新加载树菜单
                initMenuTree();
                layer.msg("删除成功!",{icon: 1});
            }
        }
    });
}
