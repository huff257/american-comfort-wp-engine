import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { createElement, useEffect } from '@wordpress/element';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import './editor.scss';
import './style.scss';

registerBlockType('building-blocks-theme/tab', {
    title: 'Tab',
    icon: 'editor-table',
    category: 'layout',
    parent: ['building-blocks-theme/tabs'],
    attributes: {
        title: { type: 'string', default: 'Tab' },
        icon: { type: 'string', default: '' }
    },
    edit: (props) => {
        const { attributes, setAttributes, clientId } = props;
        const blockProps = useBlockProps();
        const parentClientId = useSelect(
            select => select('core/block-editor').getBlockRootClientId(clientId),
            [clientId]
        );
        const tabs = useSelect(
            select => parentClientId ? select('core/block-editor').getBlocks(parentClientId) : [],
            [parentClientId]
        );
        const { updateBlockAttributes } = useDispatch('core/block-editor');
        const index = tabs.findIndex(tab => tab.clientId === clientId);
        const updateTitle = (value) => {
            setAttributes({ title: value });
            if(parentClientId !== null && index !== -1) {
                const reorderedTitles = tabs.map((tab, i) => i === index ? value : (tab.attributes.title || 'Tab ' + (i + 1)));
                updateBlockAttributes(parentClientId, { tabTitles: reorderedTitles });
            }
        };
        const iconOptions = [
            { label: 'Select icon', value: '' },
            { label: 'Snowflake', value: 'snowflake' },
            { label: 'Flame', value: 'flame' },
            { label: 'Air Quality', value: 'air-quality' },
            { label: 'Water Heater', value: 'water-heater' },
            { label: 'Commercial', value: 'commercial' }
        ];
        return createElement(
            'div',
            { ...blockProps, className: 'tab-item inactive' },
            createElement(
                InspectorControls,
                {},
                createElement(
                    PanelBody,
                    { title: 'Tab Settings', initialOpen: true },
                    createElement(TextControl, {
                        label: 'Tab Title',
                        value: attributes.title,
                        onChange: updateTitle
                    }),
                    createElement(SelectControl, {
                        label: 'Tab Icon',
                        value: attributes.icon,
                        options: iconOptions,
                        onChange: (value) => setAttributes({ icon: value })
                    })
                )
            ),
            createElement(
                'button',
                {
                    className: `tab-button ${attributes.icon || ''} mobile`,
                    type: 'button'
                },
                attributes.title
            ),
            createElement(
                'div',
                { className: 'tab-content' },
                createElement(InnerBlocks)
            )
        );
    },
    save: (props) => {
        const { attributes } = props;
        const blockProps = useBlockProps.save({
            className: 'tab-item inactive'
        });
        return createElement(
            'div',
            blockProps,
            createElement(
                'button',
                {
                    className: `tab-button ${attributes.icon || ''} mobile`,
                    type: 'button'
                },
                attributes.title
            ),
            createElement(
                'div',
                { className: 'tab-content' },
                createElement(InnerBlocks.Content)
            )
        );
    },
});

registerBlockType('building-blocks-theme/tabs', {
    title: 'Tabs',
    icon: 'admin-page',
    category: 'layout',
    attributes: {
        tabTitles: { type: 'array', default: [] },
        tabIcons: { type: 'array', default: [] }
    },
    edit: (props) => {
        const { attributes, setAttributes, clientId } = props;
        const blockProps = useBlockProps();
        const tabs = useSelect(
            select => select('core/block-editor').getBlocks(clientId),
            [clientId]
        );
        useEffect(() => {
            const reorderedTitles = tabs.map((tab, index) => tab.attributes.title || 'Tab ' + (index + 1));
            const reorderedIcons = tabs.map((tab) => tab.attributes.icon || '');
            setAttributes({ tabTitles: reorderedTitles, tabIcons: reorderedIcons });
        }, [tabs.map(tab => tab.clientId).join(',')]);
        return createElement(
            'div',
            { ...blockProps, className: 'tabs-container' },
            createElement(
                'div',
                { className: 'tabs-header desktop' },
                attributes.tabTitles.map((title, index) =>
                    createElement(
                        'button',
                        {
                            key: index,
                            className: `tab-button ${attributes.tabIcons[index] || ''}`,
                            type: 'button'
                        },
                        title
                    )
                )
            ),
            createElement(InnerBlocks, {
                allowedBlocks: ['building-blocks-theme/tab'],
                templateLock: false,
                renderAppender: InnerBlocks.ButtonBlockAppender
            })
        );
    },
    save: (props) => {
        const { attributes } = props;
        const blockProps = useBlockProps.save();
        return createElement(
            'div',
            { ...blockProps, className: 'tabs-container' },
            createElement(
                'div',
                { className: 'tabs-header desktop' },
                attributes.tabTitles.map((title, index) =>
                    createElement(
                        'button',
                        {
                            key: index,
                            className: `tab-button ${attributes.tabIcons[index] || ''}`,
                            type: 'button'
                        },
                        title
                    )
                )
            ),
            createElement(
                'div',
                { className: 'tabs-body' },
                createElement(InnerBlocks.Content)
            )
        );
    },
});
