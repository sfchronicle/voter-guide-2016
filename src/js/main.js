require("./lib/social");

var active = document.getElementsByClassName('active');
var rb = document.getElementsByClassName('racebox');
var category = document.getElementsByClassName('category');
var racetype = document.getElementsByClassName('racetype');
var area = document.getElementsByClassName('area');
var clear = document.getElementById('clear');
var cat = document.getElementById('categories'); // where the buttons go
var button = document.getElementsByClassName('button'); // array of all the buttons
var display = []; // array of ids for active buttons
var darea = document.getElementById('darea'); // where the diff races go
var options = ["local","regional","state","federal","election","ballot measure","proposition","environment","death penalty","drug use","education","firearms"]; // potential button options
var matches = []; // find out what possible buttons are left
var newmatches = [];
var string = "";
var disabled = document.getElementsByClassName('disabled');

// adds in all the buttons

for (var i = 0; i < buttonData.length; i++) {
	cat.insertAdjacentHTML("afterbegin",'<button class="' + buttonData[i].class + ' button" id="' + buttonData[i].button + '">' + buttonData[i].display + '</button>');
}

// function that adds active class to buttons, updates the array of active ids
var selected = function() {
	// use this to refer to the selected button

	// clear.classList.add('enable');

	matches = [];

	var al = active.length;

	if (this.classList.contains('active')) {
		// this.classList.remove('active');

		// if you unclick, it removes from array
		// for (var j = 0; j < display.length; j++ ) {
		// 	if (display[j].substring(0,this.id.length) == this.id) {
		// 		display.splice(j,1);
		// 	}
		// }
	}
	else if (this.classList.contains('disabled')) {
		display = [];
		display.push(this.id);
	} 
	else {
		this.classList.add('active');
		// adds to array on click
		display.push(this.id);
	}

	// test for emma
	if (this.classList.contains('disabled')) {
		for (var z = 0; z < button.length; z++) {
			button[z].classList.remove('active');
			button[z].classList.remove('disabled');
		}
		this.classList.add('active');
	}

	if ((active.length == 1) && (al == 1)) {
		for (var m = 0; m < raceData.length; m++ ) {

			// from the tags column, compile all the arrays that contain the clicked id
			if (raceData[m].tags.indexOf(this.id) > -1) {
				matches.push(raceData[m].tags.split(','));
			}
		}
	}
	else if ((active.length > 1) || (al != 1)) {
		testBoolean();
	}

	// flatted multiple arrays into one
	var merged = [].concat.apply([],matches);

	// produce a string that displays all the elements in the array to match against
	string = "";
	for (var k = 0; k < merged.length; k++) {
		if (string.indexOf(merged[k]) < 0) {
			string += merged[k] + " ";
		}
	}

	for (var k = 0; k < button.length; k++) {
		if ((string.indexOf(button[k].id) < 0) && (active.length > 0)) {
			// button[k].disabled = true;
			button[k].classList.add('disabled');
		}
		else {
			button[k].classList.remove('disabled');
			// button[k].disabled = false;
		}
	}

	for (var r = 0, s = 0; ((r < rb.length) && (s <= display.length));) {
		if (s < display.length) {
			if (rb[r].getAttribute("data-categories").indexOf(display[s]) > -1) {
				s++;

				if (s == display.length) {
					rb[r].style.display = "block";
					s = 0;
					r++;
				}
			}
			else {
				rb[r].style.display = "none";
				r++;
				s = 0;
			}
		}
		else { 
			if (display.length == 0) {
				for (var u = 0; u < rb.length; u++) {
					rb[u].style.display = "block";
				}
			}
			break;
		}
	}
}

// function testing if the boolean is actually included
var testBoolean = function() {

	for (var y = 0; y < button.length; y++) {
		button[y].classList.remove('disabled');
	}

	console.log(display);

	for (var n = 0, o = 0; (n < raceData.length) && (o <= display.length);) {
		if ((n < raceData.length) && (o < display.length)) {
			if (raceData[n].tags.indexOf(display[o]) > -1) {
				o++;

				if (o == display.length) {
					matches.push(raceData[n].tags.split(','));
					o = 0;
					n++;
				}
			}
			else if (raceData[n].tags.indexOf(display[o]) < 0) {
				n++;
				o = 0;
			}
		}
	}
}

for (i = 0; i < button.length; i++ ) {
	button[i].addEventListener("click", selected);
}

