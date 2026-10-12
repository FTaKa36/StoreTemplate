<?php
include 'koneksi.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nama = $_POST['nama'];
    $email = $_POST['email'];
    $komentar = $_POST['komentar'];

    $query = "INSERT INTO buku_tamu (nama, email, komentar) VALUES ('$nama', '$email', '$komentar')";
    $result = mysqli_query($koneksi, $query);

    if ($result) {
        header("Location: index.html");
        exit;
    } else {
        echo "Gagal menyimpan: " . mysqli_error($koneksi);
    }
}
?>
