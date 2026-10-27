function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	const completed = tweet_array.filter(tweet => tweet.source== 'completed_event' && tweet.activityType!= 'unknown');

	const counts = {};
	completed.forEach(function(tweet){
		const type = tweet.activityType;
		if(counts[type]== undefined){
			counts[type] = 0;
		}
		counts[type]++
	});
	const activityData = Object.keys(counts).map(function(type){
		return{activityType: type, count: counts[type]};
	});
	activityData.sort((a,b)=>b.count - a.count);
	document.getElementById('numberActivities').innerText = activityData.length;
	document.getElementById('firstMost').innerText = activityData[0].activityType;
	document.getElementById('secondMost').innerText = activityData[1].activityType;
	document.getElementById('thirdMost').innerText = activityData[2].activityType;

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  "mark": "bar",
	  "encoding":{
		"x": {"field": "activityType", "type": "nominal", "title": "Activity type", "sort": "-y"},
	 	"y": {"field": "count", "type": "quantitative", "title": "Number of Tweets"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	const topThree = activityData.slice(0,3).map(d=>d.activityType);
	const dayNames =['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const distanceData = completed.filter(tweet => topThree.includes(tweet.activityType)).map(function(tweet){ return{
		activityType: tweet.activityType,
		distance: tweet.distance,
		day: dayNames[tweet.time.getDay()]
	};
});
	//create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	const  distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distances of the top three activities by day of the week.",
		"data": {"values": distanceData},
		"mark": "point",
		"encoding": {
	    	"x": {"field": "day", "type": "ordinal", "sort": dayNames, "title": "Day of the week"},
	    	"y": {"field": "distance", "type": "quantitative", "title": "Distance (miles)"},
	    	"color": {"field": "activityType", "type": "nominal", "title": "Activity type"}
	  }
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	const distance_vis_agg_spec= {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Mean distances of the top three activities by day of the week.",
		"data": {"values": distanceData},
		"mark": "point",
		"encoding": {
			"x": {"field": "day", "type": "ordinal", "sort": dayNames, "title": "Day of the week"},
			"y": {"field": "distance", "type": "quantitative", "aggregate": "mean", "title": "Mean distance (miles)"},
			"color": {"field": "activityType", "type": "nominal", "title": "Activity type"}	
		}
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_agg_spec, {actions:false});
	const distanceVis = document.getElementById('distanceVis');
	const distanceVisAggregated = document.getElementById('distanceVisAggregated');
	const button = document.getElementById('aggregate');

	distanceVisAggregated.style.display = 'none';

	button.addEventListener('click', function(){
		if (distanceVisAggregated.style.display == 'none') {
			distanceVisAggregated.style.display = 'block';
			distanceVis.style.display= 'none';
			button.innerText = 'Show all activities';
			}
		else{
			distanceVis.style.display = 'block';
			distanceVisAggregated.style.display = 'none';
			button.innerText= 'Show means';
		}
	});
	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';
	document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';

}
//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
