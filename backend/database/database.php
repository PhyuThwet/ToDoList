<?php
 $host = 'mysql';
 $db   = 'app';
 $user = 'app';
 $pass = 'app';     
 $charset = 'utf8mb4';

 $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
 $options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
 echo "connect";
    $sql="CREATE TABLE app.todo(id INT PRIMARY KEY ,title VARCHAR (255) NOT NULl,category VARCHAR(100) NOT NULL,deadline DATE NOT NULl,isComplete TINYINT NOT NULL DEFAULT 0)";
    $pdo->exec($sql);
    echo "Table create successfully!";

} catch (PDOException $e) {
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
?>