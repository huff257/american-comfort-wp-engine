<?php
    add_action('init', 'bb_register_styling_packages_post');
    add_action('add_meta_boxes', 'json_field_add_meta_box');
    add_action('save_post', 'save_advanced_block_json_meta_box');

    function bb_register_styling_packages_post() {
        $labels = array(
            'name'               => 'Styling Packages',
            'singular_name'      => 'Styling Package',
            'menu_name'          => 'Styling Packages',
            'name_admin_bar'     => 'Styling Package',
            'add_new'            => 'Add New',
            'add_new_item'       => 'Add New Styling Package',
            'new_item'           => 'New Styling Package',
            'edit_item'          => 'Edit Styling Package',
            'view_item'          => 'View Styling Package',
            'all_items'          => 'All Styling Packages',
            'search_items'       => 'Search Styling Packages',
            'parent_item_colon'  => 'Parent Styling Packages:',
            'not_found'          => 'No styling packages found.',
            'not_found_in_trash' => 'No styling packages found in Trash.'
        );

        $args = array(
            'labels'             => $labels,
            'public'             => false,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'capability_type'    => 'post',
            'hierarchical'       => false,
            'supports'           => ['title', 'custom-fields'],
            'menu_position'      => 20,
            'menu_icon'          => 'dashicons-admin-appearance',
            'has_archive'        => false,
            'rewrite'            => false,
            'show_in_rest'       => true,
            // 'publicly_queryable' => true,
        );

        register_post_type('styling_package', $args);
    }

    function json_field_add_meta_box() {
        add_meta_box(
            'advanced_block_json',
            'Layout JSON / Styling',
            'render_json_field',
            'styling_package',
            'normal',
            'high'
        );
    }

    function render_json_field($post) {
        $value = get_post_meta($post->ID, 'advanced_block_json', true);

        echo '<textarea 
                name="advanced_block_json"
                id="layout_rich_text" 
                rows="10" 
                style="width:100%; font-family:monospace;">' 
                . esc_textarea($value) . 
            '</textarea>';

        wp_nonce_field('save_advanced_block_json', 'advanced_block_json_nonce');
    }

    function save_advanced_block_json_meta_box($post_id) {
        if (!isset($_POST['advanced_block_json_nonce']) || !wp_verify_nonce($_POST['advanced_block_json_nonce'], 'save_advanced_block_json')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        if (isset($_POST['advanced_block_json'])) {
            update_post_meta($post_id, 'advanced_block_json', sanitize_textarea_field($_POST['advanced_block_json']));
        }
    }
