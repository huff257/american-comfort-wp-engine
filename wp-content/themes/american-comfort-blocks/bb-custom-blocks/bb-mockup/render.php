<?php 
    $class = 'device-image-wrapper';

    if ( ! empty( $attributes['className'] ) ) {
        $class .= ' ' . esc_attr( $attributes['className'] );
    }

    $parallax_size_map = [
        'small'  => [ 150, 770 ],
        'medium' => [ 343, 957 ],
        'large'  => [ 480, 1200 ],
    ];

    $parallax_size =
        $parallax_size_map[ $attributes['imageSize'] ?? 'medium' ]
        ?? $parallax_size_map['medium'];
?>
<div class="<?= esc_attr( $class ); ?>">
    <?php
        echo wp_get_attachment_image(
            $attributes['deviceImageId'] ?? 0,
            [ 400, 251 ],
            false,
            [
                'class' => 'device js-webp',
                'sizes' => '400px',
                'fetchpriority' => 'high',
                'data-webp' => 'true',
            ]
        );
    ?>

    <div class="parallax-image-wrapper">
        <?php
            echo wp_get_attachment_image(
                $attributes['parallaxImageId'] ?? 0,
                $parallax_size,
                false,
                [
                    'class' => 'parallax-image js-webp',
                    'fetchpriority' => 'high',
                    'data-webp' => 'true',
                ]
            );
        ?>
    </div>
</div>
