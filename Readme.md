* 分页
* 数据校验，包括Jquery前端校验 + JSR303后端校验
* AJAX (提升扩展性，用JSON作为数据传输)
* Rest
* Bootstrap
* Spring + MyBatis
* 逆向工程 MyBatis Generator
* 使用 MyBatis generator 生成 bean 和 dao, 使用以后，将生成：
1   org.vincent.ssm.bean 下面所有的类
2   org.vincent.ssm.dao  下面所有的类
3   resources/mapper 下面所有的xml

然后会在上面修改，所以不要随便删除或者重新生成。


知识点集合：
1，如果要彻底只是中文，除了用 org.springframework.web.filter.CharacterEncodingFilter 以外，还要求在 tomcat 的配置中使用

<connector URIEncoding="UTF-8" ... />

2, 加入 Mybatis 的表对应的属性和 entity 的类属性不一致怎么办
第一种解决方案：写SQL 语句的时候起别名，就是说，在写mapper.xml的时候，select AAA as bbb 其中 bbb 就是类的属性名
第二种解决方案：在 mybatis-config.xml 的configuration -> settings 处修改：<setting name="mapUnderscoreToCamelCase" value="true"/>
第三种解决方案：在mapper.xml 里的 resultMap 进行mapping:

  <resultMap id="BaseResultMap" type="org.vincent.ssm.bean.Department">
    <id column="dept_id" jdbcType="INTEGER" property="deptId" />
    <result column="dept_name" jdbcType="VARCHAR" property="deptName" />
  </resultMap>