// adding in the different races
for (i = 0; i < raceData.length; i++ ) {
	var cstring = "";
	var carray = raceData[i].tags.split(",");
	for (var q = 0; q < carray.length; q++) {
		if (q < carray.length - 1) {
			cstring += carray[q] + " ";
		}
		else {
			cstring += carray[q];
		}
	}

	// if there is no endorsement url, don't print that one

	if (raceData[i].endorsementurl == "#") {
		continue;
	}
	else {}

	// p + i and d + i are arbitrary ids

	if (raceData[i].rmid != "No") {
		var color = "green";
		if (raceData[i].rmid == "Yes") {
			var insertthistext = '<i class="fa fa-check" aria-hidden="true"></i> Yes';
			var rbtm = "on";
		}
		else {
			insertthistext = raceData[i].rmid;
			rbtm = "for";
		}
	}
	else {
		color = "red";
		insertthistext = '<i class="fa fa-times" aria-hidden="true"></i> No';
		rbtm = "on";
	}

	if (raceData[i].coverageurl != "#") {
		var coverage = '<br><span class="more"><a href="' + raceData[i].coverageurl + '" target="_blank">Related coverage <i class="fa fa-angle-double-right" aria-hidden="true"></i></a></span>';
	}
	else {
		var coverage = "";
	}

	darea.insertAdjacentHTML("afterbegin","<div class='contain flex racebox' id='p" + i + "' data-categories='" + cstring + "'></div>");
	
	if (raceData[i].icon == null){
		document.getElementById("p" + i).insertAdjacentHTML("afterbegin",'<h3 class="vrace">' + raceData[i].race + '</h3><h4 class="vrace2">' + raceData[i].description + coverage + '</h4><div class="endorse">The Chronicle recommends</div><div class="endorsee"><span class="endorsement ' + color + '">' + insertthistext + '</span> ' + '<br><span class="more"><a href="' + raceData[i].endorsementurl + '" target="_blank">Our editorial <i class="fa fa-angle-double-right" aria-hidden="true"></i></a></span><div class="buttondisplay" id="d' + i + '"></div></div>');}
	else if (raceData[i].icon == 'clinton'){
		document.getElementById("p" + i).insertAdjacentHTML("afterbegin",'<h3 class="vrace">' + raceData[i].race + '</h3><h4 class="vrace2">' + raceData[i].description + coverage + '</h4>'+ '<div class="endorse">The Chronicle recommends</div>' + '<div class="img-logo"><img src="./assets/logos/' + raceData[i].icon + '.png"></div>' + '<div class="endorsee"><span class="endorsement ' + color + '">' + insertthistext + '</span> ' + '<br><span class="more"><a href="' + raceData[i].endorsementurl + '" target="_blank">Our editorial <i class="fa fa-angle-double-right" aria-hidden="true"></i></a></span><div class="buttondisplay" id="d' + i + '"></div></div>');}

	else {
		document.getElementById("p" + i).insertAdjacentHTML("afterbegin",'<div class="img-logo"><img src="./assets/logos/' + raceData[i].icon + '.png"></div>' + '<h3 class="vrace">' + raceData[i].race + '</h3><h4 class="vrace2">' + raceData[i].description + coverage + '</h4><div class="endorse">The Chronicle recommends</div><div class="endorsee"><span class="endorsement ' + color + '">' + insertthistext + '</span> ' + rbtm + ' ' + raceData[i].race + '<br><span class="more"><a href="' + raceData[i].endorsementurl + '" target="_blank">Our editorial <i class="fa fa-angle-double-right" aria-hidden="true"></i></a></span><div class="buttondisplay" id="d' + i + '"></div></div>');
	};
	var buttonID = document.getElementById("d" + i);
	var addstr = "";

	for (var a = 0, b = 0; ((a < raceData[i].tags.length) && (b <= raceData[i].tags.split(",").length));) {
		if (b < raceData[i].tags.split(",").length) {

			for (var c = 0; c < buttonData.length; c++) {
				if (raceData[i].tags.split(",")[b] == buttonData[c].button) {
					var newclass = buttonData[c].class;
					c = 0;
					break;
				}
				else {
				}
			}

			b++;
		}
		else { b++ };
		a++;
	}

	buttonID.insertAdjacentHTML("beforeend",addstr);
}


$(function() {
    var sticky = $('#categories');
    var hieghtThreshold = $(".cat-background").offset().top;
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();

        if (scroll >= hieghtThreshold ) {
            sticky.addClass('sticky-nav');
        } else {
            sticky.removeClass('sticky-nav');
        }
    });
})


$('#federal').click(function(){
    $('#p62').addClass("filtered");
});

$('#viewall').click(function(){
    $('#p62').removeClass("filtered");
    $('.contain').css( "display", "block");
    $('#viewall').removeClass('disabled');
});


$(document).ready(function() {
  $(".button").on("click", function( e ) {

    e.preventDefault();

    $("body, html").animate({ 
      scrollTop: $('.container').offset().top - 40
    },0);

  });
});
