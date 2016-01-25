var IMAGE_FADEIN_DELAY = 300;
var IMAGE_FADEIN_TIME = 1000;
var SENTENCE_FADEOUT_TIME = 1000;
var SENTENCE_FADEIN_TIME = 1500;
var PUNCTUATION = [",", ".", "?", "!", "(", ")", "\"", "\\", "-", "[", "]", "/", ":", ";"];
var PUNCTUATION_SPACING = ["", "", "", "", " ", " ", " ", "", "", " ", " ", "", "", ""];

var currentSentence = 0;
var sentences = [];


function updateImages() {	
	if (currentSentence < 0) {
		currentSentence = sentences.length-1;
	}
	if (currentSentence >= sentences.length) {
		currentSentence = 0;
	}
	// Empty the images and the sentence.
	$("#images").empty();
	$("#sentence").hide();
	$("#sentence").empty().append("<h1 class='rebus-hover' style='font-size: 60px;'>. . .</h1>");
	// Change header.
	$("#header").html("<h1>" + (currentSentence+1) + " / " + sentences.length + "</h1>");
	// Get current sentence.
	var sentence = sentences[currentSentence];
	// Add images for the current sentence.
	translateSentence(sentence, currentSentence, IMAGE_FADEIN_DELAY, IMAGE_FADEIN_TIME);
	// Add the sentence.
	$("#sentence").append("<h3>");
	$("#sentence h3").hide();
	
	$.each(sentence, function(i, word) {
		if(i != 0 && !isPunctuation(word)) {
			$("#sentence h3").append(" " + word);
		} else {
			var spacing = PUNCTUATION_SPACING[punctuationIndex(word)] == undefined ? "" : PUNCTUATION_SPACING[punctuationIndex(word)];
			$("#sentence h3").append(spacing + word);
		}
	});

}

function isPunctuation(word)
{
	var punctIndex;
	for(punctIndex = 0; punctIndex < PUNCTUATION.length; ++punctIndex) {
		if(word == PUNCTUATION[punctIndex]) {
			return true;
		}
	}
	return false;
}

function punctuationIndex(word)
{
	var punctIndex;
	for(punctIndex = 0; punctIndex < PUNCTUATION.length; ++punctIndex) {
		if(word == PUNCTUATION[punctIndex]) {
			return punctIndex;
		}
	}
	return -1;
}

function fadeinSentence() {
	$("#sentence").fadeIn(SENTENCE_FADEIN_TIME);
	$("#sentence h1").on("mousedown", function(e) {
		$(this).fadeOut(SENTENCE_FADEOUT_TIME, function() {
			$("#sentence h3").fadeIn(SENTENCE_FADEIN_TIME);
		});
	});
}

$(document).ready(function() {
	// Remove all previous styling.
	$('link[rel=stylesheet]').remove();
	$("head").append("<link href='https://fonts.googleapis.com/css?family=Roboto:400,300,100' rel='stylesheet' type='text/css'>");

	// Clone all paragraphs.
	var paragraphs = $("p").clone();
	$("body").empty();
	$("body").addClass("rebus");
	$("body").append("<div class='row'></div>")

	// Create column for back, images and next areas.
	$(".row").append("<div id='previous' class='col-md-1'>");
	$(".row").append("<div id='center-col' class='col-md-10'>");
	$(".row").append("<div id='next' class='col-md-1'>");

	$("#center-col").append("<div id='header'>");
	$("#center-col").append("<div id='images'>");
	$("#center-col").append("<div id='sentence'>");

	// Create buttons for previous and next.
	$("#previous").append("<a href='#' class='previous-btn'><i class='fa fa-chevron-left'></i></a>");
	$("#next").append("<a href='#' class='next-btn'><i class='fa fa-chevron-right'></i></a>");

	
	// Separate all paragraphs into sentences made up of single words.
	$.each(paragraphs, function(i, p) {
		var words = [];
		var dirtyWords = $(p).text().split(" ");
		$.each(dirtyWords, function(i, w) {
			extractCleanWords(w, words);
		});
	});

	updateImages();

	// Link previous and next buttons.
	$(".previous-btn").on("mousedown", function(e) {
		currentSentence--;
		updateImages();
	});
	$(".next-btn").on("mousedown", function(e) {
		currentSentence++;
		updateImages();
	});
});

