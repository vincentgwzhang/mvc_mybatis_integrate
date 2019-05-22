package org.vincent.ssm.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.vincent.ssm.bean.Employee;
import org.vincent.ssm.service.EmployeeService;

import java.util.List;

@Controller
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/emps")
    public String getAllEmps(@RequestParam(value="pn", defaultValue = "1") Integer pn, Model model) {
        PageHelper.startPage(pn, 5);//How many for each page
        List<Employee> employeeList = employeeService.getAll();
        PageInfo<Employee> page = new PageInfo(employeeList, 10);//How many page to display
        model.addAttribute("pageInfo", page);
        return "list";
    }

}
