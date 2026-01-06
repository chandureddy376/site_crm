<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$data = json_decode(file_get_contents("php://input"));
include "db.php";
$sql = "DELETE FROM my_executives WHERE executives_IDPK = $data->delete_id ";
$sql2 = "DELETE FROM login WHERE executives_FKID = $data->delete_id ";
$sql3 = "DELETE FROM junk_files WHERE customer_IDPK = $data->delete_junk";
$result = $connect->query($sql);
$result = $connect->query($sql2);
$result = $connect->query($sql3);
$connect->close();
?>
