<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
include "db.php"; 

$query = "SELECT customer_id as id, customer_name as name, customer_number as number,
customer_source as source, customer_date as date, customer_time as time FROM enquiry ORDER BY customer_IDPK DESC";
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
}
$connect->close();
?>