// "document.write" overrides everything inside the body tag!!!
function displaySentence(sentence) {
	$.each(sentence, function(i, word) {
		document.write(word + " / ");
	});
	document.write("<br>");
}


function extractCleanWords(dirtyWord, words)
{	
	var letters = "";
	var flag = true;
	var charIndex;
	for(charIndex = 0; charIndex < dirtyWord.length; ++charIndex) {
		var punctIndex;
		for(punctIndex = 0; punctIndex < PUNCTUATION.length; ++punctIndex) {
			if(dirtyWord.charAt(charIndex) == PUNCTUATION[punctIndex]) {
				// Add letters so far as a single word to words
				if(letters.length > 0) {
					words.push(letters);
					//document.write(letters + " ");
				}
				// Add punctuation symbol to words
				words.push(dirtyWord.charAt(charIndex));
				//document.write(" PUNCT " + dirtyWord.charAt(charIndex) + " ");
				// If the punctuation symbol is a full stop, words contains a full sentence
				if(PUNCTUATION[punctIndex] == ".") {
					// Add words to sentences array and clear words array					
					sentences.push(words.splice(0, words.length));
					//alert("Sentence after full stop: " + sentences[sentences.length-1]);
					// Clear words array
					//words.length = 0;
					//document.write("<br><br>");
				}
				// Clear letters and set flag
				letters = "";
				flag = false;
			}
		}
		// If the current character wasnt a punctuation symbol, add it at the end of the letters string
		if(flag) {
			letters += dirtyWord.charAt(charIndex);

			if(charIndex == dirtyWord.length - 1) {
				words.push(letters);
				//document.write(letters + " ");
			}
		}
		else {
			flag = true;
		}

	}
	
	
}

function translateSentence(wordsArray, sentenceIndex, fadeinDelay, fadeinTime) {
	function handleImage(imageUrl, width, height) {
		// If image is from previous or next sentence, don't do anything!
		if (sentenceIndex != currentSentence) {
			return;
		}
		if (isPunctuation(wordsArray[i-1])) {
			var punc = $("<span>");
			punc.html(wordsArray[i-1]);
			punc.addClass("rebus-fadein");
			punc.addClass("rebus-punctuation");
			punc.attr("alt", "i: " + (i-1) + " word: " + wordsArray[i-1]);
			$("#images").append(punc);
			if (i < wordsArray.length-1) {
				$(punc).delay(fadeinDelay*i).fadeIn(fadeinTime);
			} else {
				$(punc).delay(fadeinDelay*i).fadeIn(fadeinTime, function(e) {
					fadeinSentence();
				});
			}
		} else {
			// Add html code for image to images div
			var image = $("<img>");
			image.attr("src", imageUrl.url);
			image.data("tbUrl", imageUrl.tbUrl);
			image.attr("onError", "this.onerror=null;this.src='" + imageUrl.tbUrl + "';");
			image.addClass('rebus-fadein');
			image.attr("alt", "i: " + (i-1) + " word: " + wordsArray[i-1]);
			image.attr("title", wordsArray[i-1]);
			$("#images").append(image);
			// Fetch images
			image.waitForImages(function() {
				// Fade in everything with this class.
				if (i < wordsArray.length-1) {
					$(image).delay(fadeinDelay*i).fadeIn(fadeinTime);
				} else {
					$(image).delay(fadeinDelay*i).fadeIn(fadeinTime, function(e) {
						fadeinSentence();
					});
				}
			});
		}
		if (i < wordsArray.length) {
			getImageUrl(wordsArray[i++], handleImage, function(errorMessage) {
				console.error(errorMessage);
			});
		}
	}

	var i = 0;
	getImageUrl(wordsArray[i++], handleImage, function(errorMessage) {
		console.error(errorMessage);
	});
}

function onImageError(image) {
	alert("Error");
	var img = $(image);
	img.attr("onError", "");
	img.attr("src", img.data("tbUrl"));
	return true;
}