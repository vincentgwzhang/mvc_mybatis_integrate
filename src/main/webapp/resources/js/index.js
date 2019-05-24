var myContextPath = global_getContextPath();
var totalRecord = 0;
var currentPageNum = 0;

$(document).ready(pageInit());

function pageInit() {
    loadData();
    initComponent();
}

function initComponent() {
    initEmpAddBtn();
    initEmpAddSaveBtn();
    initEmpUpdateSaveBtn();
    initAddFormTextComponent();
    initAddFormEmailComponent();
    initUpdateFormEmailComponent();
    initEmpEditBtn();
    initEmpDelBtn();
    initCheckAllBtn();
    initCheckItemBtn();
    initBatchDeleteBtn();
}

function initBatchDeleteBtn() {
    $("#emp_delete_all").click(function () {
        var empNames = "";
        $.each($(".check_item:checked"), function () {
            empNames += $(this).parents("tr").find("td:eq(2)").text() + ",";
        })
        empNames = empNames.substring(0, empNames.length-1);
        if (confirm("Confirm to delte " + empNames + "?")) {
            var empIds = "";
            $.each($(".check_item:checked"), function () {
                empIds += $(this).parents("tr").find("td:eq(1)").text() + "-";
            })
            empIds = empIds.substring(0, empIds.length-1);
            $.ajax({
                url: myContextPath + "/emp/" + empIds,
                type: "delete",
                success: function (result) {
                    to_page(currentPageNum);
                }
            });
        }
    });
}

function initCheckItemBtn() {
    $(document).on("click", ".check_item", function () {
        if ( $(".check_item:checked").length == $(".check_item").length ) {
            $("#check_all").prop("checked", true);
        } else {
            $("#check_all").prop("checked", false);
        }
    })
}

function initCheckAllBtn() {
    $("#check_all").click(function () {
        var selected = $("#check_all").prop("checked");
        $(".check_item").prop("checked", selected);
    });
}

function initEmpUpdateSaveBtn() {
    $("#emp_update_btn").click(function () {
        if(!validate_edit_form()) {
            return false;
        }

        $.ajax({
            url: myContextPath + "/emp/" + $(this).attr("empID"),
            type: "PUT",
            data: $("#empUpdateModal form").serialize(),
            success: function (result) {
                if(result.code == 100) {
                    $("#empUpdateModal").modal("hide");
                    //navigate to new emp
                    to_page(currentPageNum);
                } else {
                    if(undefined != result.extend.errorFields.email) {
                        show_Validate_msg("#email_add_input", "has-error", result.extend.errorFields.email);
                    }
                }
            }
        });
    });
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
                if(result.code == 100) {
                    totalRecord++;
                    $("#empAddModal").modal("hide");
                    //navigate to new emp
                    to_page(totalRecord);
                } else {
                    if(undefined != result.extend.errorFields.email) {
                        show_Validate_msg("#email_add_input", "has-error", result.extend.errorFields.email);
                    }

                    if (undefined != result.extend.errorFields.empName) {
                        show_Validate_msg("#empName_add_input", "has-error", result.extend.errorFields.empName);
                    }
                }
            }
        });
    });
}

function initEmpAddBtn() {
    $('#emp_add_modal_btn').click(function () {
        showModel("#empAddModal");
        clearForm("#empName_add_input", "#email_add_input");
        emptyForm("#empName_add_input", "#email_add_input");
        fillSelectOptionWithDeptData("#empAddModal select", true);
    });
}

function getEmp(empID) {
    $.ajax({
        url: myContextPath + "/emp/" + empID,
        type: "get",
        success: function (result) {
            var employee = result.extend.employee
            var empIDResult = employee.empId;
            var emailResult = employee.email;
            var empNameResult = employee.empName;
            var genderResult = employee.gender;
            var didResult = employee.dId;
            $("#empName_update_static").text(empNameResult);
            $("#email_update_input").val(emailResult);
            $("#empUpdateModal input[name=gender]").val([genderResult]);
            $("#empUpdateModal select").val([didResult]);
        }
    });
}

