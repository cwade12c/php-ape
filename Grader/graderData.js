$(document).ready(start);

var graderID = "1";

function start(){
	gettbgTable();
}

function gettbgTable()
{
	$.post("getToBeGradedExams.php", {grader:graderID}, 
		function (data) {		
			data = JSON.parse(data);
			displaytbgTable(data);
		})
}

function displaytbgTable(data)
{
	var tr = $("<tr Align='Center'><th>Category</th><th>Quarter</th><th>Date</th><th>Time</th><th>Duration</th><th>Location</th><th colspan='2'>Action</th></tr>");
	$('#tbgTable').append(tr);
	for(var x = 0; x < data.length; x++)
	{
		var time = getStartTime(data[x].time);
		tr = $("<tr Align='Center'>");
        tr.append("<td>" + data[x].category + "</td>");
        tr.append("<td>" + data[x].quarter + "</td>");
        tr.append("<td>" + data[x].date + "</td>");
        tr.append("<td>" + time + "</td>");
        tr.append("<td>" + data[x].duration + " hours</td>");
        tr.append("<td>" + data[x].location + "</td>");
		tr.append("<td><form action=\"grader2.php\" method=\"post\"><input type=\"hidden\" name='assignedId' value=\"" + data[x].assignedId + "\"><input type=\"hidden\" name='graderId' value=\"" + graderID + "\"><input type=\"submit\" value='Grade' style='display: block; width: 100%;'></form></td>");
		tr.append("<td><input type=button class='submitBtn' value='Submit Exam' style='display: block; width: 100%;' data-id=" + data[x].assignedId +"></td>");
		tr.append("</tr>");
        $('#tbgTable').append(tr);
		
		$(".submitBtn").unbind();
		$(".submitBtn").click(submitExam);
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

function submitExam(){ 
	$.post("submitGrades.php", {assignedId:$(this).attr("data-id")}, reload);
}

function reload(data) {
	$("#tbgTable tr").remove();
	gettbgTable();
}