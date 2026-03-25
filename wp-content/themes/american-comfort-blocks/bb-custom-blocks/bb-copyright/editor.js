(function (wp) {
  const { registerBlockType } = wp.blocks;
  const { useBlockProps } = wp.blockEditor;
  const { createElement: el, Fragment } = wp.element;

  registerBlockType('buildingblocks-block-theme/bb-copyright', {
    supports: {
      className: true,
    },

    edit: function () {
      const blockProps = useBlockProps({
        className: 'bb-copyright',
      });

      return el(
        Fragment,
        {},
        el(
          'div',
          blockProps,
          '\u00A9 ' + new Date().getFullYear() + ' Site Name'
        )
      );
    },

    save: function () {
      const blockProps = useBlockProps.save({
        className: 'bb-copyright',
      });

      return el(
        'div',
        blockProps,
        '\u00A9 ' + new Date().getFullYear() + ' Site Name'
      );
    },
  });
})(window.wp);
