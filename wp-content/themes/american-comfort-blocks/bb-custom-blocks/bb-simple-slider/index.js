( function ( wp ) {
	const { registerBlockType } = wp.blocks;
	const { InnerBlocks, InspectorControls } = wp.blockEditor;
	const { ToggleControl, PanelBody } = wp.components;
	const el = wp.element.createElement;

	registerBlockType( 'buildingblocks-block-theme/bb-slider', {
		edit: function ( props ) {
			const { attributes, setAttributes } = props;

			return el(
				'div',
				{ className: 'bb-slider-editor' },

				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: 'Slider Settings', initialOpen: true },
						el( ToggleControl, {
							label: 'Autoplay',
							checked: attributes.autoplay,
							onChange: function ( value ) {
								setAttributes( { autoplay: value } );
							}
						} ),
						el( ToggleControl, {
							label: 'Show arrows',
							checked: attributes.showArrows,
							onChange: function ( value ) {
								setAttributes( { showArrows: value } );
							}
						} )
					)
				),

				el( InnerBlocks, {
					allowedBlocks: [ 'buildingblocks-block-theme/slide' ],
					templateLock: false
				} )
			);
		},

		save: function () {
			return el(
				'div',
				{ className: 'bb-slider' },
				el( InnerBlocks.Content )
			);
		}
	} );

	registerBlockType( 'buildingblocks-block-theme/slide', {
		title: 'Slide',
		icon: 'format-image',
		category: 'layout',
		parent: [ 'buildingblocks-block-theme/bb-slider' ],
		supports: {
			reusable: false,
			html: false
		},

		edit: function () {
			return el(
				'div',
				{ className: 'bb-slide-editor device-slides' },
				el( InnerBlocks, {
					templateLock: false
				} )
			);
		},

		save: function () {
			return el(
				'div',
				{ className: 'bb-slide device-slide' },
				el( InnerBlocks.Content )
			);
		}
	} );

} )( window.wp );
