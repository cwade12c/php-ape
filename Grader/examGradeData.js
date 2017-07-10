$(document).ready(start);

function start() {
	getTable();
	$("#saveBtn").click(saveGrades);
}

function getTable() {
	//console.log("Get Table");
	var assignedCatId = $("#examCatId").val();
	var graderIdJS = $("#graderId").val();
	
	$.post("getExamGradeData.php", {assignedId:assignedCatId, graderId:graderIdJS}, 
		function(data) {	
			data = JSON.parse(data);
			displayTable(data);
			//console.log(data);
		});
}

function displayTable(data) {
	var tr = $("<tr Align='Center'><th>Seat Number</th><th>"+ data[0].category_name +"</th></tr>");
	$("#gradesTable").append(tr);
	for(var x = 0; x < data.length; x++ ) {
		tr = $("<tr Align='Center'>");
		tr.append("<td>" + data[x].seat_num + "<input type='hidden' id='" + x + "Id' value=" + data[x].student_id + " /></td>");
		tr.append("<td><input id='" + x + "Grade' type='number' min='0' max='" + data[x].possible + "' size='2'></input>/" + data[x].possible + "</td>");
		tr.append("</tr>");
		$("#gradesTable").append(tr);
		
		$("#"+ x + "Grade").val(data[x].grade);
	}
}

function saveGrades() {
	var tableSize = $("#gradesTable tr").length - 1;

	for(var x = 0; x < tableSize; x++) {
		var stuId = $("#" + x + "Id").val();
		var StuGrade = $("#" + x + "Grade").val();
		var assignedCatId = $("#examCatId").val();
		
		if(StuGrade.length > 0) {
			$.post("saveGrade.php", {assignedId:assignedCatId, studentId:stuId, grade:StuGrade}, 
				function(data) {
					
				})
		}
	}
	
	alert("Grades successfully submitted!");
}