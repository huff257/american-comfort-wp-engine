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
	ToggleControl,
	BaseControl,
	__experimentalText as Text,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from '../block.json';

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const {
			videoUrl,
			videoId,
			posterId,
			posterUrl,
			posterAlt,
			posterWidth,
			posterHeight,
			mobileImageId,
			mobileImageUrl,
			mobileImageAlt,
			useMobileFallback,
		} = attributes;

		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Video' ) } initialOpen={ true }>

						{ /* Video file */ }
						<BaseControl label={ __( 'Video file' ) } __nextHasNoMarginBottom>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) =>
										setAttributes( {
											videoUrl: media.url,
											videoId: media.id,
										} )
									}
									allowedTypes={ [ 'video' ] }
									value={ videoId }
									render={ ( { open } ) => (
										<div style={ { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' } }>
											{ videoUrl && (
												<Text size="body" color="secondary" truncate>
													{ videoUrl.split( '/' ).pop() }
												</Text>
											) }
											<Button
												variant={ videoUrl ? 'secondary' : 'primary' }
												onClick={ open }
												size="compact"
											>
												{ videoUrl
													? __( 'Replace video' )
													: __( 'Select video' ) }
											</Button>
											{ videoUrl && (
												<Button
													variant="tertiary"
													isDestructive
													size="compact"
													onClick={ () =>
														setAttributes( {
															videoUrl: '',
															videoId: undefined,
														} )
													}
												>
													{ __( 'Remove video' ) }
												</Button>
											) }
										</div>
									) }
								/>
							</MediaUploadCheck>
						</BaseControl>

						{ /* Poster image */ }
						<BaseControl
							label={ __( 'Poster image' ) }
							help={ __( 'Shown while the video loads. This is your LCP element — use a well-sized image.' ) }
							__nextHasNoMarginBottom
						>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) =>
										setAttributes( {
											posterId: media.id,
											posterUrl: media.url,
											posterAlt: media.alt || '',
											posterWidth: media.width,
											posterHeight: media.height,
										} )
									}
									allowedTypes={ [ 'image' ] }
									value={ posterId }
									render={ ( { open } ) => (
										<div style={ { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' } }>
											{ posterUrl && (
												<img
													src={ posterUrl }
													alt={ posterAlt }
													style={ { width: '100%', height: 'auto', borderRadius: '2px' } }
												/>
											) }
											<Button
												variant={ posterUrl ? 'secondary' : 'primary' }
												onClick={ open }
												size="compact"
											>
												{ posterUrl
													? __( 'Replace poster' )
													: __( 'Select poster' ) }
											</Button>
											{ posterUrl && (
												<Button
													variant="tertiary"
													isDestructive
													size="compact"
													onClick={ () =>
														setAttributes( {
															posterId: undefined,
															posterUrl: '',
															posterAlt: '',
															posterWidth: undefined,
															posterHeight: undefined,
														} )
													}
												>
													{ __( 'Remove poster' ) }
												</Button>
											) }
										</div>
									) }
								/>
							</MediaUploadCheck>
						</BaseControl>
					</PanelBody>

					<PanelBody title={ __( 'Mobile' ) } initialOpen={ false }>
						<ToggleControl
							label={ __( 'Use separate image on mobile' ) }
							help={ __(
								'Replaces the video with a static image on small screens. Skips the video download entirely.'
							) }
							checked={ useMobileFallback }
							onChange={ ( value ) =>
								setAttributes( { useMobileFallback: value } )
							}
							__nextHasNoMarginBottom
						/>

						{ useMobileFallback && (
							<BaseControl
								label={ __( 'Mobile image' ) }
								help={ __( 'If left empty, the poster image will be used instead.' ) }
								__nextHasNoMarginBottom
							>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ ( media ) =>
											setAttributes( {
												mobileImageId: media.id,
												mobileImageUrl: media.url,
												mobileImageAlt: media.alt || '',
											} )
										}
										allowedTypes={ [ 'image' ] }
										value={ mobileImageId }
										render={ ( { open } ) => (
											<div style={ { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' } }>
												{ mobileImageUrl && (
													<img
														src={ mobileImageUrl }
														alt={ mobileImageAlt }
														style={ { width: '100%', height: 'auto', borderRadius: '2px' } }
													/>
												) }
												<Button
													variant={ mobileImageUrl ? 'secondary' : 'primary' }
													onClick={ open }
													size="compact"
												>
													{ mobileImageUrl
														? __( 'Replace mobile image' )
														: __( 'Select mobile image' ) }
												</Button>
												{ mobileImageUrl && (
													<Button
														variant="tertiary"
														isDestructive
														size="compact"
														onClick={ () =>
															setAttributes( {
																mobileImageId: undefined,
																mobileImageUrl: '',
																mobileImageAlt: '',
															} )
														}
													>
														{ __( 'Remove mobile image' ) }
													</Button>
												) }
											</div>
										) }
									/>
								</MediaUploadCheck>
							</BaseControl>
						) }
					</PanelBody>
				</InspectorControls>

				{ /* Editor preview */ }
				<div { ...blockProps }>
					{ videoUrl || posterUrl ? (
						<div
							style={ {
								position: 'relative',
								background: '#000',
								aspectRatio: '16/9',
								overflow: 'hidden',
							} }
						>
							{ posterUrl && (
								<img
									src={ posterUrl }
									alt={ posterAlt }
									style={ {
										width: '100%',
										height: '100%',
										objectFit: 'cover',
										display: 'block',
									} }
								/>
							) }
							{ videoUrl && (
								<div
									style={ {
										position: 'absolute',
										inset: 0,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: 'rgba(0,0,0,0.35)',
										color: '#fff',
										fontSize: '13px',
										fontFamily: 'sans-serif',
										gap: '6px',
									} }
								>
									<span>▶</span>
									<span>{ videoUrl.split( '/' ).pop() }</span>
								</div>
							) }
						</div>
					) : (
						<div
							style={ {
								aspectRatio: '16/9',
								background: '#1a1a1a',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: '#666',
								fontSize: '13px',
								fontFamily: 'sans-serif',
							} }
						>
							{ __( 'Select a video and poster image in the sidebar →' ) }
						</div>
					) }
				</div>
			</>
		);
	},

	save( { attributes } ) {
		const {
			videoUrl,
			posterUrl,
			posterAlt,
			posterWidth,
			posterHeight,
			mobileImageUrl,
			mobileImageAlt,
			useMobileFallback,
		} = attributes;

		if ( ! videoUrl ) return null;

		const blockProps = useBlockProps.save();

		// Resolved mobile image — fall back to poster if no dedicated mobile image set
		const resolvedMobileUrl  = mobileImageUrl || posterUrl;
		const resolvedMobileAlt  = mobileImageAlt || posterAlt;

		return (
			<div { ...blockProps }>
				{ /*
				  * Preload the poster so the browser fetches it as early as possible.
				  * This is the single biggest LCP improvement for hero videos.
				  * NOTE: for best results, also output this via wp_head in your theme's
				  * functions.php using get_post_meta() so it lands in <head> before
				  * the browser starts parsing the body.
				  */ }
				{ posterUrl && (
					<link
						rel="preload"
						as="image"
						href={ posterUrl }
						fetchPriority="high"
					/>
				) }

				{ /* Mobile fallback image — hidden on desktop via CSS class */ }
				{ useMobileFallback && resolvedMobileUrl && (
					<img
						className="hero-video__mobile-image"
						src={ resolvedMobileUrl }
						alt={ resolvedMobileAlt }
						width={ posterWidth }
						height={ posterHeight }
						fetchPriority="high"
						decoding="async"
					/>
				) }

				{ /* Video — hidden on mobile via CSS class when fallback is enabled */ }
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
					poster={ posterUrl || undefined }
					width={ posterWidth }
					height={ posterHeight }
					preload="none"
				>
					<source src={ videoUrl } type="video/mp4" />
				</video>
			</div>
		);
	},
} );