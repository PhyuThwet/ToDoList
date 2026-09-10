<?

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require __DIR__ . '/database/database.php';

if (($_SERVER['REQUEST_METHOD'] ?? null) === 'OPTIONS') {
    exit;
}

 $action = $_GET['action'] ?? '';
 $input  = json_decode(file_get_contents('php://input'), true);

try {
    switch ($action) {

        case 'list':
            $stmt = $pdo->query(
                "SELECT id, title, category, deadline, isComplete AS is_completed
                 FROM todo ORDER BY deadline ASC"
            );
            $rows = $stmt->fetchAll();

            foreach ($rows as &$row) {
                $row['is_completed'] = (int)$row['is_completed'];
            }
            echo json_encode($rows);
            break;

        case 'save':
            if (!empty($input['id'])) {
                $stmt = $pdo->prepare(
                    "UPDATE todo SET title=?, category=?, deadline=?, isComplete=? WHERE id=?"
                );
                $stmt->execute([
                    $input['title'],
                    $input['category'],
                    $input['deadline'],
                    !empty($input['is_completed']) ? 1 : 0,
                    $input['id']
                ]);
            } else {
                $stmt = $pdo->prepare(
                    "INSERT INTO todo (title, category, deadline, isComplete) VALUES (?, ?, ?, ?)"
                );
                $stmt->execute([
                    $input['title'],
                    $input['category'],
                    $input['deadline'],
                    !empty($input['is_completed']) ? 1 : 0
                ]);
            }
            echo json_encode(['status' => 'success']);
            break;

            case 'toggle':
                $stmt = $pdo->prepare("UPDATE todo SET isComplete = ? WHERE id = ?");
                $stmt->execute([
                    !empty($input['isComplete']) ? 1 : 0,   
                    $input['id']
                ]);
                echo json_encode(['status' => 'success']);
                break;

            case 'delete':
                $stmt = $pdo->prepare("DELETE FROM todo WHERE id = ?");
                $stmt->execute([$input['id'] ?? 0]);
                echo json_encode(['status' => 'success']);
                break;

            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
                break;
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
?>