function initEmpEditBtn() {
    $(document).on("click", ".edit_btn", function(){
        clearEmailSelector("#email_update_input");
        showModel("#empUpdateModal");
        fillSelectOptionWithDeptData("#empUpdateModal select", false);
        getEmp($(this).attr("empID"));
        $("#emp_update_btn").attr("empID", $(this).attr("empID"));
    });
}

function initEmpDelBtn() {
    $(document).on("click", ".delete_ben", function(){
        var empID = $(this).attr("empID");
        var empName = $(this).parents("tr").find("td:eq(2)").text();
        if(confirm("Confirm to delete " + empName + "?")) {
            $.ajax({
                url: myContextPath + "/emp/" + empID,
                type: "delete",
                success: function (result) {
                    to_page(currentPageNum);
                }
            });
        }
    });
}

function validate_edit_form() {
    var validate = true;
    if(!validateEmail("#email_update_input")) {
        validate = false;
    }
    return validate;
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
        show_Validate_msg(empNameSelector, "has-error", "emp name exist already");
    } else {
        show_Validate_msg(empNameSelector, "has-success", "emp name correct");
    }
    return result;
}

function show_Validate_msg(fieldSelector, cssClass, message) {
    $(fieldSelector).parent().addClass(cssClass);
    $(fieldSelector).next("span").text(message);
}

function initAddFormEmailComponent() {
    $("#email_add_input").blur(function () {
        validateEmail("#email_add_input");
    });
}

function initUpdateFormEmailComponent() {
    $("#email_update_input").blur(function () {
        validateEmail("#email_update_input");
    });
}

function validateEmail(emailSelector) {
    clearEmailSelector(emailSelector);

    var result = isEmailCorrect(emailSelector);
    if(!result) {
        show_Validate_msg(emailSelector, "has-error", "Email invalid");
    } else {
        show_Validate_msg(emailSelector, "has-success", "Email correct");
    }
    return result;
}

function validateEmpName(empNameSelector) {
    clearEmpName(empNameSelector);

    var result = isEmpNameCorrect(empNameSelector);
    if(!result) {
        show_Validate_msg(empNameSelector, "has-error", "emp name invalid");
    } else {
        show_Validate_msg(empNameSelector, "has-success", "emp name correct");
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
                show_Validate_msg(empNameSelector, "has-error", "emp name exist already");
                validated = false;
            } else {
                show_Validate_msg(empNameSelector, "has-success", "emp name correct");
            }
        }
    });
    return validated;
}

function fillSelectOptionWithDeptData(selectID, isASYNC) {
    $.ajax({
        url: myContextPath + "/depts",
        type: "get",
        async: isASYNC,
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
    currentPageNum = pn;
    $("#check_all").prop("checked", false);
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

        var empCheckedTD = $("<td><input type='checkbox' class='check_item' /></td>");
        var empIdTD = $("<td></td>").append(empId);
        var empNameTD = $("<td></td>").append(empName);
        var genderTD = $("<td></td>").append(gender);
        var emailTD = $("<td></td>").append(email);
        var deptNameTD = $("<td></td>").append(deptName);

        var editBtn = $("<button></button>").addClass("btn btn-primary btn-sm edit_btn").append($("<span></span>").addClass("glyphicon glyphicon-pencil")).append(" Edit");
        var deltBtn = $("<button></button>").addClass("btn btn-danger btn-sm delete_ben").append($("<span></span>").addClass("glyphicon glyphicon-trash")).append(" Delete");
        var buttonTD = $("<td></td>").append(editBtn).append("&nbsp;&nbsp;&nbsp;").append(deltBtn);
        editBtn.attr("empId",empId);
        deltBtn.attr("empId",empId);

        $("<tr></tr>")
            .append(empCheckedTD)
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
    currentPageNum = result.extend.pageInfo.pageNum;
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