/*global $, document*/
function descriptionHeight() {         //checks description height and sets the highest for each pair of descriptions
    var paragraphs = $('.description'), heights = [], i = 1, a = 0, b = 0;
    $.each($('.description'), function () {
        heights.push($(this).height());
    });
    for (i, a, b; heights[i]; i += 2, a = 0, b = 0) {
        a = heights[i - 1];
        b = heights[i];
        if (a > b) {
            $(paragraphs[i]).height(a);
        } else {
            $(paragraphs[i - 1]).height(b);
        }
    }
}

function tabs() {          // changes content below main navigation
    $('#recent-posts, #news, #galleries, #people').hide();
    $('#tabs div:first').show();
    $('#main-nav ul li:first').addClass('main-nav-selected');
    $('#main-nav ul li a').click(function () {
        $('#main-nav ul li').removeClass('main-nav-selected');
        $(this).addClass('main-nav-selected');
        var currentTab = $(this).attr('href');
        $('#recent-posts, #news, #galleries, #people').hide();
        $(currentTab).show();
        return false;
    });
}


function readMore() {        // shows more/less text
    var rowsshown = 3, rowheight = $('.post p').css('line-height').replace(/[^-\d\.]/g, ''), ht = (rowsshown * rowheight);
    $('.post-text').css({'overflow': 'hidden', 'height': ht + 'px' });
    $('.post-more p').click(function () {
        var content = $(this).parent().prevAll('p'), self = this, fullHeight;
        if ($(content).css('height') === ht + 'px') {
            $(content).height('auto');
            fullHeight = $(content).height();
            if (fullHeight !== ht) {
                $(content).height(rowheight + 'px').animate({'height': fullHeight + 'px'}, 700, function () {
                    $(self).text('Read less').addClass('read-less');
                });
            }
        } else {
            $(content).animate({'height': ht + 'px'}, 700, function () {
                $(self).text('Read more').removeClass('read-less');
            });
        }
    });
}
function validSearch(a) {           //checks search form before submit
    if ($("#search-text").val() === "Search" || $("#search-text").val().trim().length === 0) {
        $('#search-error').show().css({'padding-top': '4px', 'color': 'red'});

    } else {
        a.submit();
    }
    $('#search-text').blur(function () {$('#search-error').hide(); });
}

//Twitter task (begin)
String.prototype.parseURL = function () {
    return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function (url) {
        return url.link(url);
    });
};
String.prototype.parseUsername = function () {
    return this.replace(/[@]+[A-Za-z0-9-_]+/g, function (u) {
        var username = u.replace("@", "");
        return u.link("http://twitter.com/" + username);
    });
};
String.prototype.parseHashtag = function () {
    return this.replace(/[#]+[A-Za-z0-9-_]+/g, function (t) {
        var tag = t.replace("#", "%23");
        return t.link("http://search.twitter.com/search?q=" + tag);
    });
};
function parseDate(str) {
    var v = str.split(' ');
    return new Date(Date.parse(v[1] + " " + v[2] + ", " + v[5] + " " + v[3] + " UTC"));
}

function loadLatestTweet() {
    var numTweets = 3, i, url = 'https://api.twitter.com/1/statuses/user_timeline/ThisIsHorosho.json?callback=?&count=' + numTweets + '&include_rts=1';
    $.getJSON(url, function (data) {
        for (i = 0; i < data.length; i += 1) {
            var tweet = data[i].text, created = parseDate(data[i].created_at), createdDate = created.getDate() + '-' + (created.getMonth() + 1) + '-' + created.getFullYear() + ' at ' + created.getHours() + ':' + created.getMinutes();
            tweet = tweet.parseURL().parseUsername().parseHashtag();
            tweet = '<a class="username" href="https://twitter.com/#!/@ThisIsHorosho" target="_blank">@ThisIsHorosho</a>' + " " + tweet + " " + '<a class="tweet-date" href="https://twitter.com/#!/@ThisIsHorosho/status/' + data[i].id_str + '">' + createdDate + '</a>';
            $("#latest-tweets").append('<div class="tweet"><p>' + tweet + '</p></div>');
        }
    });
}
//Twitter Task (End)

$(document).ready(function () {
    $("#quote" + Math.floor(Math.random() * 3)).attr('class', '');  //shows random quote
    $("#search-text").val("Search");
    $("#search-text").on({
        focus: function () {   //clears  search input box
            if ($(this).val() === "Search") {
                $(this).val('');
            }
        },
        blur: function () {    //fills search input box
            if ($(this).val().length === 0) {
                this.value = "Search";
            }
        }
    });
    descriptionHeight();
    $('.follow-img').hover(function () {  //makes images to fade in and fade out
        $(this).fadeTo("slow", 0.8);
    },
        function () {
            $(this).fadeTo("slow", 1);
        });
    tabs();
    readMore();
    $('#search-error').hide();
    loadLatestTweet();
    $(".fancybox").fancybox();
    $('#slider').nivoSlider();
});






