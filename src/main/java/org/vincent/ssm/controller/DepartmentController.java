package org.vincent.ssm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.vincent.ssm.bean.Department;
import org.vincent.ssm.dto.MVCResponse;
import org.vincent.ssm.service.DepartmentService;

import java.util.List;

@Controller
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping("/depts")
    @ResponseBody
    public MVCResponse getDepts() {
        List<Department> departmentList = departmentService.getDepts();
        return MVCResponse.success().add("depts", departmentList);
    }

}
