/*系统管理模块
 *  根据角色添加菜单
 * */

angular.module('quayPsApp').
    controller('sysEditMenuController', ['$scope', '$http', '$log', '$state', '$rootScope','Menu', function ($scope, $http, $log, $state, $rootScope, Menu) {
        $scope.roleItems = [];
        $scope.roleSelected = null;

        //get all system roles
        //$http.get(mainService.baseUrl + "management/role/getRoleAll").
        //    success(function (response) {
        //        $scope.roleItems = response;
        //    }).
        //    error(function (response) {
        //        $log.error('error')
        //    });



        //selected role changed
        $scope.roleSelectedChanged = function () {
            getRightTreeDataByRole();
        }

        var leftMenuTree;
        var rightMenuTree;
        //菜单树的配置
        var setting = {
            data: {
                key: {
                    title: "t"
                },
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode, clickFlag) {

                }
            }
        };

        //取得菜单树的数据, 并且将树初始化
        Menu.getMenusTree().then(function (menus) {
            $scope.nodeData = menus.data;
            //初始化菜单树
            leftMenuTree = $.fn.zTree.init($('#leftMenuTree'), setting, $scope.nodeData);
        })

        //将选择的菜单添加到角色里面
        $scope.addMenuToRoleButton = function () {
            //判断左树有没有被选中
            if (leftMenuTree.getSelectedNodes().length != 1) {
                alert('请选择一个节点');
                return;
            }
            //判断角色有没有被选中
            if(null == $scope.roleSelected){
                alert('请选择一个角色');
                return;
            }

            //请求server将数据加载上
            addMenuToRoleServer();

        }

        $scope.deleteMenuToRoleButton = function () {
            //判断左树有没有被选中
            if (rightMenuTree.getSelectedNodes().length != 1) {
                alert('请选择一个节点');
                return;
            }
            //判断角色有没有被选中
            if(null == $scope.roleSelected){
                alert('请选择一个角色');
                return;
            }

            //请求server将数据加载上
            deleteMenuToRoleServer();

        }

        //use $http to add selected data from left tree to server
        var addMenuToRoleServer = function(){
            $http.post(mainService.baseUrl + "management/menu/addMenuToRole", {
                "roleId": $scope.roleSelected.id,
                "menuId": leftMenuTree.getSelectedNodes()[0].id,
                "menuParentId": leftMenuTree.getSelectedNodes()[0].pId
            }).
                success(function (response) {
                    getRightTreeDataByRole();
                }).
                error(function (response) {
                });
        }

        var deleteMenuToRoleServer = function(){
            $http.post(mainService.baseUrl + "management/menu/deleteMenuToRole", {
                "roleId": $scope.roleSelected.id,
                "menuId": rightMenuTree.getSelectedNodes()[0].id,
                "menuParentId": rightMenuTree.getSelectedNodes()[0].pId
            }).
                success(function (response) {
                    getRightTreeDataByRole();
                }).
                error(function (response) {
                });
        }

        var initRightTree = function(){
            //init right tree
            rightMenuTree = $.fn.zTree.init($('#rightMenuTree'), setting, $scope.rightTreeNodeData);
        }

        var refreshRightTree = function(){
            //var treeObj = $.fn.zTree.getZTreeObj("rightMenuTree");
            //$.fn.zTree.init($('#rightMenuTree'), setting, $scope.rightTreeNodeData);
            //rightMenuTree.destroy();
            rightMenuTree =  $.fn.zTree.init($('#rightMenuTree'), setting, $scope.rightTreeNodeData);
            //rightMenuTree.refresh();
            console.log('refreshed inside');

        }

        var getRightTreeDataByRole = function(){
            $http.post(mainService.baseUrl + "management/menu/getMenuByRole", {"roleId": $scope.roleSelected.id}).
                success(function (response) {
                    $scope.rightTreeNodeData = mainService.sort(response, "orderNo", false);
                    initRightTree();
                }).
                error(function (response) {
                });
        }
    }]);
