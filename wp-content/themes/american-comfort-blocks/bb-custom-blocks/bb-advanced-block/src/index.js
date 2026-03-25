import domReady from '@wordpress/dom-ready';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { useState, useEffect, createElement as el } from '@wordpress/element';
import { TextControl, ComboboxControl, PanelBody } from '@wordpress/components';
import { select } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import './editor.scss';

domReady(() => {
    const ALLOWED_BLOCKS = null;

    function resolveEditorBackgroundColor(className) {
        if (!className) return null;

        const match = className.match(/has-([a-z0-9\-]+)-background-color/);
        if (!match) return null;

        const slug = match[1];
        const settings = select('core/block-editor')?.getSettings?.();
        const colors = settings?.colors || [];

        const color = colors.find((c) => c.slug === slug);
        return color ? color.color : null;
    }

    function Edit({ attributes, setAttributes }) {
        const [posts, setPosts] = useState(null);
        const postType = 'styling_package';
        const TagName = attributes.htmlTag || 'section';

        useEffect(() => {
            if (!posts) {
                apiFetch({
                    path: `/wp/v2/${postType}?per_page=50&_fields=id,title,meta`,
                }).then(setPosts);
            }
        }, [posts]);

        const resolveVariant = (post) => {
            if (!post) return 'default';
            if (post.meta?.featured) return 'featured';
            if (post.meta?.layout) return post.meta.layout;
            return 'default';
        };

        if (!posts) {
            return el('p', null, 'Loading…');
        }

        const bgColor = resolveEditorBackgroundColor(attributes.className);

        const wrapperStyle = { padding: '8px', border: '1px dashed #ccc' };
        if (bgColor) wrapperStyle.backgroundColor = bgColor;

        return el(
            TagName,
            {
                className: `bb-advanced-wrapper ${attributes.className || ''}`,
                style: wrapperStyle,
            },
            el(
                InspectorControls,
                null,
                el(
                    PanelBody,
                    { title: 'Styling Package Settings', initialOpen: true },
                    el(ComboboxControl, {
                        label: 'HTML Element',
                        value: attributes.htmlTag,
                        options: [
                            { label: 'section', value: 'section' },
                            { label: 'div', value: 'div' },
                            { label: 'article', value: 'article' },
                            { label: 'aside', value: 'aside' },
                            { label: 'main', value: 'main' },
                            { label: 'header', value: 'header' },
                            { label: 'footer', value: 'footer' },
                        ],
                        onChange: (value) =>
                            setAttributes({ htmlTag: value || 'section' }),
                    }),
                    el(ComboboxControl, {
                        label: 'Select Styling Package',
                        value: attributes.postId || '',
                        options: [
                            { label: '— None —', value: '' },
                            ...posts.map((p) => ({
                                label: p.title.rendered,
                                value: p.id,
                            })),
                        ],
                        onChange: (value) => {
                            const post = posts.find((p) => p.id === Number(value));
                            setAttributes({
                                postId: Number(value) || null,
                                variant: resolveVariant(post),
                            });
                        },
                    }),
                    el(TextControl, {
                        label: 'Extra Class Name',
                        value: attributes.className || '',
                        onChange: (value) => setAttributes({ className: value }),
                    })
                )
            ),
            el(InnerBlocks, { allowedBlocks: ALLOWED_BLOCKS })
        );
    }

    registerBlockType('buildingblocks-block-theme/bb-advanced-block', {
        icon: 'screenoptions',
        supports: { color: { background: true } },
        attributes: {
            postId: { type: 'number' },
            htmlTag: { type: 'string', default: 'div' },
            className: { type: 'string', default: '' },
        },
        edit: Edit,
        save: () => el(InnerBlocks.Content),
    });
});
