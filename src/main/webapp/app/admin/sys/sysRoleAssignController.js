angular.module('quayPsApp').
    controller('sysRoleAssignController', ['$scope', '$http', '$log', '$state', '$rootScope', 'mainService','$modal', function ($scope, $http, $log, $state, $rootScope, mainService, $modal) {
        $scope.selectedRole = {};
        $scope.allRoles = [];
        $scope.userAllRoles = [];  //某个用户已经拥有的所有角色

        //获取系统现有的所有角色
        $http.get(mainService.baseUrl+"management/role/getRoleAll").
            success(function(response){
                $scope.allRoles = response;
            }).
            error(function(response){
                alert('sysRoleAssignControler.js ---> failed');
            });
        //grid的配置参数(排序在这里用的还不是server端的排序，在这里需要用server端的排序功能更为强大)
        var paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
            sort: null
        };
        $scope.gridOptions = {
            paginationPageSizes: [5, 10, 25, 50, 75, 100, 200],
            paginationPageSize: paginationOptions.pageSize,
            useExternalPagination: true,
            useExternalSorting: true,
            columnDefs:[
                { name: 'username', displayName:'用户名', enableSorting: false},
                { name: 'password', cellTemplate:'<span>*****</span>', displayName:'密码', enableSorting: false},
                { name: 'accountExpired', displayName:'是否过期', enableSorting: false},
                { name: 'createTime', displayName:'创建时间', enableSorting: false},
                { name: 'init password', cellTemplate:'<button class="btn btn-default form-control" ng-click="grid.appScope.openRoleAssignModal(row.entity)">管理角色</button>', displayName:'初始密码', enableSorting: false},
            ],
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                    if (sortColumns.length == 0) {
                        paginationOptions.sort = null;
                    } else {
                        paginationOptions.sort = sortColumns[0].sort.direction;
                    }
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    paginationOptions.pageNumber = newPage;
                    paginationOptions.pageSize = pageSize;
                });
            }
        };

        //监控分页参数的变化
        $scope.$watchGroup(['gridOptions.paginationCurrentPage', 'gridOptions.paginationPageSize'], function(){
            var offset = $scope.gridOptions.paginationCurrentPage*$scope.gridOptions.paginationPageSize-$scope.gridOptions.paginationPageSize;
            var max = ($scope.gridOptions.paginationCurrentPage*$scope.gridOptions.paginationPageSize) - offset;
            $http.post(mainService.baseUrl + "management/member/getUsersPagination", {"max" : max, "offset" : offset, "username" : $scope.username})
                .success(function(response) {
                    $scope.gridOptions.totalItems = response.count;
                    $scope.gridOptions.data = response.data;
                })
                .error(function(response) {
                    console.log("memberController.js --> failed");
                });
        }, true)

        //开始多条件查询
        $scope.queryClick = function(){
            var offset = $scope.gridOptions.paginationCurrentPage*$scope.gridOptions.paginationPageSize-$scope.gridOptions.paginationPageSize;
            var max = ($scope.gridOptions.paginationCurrentPage*$scope.gridOptions.paginationPageSize) - offset;
            $http.post(mainService.baseUrl + "management/member/getUsersPagination", {"max" : max, "offset" : offset, "username" : $scope.username})
                .success(function(response) {
                    $scope.gridOptions.totalItems = response.count;
                    $scope.gridOptions.data = response.data;
                })
                .error(function(response) {
                    console.log("sysRoleAssignController.js --> failed");
                });

        }

        $scope.openRoleAssignModal = function(row){

            //进入一个新用户时，将用户已经已经拥有的角色赋初值
            $scope.userAllRoles = [];
            $scope.selectedRole.objs = [];

            //首先获取这个用户已经拥有的角色
            var promise = $http.post(mainService.baseUrl + "management/role/getRoleByUser", {"userId" : row.id});

            promise.then(function(response){
                console.log('获取用户已有角色数据已经返回');
                console.log(response);
                $scope.userAllRoles = response.data;

                angular.forEach($scope.allRoles, function(sysRole){
                    angular.forEach($scope.userAllRoles, function(userRole){
                        if(userRole.id == sysRole.id){
                            $scope.selectedRole.objs.push(sysRole);
                        }
                    })
                });

                console.log('用户已经拥有的角色已经初始化完毕');
                console.log($scope.userAllRoles);
                openRoleAssignModal(row);
            });
        }

        var changeRole = function(row, roleObjs){
            var roleIds = mainService.getObjIds(roleObjs);
            $http.post(mainService.baseUrl + "management/role/modifyUserRoles", {"userId" : row.id, "roleIds" : roleIds})
                .success(function(response) {
                    alert('角色变更成功！'+new Date());
                })
                .error(function(response) {
                    console.log("sysRoleAssignController.js --> failed");
                });
        }

        $scope.test = function(){
            alert('hello');
        }

        var openRoleAssignModal = function(row){
            //用户添加角色的modal
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/sysModule/view/roleAssignModal.html',
                controller: function ($scope) {
                    //modal中数据的初始化
                    //$scope.selectedRole = {};  //选择好了，那么对象就往这里放
                    $scope.allRoles = $scope.allRoles;

                    $scope.xClick = function () {
                        modalInstance.dismiss('close');
                    }

                    $scope.okClick = function () {
                        changeRole(row, $scope.selectedRole.objs);
                        modalInstance.dismiss('close');
                    }

                    $scope.closeClick = function () {
                        modalInstance.dismiss('close');
                    }
                },
                size: 'md',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                },
                scope: $scope   //表示在这里使用父类的scope，在modal的controller里面可以直接调用父类的scope。
            })
        }

    }]);
