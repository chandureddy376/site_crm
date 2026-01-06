<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$data = json_decode(file_get_contents("php://input"));
include "db.php";
$sql = "INSERT INTO my_executives (executives_name, executives_email, executives_username, executives_designation, executives_number) 
VALUES ('$data->executives_name', '$data->executives_email', '$data->executives_username', '$data->executives_designation', '$data->executives_number')";
if($data->executives_name){
	$qry = $connect->query($sql);
}

$sql2 = "UPDATE my_executives SET executives_name ='$data->executives_name', executives_email ='$data->executives_email',
	executives_designation ='$data->executives_designation', executives_number ='$data->executives_number', 
	executives_username = '$data->executives_username'
	WHERE executives_IDPK = $data->executives_IDPK ";
   	$qry = $connect->query($sql2);
   	if($data->executives_name){
	   }

$sql3 = "UPDATE login SET name ='$data->executives_name', email ='$data->executives_email', 
	   username = '$data->executives_username'
	   WHERE executives_FKID = $data->executives_IDPK ";
		  $qry = $connect->query($sql3);
		  if($data->executives_name){
		  }

$connect->close();

?>