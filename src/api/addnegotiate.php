<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
$data = json_decode(file_get_contents("php://input"));
include "db.php";

	$custid = mysqli_real_escape_string($connect, $data->customer_id);
    $subscr = mysqli_real_escape_string($connect, $data->customer_phase);
    $enqr_date = date('y-m-d');
	date_default_timezone_set('Asia/Kolkata');
	$enqr_time = date("h:i A");
    

	// UPDATE-DATA-IN-ACTIVELEADS

	$sql2 = "UPDATE active_leads SET customer_name ='$data->customer_name', customer_number ='$data->customer_number',
	customer_mail ='$data->customer_mail', customer_location ='$data->customer_location', 
	customer_timeline ='$data->customer_timeline', customer_purpose ='$data->customer_purpose',
	customer_source ='$data->customer_source', customer_proptype ='$data->customer_proptype',
	customer_budget ='$data->customer_budget', customer_size ='$data->customer_size',
	customer_assign ='$data->customer_assign', customer_status ='$data->customer_status',
	customer_address ='$data->customer_address', customer_date = '$data->customer_date', customer_time = '$data->customer_time',
	customer_phase = '$data->customer_phase', customer_comments = '$data->customer_comments'
	WHERE customer_IDPK = $data->customer_IDPK ";
   	$qry = $connect->query($sql2);
   	if($data->customer_name){
	   }
	   
   // UPDATE-DATA-IN-ACTIVELEADS

   $sql2 = "UPDATE final_negotiate SET customer_name ='$data->customer_name', customer_number ='$data->customer_number',
	customer_mail ='$data->customer_mail', customer_location ='$data->customer_location', 
	customer_timeline ='$data->customer_timeline', customer_purpose ='$data->customer_purpose',
	customer_source ='$data->customer_source', customer_proptype ='$data->customer_proptype',
	customer_budget ='$data->customer_budget', customer_size ='$data->customer_size',
	customer_assign ='$data->customer_assign', customer_status ='$data->customer_status',
	customer_address ='$data->customer_address', customer_date = '$data->customer_date', customer_time = '$data->customer_time',
	customer_phase = '$data->customer_phase', customer_comments = '$data->customer_comments', customer_next_date = '$data->customer_next_date', customer_next_time = '$data->customer_next_time'
	WHERE customer_IDPK = $data->customer_IDPK ";
   	$qry = $connect->query($sql2);
   	if($data->customer_name){
       }else{

	   }

       $sql = "INSERT INTO permanent_negotiate (customer_IDPK, customer_name, customer_number, customer_mail,
	    customer_location, customer_timeline, customer_purpose, customer_source, customer_proptype, 
		customer_budget, customer_size, customer_assign, customer_status, customer_address, customer_date, 
		customer_time, customer_phase, customer_comments, customer_next_date, customer_next_time,
       final_builder_info, 	final_project_name, final_location, final_date, final_time, final_comments, 
	   final_update_date, final_update_time) 
	VALUES ('$data->customer_IDPK', '$data->customer_name', '$data->customer_number', '$data->customer_mail', '$data->customer_location', '$data->customer_timeline', '$data->customer_purpose', '$data->customer_source', '$data->customer_proptype', '$data->customer_budget', '$data->customer_size', '$data->customer_assign', '$data->customer_status',
     '$data->customer_address', '$data->customer_date', '$data->customer_time', '$data->customer_phase', '$data->customer_comments', '$data->customer_next_date', '$data->customer_next_time',
      '$data->final_builder_info', '$data->final_project_name','$data->final_location', '$data->final_date', '$data->final_time', '$data->final_comments', '$enqr_date', '$enqr_time')";
	$qry = $connect->query($sql);
	if($data->customer_name){
		
}	else {
	echo "Subscribe Failed";
}
$sql2 = "UPDATE permanent_negotiate SET customer_name ='$data->customer_name', customer_number ='$data->customer_number',
	customer_mail ='$data->customer_mail', customer_location ='$data->customer_location', 
	customer_timeline ='$data->customer_timeline', customer_purpose ='$data->customer_purpose',
	customer_source ='$data->customer_source',
	customer_budget ='$data->customer_budget', customer_size ='$data->customer_size',
	customer_assign ='$data->customer_assign', customer_status ='$data->customer_status',
	customer_address ='$data->customer_address', customer_date = '$data->customer_date', customer_time = '$data->customer_time',
	customer_phase = '$data->customer_phase', customer_comments = '$data->customer_comments', customer_next_date = '$data->customer_next_date', customer_next_time = '$data->customer_next_time', 
	final_builder_info = '$data->final_builder_info', final_project_name = '$data->final_project_name', 
	customer_proptype = '$data->customer_proptype', final_location = '$data->final_location', final_date = '$data->final_date',
	final_time = '$data->final_time', final_comments = '$data->final_comments', final_update_date = '$enqr_date', final_update_time = '$enqr_time'
	WHERE customer_IDPK = $data->customer_IDPK ";
   	$qry = $connect->query($sql2);
   	if($data->customer_name){
       }
       
$connect->close();
?>