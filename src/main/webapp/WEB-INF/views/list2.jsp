<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta HTTP-EQUIV="pragma" CONTENT="no-cache">
	<meta HTTP-EQUIV="Cache-Control" CONTENT="no-store, no-cache, must-revalidate">
	<meta HTTP-EQUIV="expires" CONTENT="-1">
	<meta http-equiv="Cache" content="no-cache">
	<title>Staff list</title>
	<% pageContext.setAttribute("APP_PATH", request.getContextPath()); %>
	<spring:url value="/js/jquery-3.4.1.min.js" var="jqueryJS" />
	<spring:url value="/bootstrap/js/bootstrap3.min.js" var="bootstrapJS" />
	<spring:url value="/js/index.js" var="indexJS" />
	<spring:url value="/js/global.js" var="globalJS" />
	<spring:url value="/bootstrap/css/bootstrap3.min.css" var="bootstrapCSS" />
	<script type="text/javascript" src="${globalJS}"></script>
	<script type="text/javascript" src="${jqueryJS}"></script>
	<link rel="stylesheet" type="text/css" href="${bootstrapCSS }">
	<script type="text/javascript" src="${bootstrapJS}"></script>
	<script type="text/javascript" src="${indexJS}"></script>
</head>
<body>
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<h1>SSM-CRUD</h1>
			</div>
		</div>
		<div class="row">
			<div class="col-md-4 col-md-offset-8">
				<button class="btn btn-primary">New</button>
				<button class="btn btn-danger">Delete</button>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<table class="table table-hover" id="emps_table">
					<thead>
						<tr>
							<th>#</th>
							<th>empName</th>
							<th>gender</th>
							<th>email</th>
							<th>deptName</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>

					</tbody>
				</table>
			</div>
		</div>
		<div class="row">
			<div class="col-md-4" id="page_info_area"></div>
			<div class="col-md-8" id="page_nav_area"></div>
		</div>
	</div>
</body>
</html>