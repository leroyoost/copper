/* Event Booking Pro - WordPress Plugin
 * Get plugin at: http://iplusstd.com/item/eventBookingPro/
 * Moe Haydar
 */


(function($) {
  var $modal = null;

  $(window).resize(function() {
    doResize();
  });

  function doResize() {
    $('.eventDisplayCnt').each(function(index, element) {
      eventImageResizer($(this));
    });
    checkScroller();
  }

  function eventImageResizer($which) {
    var imgCropping =  $('.eventImage').first().attr("data-image-crop") ;
    var imgSetHeight =  $('.eventImage').first().attr("data-image-height");

    if (imgCropping == 'true') {
      $('.imgHolder.expandImg').each(function(index, element) {
        if (parseInt($(this).find('img').css('marginTop')) == 0) {
          $(this).height($(this).find('img').height());
        } else {
          var imgH = parseInt($(this).find('img').height()) - imgSetHeight;
          if (imgH > 0 ) {
            var imageH = $(this).find('img').height() - imgSetHeight;
            $(this).find(' img').css('marginTop',-parseInt(imageH/2));
            $(this).height(imgSetHeight);
          } else {
            $(this).height($(this).find('img').height());
            $(this).find(' img').css('marginTop',0);
          }
        }
      });
    }

  }

  function checkScroller() {
    $modal= $('.ebp-show');
    if ($modal.height() > ($(window).height()-40)) {
      if (!$modal.hasClass("mCustomScrollbar"))
        $modal.mCustomScrollbar({set_height:($(window).height()-40)});
      else {
        $modal.height($(window).height()-40);
        $modal.mCustomScrollbar("update");
      }
    }
  }

  function getMapType(mapString) {
     switch(mapString) {
      case "HYBRID":
        return google.maps.MapTypeId.HYBRID;
      case "TERRAIN":
        return google.maps.MapTypeId.TERRAIN;
      case "SATELLITE":
        return google.maps.MapTypeId.SATELLITE;
      case "ROADMAP":
      default:
        return google.maps.MapTypeId.ROADMAP;
     }
  }

  function doMap(mapCanvas, address, mapformat, zoomValue, addressType, scrollwheel) {
    if (address === '') return;

     mapCanvas.style.display = 'block';

    var mapOptions = {
      zoom: parseInt(zoomValue),
      mapTypeId: mapformat
    };

    if (scrollwheel === 'false') mapOptions.scrollwheel = false;


    var map = new google.maps.Map(mapCanvas, mapOptions);

    var geocoder = new google.maps.Geocoder();
    // address from latlng
    if (addressType === 'latlng') {
      var latlngStr = address.split(",", 2);
      var lat = parseFloat(latlngStr[0]);
      var lng = parseFloat(latlngStr[1]);
      latlng = new google.maps.LatLng(lat, lng);

      geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            position: latlng
          });

          google.maps.event.trigger(mapCanvas, "resize");
        } else {
          mapCanvas.style.display = 'none';
        }
      });
    } else {
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });


          google.maps.event.trigger(mapCanvas, "resize");
        } else {
          mapCanvas.style.display='none';
        }
      });
    }
  }

  $(document).ready(function() {
    var $activeDateSelect = null;

    // buy btn Modal
    $(document).on('click', '.ebp-trigger', function(e) {
      e.preventDefault();

      if ($(this).hasClass("isMoreDate")) {
        openMoreDates($(this));
        return;
      }

      if ($(document).width()>760) {
        doBuyBtn($(this));
      } else {
        var dataID = $(this).attr("data-dateID");
        var id = $(this).attr("data-id");
        var url = $("input[name='ebpmobilepagelink']").val();
        if (url.indexOf("?") > -1)
            url += "&id=" + id + "&date_id=" + dataID;
        else
            url += "?id=" + id + "&date_id=" + dataID;
        window.location.href = url;
      }
    });

    // booked people modal
    $(document).on('click', '.ebp_btn_people', function(e) {
      e.preventDefault();
      openPopUp($(this));
    });


    // directDateBook
    $(document).on('click', '.directDateBook', function(e) {
      e.preventDefault();
      $(".ebp-show").removeClass("ebp-show");

      if ($(document).width()>760) {
        doBuyBtn($(this))
      } else {
        var dataID = $(this).attr("data-toOpen");
        var id = $(this).attr("data-id");
        var url = $("input[name='ebpmobilepagelink']").val();
        if (url.indexOf("?") > -1)
          url += "&id=" + id + "&date_id=" + dataID;
        else
          url += "?id=" + id + "&date_id=" + dataID;
        window.location.href = url;
      }
    });


    function doBookingForm() {
      //do form selects
      $('.ebp-show form select').each(function(index, element) {
        $(this).dropdownMoe({
            gutter : 2,
            stack : false,
            slidingIn : 100
        });
      });

      //select btn
      $('.ebp-show .tickets select').each(function(index, element) {
        var $ref = $(this);
        var eventID = $(this).parent().attr("data-id");

        var $tempIs = $(this).dropdownMoe({
          gutter : 5,
          stack : false,
          slidingIn : 100,
          onOptionSelect: function($opt) {
            var ticketID,Dateid, cost;
            if ($ref.hasClass("ticketType")) {
              cost = $opt.attr("data-cost");
              ticketID = $opt.attr("data-value");
              Dateid = $('.ebp-show .ebp-content .tickets input[name="ticketDate'+eventID+'"]').val();

              $('.ebp-show input[name="initialCost"]').val(cost);

              calcTotal();
            } else {
              Dateid = $opt.attr("data-value");
              ticketID = $('.ebp-show .ebp-content .tickets input[name="ticketType'+eventID+'"]').val();

              var bookingStatus = $opt.attr("data-bookingStatus");

              if (bookingStatus == 1) {
                $('.ebp-show .buy').hide()
                $('.ebp-show .noBuy').html($opt.attr("data-startsTxt"))

                $('.ebp-show .noBuy').show()
              } else if (bookingStatus > 1) {
                $('.ebp-show .buy').hide();
                $('.ebp-show .noBuy').html($opt.attr("data-endsTxt"))
                $('.ebp-show .noBuy').show()
              } else {
                $('.ebp-show .buy').show();
                $('.ebp-show .noBuy').hide()
              }

              $('.ebp-show .noBuy').css('line-height', $('.ebp-show .buy').height()+'px');


            }

            $(".ebp-show .ebp-content .tickets .spotsleft span").text("");
            $.ajax({
              type: 'POST',
              url: $("input[name='ajaxlink']").val() + '/wp-admin/admin-ajax.php',
              data: 'action=check_spots&ticket=' + ticketID + '&date_id=' + Dateid,
              success: function(response) {
                $(".ebp-show .ebp-content .tickets .spotsleft span").text(response);

                var newTotal = $(".ebp-show .ebp-content .single strong").text();

                $(".ebp-show .ebp-content .quantityBtns span").html(1);
                $('.ebp-show .ebp-content .total strong').html(newTotal);

                if (parseInt($(".ebp-show .ebp-content .spotsleft span").html()) === 0) {
                  $(".ebp-show .ebp-content .buy a").each(function(index, element) {
                    if (!$(this).hasClass("deactive"))
                        $(this).addClass("deactive")
                  });
                } else if ($(".ebp-show .ebp-content .spotsleft span").html() != "0") {
                  $(".ebp-show .ebp-content .buy a").each(function(index, element) {
                    if ($(this).hasClass("deactive"))
                      $(this).removeClass("deactive")
                  });
                }
              }
            });
          }
        });

        if ($(this).hasClass("ticketDate")) {
          $activeDateSelect=$tempIs
        }
      });

      if ($activeDateSelect != null)
        $activeDateSelect.set($modal.attr("data-targetDate"));

      if ($('.ebp-show input[name="initialCost"]').length > 0)
        calcTotal();
    }

    $(document).on('click', '.ebp-show .quantityBtns a', function(e) {
      e.preventDefault();
      var newQuantity = parseInt($('.ebp-show .quantityBtns span').html());

      if ($(this).hasClass("up"))
        newQuantity ++;
      else
        newQuantity --;


      // stop if quantity exceeds the limit
      if (newQuantity < 1) return;

      if (newQuantity > parseInt($('.ebp-show .spotsleft span').html())) return;

      var initPrice = getFormattedNumber($('.ebp-show .single strong').text());
      var newTotal = newQuantity*initPrice;
      newTotal = formatPrice(newTotal);

      $('.ebp-show .quantityBtns span').html(newQuantity);
      $('.ebp-show input[name="quantity"]').val(newQuantity);

      $('.ebp-show .total strong').html(newTotal);

      calcTotal();
    });

    // checking coupon btn
    $(document).on('click', '.ebp-show .coupon.checking', function(e) {
      e.preventDefault();

      $('.ebp-show span.couponResult').html("checking...");
      var coupon = $('.ebp-show input[name="coupon-code"]').val();
      var id = $('.ebp-show input[name="event-id"]').val();

      $.ajax({
        type:'POST',
        url: $("input[name='ajaxlink']").val() + '/wp-admin/admin-ajax.php',
        data: 'action=check_coupon&code=' + coupon + '&event=' + id,
        success: function(response) {
          var id = response.substring(0, response.indexOf('-'));
          var type = response.substring(1 + response.indexOf('-'), response.indexOf('&'));
          var opt = response.substring(1 + response.indexOf('&'), response.length);

          if (type === 'expired') {
              $('.ebp-show span.couponResult').attr("data-name", "");
              $('.ebp-show span.couponResult').html("Coupon has expired.");
          } else if (type === 'false') {
              $('.ebp-show span.couponResult').attr("data-name", "");
              $('.ebp-show span.couponResult').html("Coupon not found.");
          } else {
              $('.ebp-show span.couponResult').html(opt);
              $('.ebp-show span.couponResult').attr("data-name", coupon);
              $('.ebp-show span.couponResult').attr("data-type", type);
              $('.ebp-show span.couponResult').attr("data-id", id);
              calcTotal();
          }
        }
      });
     });

    prepareEvent($(".eventDisplayCnt").not(".isCalendar"), true);
    prepareEvent($(".eventCardCnt").not(".extended"), false);

    $(document).on('click', '.eventCardExtendedCnt .eventCardCnt', function(e) {
      e.preventDefault();
       if (!$(e.target).is("a")) {
        if (!$(this).parent().find(".eventDescription").hasClass("open")) {
          $(this).parent().find(".eventDescription").addClass("open");

          $(this).parent().find(".eventDescription").slideDown();
          if (!$(this).parent().hasClass("isInited")) {
            $(this).parent().addClass("isInited");
            prepareEvent($(this).parent(), true)
          }

        } else {
          $(this).parent().find(".eventDescription").removeClass("open");
          $(this).parent().find(".eventDescription").slideUp();
        }
      }
    });

    $(document).on('click', '.eventCardExtendedCnt .eventDescription  a.hideDetails', function(e) {
      e.preventDefault();
      $(this).parent().parent().find(".eventDescription").removeClass("open");
      $(this).parent().parent().find(".eventDescription").slideUp();
    });

    function prepareEvent($which, initMap, callback) {

      // get images
      $which.find(".eventImage").each(function(index, element) {
        if ($(this).attr("data-image") != "")
          getImg($(this));
      });

      //get info
      $which.find(".info").not(".deactive").each(function() {
        if (parseInt($(this).find(".cnt").height()) > parseInt($(this).attr("data-height"))) {
          $(this).css("height", $(this).attr("data-height"));
          var $expandBtn = $('<a href="" class="expand"></a>').text($(this).attr("data-expandTxt"));

          $expandBtn.click(function(e) {
            e.preventDefault();
            toggleTxtBox($(this).parent());
          });

          $(this).append($expandBtn);

        } else {
          $(this).css("height","auto");
        }
      });

      //initialize map
      if (initMap) {
        $which.find('.map_canvas').each(function(index, element) {
          var mapType = getMapType($(this).attr("data-maptype"));
          doMap(this,$(this).attr("data-address"), mapType, parseInt($(this).attr("data-zoom"),10),
            $(this).attr("data-addressType"), true);
        });
      }

      eventImageResizer($which);

      //move the booking page to top level.
      fixModals();
    }

    function fixModals() {
      $(".ebp-modal").not(".ebpOnTop").each(function(index, element) {
        $(this).addClass("ebpOnTop");
        $(this).appendTo("body");
      });

      $(".ebp-overlay").remove();
      $('<div class="ebp-overlay"></div>').appendTo("body");
    }

    function openMoreDates($this) {
      openPopUp($this);
    }

    function doBuyBtn($this) {
      openPopUp($this);

      $modal.find('.offlineloader').hide();

      if (parseInt($(".ebp-show .ebp-content .spotsleft span").html(),10) == 0) {
        $(".ebp-show .ebp-content .buy a").each(function(index, element) {
          if (!$(this).hasClass("deactive"))
            $(this).addClass("deactive");
        });
      }
    }

    function openNewPop($newPop) {
      var $old = $(".ebp-show");
      $modal = $newPop.first();
      $modal.addClass('ebp-show');
      setTimeout(function() {$(document).addClass( 'ebp-perspective' );$old.removeClass("ebp-show")}, 50 );
    }

    function closePopUp() {
      $(document).removeClass('ebp-perspective' );
      $modal.find(".incorrect").removeClass('incorrect')
      $modal.removeClass('ebp-show' );
    }

    function openPopUp($this) {
      $modal = $('#' +  $this.attr('data-modal')+" ").first();

      if ($this.attr('data-toOpen') != undefined) {
        $modal.attr("data-targetDate", $this.attr('data-toOpen'));
      }

      if ($modal.height() > ($(window).height()-40)) {
        if (!$modal.hasClass("mCustomScrollbar")) {
          $modal.mCustomScrollbar({set_height: ($(window).height()-40)});
        } else {
          $modal.height($(window).height() - 40);
          $modal.mCustomScrollbar("update");
        }
      }

      $modal.addClass('ebp-show' );

      doBookingForm();

      if ($('.ebp-show.mCustomScrollbar').length >0)
        $modal.mCustomScrollbar("scrollTo","top");

      setTimeout( function() {$(document).addClass( 'ebp-perspective' )}, 25 );
    }


    //Add Close Event
    $(document).on('click', '.ebp-overlay, .closeBtn a', function(e) {
        e.preventDefault();
        closePopUp();
     });

    function calcTotal() {
      var initPrice = parseFloat($('.ebp-show input[name="initialCost"]').val().replace("," , ""));

      var quantity = parseInt($('.ebp-show .quantityBtns span').html(),10);

      var couponType = $('.ebp-show span.couponResult').attr("data-type");

      var couponAmount, couponAmountFormatted, newPrice, newTotal;

      newPrice = initPrice;
      newTotal = quantity*initPrice;

      couponAmount = $('.ebp-show span.couponResult strong').text();
      couponAmountFormatted = getFormattedNumber(couponAmount);

      if (couponType === 'single') {
        if (couponAmount.indexOf("%") > -1)
          newPrice = initPrice - parseFloat(couponAmountFormatted) * initPrice/100;
        else{
          newPrice = initPrice - couponAmountFormatted;
        }

        newTotal = quantity * newPrice;
      } else if (couponType === 'total') {
        if (couponAmount.indexOf("%") > -1)
          newTotal = newTotal - parseFloat(couponAmountFormatted) * newTotal/100;
        else{
          newTotal = newTotal - couponAmountFormatted;
        }
      }

      if (newTotal < 0) newTotal = 0;
      if (newPrice < 0) newPrice = 0;

      newTotal = formatPrice(newTotal);
      newPrice = formatPrice(newPrice)

      $('.ebp-show .single strong').html(newPrice);
      $('.ebp-show .total strong').html(newTotal);
      $('.ebp-show input[name="amount"]').val(newPrice);

      if ($('.ebp-show span.couponResult strong').length > 0) {
        var newName = $('.ebp-show input[name="eventName"]').val()+" - coupon: "+$('.ebp-show .optCol.double span').text();
        $('.ebp-show input[name="item_name"]').val(newName);
      }

      //

      if (initPrice === 0) {
        $('.ebp-show .single, .ebp-show .total, .ebp-show .singleLabel, .ebp-show .totalLabel, .book.paypal').hide();

      } else {
        $('.ebp-show .single, .ebp-show .total, .ebp-show .singleLabel, .ebp-show .totalLabel, .book.paypal').show();

      }
    }

    function checkCalendarScroller() {
      $('#eventContent').mCustomScrollbar("update");
    }

    function toggleTxtBox($which) {
      if ($which.hasClass("opened")) {
        $which.removeClass("opened");

        $which.find("a.expand").html($which.attr("data-expandTxt"));
        $which.height($which.attr("data-height"));

        setTimeout(function() {
          checkCalendarScroller();
        }, 500);
      } else {
        $which.addClass("opened");
        $which.find("a.expand").html($which.attr("data-closeTxt"));
        $which.height(($which.find('.cnt').height()+$which.find("a.expand").height()+20));

        setTimeout(function() {
          checkCalendarScroller();
        }, 500);


      }
    }

    function getImg($where) {
      var img = $where.attr("data-image");
      var imgCropping = $where.attr("data-image-crop") ;
      var imgSetHeight = $where.attr("data-image-height");
      var imgWidth = $where.attr("data-image-width");

      if ($where.find('.imgHolder').length > 0) return;

      var $imgRef = $('<img src="'+img+'" />');
      var $holderRef = $('<div class="imgHolder"></div>').append($imgRef);

      $where.append($holderRef);

      $imgRef.css("display","none");

      $imgRef.on("load",function(e) {
        if (imgCropping == 'true') {
          var imgH = parseInt($imgRef.height()) - imgSetHeight;
          if (imgH > 0) {
            $imgRef.css("display","block");

            $holderRef.height(imgSetHeight);

            $imgRef.css("margin-top", -parseInt(imgH/2,10));
            $holderRef.addClass("expandImg");

            var imageH = $imgRef.height() - imgSetHeight;

            $holderRef.find(' img').css("margin-top", -parseInt(imageH/2,10));
            $holderRef.height(imgSetHeight);

            $where.find('.imgHolder.expandImg').click(function(e) {
              if (parseInt($(this).find('img').css("margin-top"),10) < 0) {
                TweenMax.to($(this).find('img'), 0.5, {css:{marginTop:0}, ease:Expo.easeOut});
                TweenMax.to($(this), 0.5, {css:{height:$(this).find('img').height()}, ease:Expo.easeOut});
              } else {
                var imageH=$(this).find('img').height() - imgSetHeight;
                TweenMax.to($(this).find(' img'), 0.5, {css:{marginTop:-parseInt(imageH/2,10)}, ease:Expo.easeOut});
                TweenMax.to($(this), 0.5, {css:{height:imgSetHeight}, ease:Expo.easeOut});
              }
            });
          } else {
              $imgRef.css("display","block");
          }
        } else {
          $imgRef.css("display","block");
        }
      });
    }

    // input validation

    $(document).on('focus',".ebp-show input,.ebp-show textarea",function() {
      if ($(this).val() == $(this)[0].title) {
        $(this).removeClass("incorrect");
        $(this).val("");
      }
    });

    $(document).on('blur',".ebp-show input,.ebp-show textarea",function() {
      if ($(this).val() == "") {
        $(this).removeClass("incorrect");
        $(this).val($(this)[0].title);
      }
    });

    $(document).on('click', '.ebp-show .book', function (e) {
      e.preventDefault();
      if ($(this).hasClass('deactive')) return;

      $('.ebp-show .ebp-content .incorrect').each(function (index, element) {
        $(this).removeClass('incorrect');
      });

      var isOkay = true;

      $(".ebp-show input.isRequired").each(function (index, element) {
        if ($(this).val() == "" || $(this).val() ==$(this).attr('title')) {
          isOkay = false;
          $(this).addClass('incorrect');
        }

        if ($(this).hasClass('email') && !validateEmail($(this).val())) {
          isOkay = false;
          $(this).addClass('incorrect');
        }

      });

      $(".ebp-show  textarea.isRequired").each(function (index, element) {
        if ($(this).val() == "" || $(this).val() ==$(this).attr('title')) {
          isOkay = false;
          $(this).addClass('incorrect');
        }
      });


      $(".ebp-show .fieldHolder.isRequired").each(function (index, element) {
        if ($(this).find('.cd-dropdown').length > 0) {
           if ($(this).find(".cd-dropdown input").val()=='none') {
              isOkay = false;
              $(this).addClass('incorrect');
           }
        } else if ($(this).find("input:checked").length < 1) {
          isOkay = false;
          $(this).addClass('incorrect');
        }
      });


      if (!isOkay) return false;

      $(".ebp-show .ebp-content .bookInput").not(".isRequired").each(function (index, element) {
        if ($(this)[0].title === $(this).val())
          $(this).val("");
      });

      $(".ebp-show .ebp-content a.book").each(function (index, element) {
        $(this).addClass("deactive");
      });

      var eventID = $(".ebp-show .ebp-content input[name='eventID'] ").val();
      var ticket = $('.ebp-show .ebp-content .tickets input[name="ticketType'+eventID+'"]').val();
      var dateid = $('.ebp-show .ebp-content .tickets input[name="ticketDate'+eventID+'"]').val();

      var coupon = $(".ebp-show .ebp-content .couponResult").attr("data-name");
      var couponID = $(".ebp-show .ebp-content .couponResult").attr("data-id");
      if (coupon == null) coupon = "";
      if (couponID == null) couponID = "";

      var amount =	getFormattedNumber($(".ebp-show .ebp-content .optCol.total span strong").text()) +"";

      var bookerName;
      if ($('.ebp-show .ebp-content input[name="firstName"]').length > 0) {
        bookerName = $('.ebp-show .ebp-content input[name="firstName"]').val();
        bookerName += ' '
        bookerName += $('.ebp-show .ebp-content input[name="lastName"]').val();
      } else {
        bookerName = $('.ebp-show .ebp-content input[name="name"]').val();
      }

      var bookerEmail = $('.ebp-show .ebp-content input[name="email"]').val();
      var bookQuantity = $(".ebp-show .ebp-content .quantityBtns span").html();
      var eventName = $(".ebp-show .ebp-content .title").text();

      checkScroller();

      $(".ebp-show .ebp-content .offlineloader").html($(".ebp-show .ebp-content .offlineloader").attr("data-text"));

      if ($('.ebp-show.mCustomScrollbar').length>0) {
        $('.ebp-show .ebp-content .offlineloader').show(0,"linear",function () {
          $('.ebp-show').mCustomScrollbar("update");
          $('.ebp-show').mCustomScrollbar("scrollTo","bottom");
        });
      } else {
        $('.ebp-show .ebp-content .offlineloader').show(200);
      }

      var bookingType = "site";

      if (parseInt(amount) > 0) bookingType = $(this).attr("data-type");

      var formInputes = "";

      $('.ebp-show .ebp-content form input[type="text"]').each(function (index, element) {
        if ($(this).attr("name") !="name"  && $(this).attr("name") !="firstName" && $(this).attr("name") !="lastName" && $(this).attr("name") !="email")
            if ($(this).val()!== '')
              formInputes+=$(this).attr("name").replace(/:/g , "")+": "+$(this).val()+"%";
      });


      $(".ebp-show .ebp-content form textarea").each(function (index, element) {
        if ($(this).val() !== '')
          formInputes += $(this).attr("name").replace(/:/g , "") + ": " + $(this).val() + "%";
      });

      $('.ebp-show .ebp-content form .cd-dropdown').each(function (index, element) {
        if ($(this).find("input").val() != 'none')
          formInputes += $(this).find("input").attr("name").replace(/:/g , "") + ": " + $(this).find("input").val() + "%";
      });

      $('.ebp-show .ebp-content form input[type="radio"]').each(function (index, element) {
        if ($(this).is(':checked'))
          formInputes += $(this).attr("name").replace(/:/g , "") + ": " + $(this).val() + "%";
      });

      $(' .ebp-content form .hasCheckBoxes').each(function (index, element) {
        if ($(this).hasClass("isTerms")) return;

        var currInputs = $(this).attr("data-name").replace(/:/g , "") + ":";
        var tots = 0;

        $(this).find('input[type="checkbox"]').each(function (index, element) {
          if ($(this).is(':checked')) {
            currInputs += " " + $(this).val() + ",";
            tots ++;
          }
        });

        if (tots > 0) formInputes += currInputs;
      });

      formInputes = formInputes.replace(/^\,/, '');
      formInputes = '&formStuff=' + encodeURIComponent(formInputes);

      var currentPage = document.URL;

      $.ajax({
        type:'POST',
        url: $("input[name='ajaxlink']").val() + '/wp-admin/admin-ajax.php',
        data:'action=doEventBooking' + '&bookingType=' + bookingType + '&coupon=' + coupon + '&couponID=' + couponID + '&dateid=' +  dateid + '&ticket=' +  ticket + '&eventid=' +  eventID + '&quantity=' + bookQuantity + '&amount=' + amount + "&eventName=" + eventName + formInputes + '&bookName=' + bookerName  + '&bookEmail=' + bookerEmail + '&currentPage=' + currentPage,
        error: function(response) {
          $(".ebp-show .ebp-content a.book").each(function (index, element) {
            $(this).removeClass("deactive")
          });

          $(".ebp-show .ebp-content .offlineloader").html("Error Sending");
        },
        success: function(response) {
          var type = response.substring(0, response.indexOf("&"));
          var opt = response.substring(1+response.indexOf("&"), response.length);

          if (type.indexOf('error') > -1) {
            $('.ebp-show .ebp-content .offlineloader').html(opt);
            $('.ebp-show .ebp-content a.book').each(function(index, element) {$(this).removeClass('deactive')});
          } else if (type.indexOf('form') > -1) {
            $(opt).appendTo('body').submit();
          } else if (type.indexOf('url') > -1 ){
            window.location.href = opt;
          } else {

            switch($('.ebp-show').attr('data-afterSuccess')) {
              case 'popup':
                var dataID = $('.ebp-show').attr('data-id');
                openNewPop($('#successLink'+dataID));
              break;

              case 'close':
                closePopUp();
              break;

              case 'redirect':
                window.location.href = $('.ebp-show').attr('data-successURL');
              break;

            }

            $('.ebp-show .ebp-content .tickets .spotsleft span').text(($('.ebp-show .ebp-content .tickets .spotsleft span').text() - parseInt(bookQuantity)));

            $('.ebp-show .ebp-content a.book').each(function (index, element) {
              $(this).removeClass('deactive');
            });

            $('.ebp-show .ebp-content form input[type="text"]').each(function (index, element) {
              $(this).val($(this).attr('title'));
            });

            $('.ebp-show .ebp-content form input[type="radio"]').each(function (index, element) {
              if ($(this).is(':checked'))
                $(this).prop('checked', false);
            });

            $(' .ebp-content form .hasCheckBoxes').each(function(index, element) {
              $(this).find('input[type="checkbox"]').each(function(index, element) {
                if ($(this).is(':checked'))
                  $(this).prop('checked', false);
              });
            });

            $('.ebp-show .ebp-content form textarea[type!="hidden"]').each(function(index, element) {
              $(this).val($(this).attr('title'));
            });

            $('.ebp-show .ebp-content .offlineloader').html($('.ebp-show .ebp-content .offlineloader').attr('data-text2'));
          }
        }
      });
     });

    $('.fc-calendar-container' ).each(function(index, element) {
      var $calendar = $(this);
      var EB_Events = {};

      $calendar.find('.eventlist li').each(function(index, element) {
        var id = $(this).attr('data-date');
        if (EB_Events[id] == undefined)
            EB_Events[id] = "";
        EB_Events[id] += $(this).html();
      });
      $calendar.find('.eventlist').remove();

      var cal = $calendar.ebpFullCalendar({
        onDayClick : function( $el, $element_content, dateProperties) {
          if ($element_content.length > 0) {
            showEvents($calendar, $element_content, dateProperties);
          }
        },
        caldata: EB_Events,
        toolTip: ($calendar.attr('data-tooltip') === 'on'),
        displayWeekAbbr: $calendar.attr('data-displayWeekAbbr'),
        displayMonthAbbr: ($calendar.attr('data-displayMonthAbbr') === 'true'),
        startIn: parseInt($calendar.attr('data-startIn'))
      });
    });

    function showEvents($calendar,$element_content, dateProperties ) {
      var $opt = $('<div class="opt" style="display:none">'+$element_content.html()+'</div>'),
      $eventHolder = $( '<div class="eventContent"></div>' ),
      $events = $( '<div class="calanderCnt"></div>' ),
      $close = $( '<span class="eventClose"></span>' ),
      $calParent =$calendar.parent().parent();


      $events.append($element_content.html() , $close);
      $eventHolder.append($events).insertAfter($calParent.find( '.custom-inner' ) );

      $calParent.find('.eventContent h3.title').each(function(index, element) {
        $(this).before('<h4 style="margin-bottom:0;">'+$(this).text()+'</h4>');
        $(this).remove();
      });

      if (!$calParent.find('.eventContent').hasClass('mCustomScrollbar'))
        $calParent.find('.eventContent').mCustomScrollbar();
      else
        $calParent.find('.eventContent').mCustomScrollbar('update');

      $calParent.find('.eventContent').each(function(index, element) {
        prepareEvent($(this),false)
      });

      TweenMax.fromTo($calParent.find('.eventContent' ), 0.5, {css:{top:'100%'}}, {css:{top:0,opacity:1}, ease:'Expo.easeOut',onComplete:calElemOpened,onCompleteScope :$calParent, delay:0.2});

      $calParent.find('.eventClose').click(function(e) {
          TweenMax.to($calParent.find('.eventContent'), 0.5, {css:{top:'100%',opacity:0}, ease:'Expo.easeOut',onComplete:removeElem,onCompleteScope :$calParent});
      });
    }

    function calElemOpened() {
      $(this).find('.eventContent .map_canvas').each(function(index, element) {
        doMap(this,$(this).attr('data-address'), getMapType($(this).attr('data-maptype')), parseInt($(this).attr('data-zoom'),10), $(this).attr('data-addressType'), true);
      });
      $(this).find('.eventContent').mCustomScrollbar('update');
    }

    function removeElem() {
      $(this).find('.eventContent').remove();
    }

    //dayC
    $('.ebpCalendarWrap').each(function(index, element) {
      var $listCalendar = $(this);
      var EB_list_Events = {};

      $listCalendar.find('.eventlist li').each(function(index, element) {
        var id = $(this).attr('data-date');

        if (EB_list_Events[id] == undefined)
          EB_list_Events[id] = "";
        EB_list_Events[id] += $(this).html();
      });

      $listCalendar.find('.eventlist').remove();

      $listCalendar.ebpDayCalendar({
        prepareEvent : prepareEvent,
        caldata : EB_list_Events,
        calWidth: $listCalendar.attr('data-init-width'),
        calCat: $listCalendar.attr('data-categories'),
        displayWeekAbbr : $listCalendar.attr('data-displayWeekAbbr'),
        displayMonthAbbr : ($listCalendar.attr('data-displayMonthAbbr') === 'true'),
        startIn : parseInt($listCalendar.attr('data-startIn'))
      });
    });
  });

  function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function getFormattedNumber(x) {
    if (x == "") return 0;
    var priceDecPoint = $('.ebp-show').attr("data-priceDecPoint");
    var priceThousandsSep = $('.ebp-show').attr("data-priceThousandsSep");

    return parseFloat(x.replace(priceThousandsSep,"").replace(priceDecPoint,"."));
  }

  function formatPrice(x) {

    var priceDecPoint = $('.ebp-show').attr("data-priceDecPoint");
    var priceThousandsSep = $('.ebp-show').attr("data-priceThousandsSep");

    var priceDecLength = parseInt($('.ebp-show').attr("data-priceDecLength"));

    x = x.toFixed(priceDecLength);

    x = x.toString();

    var decPart = x.substring(x.indexOf(".")+1, x.length)
    if(priceDecLength == 0) decPart = 0;

    if(priceDecLength > 0) x = x.substring(0, x.indexOf("."))

    x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, priceThousandsSep)

    if(priceDecLength > 0) x = x+priceDecPoint+decPart;

    return x
  }

})(jQuery);
