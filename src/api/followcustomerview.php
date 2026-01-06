<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$data = json_decode(file_get_contents("php://input"));
include "db.php";
// $sql = "SELECT * FROM follow_up WHERE customer_id = '$data->select_id'"; 
$sql = "
SELECT
                follow_up.customer_IDPK,
                follow_up.customer_name,
                a.customer_IDFK as customer_IDFK,
                a.customer_phase,
                a.customer_comments,
                a.customer_next_date as customer_next_date,
                a.customer_next_time as customer_next_time,
                a.customer_followup_date as customer_followup_date,
                a.customer_followup_time as customer_followup_time
                FROM followup_comments a 
                LEFT JOIN
		        follow_up ON follow_up.customer_IDPK = a.customer_IDFK
                WHERE a.customer_IDFK = '$data->customer_IDPK'";
// SELECT a.*,
// (select b.customer_phase from  follow_up b) as customer_phase,
// (select b.customer_comments from  follow_up b) as customer_comments
// FROM `permanent_followup` a WHERE a.customer_id = '$data->select_id'";

                
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
