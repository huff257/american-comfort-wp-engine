(function(wp){
	const {registerBlockType}=wp.blocks;
	const {InnerBlocks}=wp.blockEditor;
	const {TextControl,SelectControl}=wp.components;
	const {createElement:el,useEffect}=wp.element;
	const {useSelect}=wp.data;

	registerBlockType('buildingblocks-block-theme/bb-slider',{
		title:'BB Slider',
		icon:'images-alt2',
		category:'layout',
		supports:{html:false},
		attributes:{
			slides:{type:'array',default:[]}
		},
		edit:function(props){
			const {attributes,setAttributes,clientId}=props;
			const {slides}=attributes;
			const innerBlocks=useSelect(select=>select('core/block-editor').getBlocks(clientId),[clientId]);

			useEffect(()=>{
				const slideBlocks=innerBlocks.filter(block=>block.name==='buildingblocks-block-theme/bb-slide');
				if(slideBlocks.length!==slides.length){
					const newSlides=slideBlocks.map((block,index)=>slides[index]||{title:'',icon:''});
					setAttributes({slides:newSlides});
				}
			},[innerBlocks]);

			return el('div',{className:'bb-slider-editor'},
				el(InnerBlocks,{
					allowedBlocks:[
						'buildingblocks-block-theme/bb-slide-titles',
						'buildingblocks-block-theme/bb-slide'
					],
					template:[
						['buildingblocks-block-theme/bb-slide-titles']
					],
					templateLock:false
				})
			);
		},
		save:function(props){
			const {slides}=props.attributes;
			return el('div',{className:'bb-slider'},
				el('div',{className:'bb-slide-header-wrapper'},
					slides.map((slide,index)=>
						el('div',{className:'bb-slide-header',key:index},
							slide.icon&&el('img',{
								className:'bb-slide-icon',
								src:'/wp-content/themes/your-theme/assets/icons/'+slide.icon+'.svg',
								alt:slide.icon
							}),
							el('div',{className:'bb-slide-title'},slide.title)
						)
					)
				),
				el('div',{className:'bb-slides'},
					el(InnerBlocks.Content)
				)
			);
		}
	});

	registerBlockType('buildingblocks-block-theme/bb-slide-titles',{
		title:'Slide Titles',
		icon:'editor-ul',
		category:'layout',
		parent:['buildingblocks-block-theme/bb-slider'],
		supports:{html:false,reusable:false},
		edit:function(props){
			const {clientId}=props;
			const parentBlock=useSelect(select=>select('core/block-editor').getBlock(
				select('core/block-editor').getBlockRootClientId(clientId)
			),[clientId]);
			if(!parentBlock)return null;
			const slides=parentBlock.attributes.slides||[];
			const setAttributes=wp.data.dispatch('core/block-editor').updateBlockAttributes;

			function updateSlide(index,field,value){
				const newSlides=[...slides];
				newSlides[index][field]=value;
				setAttributes(parentBlock.clientId,{slides:newSlides});
			}

			return el('div',{className:'bb-slide-header-editor'},
				slides.map((slide,index)=>
					el('div',{className:'bb-slide-header-row',key:index},
						el(TextControl,{
							label:'Title',
							value:slide.title,
							onChange:(val)=>updateSlide(index,'title',val)
						}),
						el(SelectControl,{
							label:'Icon',
							value:slide.icon,
							options:[
								{label:'Select icon',value:''},
								{label:'Snowflake',value:'snowflake'},
								{label:'Flame',value:'flame'},
								{label:'Air Quality',value:'air-quality'},
								{label:'Water Heater',value:'water-heater'},
								{label:'Commercial',value:'commercial'}
							],
							onChange:(val)=>updateSlide(index,'icon',val)
						})
					)
				)
			);
		},
		save:function(){ return null; }
	});

	registerBlockType('buildingblocks-block-theme/bb-slide',{
		title:'Slide',
		icon:'images-alt2',
		category:'layout',
		parent:['buildingblocks-block-theme/bb-slider'],
		supports:{html:false,reusable:false},
		edit:function(){
			return el('div',{className:'bb-slider-wrapper'},
				el('div',{className:'bb-slide-body'},
					el(InnerBlocks)
				)
			);
		},
		save:function(){
			return el('div',{className:'bb-slider-wrapper'},
				el('div',{className:'bb-slide-body'},
					el(InnerBlocks.Content)
				)
			);
		}
	});

})(window.wp);
