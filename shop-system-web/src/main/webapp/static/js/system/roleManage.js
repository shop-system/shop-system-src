$(function () {
    /**跳转到添加用户界面*/
    $("#addRole").on('click',function () {
        $.ajax({
            url:"/system/RoleManageCtrl/toAddRole",
            type: "POST"
        }).done(function(data) {
            layer.open({
                type: 1,
                shade: [0.6, '#AAAAAA'],
                area: ["450px", "500px"],
                title: "添加角色",
                content: data,
                btn:['确定','取消'],
                yes:function () {
                    //角色名称不能为空
                    var rolename = $('input[name=rolename]').val();
                    if(isEmpty(rolename)){
                        layer.msg("角色名称不能为空",{icon: 5});
                        return false;
                    }
                    $.ajax({
                        url:"/system/RoleManageCtrl/saveRole",
                        datatype:"json",
                        type:"post",
                        data:$("#addRoleForm").serialize(),
                        success:function (data) {
                            if(data.error != null && data.error != ""){
                                layer.msg(data.error,{icon: 5});
                            }else{
                                window.top.layer.msg("保存成功",{icon: 1});
                                window.location.reload();
                            }
                        }
                    })
                },
                btn2:function () {

                }
            });
        });
    });

    /**跳转到修改角色的界面*/
     $(".editRole").on('click',function () {
            var roleid = $(this).attr("value");
            var oldrolename = $(this).attr("rolename");
            $.ajax({
                url:"/system/RoleManageCtrl/toEditRole",
                type: "GET"
            }).done(function(data) {
                layer.open({
                    type: 1,
                    shade: [0.6, '#AAAAAA'],
                    area: ["450px", "500px"],
                    title: "修改角色",
                    content: data,
                    btn:['确定','取消'],
                    success: function(layero, index){
                        //打开弹框同时赋值角色名到input里面
                        $('input[name=rolename]').val(oldrolename);
                    },
                    yes:function () {
                        //角色名称不能为空
                        var rolename = $('input[name=rolename]').val();
                        if(isEmpty(rolename)){
                            layer.msg("角色名称不能为空",{icon: 5});
                            return false;
                        }
                        if(isEmpty(roleid)){
                            layer.msg("角色ID不能为空",{icon: 5});
                            return false;
                        }
                        //判断角色名称是否没有做更改
                        if(rolename == oldrolename){ //没有更改，不能提交更改请求
                            layer.msg("角色名称没有更改!请更改新名称",{icon: 5});
                            return false;
                        }
                        $.ajax({
                            url:"/system/RoleManageCtrl/editRole?roleid="+roleid,
                            datatype:"json",
                            type:"post",
                            data:$("#editRoleForm").serialize(),
                            success:function (data) {
                                if(data.error != null && data.error != ""){
                                    layer.msg(data.error,{icon: 5});
                                }else{
                                    window.top.layer.msg("修改成功",{icon: 1});
                                    window.location.reload();
                                }
                            }
                        })
                    },
                    btn2:function () {

                    }
                });
            });
        });

    /**删除角色*/
    $(".delRole").on("click",function () {
        var roleid = $(this).attr("value");
        layer.confirm('是否删除?', function(index){
            if(isEmpty(roleid)){
                layer.msg("角色id不能为空",{icon: 5});
                return false;
            }
            window.location.href = "/system/RoleManageCtrl/delRole?roleid="+roleid;
        });
    })

    /**跳转分配权限页面*/
    $(".chmodrolepri").on('click',function () {
        let roleid = $(this).attr("value");
        let rolename = $(this).attr("rolename");
        $.ajax({
            url:"/system/RoleManageCtrl/toChmodRolePri?roleid="+roleid+"&rolename="+rolename,
            type: "POST"
        }).done(function(data) {
            layer.open({
                type: 1,
                shade: [0.6, '#AAAAAA'],
                area: ["450px", "500px"],
                title: "分配权限",
                content: data,
                btn:['确定','取消'],
                success:function(layero, index){
                    $("input[name=roleid]").val(roleid);


                },
                yes:function () {

                    //判断角色ID不能为空
                    if(isEmpty(roleid)){
                        layer.msg("角色id不能为空",{icon: 5});
                    }
                    //获取当前选中的权限
                    let treeObj=$.fn.zTree.getZTreeObj("treeDemoForRolePage");
                    let nodes=treeObj.getCheckedNodes(true);
                    let checkArr = new Array();
                    $(nodes).each(function (i) {
                        checkArr[i] = $(this).attr("id");
                    })
                    $.ajax({
                        url:"/system/RoleManageCtrl/saveRolePri",
                        type:"POST",
                        datatyle:"json",
                        data:{
                            "roleid":roleid,
                            "checkArr":checkArr+""
                        },
                        success:function (data) {
                            if(data.error != null && data.error != ''){
                                layer.msg(data.error,{icon: 5});
                            }else{
                                window.top.layer.msg("分配成功!");
                                window.location.reload();
                            }
                        }
                    })
                },
                btn2:function () {

                }
            });
        });
    });

});

//回显已选择的权限
function echoPri(){
    let list = $("input[name=perList]").val();
    const treeObj = $.fn.zTree.getZTreeObj("treeDemoForRolePage");
    let nodes = treeObj.transformToArray(treeObj.getNodes());
    let perArrs = list.split(",");

    nodes.forEach((item,index)=>{
        let that = item;
        perArrs.forEach((perItem,perIndex)=>{
            if($(that).attr("id") == perItem){
                $(that).attr("checked",true);
                treeObj.updateNode(that);
            }
        })
    })
}



//初始化权限菜单树
function initMenuTreeForRolePage(){
    $("#treeDemoForRolePage").innerHTML = "";
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
        check: {
            enable: true,
            chkStyle: "checkbox",
            chkDisabledInherit: true,
            chkboxType: { "Y": "ps", "N": "ps" }
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        edit: {
            enable: false,
            editNameSelectAll: true,
            showRemoveBtn: false,
            showRenameBtn: false
        },
        callback: {
            onExpand: zTreeOnExpand
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
                $.fn.zTree.init($("#treeDemoForRolePage"), setting, eval('(' + zNodes + ')')); //zNodes需要 转换成json对象
            }
            echoPri();

        }
    })

}

//展开节点触发事件
function zTreeOnExpand(event, treeId, treeNode) {
    echoPri();
};