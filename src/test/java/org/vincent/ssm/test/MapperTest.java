package org.vincent.ssm.test;

import org.apache.ibatis.session.SqlSession;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;
import org.vincent.ssm.bean.Department;
import org.vincent.ssm.bean.Employee;
import org.vincent.ssm.dao.DepartmentMapper;
import org.vincent.ssm.dao.EmployeeMapper;

import java.util.List;
import java.util.UUID;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
public class MapperTest {

    @Autowired
    DepartmentMapper departmentMapper;

    @Autowired
    EmployeeMapper employeeMapper;

    @Autowired
    SqlSession sqlSession;

    /**
     * 添加 @Transactional 事务自动回滚
     */
    @Test
    @Transactional
    public void testCRUD() {
        /**
         * 使用了@ContextConfiguration 就不需要下面两句了
         //Create Spring IOC container
         ApplicationContext ioc = new ClassPathXmlApplicationContext("applicationContext.xml");

         //Get mapper from container
         DepartmentMapper mapper = ioc.getBean(DepartmentMapper.class);
         *
         */
        departmentMapper.insertSelective(new Department(null, "Develop"));
        departmentMapper.insertSelective(new Department(null, "Test"));

        List<Department> departments = departmentMapper.selectByExample(null);
        Department developDepartment = departments.get(0);
        employeeMapper.insertSelective(new Employee(null, "Jerry", "M", "jerry@atgiogi.com", developDepartment.getDeptId(), developDepartment));
    }

    @Ignore
    public void testBatch() {
        clearDB();

        departmentMapper.insertSelective(new Department(null, "Department A"));
        departmentMapper.insertSelective(new Department(null, "Department B"));

        List<Department> departments = departmentMapper.selectByExample(null);
        Department departmentA = departments.get(0);
        Department departmentB = departments.get(1);

        EmployeeMapper sessionBatchEmployeeMapper = sqlSession.getMapper(EmployeeMapper.class);
        for(int index = 0; index < 500; index ++){
            String name = UUID.randomUUID().toString().substring(0, 20);
            sessionBatchEmployeeMapper.insertSelective(new Employee(null, name, "M", name + "@atgiogi.com", departmentA.getDeptId(), departmentA));
            sessionBatchEmployeeMapper.insertSelective(new Employee(null, name, "F", name + "@atgiogi.com", departmentB.getDeptId(), departmentB));
        }

    }

    private void clearDB() {
        employeeMapper.deleteByExample(null);
        departmentMapper.deleteByExample(null);
    }


}
