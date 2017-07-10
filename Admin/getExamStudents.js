$(document).ready(start);

var visible;

function start(){
	console.log("Start");
	getCompletedTable();
	visible = false;
}

function getCompletedTable(){			
	console.log("getCompletedTable");
	var examID = $("#examId").val();
	console.log(examID);
	$.post("getStudentExamGradesQuery.php", {exam:examID}, 
		function (data) {		
			console.log(data);
			data = JSON.parse(data);			
			console.log(data);
			displayCompletedTable(data);
			}
		)
}

function displayCompletedTable(data)
{
	$("#completedTable").empty();
	var tr = $("<tr Align='Center'><th>EWU ID</th><th>First Name</th><th>Last Name</th><th>Quarter</th><th>Date</th><th>Duration</th><th>Location</th><th>Grade</th><th>Possible</th><th>Detailed Grades</th></tr>");
	$('#completedTable').append(tr);
	
	for(var x = 0; x < data.length; x++)
	{
		tr = $("<tr Align='Center'>");
        tr.append("<td>" + data[x].EWU_ID + "</td>");
        tr.append("<td>" + data[x].f_name + "</td>");
        tr.append("<td>" + data[x].l_name + "</td>");
        tr.append("<td>" + data[x].quarter + "</td>");
        tr.append("<td>" + data[x].date + "</td>");
        tr.append("<td>" + data[x].duration + " hours</td>");
        tr.append("<td>" + data[x].location + "</td>");
		if(data[x].passed == 0)			
			tr.append("<td bgcolor='#FF0000'>" + data[x].grade + "</td>");
		else
			tr.append("<td bgcolor='#00FF00'>" + data[x].grade + "</td>");
        tr.append("<td>" + data[x].possible + "</td>");
		tr.append("<td><input type=button class='viewGradesBtn' value='Show' style='display: block; width: 100%;' data-examID=" + data[x].exam_id +" data-studentID=" + data[x].student_id +"> </td>");
		tr.append("</tr>")
        $('#completedTable').append(tr);
		$(".viewGradesBtn").unbind("click");
		$(".viewGradesBtn").click(getDetailedTable);
	}
}

function hideDetailedTable()
{
	$("#detailsTable").empty();
	visible = false;
}

function getDetailedTable()
{	
	if(this.value == "Hide")
	{
		this.value = "Show";
		hideDetailedTable();
	}
	else{
		this.value = "Hide";
		console.log("getDetailedTable");
		var studentID = $(this).attr("data-studentID");
		var examID = $(this).attr("data-examID");

		console.log("student: " + studentID);
		console.log("exam: " + examID);
		
		$.post("getDetailedTable.php", {id:studentID, exam:examID}, 
				function(data){	
					data = JSON.parse(data);	
					console.log(data);
					displayDetailedTable(data);	
				}
				)
	}
}

function displayDetailedTable(data)
{
	hideDetailedTable();
	var tr = $("<tr Align='Center'><th>Category</th><th>Grade</tr>");
	$('#detailsTable').append(tr);
	
	for(var x = 0; x < data.length; x++)
	{
		tr = $("<tr Align='Center'>");
		tr.append("<td>" + data[x].category + "</td>");
		tr.append("<td>" + data[x].grade + "/" + data[x].possible + "</td>");
		tr.append("</tr>")
		$('#detailsTable').append(tr);
	}
	visible = true;
}