<?php
/**
 * Register custom blocks
 */
add_action('init', 'bb_register_blocks');

function bb_register_blocks() {
    $block_path = get_template_directory() . '/bb-custom-blocks';

    // Existing blocks
    register_block_type($block_path . '/bb-advanced-block', [
        'editor_script'   => 'advanced-block',
        'render_callback' => 'bb_wrapper_render_callback',
        'editor_style'    => 'bb-advanced-block-editor-style',
    ]);

    register_block_type($block_path . '/bb-mockup');
    register_block_type($block_path . '/bb-copyright');
    register_block_type($block_path . '/bb-slider');
    register_block_type($block_path . '/bb-custom-navigation');
    register_block_type($block_path . '/bb-tabbable');
    register_block_type($block_path . '/bb-location-search-form');
    register_block_type($block_path . '/bb-coupon');
    register_block_type($block_path . '/bb-video');
}

/**
 * Conditionally enqueue block assets when blocks render
 */
add_filter('render_block', 'bb_conditional_block_assets', 10, 2);

function bb_conditional_block_assets($block_content, $block) {
    if (($block['blockName'] ?? '') !== 'buildingblocks-block-theme/bb-advanced-block') {
        return $block_content;
    }

    $attrs = $block['attrs'] ?? [];
    $postId = $attrs['postId'] ?? null;
    if (!$postId) return $block_content;

    $className = !empty($attrs['className'])
        ? sanitize_html_class($attrs['className'])
        : 'bb-advanced-wrapper';

    bb_enqueue_dynamic_assets($postId, $className);

    return $block_content;
}

/**
 * Enqueue dynamic assets (CSS, inline styles, JS) for a block package
 */
function bb_enqueue_dynamic_assets($postId, $className) {
    static $added = [
        'pseudo' => [],
        'assets' => [],
        'breakpoints' => [],
    ];

    $package = bb_get_post_package($postId);
    if (!$package) return;

    // Pseudo CSS
    $pseudo = $package['pseudo'] ?? [];
    if ($pseudo) {
        $pseudo_css = bb_json_to_pseudo_css($pseudo);
        $key = md5($pseudo_css);

        if ($pseudo_css && !isset($added['pseudo'][$key])) {
            $handle = "bb-dynamic-pseudo-{$postId}";

            if (!wp_style_is($handle, 'enqueued')) {
                wp_register_style($handle, false);
                wp_enqueue_style($handle);
            }

            wp_add_inline_style($handle, $pseudo_css);
            $added['pseudo'][$key] = true;
        }
    }

    // Asset CSS files
    $assets = $package['assets'] ?? [];
    if (!empty($assets['css']['file']) && !empty($assets['css']['handle'])) {
        $handle = sanitize_key($assets['css']['handle']);
        $file = ltrim($assets['css']['file'], '/');
        $path = get_template_directory() . "/assets/src/css/{$file}";

        if (file_exists($path)) {
            static $file_cache = [];

            if (!isset($file_cache[$path])) {
                $file_cache[$path] = file_get_contents($path);
            }

            $css = $file_cache[$path];
            $key = md5($path); // file-based dedupe

            if (!isset($added['assets'][$key])) {
                if (!wp_style_is($handle, 'enqueued')) {
                    wp_register_style($handle, false);
                    wp_enqueue_style($handle);
                }

                wp_add_inline_style($handle, $css);
                $added['assets'][$key] = true;
            }
        }
    }

    // Responsive breakpoints
    $breakpoints = $package['breakpoints'] ?? [];
    if ($breakpoints) {
        $bp_css = bb_breakpoints_to_css_only($breakpoints, ".{$className}");
        $key = md5($bp_css);

        if ($bp_css && !isset($added['breakpoints'][$key])) {
            $handle = "bb-dynamic-breakpoints-{$postId}";

            if (!wp_style_is($handle, 'enqueued')) {
                wp_register_style($handle, false);
                wp_enqueue_style($handle);
            }

            wp_add_inline_style($handle, $bp_css);
            $added['breakpoints'][$key] = true;
        }
    }

    // JS (already deduped by WP)
    if (!empty($assets['js']['file']) && !empty($assets['js']['handle'])) {
        wp_enqueue_script(
            $assets['js']['handle'],
            get_template_directory_uri() . "/assets/js/custom-blocks/{$assets['js']['file']}",
            ['wp-element'],
            null,
            true
        );
    }
}

