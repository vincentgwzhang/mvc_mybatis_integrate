var myContextPath = global_getContextPath();

function pageInit() {
    $.ajax({
        url: myContextPath + "/emps",
        data: "pn=1",
        type: "get",
        success: function (result) {
            build_emps_table(result);
            build_page_info(result);
            build_page_nav(result);
        }
    });
}

function to_page(pn){
    $.ajax({
        url: myContextPath + "/emps",
        data:"pn="+pn,
        type:"GET",
        success:function (result) {
            build_emps_table(result);
            build_page_info(result);
            build_page_nav(result);
        }
    });
}

function build_emps_table(result) {
    $("#emps_table tbody").empty();

    var emps = result.extend.pageInfo.list;
    $.each(emps, function (index, item) {
        var empId = item.empId;
        var empName = item.empName;
        var gender = item.gender == 'M' ? 'Male':'Female';
        var email = item.email;
        var deptName = item.department.deptName;

        var empIdTD = $("<td></td>").append(empId);
        var empNameTD = $("<td></td>").append(empName);
        var genderTD = $("<td></td>").append(gender);
        var emailTD = $("<td></td>").append(email);
        var deptNameTD = $("<td></td>").append(deptName);

        var editBtn = $("<button></button>").addClass("btn btn-primary btn-sm").append($("<span></span>").addClass("glyphicon glyphicon-pencil")).append(" Edit");
        var deltBtn = $("<button></button>").addClass("btn btn-danger btn-sm").append($("<span></span>").addClass("glyphicon glyphicon-trash")).append(" Delete");
        var buttonTD = $("<td></td>").append(editBtn).append("&nbsp;&nbsp;&nbsp;").append(deltBtn);

        $("<tr></tr>")
            .append(empIdTD)
            .append(empNameTD)
            .append(genderTD)
            .append(emailTD)
            .append(deptNameTD)
            .append(buttonTD)
            .appendTo("#emps_table tbody");
    });
}

function build_page_info(result) {
    $("#page_info_area").empty();
    $("#page_info_area").append("The " + result.extend.pageInfo.pageNum + " Page, " + result.extend.pageInfo.pages + " pages, " + result.extend.pageInfo.total + " Records");
}

function build_page_nav(result){
    $("#page_nav_area").empty();
    var ul = $("<ul></ul>").addClass("pagination");

    var firstPageLi = $("<li></li>").append($("<a></a>").append("First").attr("href","#"));
    var prePageLi = $("<li></li>").append($("<a></a>").append("&laquo;"));
    if(result.extend.pageInfo.hasPreviousPage == false){
        firstPageLi.addClass("disabled");
        prePageLi.addClass("disabled");
    }else{
        firstPageLi.click(function(){
            to_page(1);
        });
        prePageLi.click(function(){
            to_page(result.extend.pageInfo.pageNum -1);
        });
    }

    var nextPageLi = $("<li></li>").append($("<a></a>").append("&raquo;"));
    var lastPageLi = $("<li></li>").append($("<a></a>").append("Last").attr("href","#"));
    if(result.extend.pageInfo.hasNextPage == false){
        nextPageLi.addClass("disabled");
        lastPageLi.addClass("disabled");
    }else{
        nextPageLi.click(function(){
            to_page(result.extend.pageInfo.pageNum +1);
        });
        lastPageLi.click(function(){
            to_page(result.extend.pageInfo.pages);
        });
    }

    ul.append(firstPageLi).append(prePageLi);
    $.each(result.extend.pageInfo.navigatepageNums,function(index,item){
        var numLi = $("<li></li>").append($("<a></a>").append(item));
        if(result.extend.pageInfo.pageNum == item){
            numLi.addClass("active");
        }
        numLi.click(function(){
            to_page(item);
        });
        ul.append(numLi);
    });
    ul.append(nextPageLi).append(lastPageLi);
    var navEle = $("<nav></nav>").append(ul);
    navEle.appendTo("#page_nav_area");
}

$(document).ready(pageInit());