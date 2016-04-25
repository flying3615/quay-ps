angular.module('quayPsApp').
directive('defMenu', function () {

    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'app/layouts/menu/menuListPart.html',
        link: function (scope, el, attrs) {

            scope.$watchCollection('menuList',function(newVal){
                console.log(newVal);
                if(newVal){
                    for (var i = 0; i < newVal.length; i++) {
                        newVal[i].unfold = false;
                    }

                    //当点击某一个条目的时候，将条目设置为打开的状态，其余的设置为关闭的状态
                    scope.itemClicked = function (item) {
                        for (var i = 0; i < newVal.length; i++) {
                            if (newVal[i].name == item.name) {
                                newVal[i].unfold = !newVal[i].unfold;
                            } else {
                                newVal[i].unfold = false;
                            }
                        }
                    }
                }
            })



        }

    }
})
