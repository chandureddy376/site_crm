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

	// UPDATE-DATA-IN-PERAMNENT-FACETOFACE
	
$sql2 = "UPDATE permanent_facetoface SET customer_name ='$data->customer_name', customer_number ='$data->customer_number',
	customer_mail ='$data->customer_mail', customer_location ='$data->customer_location', 
	customer_timeline ='$data->customer_timeline', customer_purpose ='$data->customer_purpose',
	customer_source ='$data->customer_source', customer_proptype ='$data->customer_proptype',
	customer_budget ='$data->customer_budget', customer_size ='$data->customer_size',
	customer_assign ='$data->customer_assign', customer_status ='$data->customer_status',
	customer_address ='$data->customer_address', customer_date = '$data->customer_date', customer_time = '$data->customer_time',
	customer_phase = '$data->customer_phase', customer_comments = '$data->customer_comments', customer_next_date = '$data->customer_next_date', customer_next_time = '$data->customer_next_time',
    customer_facetoface_location = '$data->customer_facetoface_location', customer_facetoface_date = '$data->customer_facetoface_date',
    customer_facetoface_time = '$data->customer_facetoface_time', customer_suggest_properties = '$data->customer_suggest_properties', customer_update_date = '$enqr_date', customer_update_time = '$enqr_time'
	WHERE customer_IDPK = $data->customer_IDPK ";
   	$qry = $connect->query($sql2);
   	if($data->customer_name){
}	else {
	echo "Subscribe Failed";
}

	
	// UPDATE-DATA-IN-PERMANENT-FACETOFACE

	$sql2 = "UPDATE permanent_usv SET customer_name ='$data->customer_name', customer_number ='$data->customer_number',
	customer_mail ='$data->customer_mail', customer_location ='$data->customer_location', 
	customer_timeline ='$data->customer_timeline', customer_purpose ='$data->customer_purpose',
	customer_source ='$data->customer_source', customer_proptype ='$data->customer_proptype',
	customer_budget ='$data->customer_budget', customer_size ='$data->customer_size',
	customer_assign ='$data->customer_assign', customer_status ='$data->customer_status',
	customer_address ='$data->customer_address', customer_date = '$data->customer_date', customer_time = '$data->customer_time',
	customer_phase = '$data->customer_phase', customer_comments = '$data->customer_comments', customer_next_date = '$data->customer_next_date',
    customer_next_time = '$data->customer_next_time', customer_visited_place = '$data->customer_visited_place',
	customer_visit_date = '$data->customer_visit_date', customer_visit_time = '$data->customer_visit_time'
	WHERE customer_IDPK = $data->customer_IDPK ";
   	$qry = $connect->query($sql2);
   	if($data->customer_name){
}	else {
	echo "Subscribe Failed";
}

// UPDATE-DATA-IN-PERAMNENT-RSV

$sql2 = "UPDATE permanent_rsv SET customer_name ='$data->customer_name', customer_number ='$data->customer_number',
	customer_mail ='$data->customer_mail', customer_location ='$data->customer_location', 
	customer_timeline ='$data->customer_timeline', customer_purpose ='$data->customer_purpose',
	customer_source ='$data->customer_source', customer_proptype ='$data->customer_proptype',
	customer_budget ='$data->customer_budget', customer_size ='$data->customer_size',
	customer_assign ='$data->customer_assign', customer_status ='$data->customer_status',
	customer_address ='$data->customer_address', customer_date = '$data->customer_date', customer_time = '$data->customer_time',
	customer_phase = '$data->customer_phase', customer_comments = '$data->customer_comments', customer_next_date = '$data->customer_next_date',
    customer_next_time = '$data->customer_next_time', customer_visited_place = '$data->customer_visited_place',
	customer_visit_date = '$data->customer_visit_date', customer_visit_time = '$data->customer_visit_time'
	WHERE customer_IDPK = $data->customer_IDPK ";
   	$qry = $connect->query($sql2);
   	if($data->customer_name){
}	else {
	echo "Subscribe Failed";
}

// UPDATE-DATA-IN-PERAMNENT-RSV-ENDS


