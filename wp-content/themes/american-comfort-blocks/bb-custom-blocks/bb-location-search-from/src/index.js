import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, PlainText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';

registerBlockType('building-blocks-theme/location-search-form', {
    edit: () => {
        const blockProps = useBlockProps();

        const [title, setTitle] = useState('');
        const [searchValue, setSearchValue] = useState('');

        const handleSubmit = (event) => {
            event.preventDefault(); // prevents page refresh

            // You'll add custom JS here later
            console.log('Search submitted:', searchValue);
        };

        return (
            <div {...blockProps}>
                <div className="location-search-form">

                    {/* Title input */}
                    <PlainText
                        tagName="h3"
                        placeholder="Enter title..."
                        value={title}
                        onChange={setTitle}
                    />

                    {/* Form unit wrapper */}
                    <form
                        className="location-search-form__controls"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            placeholder="Search location..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />

                        <Button
                            variant="primary"
                            type="submit"
                        >
                            Search
                        </Button>
                    </form>

                </div>
            </div>
        );
    },

    save: () => {
        const blockProps = useBlockProps.save();

        return (
            <div {...blockProps}>
                <div className="location-search-form">

                    <h3 className="location-search-form__title">
                        Location Search
                    </h3>

                    <form className="location-search-form__controls">
                        <input
                            type="text"
                            className="location-search-form__input"
                            placeholder="Search location..."
                        />

                        <button
                            type="button"
                            className="location-search-form__button"
                        >
                            Search
                        </button>
                    </form>

                </div>
            </div>
        );
    }
});
