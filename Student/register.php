<?php
include 'creds.php';

$id = $_POST["id"];
$idStudent = $_POST["student"];
$sql = "INSERT INTO exam_roster (exam_id, student_id) VALUES (" . $id . ", "
    . $idStudent . ")";

try {
    // Prepare statement
    $stmt = $conn->prepare($sql);
    // execute the query
    $stmt->execute();
    echo "Updated record. <br>";
} catch (PDOException $e) {
    echo $sql . "<br>" . $e->getMessage();
}

//header("Location: studentp1ND.html");
//exit;

?>