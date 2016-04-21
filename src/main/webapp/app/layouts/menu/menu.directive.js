angular.module('quayPsApp').
    directive('defMenu', function() {
        return {
            restrict:'A',
            replace:true,
            templateUrl:'app/layouts/menu/menuListPart.html',
            controller:['$scope', function($scope){

                //一开始将所有的全部设置为关闭的状态
                for(var i = 0; i < $scope.menuList.length; i++){
                    $scope.menuList[i].unfold = false;
                }

                //当点击某一个条目的时候，将条目设置为打开的状态，其余的设置为关闭的状态
                $scope.itemClicked = function(item){
                    for(var i = 0; i< $scope.menuList.length ;i++){
                        if($scope.menuList[i].name == item.name){
                            $scope.menuList[i].unfold = !$scope.menuList[i].unfold;
                        }else{
                            $scope.menuList[i].unfold = false;
                        }
                    }
                }


            }]
        }
    });
