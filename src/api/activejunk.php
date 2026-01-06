<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$data = json_decode(file_get_contents("php://input"));
include "db.php";
$sql = "SELECT 
my_executives.executives_name as executive,
                customer_IDPK as customer_IDPK,
                customer_id as customer_id,
                customer_name as customer_name,
                customer_number as customer_number,
                customer_mail as customer_mail,
                customer_location as customer_location,
                customer_timeline as customer_timeline,
                customer_purpose as customer_purpose,
                customer_source as customer_source,
                customer_proptype as customer_proptype,
                customer_budget as customer_budget,
                customer_size as customer_size,
                customer_assign as customer_assign,
                customer_status as customer_status,
                customer_address as customer_address,
                customer_date as customer_date,
                customer_time as customer_time,
                customer_phase as customer_phase,
                customer_comments as customer_comments
 FROM junk_files
 LEFT JOIN
my_executives ON my_executives.executives_IDPK = junk_files.customer_assign
WHERE customer_IDPK = '$data->select_id'";
$result = $connect->query($sql);
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
