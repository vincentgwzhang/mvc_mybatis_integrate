var myContextPath = global_getContextPath();
var totalRecord = 0;

$(document).ready(pageInit());

function pageInit() {
    loadData();
    initComponent();
}

function initComponent() {
    initEmpAddBtn();
    initEmpAddSaveBtn();
    initAddFormTextComponent();
    initAddFormEmailComponent();
}

function initEmpAddSaveBtn() {
    $("#emp_save_btn").click(function () {
        if(!validate_add_form()) {
            return false;
        }
        /**
         * TODO: Knowledge Point: $("#empAddModal form").serialize()
         * Step 1, in the form, need to make all the component name, map to the bean attribute name, for example:
         * <input type="text" name="empName" class="form-control" id="empName_add_input" placeholder="empName"> map to org.vincent.ssm.bean.Employee.empName
         * Step 2, use $("#empAddModal form").serialize()
         */
        $.ajax({
            url: myContextPath + "/emp",
            type: "post",
            data: $("#empAddModal form").serialize(),
            success: function (result) {
                totalRecord++;
                $("#empAddModal").modal("hide");
                //navigate to new emp
                to_page(totalRecord);
            }
        });
    });
}

function initEmpAddBtn() {
    $('#emp_add_modal_btn').click(function () {
        showModel("#empAddModal");
        clearForm("#empName_add_input", "#email_add_input");
        emptyForm("#empName_add_input", "#email_add_input");
        fillSelectOptionWithDeptData("#empAddModal select");
    });
}

function validate_add_form() {
    var validate = true;
    clearForm("#empName_add_input", "#email_add_input");
    if(!validateEmpName("#empName_add_input")) {
        validate = false;
    } else if(!validateEmpNameExist("#empName_add_input")) {
        validate = false;
    }

    if(!validateEmail("#email_add_input")) {
        validate = false;
    }
    return validate;
}

function clearForm(empNameSelector, emailSelector) {
    clearEmpName(empNameSelector);
    clearEmailSelector(emailSelector);
}

function emptyForm(empNameSelector, emailSelector) {
    $(empNameSelector).val("");
    $(emailSelector).val("");
}

function clearEmpName(empNameSelector) {
    $(empNameSelector).parent().removeClass("has-error");
    $(empNameSelector).parent().removeClass("has-success");
    $(empNameSelector).next("span").text("");
}

function clearEmailSelector(emailSelector) {
    $(emailSelector).parent().removeClass("has-success");
    $(emailSelector).parent().removeClass("has-error");
    $(emailSelector).next("span").text("");
}

function initAddFormTextComponent() {
    $("#empName_add_input").blur(function () {
        if(!validateEmpName("#empName_add_input")) {
            return;
        }
        validateEmpNameExist("#empName_add_input");
    });
}

function validateEmpNameExist(empNameSelector) {
    clearEmpName(empNameSelector);
    var result = isEmpNameExist(empNameSelector);
    if(!result) {
        $(empNameSelector).parent().addClass("has-error");
        $(empNameSelector).next("span").text("emp name exist already");
    } else {
        $(empNameSelector).parent().addClass("has-success");
        $(empNameSelector).next("span").text("emp name correct");
    }
    return result;
}

function initAddFormEmailComponent() {
    $("#email_add_input").blur(function () {
        validateEmail("#email_add_input");
    });
}

function validateEmail(emailSelector) {
    clearEmailSelector(emailSelector);

    var result = isEmailCorrect(emailSelector);
    if(!result) {
        $(emailSelector).parent().addClass("has-error");
        $(emailSelector).next("span").text("Email invalid");
    } else {
        $(emailSelector).parent().addClass("has-success");
        $(emailSelector).next("span").text("Email correct");
    }
    return result;
}

function validateEmpName(empNameSelector) {
    clearEmpName(empNameSelector);

    var result = isEmpNameCorrect(empNameSelector);
    if(!result) {
        $(empNameSelector).parent().addClass("has-error");
        $(empNameSelector).next("span").text("emp name invalid");
    } else {
        $(empNameSelector).parent().addClass("has-success");
        $(empNameSelector).next("span").text("emp name correct");
    }
    return result;
}

function isEmpNameCorrect(empNameSelector) {
    var empName = $(empNameSelector).val();
    var regName = /(^[a-zA-Z0-9_-]{6,16}$)|(^[\u2E80-\u9FFF]{2,5})/;
    return regName.test(empName) && empName != "";
}

function isEmailCorrect(emailSelector) {
    var email = $(emailSelector).val();
    var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEmail.test(email);
}

function showModel(modelSelector) {
    $(modelSelector).modal({
        backdrop: true,
        keyboard: true
    });
}

function isEmpNameExist(empNameSelector) {
    var empNameValue = $(empNameSelector).val();
    var validated = true;
    $.ajax({
        url: myContextPath + "/checkEmpName",
        data: "empName=" + empNameValue,
        type: "get",
        async: false,
        success: function (result) {
            if(result.code == 200) {
                $(empNameSelector).parent().addClass("has-error");
                $(empNameSelector).next("span").text("emp name exist already");
                validated = false;
            } else {
                $(empNameSelector).parent().addClass("has-success");
                $(empNameSelector).next("span").text("emp name correct");
            }
        }
    });
    return validated;
}

function fillSelectOptionWithDeptData(selectID) {
    $.ajax({
        url: myContextPath + "/depts",
        type: "get",
        success: function (result) {
            $(selectID).empty();
            $.each(result.extend.depts, function () {
                $("<option></option>").append(this.deptName).attr("value", this.deptId).appendTo(selectID);
            });
        }
    });
}

function loadData() {
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
    totalRecord = result.extend.pageInfo.total;
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