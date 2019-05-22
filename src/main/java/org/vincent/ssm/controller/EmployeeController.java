package org.vincent.ssm.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.vincent.ssm.bean.Employee;
import org.vincent.ssm.dto.MVCResponse;
import org.vincent.ssm.service.EmployeeService;

import java.util.List;

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

    public String getAllEmps() {
        return "list";
    }

}
