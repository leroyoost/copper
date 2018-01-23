/**
 * jquery.dropdown.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2012, Codrops
 * http://www.codrops.com
 */
;( function( $, window, undefined ) {

	'use strict';

	$.DropDown = function( options, element ) {
		this.$el = $( element );
		this._init( options );
	};

	// the options
	$.DropDown.defaults = {
		speed : 300,
		easing : 'ease',
		gutter : 0,
		// initial stack effect
		stack : true,
		// delay between each option animation
		delay : 0,
		// random angle and positions for the options
		random : false,
		// rotated [right||left||false] : the options will be rotated to thr right side or left side.
		// make sure to tune the transform origin in the stylesheet
		rotated : false,
		// effect to slide in the options. value is the margin to start with
		slidingIn : false,
		onOptionSelect : function(opt) { return false; }
	};

	$.DropDown.prototype = {
		set: function(which){

			var self=this
			var opt=null;
			this.currentDateOpened=which;
			this.listopts.children( 'li' ).each( function() {
				if(which==$( this ).attr('data-value')){
					opt=$(this);
				}

			})
			if(opt==null || opt.attr('data-value')==self.inputEl.val())
				return;

			self.inputEl.val( opt.attr( 'data-value' ) );
			self.selectlabel.html( opt.html() );

			self.options.onOptionSelect( opt );

		}
		,
		_init : function( options ) {

			// options
			this.options = $.extend( true, {}, $.DropDown.defaults, options );
			this._layout();
			this._initEvents();

		},
		_layout : function() {

			var self = this;
			this.minZIndex = 1000;
			var value = this._transformSelect();
			this.opts = this.listopts.children( 'li' );
			this.optsCount = this.opts.length;
			this.size = { width : this.dd.width(), height : this.dd.height() };

			var elName = this.$el.attr( 'name' ), elId = this.$el.attr( 'id' ),
				inputName = elName !== undefined ? elName : elId !== undefined ? elId : 'cd-dropdown-' + ( new Date() ).getTime();

			this.inputEl = $( '<input type="hidden" name="' + inputName + '" value="' + value + '"></input>' ).insertAfter( this.selectlabel );
			this.currentDateOpened=value;

			this.selectlabel.css( 'z-index', this.minZIndex + this.optsCount );
			this._positionOpts();
			if( ModernizrC.csstransitions ) {
				setTimeout( function() { self.opts.css( 'transition', 'all ' + self.options.speed + 'ms ' + self.options.easing ); }, 25 );
			}

		},
		_transformSelect : function() {

			var optshtml = '', selectlabel = '', value = -1;
			this.$el.children( 'option' ).each( function() {

				var $this = $( this ),
					val = isNaN( $this.attr( 'value' ) ) ? $this.attr( 'value' ) : Number( $this.attr( 'value' ) ) ,
					cost = isNaN( $this.attr( 'data-cost' ) ) ? $this.attr( 'data-cost' ) : Number( $this.attr( 'data-cost' ) ) ,
					allowed = isNaN( $this.attr( 'data-allowed' ) ) ? $this.attr( 'data-allowed' ) : Number( $this.attr( 'data-allowed' ) ) ,
					classes = $this.attr( 'class' ),
					selected = $this.attr( 'selected' ),
					label = $this.text();


					 // data-bookingStatus
                  // data-startsTxt
                  // data-endsTxt

				if( val !== -1 ) {
					var li_html = '';
					var class_html = (classes !== undefined) ? 'class="' + classes + '"' : '';

					var datas = ''

					if (allowed || allowed == 0) datas += 'data-allowed="' + allowed + '"'
					if (cost || cost == 0) datas += 'data-cost="' + cost + '"'
					if ($this.attr('data-bookingStatus')) datas += 'data-bookingStatus="' + $this.attr('data-bookingStatus') + '"'
					if ($this.attr('data-startsTxt')) datas += 'data-startsTxt="' + $this.attr('data-startsTxt') + '"'
					if ($this.attr('data-endsTxt')) datas += 'data-endsTxt="' + $this.attr('data-endsTxt') + '"'


					li_html = '<li data-value="' + val + '" ' + datas + '><span ' + class_html + '>' + label + '</span></li>';

					optshtml += li_html

				}

				if( selected ) {
					selectlabel = label;
					value = val;
				}

			} );

			this.listopts = $( '<ul/>' ).append( optshtml );
			this.selectlabel = $( '<span/>' ).append( selectlabel );
			this.dd = $( '<div class="cd-dropdown"/>' ).append( this.selectlabel, this.listopts ).insertAfter( this.$el );
			this.$el.remove();

			return value;

		},
		_positionOpts : function( anim ) {

			var self = this;

			this.listopts.css( 'height', 'auto' );
			this.listopts.css( 'top', (self.size.height + self.options.gutter) );

			this.opts
				.each( function( i ) {
					$( this ).css( {
						zIndex : self.minZIndex + self.optsCount - 1 - i,
						top : self.options.slidingIn ? ( i  ) * ( self.size.height + self.options.gutter ) : 0,
						left : 0,
						marginLeft : self.options.slidingIn ? i % 2 === 0 ? self.options.slidingIn : - self.options.slidingIn : 0,
						opacity : self.options.slidingIn ? 0 : 1,
						transform : 'none'
					} );
				} );

			if( !this.options.slidingIn ) {
				this.opts
					.eq( this.optsCount - 1 )
					.css( { top : this.options.stack ? 9 : 0, left : this.options.stack ? 4 : 0, width : this.options.stack ? this.size.width - 8 : this.size.width, transform : 'none' } )
					.end()
					.eq( this.optsCount - 2 )
					.css( { top : this.options.stack ? 6 : 0, left : this.options.stack ? 2 : 0, width : this.options.stack ? this.size.width - 4 : this.size.width, transform : 'none' } )
					.end()
					.eq( this.optsCount - 3 )
					.css( { top : this.options.stack ? 3 : 0, left : 0, transform : 'none' } );
			}

		},
		_initEvents : function() {

			var self = this;

			this.selectlabel.on( 'mousedown.dropdown', function( event ) {
				self.opened ? self.close() : self.open();
				return false;

			} );

			this.opts.on( 'click.dropdown', function() {
				if( self.opened ) {
					var opt = $( this );
					self.options.onOptionSelect( opt );
					self.inputEl.val( opt.data( 'value' ) );
					self.selectlabel.html( opt.html() );
					self.close();
				}
			} );

		},
		open : function() {

			var self = this;
			var h;
			this.dd.toggleClass( 'cd-active' );
			var listHeight =( this.optsCount + 1 ) * ( this.size.height + this.options.gutter );

			this.listopts.css( 'height', listHeight );

			if(this.listopts.height()>450){
				this.listopts.css('height',"450");
				this.listopts.css('overflow-y',"scroll");
				this.listopts.css('overflow-x',"hidden");
			}

			this.opts.each( function( i ) {
			h=(self.size.height>40)?self.size.height:40;
				$( this ).css( {
					opacity : 1,
					top : self.options.rotated ? h + self.options.gutter : ( i  ) * ( h + self.options.gutter ),
					left : self.options.random ? Math.floor( Math.random() * 11 - 5 ) : 0,

					marginLeft : 0,
					transform : self.options.random ?
						'rotate(' + Math.floor( Math.random() * 11 - 5 ) + 'deg)' :
						self.options.rotated ?
							self.options.rotated === 'right' ?
								'rotate(-' + ( i * 5 ) + 'deg)' :
								'rotate(' + ( i * 5 ) + 'deg)'
							: 'none',
					transitionDelay : self.options.delay && ModernizrC.csstransitions ? self.options.slidingIn ? ( i * self.options.delay ) + 'ms' : ( ( self.optsCount - 1 - i ) * self.options.delay ) + 'ms' : 0
				} );

			} );
			this.opened = true;

		},
		close : function() {

			var self = this;
			this.dd.toggleClass( 'cd-active' );
			if( this.options.delay && ModernizrC.csstransitions ) {
				this.opts.each( function( i ) {
					$( this ).css( { 'transition-delay' : self.options.slidingIn ? ( ( self.optsCount - 1 - i ) * self.options.delay ) + 'ms' : ( i * self.options.delay ) + 'ms' } );
				} );
			}
			this._positionOpts( true );
			this.opened = false;
			this.listopts.css('overflow-y',"default");
			this.listopts.css('overflow-x',"default");

		},



	}

	$.fn.dropdownMoe = function( options ) {
		var instance = $.data( this, 'dropdownMoe' );
		if ( typeof options === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			this.each(function() {
				instance[ options ].apply( instance, args );
			});
		}
		else {
			this.each(function() {
				instance ? instance._init() : instance = $.data( this, 'dropdownMoe', new $.DropDown( options, this ) );
			});
		}
		return instance;
	};

} )( jQuery, window );
