<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require __DIR__ . '/database/database.php';

if (($_SERVER['REQUEST_METHOD'] ?? null) === 'OPTIONS') {
    exit;
}


 $method = $_SERVER['REQUEST_METHOD'] ?? null;
 $input = json_decode(file_get_contents('php://input'), true);

try {
    switch ($method) {
        case 'GET':
        
            $stmt = $pdo->query("SELECT * FROM todo ORDER BY deadline ASC");
            echo json_encode($stmt->fetchAll());
            break;

        case 'POST':
        
            $stmt = $pdo->prepare("INSERT INTO todo (title, category, deadline, isComplete) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $input['title'],
                $input['category'],
                $input['deadline'],
                $input['isComplete'] ?? 0
            ]);
            echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
            break;

        case 'PUT':

            $stmt = $pdo->prepare("UPDATE todo SET title = ?, category = ?, deadline = ?, isComplete = ? WHERE id = ?");
            $stmt->execute([
                $input['title'],
                $input['category'],
                $input['deadline'],
                $input['isComplete'],
                $input['id']
            ]);
            echo json_encode(['status' => 'success']);
            break;

        case 'DELETE':
            
            $id = $_GET['id'];
            $stmt = $pdo->prepare("DELETE FROM todo WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['status' => 'success']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>

