<?php
if ( ! defined( 'ABSPATH' ) ) exit;

define( 'THEME_DIR', get_template_directory() );
define( 'THEME_URI', get_template_directory_uri() );
define( 'STATIC_DIR', get_template_directory() . '/site/' . sanitize_title(get_bloginfo('name')) );
define( 'SITE_SLUG', sanitize_title(get_bloginfo('name')));
define( 'LIVE_DOMAIN', get_option('live_site_domain'));
define( 'DEV_DOMAIN', network_home_url() );

class BuildingBlocksTheme {

    public function __construct() {
        add_action( 'after_setup_theme', [ $this, 'load_theme_files' ] );
    }

    public function prevent_activation() {
        switch_theme( WP_DEFAULT_THEME );
    }

    public function load_theme_files() {
        $files = [
            '/inc/setup.php',
            // '/inc/helpers.php',
            // '/inc/css-helpers.php',
            // '/inc/image-helpers.php',
            // '/inc/acf-fields.php',
            // '/inc/acf-forms.php',
            '/inc/register-blocks.php',
            '/inc/styling-packages.php',
            '/inc/coupons.php',
            // '/inc/styling-package-helpers.php',
            // '/inc/acf-options-pages.php',
            // '/inc/site-icons.php',
            // '/inc/static-builder.php',
            // '/inc/static-site-build.php',
            '/inc/enqueue.php',
        ];

        foreach ( $files as $file ) {
            $path = THEME_DIR . $file;
            if ( file_exists( $path ) ) {
                require_once $path;
            }
        }
    }
}

new BuildingBlocksTheme();
