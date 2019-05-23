package org.vincent.ssm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.vincent.ssm.bean.Department;
import org.vincent.ssm.dao.DepartmentMapper;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentMapper departmentMapper;

    public List<Department> getDepts() {
        return departmentMapper.selectByExample(null);
    }
}
