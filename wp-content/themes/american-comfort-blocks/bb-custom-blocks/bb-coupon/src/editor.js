(function() {
    var subscribe = wp.data.subscribe;
    var select = wp.data.select;

    console.log('editor script');

    subscribe(function() {
        var blocks = select('core/block-editor').getBlocks();
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (block.name === 'building-blocks-theme/tabs') {
                var blockClientId = block.clientId;
                var blockElement = document.querySelector('[data-block="' + blockClientId + '"]');
                if (blockElement && blockElement.className.indexOf('my-editor-class') === -1) {
                    blockElement.className += ' my-editor-class';
                }
            }
        }
    });
})();
