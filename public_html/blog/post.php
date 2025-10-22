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

    // Inject carousels where requested in the Markdown body.
    $carouselDir = __DIR__ . "/posts/images/posts/$slug/";
    $carouselUrl = "posts/images/posts/$slug/";
    $images = glob($carouselDir . '*.{jpg,jpeg,png,gif,webp}', GLOB_BRACE);

    $carouselHtml = '';
    if (!empty($images)) {
        sort($images);

        ob_start();
        ?>
<div class="carousel-container" data-carousel-id="<?= htmlspecialchars($slug, ENT_QUOTES) ?>">
  <button class="arrow left" type="button" aria-label="Previous image">&#10094;</button>
  <div class="carousel-track">
    <?php foreach ($images as $index => $imgPath): ?>
      <?php $imgName = basename($imgPath); ?>
      <div class="carousel-slide<?= $index === 0 ? ' active' : '' ?>">
        <img src="<?= htmlspecialchars($carouselUrl . $imgName, ENT_QUOTES) ?>" alt="" />
      </div>
    <?php endforeach; ?>
  </div>
  <button class="arrow right" type="button" aria-label="Next image">&#10095;</button>
</div>
        <?php
        $carouselHtml = trim(ob_get_clean());
        if ($carouselHtml !== '') {
            $carouselHtml = preg_replace('/^[\t ]+/m', '', $carouselHtml);
        }
    }

    $body = $post['body'];
    if ($carouselHtml) {
        if (stripos($body, '[carousel]') !== false) {
            $body = preg_replace('/\[carousel\]/i', $carouselHtml, $body);
        } else {
            $body = $carouselHtml . "\n\n" . $body;
        }
    } else {
        $body = preg_replace('/\[carousel\]/i', '', $body);
    }

    echo "<article>";
    echo "<h2>" . htmlspecialchars($post['title']) . "</h2>";
    echo "<p><em>" . htmlspecialchars($post['date']) . "</em></p>";
    echo $parser->text($body);
    echo "<p>Tags: ";
    foreach ($post['tags'] ?? [] as $tag) {
        echo "<a href='" . $base_path . "index.php?tag=" . urlencode($tag) . "'>" . htmlspecialchars($tag) . "</a> ";
    }
    echo "</p>";
    echo "</article>";

    $page_content = ob_get_clean();
}

include __DIR__ . '/templates/base.php';
