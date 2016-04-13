var state = 'stop';

function buttonBackPress() {
    console.log("button back invoked.");
}

function buttonForwardPress() {
    console.log("button forward invoked.");
}

function buttonPlayPress(id) {
    var button_str = "#button_song_play_".concat(id);

    if(state=='stop'){
      state='play';
      var button = d3.select("#button_play").classed('btn-success', true); 
      button.select("i").attr('class', "fa fa-pause");  

      var button_song = d3.select(button_str).classed('btn-success', true); 
      button_song.select("img").attr('src', "static/img/pause-icon.png");
    }
    else if(state=='play' || state=='resume'){
      state = 'pause';
      d3.select("#button_play i").attr('class', "fa fa-play"); 

      d3.select(button_str.concat(" img")).attr('src', "static/img/playing-icon.png");
    }
    else if(state=='pause'){
      state = 'resume';
      d3.select("#button_play i").attr('class', "fa fa-pause");

      d3.select(button_str.concat(" img")).attr('src', "static/img/pause-icon.png");        
    }
    console.log("button play pressed, play was "+state);
}

// function buttonPlayPress() {
//     if(state=='stop'){
//       state='play';
//       var button = d3.select("#button_play").classed('btn-success', true); 
//       button.select("i").attr('class', "fa fa-pause");  
//     }
//     else if(state=='play' || state=='resume'){
//       state = 'pause';
//       d3.select("#button_play i").attr('class', "fa fa-play"); 
//     }
//     else if(state=='pause'){
//       state = 'resume';
//       d3.select("#button_play i").attr('class', "fa fa-pause");        
//     }
//     console.log("button play pressed, play was "+state);
// }

// function buttonSongPlayPress(id) {

//     var button_str = "#button_song_play_".concat(id);
//     if(state=='stop'){
//       state='play';
//       var button = d3.select(button_str).classed('btn-success', true); 
//       button.select("img").attr('src', "static/img/pause-icon.png");  
//     }
//     else if(state=='play' || state=='resume'){
//       state = 'pause';
//       d3.select(button_str.concat(" img")).attr('src', "static/img/pause-icon.png"); 
//     }
//     else if(state=='pause'){
//       state = 'resume';
//       d3.select(button_str.concat(" img")).attr('src', "static/img/playing-icon.png");        
//     }
//     console.log("button song-play pressed, play was "+state);
// }