<?php 
add_action('wp_enqueue_scripts', 'buildingBlock_enqueue_styles');
add_action('admin_enqueue_scripts', 'enqueue_admin_scripts');
add_filter('render_block', 'conditionally_enqueue_block_variant', 10, 2);
add_action('enqueue_block_editor_assets', 'my_block_enqueue_editor_styles');
add_action('wp_footer', 'load_servicetitan_scheduler_after_load');

function buildingBlock_enqueue_styles() {
    $theme_uri  = get_template_directory_uri();
    $theme_path = get_template_directory();

    wp_enqueue_style(
        'building-blocks-global-css',
        $theme_uri . '/assets/src/css/global.css',
        array(),
        filemtime($theme_path . '/assets/src/css/global.css'),
        'all'
    );
}

function enqueue_admin_scripts() {
    $theme_uri  = get_template_directory_uri();
    $theme_path = get_template_directory();

    $screen = get_current_screen();
    if ($screen && $screen->post_type === 'styling_package') {
        wp_enqueue_script(
            'layout-json-bundle',
            $theme_uri . '/dist/admin-init.bundle.js',
            [],
            filemtime($theme_path . '/dist/admin-init.bundle.js'),
            true
        );
    }

    wp_enqueue_style(
        'building-blocks-admin-css',
        $theme_uri . '/assets/src/css/editor.css',
        array(),
        filemtime($theme_path . '/assets/src/css/editor.css'),
        'all'
    );
}

function my_block_enqueue_editor_styles() {
    $theme_uri  = get_template_directory_uri();
    $theme_path = get_template_directory();

    wp_register_style(
        'bb-custom-admin-blocks',
        $theme_uri . '/assets/src/css/block-admin.css',
        [],
        filemtime($theme_path . '/assets/src/css/block-admin.css')
    );
    wp_enqueue_style('bb-custom-admin-blocks');
}

function conditionally_enqueue_block_variant($block_content, $block) {
    if (empty($block['attrs']['variant'])) {
        return $block_content;
    }

    $block_name = str_replace('/', '-', $block['blockName']);
    $variant    = $block['attrs']['variant'];
    $handle     = "bb-{$block_name}-{$variant}";

    if (wp_style_is($handle, 'registered')) {
        wp_enqueue_style($handle);
    }

    return $block_content;
}

function load_servicetitan_scheduler_after_load() {
    ?>
    <script>
    window.addEventListener("load", function () {
        var script = document.createElement("script");
        script.src = "https://embed.scheduler.servicetitan.com/scheduler-v1.js";
        script.id = "se-widget-embed";
        script.setAttribute("data-api-key", "fo7vl4zdc4riyu64xmyb02l4");
        script.setAttribute("data-schedulerid", "sched_vp2k1npobnta0swr81y9kzrb");
        script.defer = true;
        document.body.appendChild(script);
    });
    </script>
    <?php
}