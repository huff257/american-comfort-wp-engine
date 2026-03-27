import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	BaseControl,
	ToggleControl,
	__experimentalText as Text,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from '../block.json';

registerBlockType(metadata.name, {

	edit({ attributes, setAttributes }) {

		const {
			videoUrl,
			videoId,
			posterId,
			posterUrl,
			posterAlt,
			posterWidth,
			posterHeight,
			posterSrcSet,
			posterSizes,
			useMobileFallback,
		} = attributes;

		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>

					<PanelBody title={__('Video')} initialOpen={true}>

						<BaseControl label={__('Video file')}>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) =>
										setAttributes({
											videoUrl: media.url,
											videoId: media.id,
										})
									}
									allowedTypes={['video']}
									value={videoId}
									render={({ open }) => (
										<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

											{videoUrl && (
												<Text size="body" color="secondary" truncate>
													{videoUrl.split('/').pop()}
												</Text>
											)}

											<Button
												variant={videoUrl ? 'secondary' : 'primary'}
												onClick={open}
											>
												{videoUrl ? __('Replace video') : __('Select video')}
											</Button>

											{videoUrl && (
												<Button
													variant="tertiary"
													isDestructive
													onClick={() =>
														setAttributes({
															videoUrl: '',
															videoId: undefined,
														})
													}
												>
													{__('Remove video')}
												</Button>
											)}

										</div>
									)}
								/>
							</MediaUploadCheck>
						</BaseControl>


						<BaseControl
							label={__('Poster image')}
							help={__('Used for LCP and responsive loading')}
						>

							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) =>
										setAttributes({
											posterId: media.id,
											posterUrl: media.url,
											posterAlt: media.alt || '',
											posterWidth: media.width,
											posterHeight: media.height,

											posterSrcSet: media.sizes
												? Object.values(media.sizes)
														.map((size) => `${size.url} ${size.width}w`)
														.join(', ')
												: '',

											posterSizes: '(max-width: 768px) 100vw, 100vw',
										})
									}

									allowedTypes={['image']}
									value={posterId}

									render={({ open }) => (
										<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

											{posterUrl && (
												<img
													src={posterUrl}
													alt={posterAlt}
													style={{
														width: '100%',
														height: 'auto',
														borderRadius: '2px',
													}}
												/>
											)}

											<Button
												variant={posterUrl ? 'secondary' : 'primary'}
												onClick={open}
											>
												{posterUrl ? __('Replace poster') : __('Select poster')}
											</Button>

											{posterUrl && (
												<Button
													variant="tertiary"
													isDestructive
													onClick={() =>
														setAttributes({
															posterId: undefined,
															posterUrl: '',
															posterAlt: '',
															posterSrcSet: '',
															posterSizes: '',
														})
													}
												>
													{__('Remove poster')}
												</Button>
											)}

										</div>
									)}
								/>
							</MediaUploadCheck>

						</BaseControl>

					</PanelBody>


					<PanelBody title={__('Mobile')} initialOpen={false}>

						<ToggleControl
							label={__('Replace video with image on mobile')}
							help={__('Prevents mobile browsers from downloading the video')}
							checked={useMobileFallback}
							onChange={(value) =>
								setAttributes({ useMobileFallback: value })
							}
						/>

					</PanelBody>

				</InspectorControls>


				<div {...blockProps}>

					{posterUrl ? (

						<div
							style={{
								position: 'relative',
								background: '#000',
								aspectRatio: '16/9',
								overflow: 'hidden',
							}}
						>

							<img
								src={posterUrl}
								alt={posterAlt}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
							/>

							{videoUrl && (
								<div
									style={{
										position: 'absolute',
										inset: 0,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: 'rgba(0,0,0,0.35)',
										color: '#fff',
										fontSize: '13px',
									}}
								>
									▶ {videoUrl.split('/').pop()}
								</div>
							)}

						</div>

					) : (

						<div
							style={{
								aspectRatio: '16/9',
								background: '#1a1a1a',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: '#666',
							}}
						>
							{__('Select a video and poster image in the sidebar →')}
						</div>

					)}

				</div>
			</>
		);
	},



	save({ attributes }) {

		const {
			videoUrl,
			posterUrl,
			posterAlt,
			posterWidth,
			posterHeight,
			posterSrcSet,
			posterSizes,
			useMobileFallback,
		} = attributes;

		if (!videoUrl) return null;

		const blockProps = useBlockProps.save();

		return (

			<div {...blockProps}>

				{posterUrl && (
					<link
						rel="preload"
						as="image"
						href={posterUrl}
						fetchPriority="high"
					/>
				)}

				{useMobileFallback && posterUrl && (

					<img
						className="hero-video__mobile-image"
						src={posterUrl}
						srcSet={posterSrcSet}
						sizes={posterSizes}
						alt={posterAlt}
						width={posterWidth}
						height={posterHeight}
						fetchPriority="high"
						decoding="async"
						loading="eager"
					/>

				)}

				<video
					className={
						useMobileFallback
							? 'hero-video__video hero-video__video--desktop-only'
							: 'hero-video__video'
					}
					autoPlay
					muted
					loop
					playsInline
					poster={posterUrl || undefined}
					width={posterWidth}
					height={posterHeight}
					preload="none"
				>

					<source src={videoUrl} type="video/mp4" />

				</video>

			</div>

		);
	},

});
