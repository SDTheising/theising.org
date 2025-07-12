<?php
// lib/util.php

function parseMarkdownFile($filepath) {
    $content = file_get_contents($filepath);
    $meta = [
        'title' => '',
        'slug' => '',
        'date' => '',
        'tags' => [],
    ];

    if (preg_match('/^---(.*?)---(.*)/s', $content, $matches)) {
        $yaml = trim($matches[1]);
        $body = trim($matches[2]);

        foreach (explode("\n", $yaml) as $line) {
            if (strpos($line, ':') !== false) {
                [$key, $val] = explode(':', $line, 2);
                $key = trim($key);
                $val = trim($val);
                if ($key === 'tags') {
                    $val = trim($val, '[]');
                    $meta[$key] = array_map('trim', explode(',', $val));
                } else {
                    $meta[$key] = $val;
                }
            }
        }
    } else {
        $body = $content;
    }

    $meta['slug'] = $meta['slug'] ?: basename($filepath, '.md');
    $meta['body'] = $body;
    return $meta;
}
