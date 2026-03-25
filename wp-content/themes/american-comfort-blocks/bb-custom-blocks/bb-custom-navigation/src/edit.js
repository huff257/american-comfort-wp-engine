import { useBlockProps, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Spinner, Button, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
    const { selectedNavigationId, logoUrl, logoId, logoAlt, buttons } = attributes;
    const blockProps = useBlockProps();

    // Fetch all available navigation menus
    const { navigationMenus, isLoading } = useSelect((select) => {
        const { getEntityRecords, isResolving } = select('core');

        const menus = getEntityRecords('postType', 'wp_navigation', {
            per_page: -1,
            status: 'publish'
        });

        return {
            navigationMenus: menus || [],
            isLoading: isResolving('getEntityRecords', ['postType', 'wp_navigation', {
                per_page: -1,
                status: 'publish'
            }])
        };
    }, []);

    // Fetch all pages
    const { pages, pagesLoading } = useSelect((select) => {
        const { getEntityRecords, isResolving } = select('core');

        const allPages = getEntityRecords('postType', 'page', {
            per_page: -1,
            status: 'publish',
            orderby: 'title',
            order: 'asc'
        });

        return {
            pages: allPages || [],
            pagesLoading: isResolving('getEntityRecords', ['postType', 'page', {
                per_page: -1,
                status: 'publish',
                orderby: 'title',
                order: 'asc'
            }])
        };
    }, []);

    // Create options for the select control
    const menuOptions = [
        { label: __('Select a navigation menu', 'buildingblocks-block-theme'), value: 0 },
        ...navigationMenus.map(menu => ({
            label: menu.title?.rendered || __('(no title)', 'buildingblocks-block-theme'),
            value: menu.id
        }))
    ];

    // Handle logo selection
    const onSelectLogo = (media) => {
        setAttributes({
            logoUrl: media.url,
            logoId: media.id,
            logoAlt: media.alt || ''
        });
    };

    const onRemoveLogo = () => {
        setAttributes({
            logoUrl: '',
            logoId: 0,
            logoAlt: ''
        });
    };

    // Handle button management
    const addButton = () => {
        const newButtons = [...(buttons || []), { text: 'Button', url: '', btnClass: '' }];
        setAttributes({ buttons: newButtons });
    };

    const updateButton = (index, field, value) => {
        const newButtons = [...buttons];
        newButtons[index][field] = value;
        setAttributes({ buttons: newButtons });
    };

    const removeButton = (index) => {
        const newButtons = buttons.filter((_, i) => i !== index);
        setAttributes({ buttons: newButtons });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Navigation Settings', 'buildingblocks-block-theme')}>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <SelectControl
                            label={__('Choose Navigation Menu', 'buildingblocks-block-theme')}
                            value={selectedNavigationId}
                            options={menuOptions}
                            onChange={(value) => setAttributes({ selectedNavigationId: parseInt(value) })}
                            help={__('Select which navigation menu to display', 'buildingblocks-block-theme')}
                        />
                    )}
                </PanelBody>

                <PanelBody title={__('Logo', 'buildingblocks-block-theme')} initialOpen={false}>
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectLogo}
                            allowedTypes={['image']}
                            value={logoId}
                            render={({ open }) => (
                                <div>
                                    {logoUrl ? (
                                        <div>
                                            <img 
                                                src={logoUrl} 
                                                alt={logoAlt} 
                                                style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
                                            />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Button onClick={open} variant="secondary">
                                                    {__('Replace Logo', 'buildingblocks-block-theme')}
                                                </Button>
                                                <Button onClick={onRemoveLogo} variant="tertiary" isDestructive>
                                                    {__('Remove', 'buildingblocks-block-theme')}
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button onClick={open} variant="secondary">
                                            {__('Select Logo', 'buildingblocks-block-theme')}
                                        </Button>
                                    )}
                                </div>
                            )}
                        />
                    </MediaUploadCheck>
                    {logoUrl && (
                        <TextControl
                            label={__('Logo Alt Text', 'buildingblocks-block-theme')}
                            value={logoAlt}
                            onChange={(value) => setAttributes({ logoAlt: value })}
                            style={{ marginTop: '15px' }}
                        />
                    )}
                </PanelBody>

                <PanelBody title={__('Buttons', 'buildingblocks-block-theme')} initialOpen={false}>
                    {buttons && buttons.length > 0 ? (
                        buttons.map((button, index) => (
                            <div key={index} style={{ marginBottom: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '4px' }}>
                                <h4 style={{ marginTop: 0 }}>{__('Button', 'buildingblocks-block-theme')} {index + 1}</h4>
                                <TextControl
                                    label={__('Button Text', 'buildingblocks-block-theme')}
                                    value={button.text}
                                    onChange={(value) => updateButton(index, 'text', value)}
                                />
                                <TextControl
                                    label={__('Button URL', 'buildingblocks-block-theme')}
                                    value={button.url}
                                    onChange={(value) => updateButton(index, 'url', value)}
                                    type="url"
                                    help={__('Or select a page below', 'buildingblocks-block-theme')}
                                />
                                {pagesLoading ? (
                                    <Spinner />
                                ) : (
                                    <SelectControl
                                        label={__('Or Select a Page', 'buildingblocks-block-theme')}
                                        value=""
                                        options={[
                                            { label: __('Select a page...', 'buildingblocks-block-theme'), value: '' },
                                            ...pages.map(page => ({
                                                label: page.title?.rendered || __('(no title)', 'buildingblocks-block-theme'),
                                                value: page.link
                                            }))
                                        ]}
                                        onChange={(value) => {
                                            if (value) {
                                                updateButton(index, 'url', value);
                                            }
                                        }}
                                    />
                                )}
                                <TextControl
                                    label={__('Button Classes', 'buildingblocks-block-theme')}
                                    value={button.btnClass || ''}
                                    onChange={(value) => updateButton(index, 'btnClass', value)}
                                    help={__('e.g., ac-btn ac-blue-btn', 'buildingblocks-block-theme')}
                                />
                                <Button 
                                    onClick={() => removeButton(index)} 
                                    variant="secondary" 
                                    isDestructive
                                    style={{ marginTop: '10px' }}
                                >
                                    {__('Remove Button', 'buildingblocks-block-theme')}
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p>{__('No buttons added yet.', 'buildingblocks-block-theme')}</p>
                    )}
                    <Button onClick={addButton} variant="primary" style={{ marginTop: '10px' }}>
                        {__('Add Button', 'buildingblocks-block-theme')}
                    </Button>
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                {!selectedNavigationId ? (
                    <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '4px', textAlign: 'center' }}>
                        <p style={{ margin: 0 }}>
                            {__('Select a navigation menu from the block settings →', 'buildingblocks-block-theme')}
                        </p>
                    </div>
                ) : (
                    <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '4px', textAlign: 'center' }}>
                        <button 
                            className="custom-navigation__toggle" 
                            style={{ pointerEvents: 'none' }}
                        >
                            <span className="custom-navigation__toggle-icon"></span>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}