<?php
/**
 * Custom Navigation Block - Server-side rendering
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Recursively extract navigation links with hierarchy
 *
 * @param array $blocks Parsed blocks array.
 * @return array Array of links with children.
 */
if ( ! function_exists( 'bb_extract_navigation_links' ) ) {
    function bb_extract_navigation_links( $blocks ) {
        $links = array();

        foreach ( $blocks as $block ) {
            // Handle both navigation-link AND navigation-submenu
            if ( $block['blockName'] === 'core/navigation-link' || $block['blockName'] === 'core/navigation-submenu' ) {
                $link = array(
                    'label'    => isset( $block['attrs']['label'] ) ? $block['attrs']['label'] : '',
                    'url'      => isset( $block['attrs']['url'] ) ? $block['attrs']['url'] : '',
                    'children' => array(),
                );

                // Check if this link has children (innerBlocks)
                if ( ! empty( $block['innerBlocks'] ) ) {
                    $link['children'] = bb_extract_navigation_links( $block['innerBlocks'] );
                }

                $links[] = $link;
            } elseif ( ! empty( $block['innerBlocks'] ) ) {
                // If it's not a navigation-link/submenu but has innerBlocks, recurse into them
                $links = array_merge( $links, bb_extract_navigation_links( $block['innerBlocks'] ) );
            }
        }

        return $links;
    }
}

/**
 * Recursively render navigation items
 *
 * @param array $links Array of navigation links.
 * @param int   $level Current nesting level.
 * @param string $logo_url Logo URL (only passed at level 0).
 * @param string $logo_alt Logo alt text (only passed at level 0).
 * @param array $buttons Buttons array (only passed at level 0).
 * @return void
 */
if ( ! function_exists( 'bb_render_navigation_items' ) ) {
    function bb_render_navigation_items( $links, $level = 0, $logo_url = '', $logo_alt = '', $buttons = array() ) {
        if ( empty( $links ) ) {
            return;
        }

        $ul_class = $level === 0 ? 'custom-navigation' : 'custom-navigation__submenu';
        ?>
        <ul class="<?php echo esc_attr( $ul_class ); ?>" data-level="<?php echo esc_attr( $level ); ?>">
            <?php if ( $level === 0 ) : ?>
                <button 
                    class="custom-navigation__close" 
                    aria-label="<?php echo esc_attr__( 'Close navigation menu', 'buildingblocks-block-theme' ); ?>"
                >
                    <span class="custom-navigation__close-icon"></span>
                </button>

                <?php if ( ! empty( $logo_url ) ) : ?>
                    <li class="custom-navigation__logo-item">
                        <a href="<?php echo esc_url( home_url( '/' ) ); ?>">
                            <img class="mobile-nav-logo" src="<?php echo esc_url( $logo_url ); ?>" alt="<?php echo esc_attr( $logo_alt ); ?>" width="200" height="110" />
                        </a>
                    </li>
                <?php endif; ?>
            <?php endif; ?>

            <?php foreach ( $links as $link ) : ?>
                <li class="custom-navigation__item <?php echo ! empty( $link['children'] ) ? 'has-children' : ''; ?>">
                    <a href="<?php echo esc_url( $link['url'] ); ?>" class="custom-navigation__link">
                        <span class="label"><?php echo esc_html( $link['label'] ); ?></span>
                    </a>
                    <?php
                    if ( ! empty( $link['children'] ) ) {
                        bb_render_navigation_items( $link['children'], $level + 1 );
                    }
                    ?>
                </li>
            <?php endforeach; ?>

            <?php if ( $level === 0 && ! empty( $buttons ) ) : ?>
                <?php foreach ( $buttons as $button ) : 
                    $btn_class = isset( $button['btnClass'] ) && ! empty( $button['btnClass'] ) 
                        ? esc_attr( $button['btnClass'] ) 
                        : 'custom-navigation__button';
                ?>
                    <li class="custom-navigation__button-item">
                        <a href="<?php echo esc_url( $button['url'] ); ?>" class="<?php echo $btn_class; ?>">
                            <?php echo esc_html( $button['text'] ); ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            <?php endif; ?>
        </ul>
        <?php
    }
}

$selected_navigation_id = isset( $attributes['selectedNavigationId'] ) ? absint( $attributes['selectedNavigationId'] ) : 0;
$logo_url = isset( $attributes['logoUrl'] ) ? esc_url( $attributes['logoUrl'] ) : '';
$logo_alt = isset( $attributes['logoAlt'] ) ? esc_attr( $attributes['logoAlt'] ) : '';
$buttons = isset( $attributes['buttons'] ) ? $attributes['buttons'] : array();

if ( empty( $selected_navigation_id ) ) {
    echo sprintf(
        '<div %s><p>%s</p></div>',
        get_block_wrapper_attributes(),
        esc_html__( 'Please select a navigation menu in the block settings.', 'buildingblocks-block-theme' )
    );
    return;
}

$navigation_post = get_post( $selected_navigation_id );

if ( ! $navigation_post || $navigation_post->post_type !== 'wp_navigation' || $navigation_post->post_status !== 'publish' ) {
    echo sprintf(
        '<div %s><p>%s</p></div>',
        get_block_wrapper_attributes(),
        esc_html__( 'Selected navigation menu not found.', 'buildingblocks-block-theme' )
    );
    return;
}

$parsed_blocks = parse_blocks( $navigation_post->post_content );
$links = bb_extract_navigation_links( $parsed_blocks );
if ( empty( $links ) ) {
    echo sprintf(
        '<div %s><p>%s</p></div>',
        get_block_wrapper_attributes(),
        esc_html__( 'No navigation links found in the selected menu.', 'buildingblocks-block-theme' )
    );
    return;
}

// Filter buttons - only show if both text and url are set
$valid_buttons = array();
if ( ! empty( $buttons ) ) {
    foreach ( $buttons as $button ) {
        if ( ! empty( $button['text'] ) && ! empty( $button['url'] ) ) {
            $valid_buttons[] = $button;
        }
    }
}

?>
<nav <?php echo get_block_wrapper_attributes(); ?>>
    <button 
        class="custom-navigation__toggle" 
        aria-label="<?php echo esc_attr__( 'Toggle navigation menu', 'buildingblocks-block-theme' ); ?>"
        aria-expanded="false"
        aria-controls="custom-navigation-menu"
    >
        <span class="custom-navigation__toggle-icon"></span>
    </button>

    <?php bb_render_navigation_items( $links, 0, $logo_url, $logo_alt, $valid_buttons ); ?>
</nav>