<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$data = json_decode(file_get_contents("php://input"));
include "db.php";
$sql = "SELECT * FROM permanent_usv WHERE customer_id = '$data->select_id'";
$result = $connect->query($sql);
// $sql2 = "SELECT * FROM permanent_usv_propertylist WHERE customer_id = '$data->select_id'";
// $result = $connect->query($sql2);
if ($result->num_rows > 0) {
    // output data of each row
     $data = array() ;
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
} else {
    echo "0 results";
}
echo json_encode($data);
$connect->close();
?>