/**
 * Get the package data for a block
 */
function bb_get_post_package($postId) {
    $json = get_post_meta($postId, 'advanced_block_json', true);
    return json_decode($json, true) ?: [];
}

function bb_get_package_render_data($postId) {
    $package = bb_get_post_package($postId);
    if (!$package) return ['inline_style' => '', 'package_class' => '', 'behaviors' => []];

    $inline_style = !empty($package['styles'])
        ? bb_json_to_css_vars_only($package['styles'])
        : '';

    $package_class = !empty($package['className'])
        ? implode(' ', array_map('sanitize_html_class', preg_split('/\s+/', $package['className'])))
        : '';

    $behaviors = array_filter($package['behaviors'] ?? [], fn($b) => isset($b['name']));

    return [
        'inline_style' => $inline_style,
        'package_class' => $package_class,
        'behaviors' => $behaviors,
    ];
}

/**
 * Convert JSON style object to CSS variables
 */
function bb_json_to_css_vars_only($styles) {
    $inline = '';
    foreach ($styles as $key => $value) {
        if ($key !== 'pseudo') $inline .= "--{$key}: {$value};";
    }
    return $inline;
}

/**
 * Pseudo element CSS
 */
function bb_json_to_pseudo_css($pseudos) {
    if (empty($pseudos) || !is_array($pseudos)) return '';
    $css = '';
    foreach ($pseudos as $pseudo) {
        if (empty($pseudo['element']) || empty($pseudo['file'])) continue;

        $element = $pseudo['element'];
        if (!str_starts_with($element, '.') && !str_starts_with($element, '#')) {
            $element = '.' . $element;
        }

        $url = get_template_directory_uri() . '/assets/svgs/' . ltrim($pseudo['file'], '/');
        $allowed_props = ['width','height','position','top','left','right','bottom','background-size','background-repeat','z-index'];
        $props = "content:'';display:block;mask-image:url('{$url}');";
        foreach ($allowed_props as $prop) {
            if (!empty($pseudo[$prop])) $props .= "{$prop}:{$pseudo[$prop]};";
        }

        if (!empty($pseudo['before'])) $css .= "{$element}::before{{$props}}";
        if (!empty($pseudo['after'])) $css .= "{$element}::after{{$props}}";
    }
    return $css;
}

/**
 * Breakpoints to CSS
 */
function bb_breakpoints_to_css_only(array $breakpoints, $selector) {
    $css = '';
    foreach ($breakpoints as $width => $data) {
        if (empty($data['styles']) || !is_array($data['styles'])) continue;
        $vars = bb_json_to_css_vars_only($data['styles']);
        $rules = trim($vars) ? "{$selector} { {$vars} }" : '';
        if ($rules) $css .= "@media (max-width: {$width}px) { {$rules} }";
    }
    return $css;
}

/**
 * Block render callback wrapper
 */
function bb_wrapper_render_callback($attributes, $content) {
    $postId = $attributes['postId'] ?? null;
    $tag = $attributes['htmlTag'] ?? 'section';
    $inline_style = '';
    $package_class = '';
    $data_js = '';

    if (!empty($attributes['className']) &&
        preg_match('/has-([a-z0-9\-]+)-background-color/', $attributes['className'], $m)) {
        $inline_style .= 'background-color:' . esc_attr($m[1]) . ';';
    }

    if ($postId) {
        $render_data = bb_get_package_render_data($postId);
        $inline_style .= $render_data['inline_style'];
        $package_class = $render_data['package_class'];
        $data_js = htmlspecialchars(wp_json_encode(array_values($render_data['behaviors'])), ENT_QUOTES, 'UTF-8');
    }

    $wrapper_attributes = get_block_wrapper_attributes([
        'class' => $package_class ?: null,
        'style' => $inline_style ?: null,
    ]);

    return sprintf(
        '<%1$s %2$s data-post-id="%3$s" data-js="%4$s">%5$s</%1$s>',
        esc_html($tag),
        $wrapper_attributes,
        esc_attr($postId ?? ''),
        $data_js,
        $content
    );
}
