<?php
    add_filter( 'block_directory_enabled', '__return_false' );
    remove_action( 'welcome_panel', 'wp_welcome_panel' );
    // add_action( 'wp_head', 'mytheme_preload_critical_fonts', 1 );

    function mytheme_preload_critical_fonts() {
        $fonts = [
            'anton'     => 'assets/fonts/Anton-Regular.woff2',
            'work-sans-400' => 'assets/fonts/WorkSans-400.woff2',
            'work-sans-700' => 'assets/fonts/WorkSans-700.woff2',
        ];

        $theme_uri = get_template_directory_uri();

        foreach ( $fonts as $handle => $path ) {
            $font_url = esc_url( $theme_uri . '/' . $path );
            echo '<link rel="preload" href="' . $font_url . '" as="font" type="font/woff2" crossorigin>' . "\n";
        }
    }