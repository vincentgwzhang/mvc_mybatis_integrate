<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Spring MVC XML Config Example</title>
    <spring:url value="/resources/js/jquery-3.4.1.min.js" var="jqueryJS" />
    <spring:url value="/resources/bootstrap/bootstrap.min.js" var="bootstrapJS" />
    <spring:url value="/resources/bootstrap/bootstrap.min.css" var="bootstrapCSS" />
    <script src="${jqueryJS}"></script>
    <script src="${bootstrapJS}"></script>
    <link rel="stylesheet" href="${bootstrapCSS }">
</head>
<body>

${message}

</body>
</html>
