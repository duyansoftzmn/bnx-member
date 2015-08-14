define([
    'text!SY_BASE/media/ngJplayer/jplayer.html',
    'SY_BASE/media/jquery.jplayer.2.7.0/jquery.jplayer.min'
    ],function(template){

    SyApp.NG.directive('syJplayer',function(){

        return {
            restrict:'EA',
            template: template,
            scope: {
                audobj: '='
            },
            transclude: true,
            link: function(scope, element, attrs){
                    global_lp = 0;

                    var player = element.children('.jquery_jplayer');
                    var containerJo = player.next('.player_container');

                    player.jPlayer({
                        solution: 'html, flash',
                        preload: 'false',
                        wmode: 'window',
                        swfPath: SyApp.LIBS_PATH+ "/media/jquery.jplayer.2.7.0/Jplayer.swf",
                        supplied: "m4a,wav",
                        ready: function () {

                            player.jPlayer("setMedia", scope.audobj).jPlayer("pause");
                            showPlayBtn();
                        },
                        timeupdate: function(event){
                            $("#sliderPlayback").slider('value', event.jPlayer.status.currentPercentAbsolute);
                            
                        }
                    }).jPlayer("onProgressChange", function(lp,ppr,ppa,pt,tt) {
                        var lpInt = parseInt(lp);
                        var ppaInt = parseInt(ppa);
                        global_lp = lpInt;

                        $('#loaderBar').progressbar('option', 'value', lpInt);
                        $('#sliderPlayback').slider('option', 'value', ppaInt);
                    })
                    .jPlayer("onSoundComplete", function() {
                        $(this).jPlayer("play");
                    });

                    function showPauseBtn()
                    {
                        containerJo.find(".cp-play").fadeOut(function(){
                            containerJo.find(".cp-pause").fadeIn();
                        });
                    }

                    function showPlayBtn(thisJo)
                    {
                       // var containerJo = thisJo.next('.player_container');

                        containerJo.find(".cp-pause").fadeOut(function(){
                            containerJo.find(".cp-play").fadeIn();
                        });
                    }

                    function playTrack(t,n)
                    {
                        player.jPlayer("setFile", t).jPlayer("play");

                        showPauseBtn();

                        return false;
                    }

                     containerJo.find(".cp-play").on('click',function() {
                        player.jPlayer("play");
                        showPauseBtn();
                        return false;
                    });

                    containerJo.find(".cp-pause").on('click',function() {
                        player.jPlayer("pause");
                        showPlayBtn();
                        return false;
                    });

                    containerJo.find(".stop").on('click',function() {
                        alert(123);
                        player.jPlayer("stop");
                        showPlayBtn();
                        return false;
                    });


                    $("#volume-min").on('click', function() {
                        $('#jquery_jplayer').jPlayer("volume", 0);
                        $('#sliderVolume').slider('option', 'value', 0);
                        return false;
                    });

                    $("#volume-max").on('click', function() {
                        $('#jquery_jplayer').jPlayer("volume", 100);
                        $('#sliderVolume').slider('option', 'value', 100);
                        return false;
                    });

                    $("#player_progress_ctrl_bar a").click(function() {
                        $("#jquery_jplayer").jPlayer("playHead", this.id.substring(3)*(100.0/global_lp));
                        return false;
                    });

                    // Slider
                    $('#sliderPlayback').slider({
                        max: 100,
                        range: 'min',
                        animate: false,

                        slide: function(event, ui) {
                            console.log(ui.value);
                            $("#jquery_jplayer").jPlayer("playHead", ui.value);
                        }
                    });

                    $('#sliderVolume').slider({
                        value : 50,
                        max: 100,
                        range: 'min',
                        animate: false,

                        slide: function(event, ui) {
                            console.log("value",ui.value);
                            $("#jquery_jplayer").jPlayer("volume", ui.value/100 );
                        }
                    });

                    $('#loaderBar').progressbar();


                    //hover states on the static widgets
                    $('#dialog_link, ul#icons li').hover(
                        function() { $(this).addClass('ui-state-hover'); },
                        function() { $(this).removeClass('ui-state-hover'); }
                    );


            }
        };
    })
})
