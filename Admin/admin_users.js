$(document).ready(start);

function start()
{
	//console.log("Start");
	
	$("#searchBtn").click(search);
}

function search()
{
	////console.log("search");
	remake();
	var query = $("#searchBar").val();
	//console.log("search: " + query);
	$.post("SearchUsers.php", {"search" : query, "table" : "student"}, resultsRecievedStudent);
	$.post("SearchUsers.php", {"search" : query, "table" : "grader"}, resultsRecievedGrader);
	$.post("SearchUsers.php", {"search" : query, "table" : "teacher"}, resultsRecievedTeacher);
}

function resultsRecievedStudent(data)
{
	////console.log("resultsRecieved: " + data);
	var obj = JSON.parse(data);
	$.each(obj, createRowStudent);
}

function resultsRecievedGrader(data)
{
	//console.log("resultsRecieved: " + data);
	var obj = JSON.parse(data);
	$.each(obj, createRowGrader);
}

function resultsRecievedTeacher(data)
{
	//console.log("resultsRecieved: " + data);
	var obj = JSON.parse(data);
	$.each(obj, createRowTeacher);
}

function createRowStudent(key, value)
{
	var tr = $("<tr><td>" + value.EWU_ID + "</td>");
	tr.append("<td>" + value.l_name + "</td>");
	tr.append("<td>" + value.f_name + "</td>");
	tr.append("<td>" + value.email + "</td>");
	tr.append("<td>" + value.state + "</td>");
	tr.append("<td><form action=\"ViewStudent.php\" method=\"post\"><input type=\"hidden\" name='id' value=\"" + value.EWU_ID + "\"> <input type=\"submit\" value=\"View\"> </form> </td></tr>");
	$("#student_tbl").append(tr);
}

function createRowGrader(key, value)
{
	//console.log("createRow: " + value + " " + key);
	$("#grader_tbl").append("<tr><td>" + value.EWU_ID + "</td><td>" + value.l_name + "</td><td>" + value.f_name + "</td><td>" + value.email + "</td><td><input data-name=" + value.EWU_ID + " type='submit' id='view_grader' class='view_grader' value='view'</td></tr>");
}

function createRowTeacher(key, value)
{
	//console.log("createRow: " + value + " " + key);
	$("#teacher_tbl").append("<tr><td>" + value.EWU_ID + "</td><td>" + value.l_name + "</td><td>" + value.f_name + "</td><td>" + value.email + "</td><td><input data-name=" + value.EWU_ID + " type='submit' id='view_teacher' class='view_teacher' value='view'</td></tr>");
}

function remake()
{
	$("#student_tbl").find("tr:gt(0)").remove();
	$("#grader_tbl").find("tr:gt(0)").remove();
	$("#teacher_tbl").find("tr:gt(0)").remove();
}