$(document).ready(start);

var start_time, duration, date, id, quarter, loc;
var locations, quarters;
var studentID = "691171", studentState;
var visible;

function start(){
	console.log("Start");
	getStudent();
	//getCompletedTable();
	getAvailableTable();
	visible = false;
}

function getStudent()
{
	console.log("getStudent.js");
	
	$.post("getStudent.php", {student:studentID}, 
		function (data) {			
			data = JSON.parse(data);
			studentState = data;	
			console.log(data);
		}
	)
}

function setStudentState(state)
{
	console.log("setStudentState.js");
	$.post("setState.php", {student:studentID, theState:state}, 
		function (data) {			
			console.log(data);	
			data = JSON.parse(data);
			studentState = state;	
			console.log(data);
		}
	)
		console.log("student state: " + studentState);
}

function getRegisteredTable(){
	console.log("registeredTable.js");
	
	$.post("registeredExamsQuery.php", {student:studentID}, 
		function (data) {
			data = JSON.parse(data);			
			//console.log(data);
			locations = data[1];
			displayRegisteredTable(data[0]);
			getCompletedTable();
		}
	)
}

function displayRegisteredTable(data)
{
	$("#registeredTable").empty();
	//console.log(data);
	var temp = [];
	for(var i = 0; i < data.length; i++)
	{
		id = data[i].id;
		start_time = getStartTime(data[i].start_time);
		duration = data[i].duration + " hours";
		date = data[i].date;
		quarter = getQuarter(data[i].quarter);
		loc = getLocation(data[i].location); 
		temp.push({ID:id, StartTime:start_time, Duration:duration, Date:date, Quarter:quarter, Location:loc});
	}
	//console.log("Temp: " + temp.length); // number of exams
	
	var tr = $("<tr Align='Center'><th>Quarter</th><th>Date</th><th>Start Time</th><th>Duration</th><th>Location</th><th>Action</th></tr>");
	$('#registeredTable').append(tr);
	
	for(var x = 0; x < temp.length; x++)
	{
		tr = $("<tr Align='Center'>");
        tr.append("<td>" + temp[x].Quarter + "</td>");
        tr.append("<td>" + temp[x].Date + "</td>");
        tr.append("<td>" + temp[x].StartTime + "</td>");
        tr.append("<td>" + temp[x].Duration + "</td>");
        tr.append("<td>" + temp[x].Location + "</td>");
		tr.append("<td><input type=button class='unregisterBtn' value='Unregister' style='display: block; width: 100%;' data-id=" + temp[x].ID +"> </td>");
		tr.append("</tr>")
        $('#registeredTable').append(tr);
		$(".unregisterBtn").unbind("click");
		$(".unregisterBtn").click(unregisterForExam);
	}
}

function getCompletedTable(){			
	console.log("getCompletedTable");
	$.post("completedExamsQuery.php", {student:studentID}, 
		function (data) {
			data = JSON.parse(data);			
			console.log(data);
			displayCompletedTable(data);
			}
		)
}

function displayCompletedTable(data)
{
	$("#completedTable").empty();
	var tr = $("<tr Align='Center'><th>Quarter</th><th>Date</th><th>Duration</th><th>Location</th><th>Grade</th><th>Possible</th><th>Detailed Grades</th></tr>");
	$('#completedTable').append(tr);
	
	for(var x = 0; x < data.length; x++)
	{
		tr = $("<tr Align='Center'>");
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

function unregisterForExam(){
	console.log("unregisterForExam");
	if(studentState == "registered")
	{
		console.log("unregisterForExam == true");
		console.log(this);
		// removes exam by IDs
		var id = $(this).attr("data-id");
		console.log(id);
		$.post("unregister.php", {id:id, student:studentID});
		setStudentState("ready");
		start();
	}
		console.log("student state: " + studentState);
		start();
}

function getAvailableTable() {
	console.log("getAvailableTable.js");
	
	$.post("availableExamsQuery.php", "", 
		function (data) {
			//console.log(data);
			data = JSON.parse(data);			
			//console.log(data);
			locations = data[2];
			quarters = data[1];
			displayAvailableTable(data[0]);
			getRegisteredTable();
		}
	)
}

function displayAvailableTable(data)
{
	$("#availableTable").empty();
	//console.log(data);
	var temp = [];
	for(var i = 0; i < data.length; i++)
	{
		id = data[i].id;
		start_time = getStartTime(data[i].start_time);
		duration = data[i].duration + " hours";
		date = data[i].date;
		quarter = getQuarter(data[i].quarter);
		loc = getLocation(data[i].location); 
		temp.push({ID:id, StartTime:start_time, Duration:duration, Date:date, Quarter:quarter, Location:loc});
	}
	//console.log("Temp: " + temp.length); // number of exams
	
	var tr = $("<tr Align='Center'><th>Quarter</th><th>Date</th><th>Start Time</th><th>Duration</th><th>Location</th><th>Action</th></tr>");
	$('#availableTable').append(tr);
	
	for(var x = 0; x < temp.length; x++)
	{
		tr = $("<tr Align='Center'>");
        tr.append("<td>" + temp[x].Quarter + "</td>");
        tr.append("<td>" + temp[x].Date + "</td>");
        tr.append("<td>" + temp[x].StartTime + "</td>");
        tr.append("<td>" + temp[x].Duration + "</td>");
        tr.append("<td>" + temp[x].Location + "</td>");
		tr.append("<td><input type=button class='registerBtn' value='Register' style='display: block; width: 100%;' data-id=" + temp[x].ID +"> </td>");
		tr.append("</tr>")
        $('#availableTable').append(tr);
		$(".registerBtn").unbind("click");
		$(".registerBtn").click(registerForExam);
	}
}

function registerForExam(){
	console.log("registerForExam");
		console.log("student state: " + studentState);
	if(studentState == "ready")
	{
		console.log("registerForExam == true");
		console.log(this);
		// removes exam by IDs
		var id = $(this).attr("data-id");
		console.log(id);
		$.post("register.php", {id:id, student:studentID});
		setStudentState("registered");
		start();
	}
		//console.log("student state: " + studentState);
		start();
}

function getQuarter(quarter)
{
	for(var i = 0; i < quarters.length; i++)
	{
		if(quarters[i].id == quarter)
		{
			return quarters[i].name;
		}
	}
	
}

function getLocation(loc)
{
	for(var i = 0; i < locations.length; i++)
	{
		if(locations[i].id == loc)
			return locations[i].name;
	}
}

function getStartTime(start_time)
{
	//console.log(start_time);
	var time = start_time.split(":");
	//console.log(time);
	if(time[0] != 12 && time[0] > 12)
	{
		time[0] = time[0]-12;
		time[3] = 1;
		if(time[0].toString().length == 1)
			time[0] = "0" + time[0];
	}
	else
	{
		time[0] = time[0];
		time[3] = 0;
	}
	//console.log(time);
	var startTime = time[0]+":"+time[1];
	if(time[3] == 0)
		startTime = startTime+"AM";
	else
		startTime = startTime+"PM";
	//console.log(startTime);
	return startTime;
}