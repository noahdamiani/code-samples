(function() {
    "use strict";

//Create New Service
$('.add-service-btn').click(addService);

//Toggle new service inputs
$('.show-drawer').click(function(){
    $('.drawer').slideToggle();
});

$('.close-drawer').click(function(){
    $('.drawer').slideToggle();
});

function addService(e) {
    var $newService = $('.new-service');
    if($newService.length < 3) {
        var _this = $(e.currentTarget);
        var $newServiceClone = $('.new-service-clone');
        var template = $newServiceClone.clone();

            //Grab Input Values
            var serviceName = _this.parent().find('#new-service-name').val(),
            servicePrice = _this.parent().find('#new-service-price').val(),
            serviceDesc = _this.parent().find('#new-service-description').val();

            //Save to cloned UI
            var saveName = template.find('.service-title .edit-field'),
            savePrice = template.find('.amount .edit-field'),
            saveDesc = template.find('.service-description .edit-field');

            saveName.text(serviceName);
            savePrice.text(servicePrice);
            saveDesc.text(serviceDesc);

            //Show and Append new Clone
            template.show().removeClass('new-service-clone').addClass('new-service');
            $newServiceClone.after(template);

            //Create Service Objects
            var contribution_levels = new FormData();
            var service = {
                "contribution_levels":
                [
                {
                    "heading": serviceName,
                    "amount": servicePrice,
                    "description": serviceDesc
                }
                ]
            };

            contribution_levels.append("data", JSON.stringify(service));

            //Push New Service
            $.ajax({
                url: '/account/addContributionLevels.json',
                type: 'POST',
                data: contribution_levels,
                cache: false,
                contentType: false,
                processData: false
            }).fail(function() {
                alert('Adding the service failed. Please try again');
            });

            //Clear Inputs
            $('.add-service input').val('');
            $('.add-service textarea').val('');

            //Update Service Count
            var count = $newService.length;
            $('.service-ct').text(count);
            $('.show-drawer').fadeOut();
        } else {
            $('.no-services p').text('Max 3 services reached. Please click edit if adjustments needed.');
            $('.add-service, .add-service-btn').fadeOut();
        }
    }

//Trim spaces from text
$('.edit-field').each(function(){
    var trim = $.trim($(this).text());
    $(this).text(trim);
});

//Initialize YouTube Video and fix Embed URLs
$('.vid').attr('src', $('.yt-src').val().replace("watch?v=", "v/"));

//Set Rating Stars
$('.rating-val').each(function() {
    var val = parseInt($(this).text());
    for (var i = 0; i < val; i++) {
        $(this).parent().append('<i class="fa fa-star">');
    }
});

// Accordions
(function($) {
    $.fn.clickToggle = function(func1, func2) {
        var funcs = [func1, func2];
        this.data('toggleclicked', 0);
        this.click(function() {
            var data = $(this).data();
            var tc = data.toggleclicked;
            $.proxy(funcs[tc], this)();
            data.toggleclicked = (tc + 1) % 2;
        });
        return this;
    };
}(jQuery));

$('.read-more').clickToggle(function() {
    var pHeight = $(this).prev().find('.text').height();
    $(this).prev().css('overflow', 'visible');
    $(this).prev().animate({
        height: pHeight
    }, 500);
    $(this).html('<i class="fa fa-caret-up"></i> <span>less</span>');
}, function() {
    $(this).prev().css('overflow', 'hidden');
    $(this).prev().animate({
        height: '62'
    }, 500);
    $(this).html('<i class="fa fa-caret-down"></i> <span>more</span>');
});

// Set Text Height for Readmores
$('.text').each(function() {
    var text = $(this);
    if (text.parent('.next-read-more').length) {
        if (text.height() < 63) {
            $(this).parent().next().hide();
        }
    }
});

function readMore() {
    $('.text').each(function() {
        var text = $(this);
        if (text.parent('.next-read-more').length) {
            if (text.height() < 63) {
                $(this).parent().next().hide();
            } else {
                $(this).parent().css('overflow', 'visible');
                $(this).parent().height($(this).height());
                $(this).parent().next().trigger('click').show();
            }
        }
    });
}

// Set edit areas to size of content
function textAreaSize() {
    $('textarea').each(function() {
        $(this).height($(this).prop('scrollHeight'));
    });
}

//Edit Fields Function
$(document).on('click', '.toggle-edit', function() {
    var field = $(this).parent().find('.edit-field');
    field.each(function() {
        var dataAmount = $(this).data("amount");
        $(this).parent().find('.hidden-val').html(dataAmount);
        if ($(this).text() === 'TBD') {
            var input = '<textarea class="being-edited" data-amount="' + dataAmount + '">' + dataAmount + '</textarea>';
        } else {
            var input = '<textarea class="being-edited" data-amount="' + dataAmount + '">' + $(this).html() + '</textarea>';
        }
        $(this).replaceWith(input);
        textAreaSize();
    });
    $(this).removeClass('toggle-edit').addClass('save-edit');
});

//Save Fields Function
function saveChanges(target) {
    var editInput = target.parent().find('.being-edited');
    editInput.each(function() {
        var newContent = '<span class="text edit-field" data-amount="' + $(this).val() + '">' + $(this).val() + '</span>';
        $(this).replaceWith(newContent);
    });
    target.removeClass('save-edit').addClass('toggle-edit');
    var tbd = $('.amount .edit-field');
    tbd.each(function(){
        var _this = $(this);
        if (parseInt(_this.text()) < 0) {
            _this.text('TBD');
            _this.siblings('.hidden-val').text(editInput.val());
        }   
    });
}

function enterChanges() {
    $('.save-edit').replaceWith('<a class="toggle-edit"><span></span></a>');
    $('.being-edited').each(function() {
        var newContent = '<span class="text edit-field">' + $(this).val() + '</span>';
        $(this).replaceWith(newContent);
    });
}

// AJAX: Update Service
$(document).on('click', '.save-edit', function(e) {
    if ($(e.currentTarget).parent().hasClass('edit-profile')) {
        updateProfile(e);
    } else {
        updateService(e);
    }
});

var RETURN_KEY = 13;

function updateService(e) {
    var _this = $(e.currentTarget);
    var formData = new FormData();
    var section = $(e.currentTarget).parent().find('.contribution-service');

    var services = [];

    section.each(function() {
        if ($(this).find('.amount .being-edited').val() === 'TBD') {
            var price = $(this).find('.hidden-val').html();
        } else {
            var price = $(this).find('.amount .being-edited').val();
        }

        var service = {
            "id": $.trim($(this).find('.contribution-id').text()),
            "heading": $(this).find('.service-title .being-edited').val(),
            "description": $(this).find('.service-description .being-edited').val(),
            "amount": price
        };

        services.push(service);
    });

    var contribution_levels = {
        "contribution_levels": services
    };

    formData.append("data", JSON.stringify(contribution_levels));

    $.ajax({
        url: '/account/updateContributionLevels.json',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function() {
            if (_this.hasClass('being-edited')) {
                enterChanges();
            } else {
                saveChanges(_this);
            }
            readMore();
        }
    }).fail(function() {
        alert('Update failed. Please try again.');
    });
}

//Video Helper Functions

if (!$.trim($('.yt-src').val())) {
    $('.yr-src').show();
    $('.vid').hide();
    $('.toggle-edit-vid').removeClass('toggle-edit-vid').addClass('save-vid');
} else {
    $('.vid').show();
}

$(document).on('click', '.toggle-edit-vid', function() {
    $('.yr-src').show();
    $('.vid').hide();
    $(this).removeClass('toggle-edit-vid').addClass('save-vid');
});

$(document).on('click', '.save-vid', function(e) {
    updateVideo(e);
});

$(document).on('keypress', '.yt-src', function(e) {
    if (e.keyCode === RETURN_KEY) {
        updateVideo(e);
    }
});

function saveVideo(target) {
    var url = $('.yt-src').val().replace("watch?v=", "v/");
    $('.vid').attr('src', url).show();
    $('.yr-src').hide();
    target.removeClass('save-vid').addClass('toggle-edit-vid');
}

// AJAX: Update Video

function updateVideo(e) {
    var _this = $(e.currentTarget);
    var video_url = {
        "bio": $(document).find('.long-description span').text(),
        "video_url": _this.parent().find('.yt-src').val()
    };

    $.ajax({
        url: '/account/setUserProfile.json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(video_url),
        success: function() {
            if (_this.hasClass('yt-src')) {
                saveVideo(_this.parent('.pane').find('.save-vid'));
            } else {
                saveVideo(_this);
            }
        }
    });
}

// AJAX: Update Profile
function updateProfile(e) {
    var _this = $(e.currentTarget);
    var profileData = {
        "bio": _this.parent().find('.long-description .being-edited').val(),
        "video_url": $(document).find('.yt-src').val()
    };

    $.ajax({
        url: '/account/setUserProfile.json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(profileData),
        success: function() {
            if (_this.hasClass('being-edited')) {
                enterChanges();
            } else {
                saveChanges(_this);
            }
            readMore();
            console.log('success');
        }
    });
}

var $statusTextbox = $("#status-textbox");
var $updateStatusBtn = $("#update-status-btn");

//Ajax: Update Status
$updateStatusBtn.on("click", updateStatus);

function updateStatus() {
    var status = {
        "status": $statusTextbox.val()
    };
    $.ajax({
        url: "/statuses/update.json",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(status)
    }).done(function() {
        $("#current-status").text(status.status);
        $statusTextbox.val("");
    });
}

})();