if($subscr == "Face to Face Meeting"){
	$sql = "INSERT INTO face_to_face (customer_IDPK, customer_id, customer_name, customer_number, customer_mail, customer_location, customer_timeline, 
customer_purpose, customer_source, 	customer_proptype, customer_budget, customer_size, customer_assign, customer_status,
customer_address, customer_date, customer_time, customer_phase, customer_comments, customer_next_date, customer_next_time,
    customer_facetoface_location, customer_facetoface_date, customer_facetoface_time, customer_suggest_properties) 
	VALUES ('$data->customer_IDPK', '$data->customer_id', '$data->customer_name', '$data->customer_number', '$data->customer_mail', '$data->customer_location', '$data->customer_timeline', '$data->customer_purpose', '$data->customer_source', '$data->customer_proptype', '$data->customer_budget', '$data->customer_size', '$data->customer_assign', '$data->customer_status',
     '$data->customer_address', '$data->customer_date', '$data->customer_time','$data->customer_phase', '$data->customer_comments', '$data->customer_next_date', '$data->customer_next_time', '$data->customer_facetoface_location', 
     '$data->customer_facetoface_date', '$data->customer_facetoface_time', '$data->customer_suggest_properties')";
	if($data->customer_name){
	$qry = $connect->query($sql);
}	else {
	echo "Subscribe Failed";
}
	$sql2 = "UPDATE face_to_face SET customer_name ='$data->customer_name', customer_number ='$data->customer_number',
	customer_mail ='$data->customer_mail', customer_location ='$data->customer_location', 
	customer_timeline ='$data->customer_timeline', customer_purpose ='$data->customer_purpose',
	customer_source ='$data->customer_source', customer_proptype ='$data->customer_proptype',
	customer_budget ='$data->customer_budget', customer_size ='$data->customer_size',
	customer_assign ='$data->customer_assign', customer_status ='$data->customer_status',
	customer_address ='$data->customer_address', customer_date = '$data->customer_date', customer_time = '$data->customer_time',
	customer_phase = '$data->customer_phase', customer_comments = '$data->customer_comments', customer_next_date = '$data->customer_next_date', customer_next_time = '$data->customer_next_time',
    customer_facetoface_location = '$data->customer_facetoface_location', customer_facetoface_date = '$data->customer_facetoface_date',
    customer_facetoface_time = '$data->customer_facetoface_time', customer_suggest_properties = '$data->customer_suggest_properties'
	WHERE customer_IDPK = $data->customer_IDPK ";
   	$qry = $connect->query($sql2);
   	if($data->customer_name){
}	else {
	echo "Subscribe Failed";
}

$sql = "DELETE FROM follow_up WHERE customer_id = '".$custid."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
$sql = "DELETE FROM usv WHERE customer_id = '".$custid."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
$sql = "DELETE FROM rsv WHERE customer_id = '".$custid."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
$sql = "DELETE FROM final_negotiate WHERE customer_id = '".$custid."'";
if($data->customer_id){
$qry = $connect->query($sql);
}

}
if($subscr == "USV"){
	$sql = "INSERT INTO usv (customer_IDPK, customer_id, customer_name, customer_number, customer_mail, customer_location, customer_timeline, customer_purpose, customer_source, customer_proptype, customer_budget, customer_size, customer_assign, customer_status, customer_address, customer_date, customer_time, customer_phase, customer_comments, customer_next_date, customer_next_time) 
	VALUES ('$data->customer_IDPK', '$data->customer_id', '$data->customer_name', '$data->customer_number', '$data->customer_mail', '$data->customer_location', '$data->customer_timeline', '$data->customer_purpose', '$data->customer_source', '$data->customer_proptype', '$data->customer_budget', '$data->customer_size', '$data->customer_assign', '$data->customer_status',
     '$data->customer_address', '$data->customer_date', '$data->customer_time', '$data->customer_phase', '$data->customer_comments', '$data->customer_next_date', '$data->customer_next_time')";
	if($data->customer_name){
	$qry = $connect->query($sql);
}	else {
	echo "Subscribe Failed";
}

$sql = "INSERT INTO permanent_usv (customer_IDPK, customer_id, customer_name, customer_number, customer_mail, customer_location, customer_timeline, customer_purpose, customer_source, customer_proptype, customer_budget, customer_size, customer_assign, customer_status, customer_address, customer_date, customer_time, customer_phase, customer_comments, customer_next_date, customer_next_time,
customer_visited_place, customer_visit_date, customer_visit_time) 
	VALUES ('$data->customer_IDPK', '$data->customer_id', '$data->customer_name', '$data->customer_number', '$data->customer_mail', '$data->customer_location', '$data->customer_timeline', '$data->customer_purpose', '$data->customer_source', '$data->customer_proptype', '$data->customer_budget', '$data->customer_size', '$data->customer_assign', '$data->customer_status',
    '$data->customer_address', '$data->customer_date', '$data->customer_time', '$data->customer_phase', '$data->customer_comments', '$data->customer_next_date', '$data->customer_next_time',
    '$data->customer_visited_place', '$data->customer_visit_date', '$data->customer_visit_time')";
	if($data->customer_name){
	$qry = $connect->query($sql);
}	else {
	echo "Subscribe Failed";
}

