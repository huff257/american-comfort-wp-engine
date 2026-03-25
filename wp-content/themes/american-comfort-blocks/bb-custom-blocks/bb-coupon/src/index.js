import { registerBlockType } from '@wordpress/blocks';
import {
    useBlockProps,
    InnerBlocks,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    Spinner
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import './style.scss';

registerBlockType('building-blocks-theme/bb-coupon', {
    title: 'Coupon Wrapper',
    icon: 'tickets-alt',
    category: 'widgets',

    attributes: {
        couponId: {
            type: 'string',
            default: ''
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const { couponId } = attributes;
        const [coupons, setCoupons] = useState([]);
        const [loading, setLoading] = useState(true);

        const blockProps = useBlockProps({
            className: 'bb-coupon-wrapper'
        });

        // Fetch coupon posts from REST API
        useEffect(() => {
            const fetchCoupons = async () => {
                try {
                    const res = await fetch('/wp-json/wp/v2/coupon?per_page=100'); // adjust per_page as needed
                    const data = await res.json();
                    const options = data.map(post => ({
                        label: post.title.rendered || `#${post.id}`,
                        value: post.id.toString()
                    }));
                    setCoupons(options);
                    setLoading(false);
                } catch (err) {
                    console.error('Failed to fetch coupons', err);
                    setLoading(false);
                }
            };

            fetchCoupons();
        }, []);

        return (
            <>
                <InspectorControls>
                    <PanelBody title="Coupon Settings">
                        {loading ? (
                            <Spinner />
                        ) : (
                            <SelectControl
                                label="Select Coupon"
                                value={couponId}
                                options={[
                                    { label: '— Select a coupon —', value: '' },
                                    ...coupons
                                ]}
                                onChange={(value) => setAttributes({ couponId: value })}
                                help="Choose which Coupon post to use"
                            />
                        )}
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <InnerBlocks />
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const { couponId } = attributes;

        const blockProps = useBlockProps.save({
            className: 'bb-coupon-wrapper',
            'data-coupon-id': couponId
        });

        return (
            <div {...blockProps}>
                <InnerBlocks.Content />
            </div>
        );
    }
});