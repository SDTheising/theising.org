<?php
require_once __DIR__ . '/lib/parsedown.php';
require_once __DIR__ . '/lib/util.php'; // defines parseMarkdownFile()
$parser = new Parsedown();

$base_path = '/blog/';

// Load & parse all posts
$files = glob(__DIR__ . '/posts/*.md');
$posts = [];
foreach ($files as $file) {
    $meta = parseMarkdownFile($file);
    if ($meta) {
        $posts[] = $meta;
    }
}

// Filter by tag (optional)
$filter_tag = $_GET['tag'] ?? null;
if ($filter_tag) {
    $posts = array_filter($posts, fn($p) => in_array($filter_tag, $p['tags'] ?? []));
}

// Sort & paginate
usort($posts, fn($a, $b) => strtotime($b['date']) <=> strtotime($a['date']));
$page = max((int)($_GET['page'] ?? 1), 1);
$per_page = 5;
$total_pages = ceil(count($posts) / $per_page);
$current_posts = array_slice($posts, ($page - 1) * $per_page, $per_page);

// Build page content
ob_start();
echo "<h2>Blog</h2>";
if ($filter_tag) {
    echo "<p>Filtering by tag: <strong>" . htmlspecialchars($filter_tag) . "</strong></p>";
}
foreach ($current_posts as $post) {
    echo "<article>";
    echo "<h3><a href='" . $base_path . "post.php?slug=" . urlencode($post['slug']) . "'>" . htmlspecialchars($post['title']) . "</a></h3>";
    echo "<p><em>" . htmlspecialchars($post['date']) . "</em></p>";
    echo "<p>";
    foreach ($post['tags'] ?? [] as $tag) {
        echo "<a href='?tag=" . urlencode($tag) . "'>" . htmlspecialchars($tag) . "</a> ";
    }
    echo "</p>";
    echo "</article>";
}

// Pagination
echo "<div class='pagination'>";
if ($page > 1) {
    echo "<a href='?page=" . ($page - 1) . ($filter_tag ? "&tag=" . urlencode($filter_tag) : "") . "'>Previous</a> ";
}
echo "<span>Page $page of $total_pages</span>";
if ($page < $total_pages) {
    echo " <a href='?page=" . ($page + 1) . ($filter_tag ? "&tag=" . urlencode($filter_tag) : "") . "'>Next</a>";
}
echo "</div>";

$page_content = ob_get_clean();
$page_title = "Blog";
include __DIR__ . '/templates/base.php';