$sql = "DELETE FROM follow_up WHERE customer_id = '".$custid."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
$sql = "DELETE FROM face_to_face WHERE customer_id = '".$custid."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
$sql = "DELETE FROM rsv WHERE customer_id = '".$custid."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
$sql = "DELETE FROM final_negotiate WHERE customer_id = '".$custid."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
}
if($subscr == "RSV"){
	$sql = "INSERT INTO rsv (customer_IDPK, customer_id, customer_name, customer_number, customer_mail, customer_location, customer_timeline, customer_purpose, customer_source, customer_proptype, customer_budget, customer_size, customer_assign, customer_status, customer_address, customer_date, customer_time, customer_phase, customer_comments, customer_next_date, customer_next_time) 
	VALUES ('$data->customer_IDPK', '$data->customer_id', '$data->customer_name', '$data->customer_number', '$data->customer_mail', '$data->customer_location', '$data->customer_timeline', '$data->customer_purpose', '$data->customer_source', '$data->customer_proptype', '$data->customer_budget', '$data->customer_size', '$data->customer_assign', '$data->customer_status',
     '$data->customer_address', '$data->customer_date', '$data->customer_time', '$data->customer_phase', '$data->customer_comments', '$data->customer_next_date', '$data->customer_next_time')";
	if($data->customer_name){
	$qry = $connect->query($sql);
}	else {
	echo "Subscribe Failed";
}
$sql = "INSERT INTO permanent_rsv (customer_IDPK, customer_id, customer_name, customer_number, customer_mail, customer_location, customer_timeline, customer_purpose, customer_source, customer_proptype, customer_budget, customer_size, customer_assign, customer_status, customer_address, customer_date, customer_time, customer_phase, customer_comments, customer_next_date, customer_next_time,
	customer_visited_place, customer_visit_date, customer_visit_time) 
	VALUES ('$data->customer_IDPK', '$data->customer_id', '$data->customer_name', '$data->customer_number', '$data->customer_mail', '$data->customer_location', '$data->customer_timeline', '$data->customer_purpose', '$data->customer_source', '$data->customer_proptype', '$data->customer_budget', '$data->customer_size', '$data->customer_assign', '$data->customer_status',
     '$data->customer_address', '$data->customer_date', '$data->customer_time', '$data->customer_phase', '$data->customer_comments', '$data->customer_next_date', '$data->customer_next_time', 
	 '$data->customer_visited_place', '$data->customer_visit_date', '$data->customer_visit_time')";
	if($data->customer_name){
	$qry = $connect->query($sql);
}	else {
	echo "Subscribe Failed";
}
$sql = "DELETE FROM follow_up WHERE customer_id = '".$demo."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
$sql = "DELETE FROM face_to_face WHERE customer_id = '".$demo."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
$sql = "DELETE FROM usv WHERE customer_id = '".$demo."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
$sql = "DELETE FROM final_negotiate WHERE customer_id = '".$demo."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
}
if($subscr == "Final Negotiation"){
	$sql = "INSERT INTO final_negotiate (customer_IDPK, customer_id, customer_name, customer_number, customer_mail, customer_location, customer_timeline, customer_purpose, customer_source, customer_proptype, customer_budget, customer_size, customer_assign, customer_status, customer_address, customer_date, customer_time, customer_phase, customer_comments, customer_next_date, customer_next_time) 
	VALUES ('$data->customer_IDPK', '$data->customer_id', '$data->customer_name', '$data->customer_number', '$data->customer_mail', '$data->customer_location', '$data->customer_timeline', '$data->customer_purpose', '$data->customer_source', '$data->customer_proptype', '$data->customer_budget', '$data->customer_size', '$data->customer_assign', '$data->customer_status',
     '$data->customer_address', '$data->customer_date', '$data->customer_time', '$data->customer_phase', '$data->customer_comments', '$data->customer_next_date', '$data->customer_next_time')";
	if($data->customer_name){
	$qry = $connect->query($sql);
}	else {
	echo "Subscribe Failed";
}
$sql = "DELETE FROM follow_up WHERE customer_id = '".$demo."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
$sql = "DELETE FROM face_to_face WHERE customer_id = '".$demo."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
$sql = "DELETE FROM usv WHERE customer_id = '".$demo."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
$sql = "DELETE FROM rsv WHERE customer_id = '".$demo."'";
if($data->customer_id){
$qry = $connect->query($sql);
}
}
$connect->close();
?>