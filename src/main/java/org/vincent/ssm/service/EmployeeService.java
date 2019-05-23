package org.vincent.ssm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.vincent.ssm.bean.Employee;
import org.vincent.ssm.bean.EmployeeExample;
import org.vincent.ssm.dao.EmployeeMapper;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeMapper employeeMapper;

    public List<Employee> getAll() {
        EmployeeExample employeeExample = new EmployeeExample();
        employeeExample.setOrderByClause("emp_id");
        return employeeMapper.selectByExampleWithDept(employeeExample);
    }

    public void saveEmp(Employee employee) {
        employeeMapper.insertSelective(employee);
    }

    public boolean checkIfUserExist(String empName) {
        EmployeeExample employeeExample = new EmployeeExample();
        EmployeeExample.Criteria criteria = employeeExample.createCriteria();
        criteria.andEmpNameEqualTo(empName);
        return employeeMapper.countByExample(employeeExample) == 0L;
    }
}
