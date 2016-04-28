angular.module('quayPsApp').
controller('sysRoleAssignController', ['$scope', '$http', '$log', '$rootScope', '$uibModal', 'Principal', 'User', 'paginationConstants','AlertService',
    function ($scope, $http, $log, $rootScope, $uibModal, Principal, User, paginationConstants,AlertService) {




        $scope.selectedRole = {};
        $scope.allRoles = [];
        $scope.userAllRoles = [];  //某个用户已经拥有的所有角色

        //获取系统现有的所有角色
        Principal.listAllRoles().query(function (response) {
            $scope.allRoles = response;
        }, function (response) {
            alert('sysRoleAssignControler.js ---> failed');
        });
        //grid的配置参数(排序在这里用的还不是server端的排序，在这里需要用server端的排序功能更为强大)
        var paginationOptions = {
            pageNumber: 0,
            pageSize: paginationConstants.itemsPerPage,
            sort: null
        };
        $scope.gridOptions = {
            rowHeight: 30, // set row height, this is default size
            paginationPageSizes: [5, 10, 25, 50, 75, 100, 200],
            paginationPageSize: paginationConstants.itemsPerPage,
            useExternalPagination: true,
            useExternalSorting: true,
            columnDefs: [
                {name: 'login', displayName: '用户名', enableSorting: false},
                {name: 'password', cellTemplate: '<span>*****</span>', displayName: '密码', enableSorting: false},
                {name: 'activated', displayName: '是否激活', enableSorting: false},
                {
                    name: 'createdDate',
                    displayName: '创建时间',
                    enableSorting: false,
                    type: 'date',
                    cellFilter: 'date:\'yyyy-MM-dd HH:mm:ss\''
                },
                {
                    name: 'init password',
                    cellTemplate: '<button class="btn btn-primary form-control" ng-click="grid.appScope.openRoleAssignModal(row.entity)">管理角色</button>',
                    displayName: '操作',
                    enableSorting: false
                },
            ],
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    if (sortColumns.length == 0) {
                        paginationOptions.sort = null;
                    } else {
                        paginationOptions.sort = sortColumns[0].sort.direction;
                    }
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    paginationOptions.pageNumber = newPage - 1;
                    paginationOptions.pageSize = pageSize;
                    getUsers()
                });
            }
        };


        var getUsers = function () {
            User.query({
                page: paginationOptions.pageNumber,
                size: paginationOptions.pageSize
            }, function (result, headers) {
                //vm.links = ParseLinks.parse(headers('link'));
                $scope.gridOptions.totalItems = headers('X-Total-Count');
                $scope.gridOptions.data = result;
            });
        }

        getUsers();


        //监控分页参数的变化
        //$scope.$watchGroup(['gridOptions.paginationCurrentPage', 'gridOptions.paginationPageSize'], function () {
        //    User.query({
        //        page: $scope.gridOptions.paginationCurrentPage,
        //        size: paginationConstants.itemsPerPage
        //    }, function (result, headers) {
        //        //vm.links = ParseLinks.parse(headers('link'));
        //        $scope.gridOptions.totalItems = headers('X-Total-Count');
        //        $scope.gridOptions.data = result;
        //    });
        //}, true)

        //开始多条件查询
        $scope.queryClick = function () {
            var offset = $scope.gridOptions.paginationCurrentPage * $scope.gridOptions.paginationPageSize - $scope.gridOptions.paginationPageSize;
            var max = ($scope.gridOptions.paginationCurrentPage * $scope.gridOptions.paginationPageSize) - offset;
            //$http.post(mainService.baseUrl + "management/member/getUsersPagination", {
            //        "max": max,
            //        "offset": offset,
            //        "username": $scope.username
            //    })
            //    .success(function (response) {
            //        $scope.gridOptions.totalItems = response.count;
            //        $scope.gridOptions.data = response.data;
            //    })
            //    .error(function (response) {
            //        console.log("sysRoleAssignController.js --> failed");
            //    });

        }

        $scope.openRoleAssignModal = function (row) {

            //进入一个新用户时，将用户已经已经拥有的角色赋初值
            $scope.userAllRoles = [];
            $scope.selectedRole.objs = [];

            User.get({login: row.login}, function (user) {
                $scope.userAllRoles = user.authorities;
                angular.forEach($scope.allRoles, function (sysRole) {
                    angular.forEach($scope.userAllRoles, function (userRole) {
                        if (userRole == sysRole.name) {
                            $scope.selectedRole.objs.push(sysRole);
                        }
                    })
                });


                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'app/admin/sys/view/roleAssignModal.html',
                    controller: function ($scope) {
                        //modal中数据的初始化
                        //$scope.selectedRole = {};  //选择好了，那么对象就往这里放
                        //$scope.allRoles = $scope.userAllRoles;

                        $scope.xClick = function () {
                            modalInstance.dismiss('close');
                        }

                        $scope.okClick = function () {
                            var roleObjs = $scope.selectedRole.objs;
                            var role_names = [];
                            angular.forEach(roleObjs, function (role) {
                                role_names.push(role.name);
                            })

                            var data = {"user_ids":[row.id],"role_names":role_names};
                            $http({method: "POST", url: "api/users/change_roles", data: JSON.stringify(data)})
                            modalInstance.dismiss('close');
                        }

                        $scope.closeClick = function () {
                            modalInstance.dismiss('close');
                        }
                    },
                    size: 'md',
                    resolve: {
                        items: function () {
                            var role_names = [];
                            angular.forEach($scope.allRoles, function (role_obj) {
                                role_names.push(role_obj.role_name);
                            })
                            return role_names;
                        }
                    },
                    scope: $scope   //表示在这里使用父类的scope，在modal的controller里面可以直接调用父类的scope。
                })
            })

        }

        $scope.getTableHeight = function () {
            var rowHeight = 30; // your row height
            var headerHeight = 30; // your header height
            return {
                height: ($scope.gridOptions.data.length * rowHeight + headerHeight) + "px"
            };
        }

    }]);
