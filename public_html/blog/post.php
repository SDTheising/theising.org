<?php
require_once __DIR__ . '/lib/parsedown.php';
require_once __DIR__ . '/lib/util.php';
$parser = new Parsedown();

$base_path = '/blog/';

$slug = $_GET['slug'] ?? '';
$file = __DIR__ . "/posts/$slug.md";

if (!file_exists($file)) {
    http_response_code(404);
    $page_title = "Not Found";
    $page_content = "<h2>404</h2><p>Post not found.</p>";
} else {
    $post = parseMarkdownFile($file);
    $page_title = $post['title'];

    ob_start();
    echo "<article>";
    echo "<h2>" . htmlspecialchars($post['title']) . "</h2>";
    echo "<p><em>" . htmlspecialchars($post['date']) . "</em></p>";
    echo $parser->text($post['body']);
    echo "<p>Tags: ";
    foreach ($post['tags'] ?? [] as $tag) {
        echo "<a href='" . $base_path . "index.php?tag=" . urlencode($tag) . "'>" . htmlspecialchars($tag) . "</a> ";
    }
    echo "</p>";
    echo "</article>";
    $page_content = ob_get_clean();
}

include __DIR__ . '/templates/base.php';
