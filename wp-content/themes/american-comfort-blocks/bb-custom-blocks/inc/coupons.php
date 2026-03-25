<?php 
    function bb_coupons_post_type() {
        register_post_type('coupon', array(
            'labels' => array(
                'name' => 'Coupons',
                'singular_name' => 'Coupon',
            ),
            'public' => true,
            'has_archive' => true,
            'rewrite' => array(
                'slug' => 'coupons',
                'with_front' => true
            ),
            'show_in_rest' => true,
            'query_var' => true,
            'menu_icon' => 'dashicons-tickets-alt',
            'supports' => array(
                'title',
                'editor',
                'excerpt',
                'thumbnail',
                'author',
                'revisions'
            ),
            'taxonomies' => array('category', 'post_tag'),
        ));
    }
    add_action('init', 'bb_coupons_post_type');