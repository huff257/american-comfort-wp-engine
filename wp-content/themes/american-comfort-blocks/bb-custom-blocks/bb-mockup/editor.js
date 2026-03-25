(function (wp) {
  const { registerBlockType } = wp.blocks;
  const {
    MediaUpload,
    MediaUploadCheck,
    InspectorControls,
    useBlockProps,
  } = wp.blockEditor;
  const { Button, PanelBody, SelectControl } = wp.components;
  const { createElement: el, Fragment } = wp.element;
  const { useSelect } = wp.data;

  registerBlockType('buildingblocks-block-theme/mockup', {
    supports: {
      className: true,
    },

    attributes: {
      deviceImageId: {
        type: 'number',
        default: 0,
      },
      parallaxImageId: {
        type: 'number',
        default: 0,
      },
      imageSize: {
        type: 'string',
        default: 'medium',
      },
    },

    edit: function (props) {
      const { attributes, setAttributes } = props;
      const { deviceImageId, parallaxImageId, imageSize } = attributes;

      /* =====================
       * MEDIA SUBSCRIPTIONS
       * ===================== */
      const deviceImage = useSelect(
        (select) =>
          deviceImageId
            ? select('core').getMedia(deviceImageId)
            : null,
        [deviceImageId]
      );

      const parallaxImage = useSelect(
        (select) =>
          parallaxImageId
            ? select('core').getMedia(parallaxImageId)
            : null,
        [parallaxImageId]
      );

      /* =====================
       * BLOCK WRAPPER PROPS
       * ===================== */
      const blockProps = useBlockProps({
        className: 'device-image-wrapper',
      });

      return el(
        Fragment,
        {},

        /* =====================
         * INSPECTOR CONTROLS
         * ===================== */
        el(
          InspectorControls,
          {},
          el(
            PanelBody,
            { title: 'Device', initialOpen: true },
            el(
              MediaUploadCheck,
              {},
              el(MediaUpload, {
                onSelect: (media) =>
                  setAttributes({ deviceImageId: media.id }),
                allowedTypes: ['image'],
                value: deviceImageId,
                render: ({ open }) =>
                  el(
                    Button,
                    { onClick: open, isSecondary: true },
                    deviceImageId
                      ? 'Change Device Image'
                      : 'Select Device Image'
                  ),
              })
            )
          ),

          el(
            PanelBody,
            { title: 'Mockup', initialOpen: false },

            el(
              MediaUploadCheck,
              {},
              el(MediaUpload, {
                onSelect: (media) =>
                  setAttributes({ parallaxImageId: media.id }),
                allowedTypes: ['image'],
                value: parallaxImageId,
                render: ({ open }) =>
                  el(
                    Button,
                    { onClick: open, isSecondary: true },
                    parallaxImageId
                      ? 'Change Mockup Image'
                      : 'Select Mockup Image'
                  ),
              })
            ),

            el(
              SelectControl,
              {
                label: 'Mockup image size',
                value: imageSize,
                options: [
                  { label: 'Small', value: 'small' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Large', value: 'large' },
                ],
                onChange: (imageSize) => setAttributes({ imageSize }),
              }
            )
          )
        ),

        /* =====================
         * EDITOR PREVIEW
         * (UNCHANGED)
         * ===================== */
        el(
          'div',
          blockProps,

          deviceImage &&
            el('img', {
              src:
                deviceImage.media_details?.sizes?.medium?.source_url ||
                deviceImage.source_url,
              width: 400,
              height: 251,
              className: 'device js-webp',
              sizes: '400px',
              fetchpriority: 'high',
              'data-webp': 'true',
              alt: deviceImage.alt_text || '',
            }),

          el(
            'div',
            { className: 'parallax-image-wrapper' },

            parallaxImage &&
              el('img', {
                src:
                  parallaxImage.media_details?.sizes?.large?.source_url ||
                  parallaxImage.source_url,
                width: 343,
                height: 957,
                className: 'parallax-image js-webp',
                fetchpriority: 'high',
                'data-webp': 'true',
                alt: parallaxImage.alt_text || '',
              })
          )
        )
      );
    },

    save: function () {
      return null;
    },
  });
})(window.wp);