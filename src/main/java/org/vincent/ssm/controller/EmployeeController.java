package org.vincent.ssm.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.vincent.ssm.bean.Employee;
import org.vincent.ssm.dto.MVCResponse;
import org.vincent.ssm.service.EmployeeService;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/emps")
    @ResponseBody
    public MVCResponse getEmpsWithJson(@RequestParam(value="pn", defaultValue = "1") Integer pn) {
        PageHelper.startPage(pn, 5);
        List<Employee> employeeList = employeeService.getAll();
        PageInfo<Employee> result = new PageInfo(employeeList, 10);
        return MVCResponse.success().add("pageInfo", result);
    }

    @GetMapping("/emp/{empId}")
    @ResponseBody
    public MVCResponse getEmp(@PathVariable("empId") Integer empID) {
        Employee employee = employeeService.getEmployee(empID);
        return MVCResponse.success().add("employee", employee);
    }

    @DeleteMapping("/emp/{empIds}")
    @ResponseBody
    public MVCResponse delEmp(@PathVariable("empIds") String empIDs) {
        employeeService.delEmployee(empIDs);
        return MVCResponse.success();
    }

    @PostMapping("/emp")
    @ResponseBody
    public MVCResponse saveEmp(@Valid Employee employee, BindingResult result) {
        if(result.hasErrors()){
            Map<String, Object> map = new HashMap<>();
            List<FieldError> errors = result.getFieldErrors();
            for(FieldError fieldError : errors) {
                map.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return MVCResponse.fail().add("errorFields", map);
        }
        employeeService.saveEmp(employee);
        return MVCResponse.success();
    }

    /**
     * 今天学了一个很很很关键的知识点，就是，下面的 @PutMapping("/emp/{empId}") ，里面的 empId, 要和 org.vincent.ssm.bean.Employee#empId 一样，
     * 这样的话即使前台的 form 的data, 也就是下面：
     *
     *         $.ajax({
     *             url: myContextPath + "/emp/" + $(this).attr("empID"),
     *             type: "POST",
     *             data: $("#empUpdateModal form").serialize() + "&_method=PUT",
     *         ......
     *
     * 虽然 data 没有带 empId, 但是由于 @PutMapping("/emp/{empId}") 认可了，那么参数 @Valid Employee employee 也有了这个值
     *
     * @param employee
     * @param result
     * @return
     */
    @PutMapping("/emp/{empId}")
    @ResponseBody
    public MVCResponse updateEmp(@Valid Employee employee, BindingResult result) {
        if(result.hasErrors()){
            Map<String, Object> map = new HashMap<>();
            List<FieldError> errors = result.getFieldErrors();
            for(FieldError fieldError : errors) {
                map.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return MVCResponse.fail().add("errorFields", map);
        }
        employeeService.updateEmp(employee);
        return MVCResponse.success();
    }

    @GetMapping("/checkEmpName")
    @ResponseBody
    public MVCResponse checkUser(@RequestParam("empName") String empName) {
        boolean result = employeeService.checkIfUserExist(empName);
        return result ? MVCResponse.success() : MVCResponse.fail();
    }
}
