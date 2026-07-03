<?php

include "db.php";

$username = $_POST['username'];

$email = $_POST['email'];

$password = $_POST['password'];

$id = $_POST['id'];

//Password Encryption 

$hashed=password_hash($password, PASSWORD_DEFAULT);

// insert

$sql = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashed')";

if (mysqli_query($conn , $sql)) {

header("Location: login.html");
exit();

} else {

echo "Error: " . mysqli_error($conn);

}






?>