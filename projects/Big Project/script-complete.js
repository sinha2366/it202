// Aditya Sinha
// IT 202 - Final Project
//
// References used: 
// - https://developer.spotify.com/web-api/
// - https://youtu.be/eV3WkDAM3Hw (Spotify Playlist Generator code along)
// - https://www.martin-brennan.com/es6-basics/
// - https://www.w3schools.com/css/css3_gradients.asp
//
// **script-complete.js**
// 
const app = {};

//
// Makes an ajax call to get the artists that the user inputs in
// the search dialog box
//
app.getArists = (artist) => $.ajax({
	// specify the endpoint
	url: 'https://api.spotify.com/v1/search',
	// specifying the request method = GET
	method: 'GET',
	// specifying the data output to be in json format
	dataType: 'json',
	data: {
		// requesting the artist type (need to specify for spotfy api)
		type: 'artist',
		// query for artist
		q: artist
	}
}).done(function(data) {
	
//
// for each function that is supposed to create a graph using the popularity of each artist
//
	console.log("Artist Data Object");
	console.log(data);
	
	$.each(data.artists.items, function(i, v) {
		// console.log("Test Each");
		//console.log(i);
		//console.log(v.items);
		console.log(v.popularity);
	})
});

//
// this function is supposed to draw the graph based on the given data (but i didn't get it to work)
//

// google.charts.load('current', {packages: ['corechart', 'bar']});
// google.charts.setOnLoadCallback(drawBasic);

// function drawBasic() {

//       //var data = 
//       	$.each(data.artists.items, function(i, v) {
// 		// console.log("Test Each");
// 		//console.log(i);
// 		//console.log(v.items);
// 		console.log(v.popularity);
// 	})

//       var options = {
//         title: 'Population of Largest U.S. Cities',
//         chartArea: {width: '50%'},
//         hAxis: {
//           title: 'Total Population',
//           minValue: 0
//         },
//         vAxis: {
//           title: 'City'
//         }
//       };

//       var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

//       chart.draw(data, options);
//     }

//
// Makes an ajax call ato get the albums of the specific artists that
// that the user typed in
//
app.getAristsAlbums = (id) => $.ajax({
	// specify the endpoint
	url: `https://api.spotify.com/v1/artists/${id}/albums`,
	// specifying the request method = GET
	method: 'GET',
	// specifying the data output to be in json format
	dataType: 'json',
	data: {
		// specifying the album type (not singles or compilations)
		album_type: 'album',
	}
});

//
// Gets the specific tracks by passing in the id and making an ajax call 
// to the spotify tracks api
//
app.getAlbumTracks = (id) => $.ajax({
	// specify the endpoint
	url: `https://api.spotify.com/v1/albums/${id}/tracks`,
	// specifying the data output to be in json format
	method: 'GET',
	// specifying the data output to be in json format
	dataType: 'json'	
});


//
// function that gets the albums from the artists that are specified
//
app.getAlbums = function(artists) {
	// 
	let albums = artists.map(artist => app.getAristsAlbums(artist.id));
	// wait for all calls to return using the spread operator
	$.when(...albums)
		// get the data back
		.then((...albums) => {
			// set the album ids to albums
			let albumIds = albums
				// pass along to the array of items
				.map(a => a[0].items)
				// return an array that is previous spread out and current spread out
				.reduce((prev,curr) => [...prev,...curr] ,[])
				.map(album => app.getAlbumTracks(album.id));

			app.getTracks(albumIds);
		});
};

//
// function that gets the specific tracks from the artists specified
//
app.getTracks = function(tracks) {
	// wait for all calls to return using spread operator
	$.when(...tracks)
		// retrieve the data back
		.then((...tracks) => {
			tracks = tracks
				.map(getDataObject)
				// return an array that is previous spread out and current spread out
				.reduce((prev,curr) => [...prev,...curr],[]);	
			// populates the playlist with 40 random tracks	
			const randomPlayList = getRandomTracks(40,tracks);
			// creates the random playlist using the artists specified
			app.createPlayList(randomPlayList);
		})
};

//
// creating the playlist based on the artists specified
//
app.createPlayList = function(songs) {
	// base layout for the playlist screen
	const baseUrl = 'https://embed.spotify.com/?theme=white&uri=spotify:trackset:My Playlist:';
	// populate using the songs and pass it using the song id
	songs = songs.map(song => song.id).join(',');
	$('.loader').removeClass('show');
	// specifies the playlist dialog box (widget), adding the base template and populating
	// the songs in them
	$('.playlist').append(`<iframe src="${baseUrl + songs}" width="500" height="700"></iframe>`);
}


app.init = function() {
	$('form').on('submit', function(e) {
		e.preventDefault();
		let artists = $('input[type=search]').val();
		$('.loader').addClass('show');
		artists = artists
			// parses the data
			.split(',')
			.map(app.getArists);
		// spread operator - wait for all calls to return using $.when
		$.when(...artists)
		// retrieve the data
			.then((...artists) => {
				// map the data to the array
				artists = artists.map(a => a[0].artists.items[0]);
				console.log(artists);
				app.getAlbums(artists);
			});
	});

}

const getDataObject = arr => arr[0].items;

//
// helper function that generates the random tracks to populate the 
// playlist that is created
//
function getRandomTracks(num, tracks) {
	const randomResults = [];
	// create random tracks based on the artist
	for(let i = 0; i < num; i++) {
		randomResults.push(tracks[ Math.floor(Math.random() * tracks.length) ])
	}
	// returns the playlist
	return randomResults;
}

app.getPopularity = (popularity) => $.ajax({
	dataType: 'json',
	data: {
		type: 'popularity'
	    
	}
})

// random gradient generator
// $(document).ready(function() {
//     function randomgrad() {
//         var rand1 = "#" + Math.random().toString(16).slice(2, 8);
//         var rand2 = "#" + Math.random().toString(16).slice(2, 8);
// 		var grad = $(this);

// 		function convertHex(hex,opacity){
// 		    hex = hex.replace('#','');
// 		    r = parseInt(hex.substring(0,2), 16);
// 		    g = parseInt(hex.substring(2,4), 16);
// 		    b = parseInt(hex.substring(4,6), 16);

// 		    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
// 		    return result;
// 		}
		
// 		grad.css('background-color', convertHex(rand1,40));
// 		grad.css("background-image", "linear-gradient(to left, "+ convertHex(rand1,40) +", "+ convertHex(rand2,40) +")");  
// 	}
	
// 	$('body').each(randomgrad);
//     $('.bg').each(randomgrad);
// });

$(app.init);