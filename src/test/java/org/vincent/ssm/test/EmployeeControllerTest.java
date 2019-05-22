package org.vincent.ssm.test;

import com.github.pagehelper.PageInfo;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.vincent.ssm.bean.Employee;

import java.util.List;

/**
 * 使用Spring 测试模块的请求功能，测试CRUD 的正确性
 */
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {"classpath:applicationContext.xml", "file:src/main/resources/spring-mvc.xml"})
public class EmployeeControllerTest {

    @Autowired
    WebApplicationContext context;

    MockMvc mockMvc;

    @Before
    public void initMockMVC() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    public void testPage() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/emps").param("pn", "9")).andReturn();

        MockHttpServletRequest mockHttpServletRequest = mvcResult.getRequest();
        PageInfo<Employee> pageInfo = (PageInfo<Employee>) mockHttpServletRequest.getAttribute("pageInfo");
        System.out.println("Current Page: " + pageInfo.getPageNum());
        System.out.println("Total Page:   " + pageInfo.getPages());
        System.out.println("Total Record: " + pageInfo.getTotal());
        int[] nums = pageInfo.getNavigatepageNums();
        for(int index = 0; index < nums.length; index ++) {
            System.out.print(" " + nums[index]);
        }
        System.out.println();

        List<Employee> employeeList = pageInfo.getList();
        for(Employee employee : employeeList) {
            System.out.println("ID:" + employee.getEmpId() + "==> Name:" + employee.getEmpName());
        }
    }

}
