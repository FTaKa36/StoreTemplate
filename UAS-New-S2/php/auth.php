<?php
include 'koneksi.php';

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['register'])) {
    $nama = $_POST['nama'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $query = "INSERT INTO users (nama, email, password) VALUES ('$nama', '$email', '$password')";
    $result = mysqli_query($koneksi, $query);

    if ($result) {
        echo "Registrasi berhasil";
    } else {
        echo "Gagal daftar: " . mysqli_error($koneksi);
    }
}
?>
