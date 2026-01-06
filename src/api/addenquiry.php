<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$data = json_decode(file_get_contents("php://input"));
include "db.php";
	
	$enqr_date = date('y-m-d');
	date_default_timezone_set('Asia/Kolkata');
	$enqr_time = date("h:i A");
	$cust_id = substr(str_shuffle("0123456789"), 0, 4);

	$sql1 = "INSERT INTO enquiry (customer_id, customer_name, customer_number, customer_mail, customer_location, customer_timeline, customer_purpose, customer_source, customer_proptype, customer_budget, customer_size, customer_assign, customer_status, customer_address, customer_date, customer_time) 
	VALUES ('HM$cust_id', '$data->customer_name', '$data->customer_number', '$data->customer_mail', '$data->customer_location', '$data->customer_timeline', '$data->customer_purpose', '$data->customer_source', '$data->customer_proptype', '$data->customer_budget', '$data->customer_size', '$data->customer_assign', '$data->customer_status', '$data->customer_address', '$enqr_date', '$enqr_time')";
	
	if($data->customer_name){
	$qry = $connect->query($sql1);
	}
	$sql2 = "INSERT INTO permanent_enquiry (customer_id, customer_name, customer_number, customer_mail, customer_location, customer_timeline, customer_purpose, customer_source, customer_proptype, customer_budget, customer_size, customer_assign, customer_status, customer_address, customer_date, customer_time) 
	VALUES ('HM$cust_id', '$data->customer_name', '$data->customer_number', '$data->customer_mail', '$data->customer_location', '$data->customer_timeline', '$data->customer_purpose', '$data->customer_source', '$data->customer_proptype', '$data->customer_budget', '$data->customer_size', '$data->customer_assign', '$data->customer_status', '$data->customer_address', '$enqr_date', '$enqr_time')";
	if($data->customer_name){
		$qry = $connect->query($sql2);
		}
$connect->close();
?>