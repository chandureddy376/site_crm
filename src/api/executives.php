<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
include "db.php"; 

$query = "SELECT * FROM my_executives ORDER BY executives_IDPK";
$result = mysqli_query($connect, $query);
if ($result->num_rows > 0) {
    // output data of each row
     $data = array() ;
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
    
} else {
    echo "0";
    alert('ok');
}
$connect->close();
?>
