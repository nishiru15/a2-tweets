class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.startsWith("Just completed a") ||this.text.startsWith("Just posted a") ){
            return 'completed_event';
        }
        else if(this.text.startsWith('Watch my')){
            return 'live_event';
        }
        else if(this.text.startsWith('Achieved a')|| this.text.startsWith('Goal achieved')|| this.text.startsWith('I just set a goal')){
            return 'achievement';
        }
        else{
            return 'miscellaneous';
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (this.text.includes("TomTom MySports Watch")){
            return false;
        }
        if (this.text.includes(" - ")){
            return true;
        }
        //TODO: identify whether the tweet is written
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        let index = this.text.indexOf(" - ");
        let written = this.text.substring(index + 3);
        written = written.replace(/https?:\/\/\S+/g, "");
        written = written.replace("#Runkeeper", "");
        //TODO: parse the written text from the tweet
        return written.trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        let index = this.text.indexOf( " km ");
        if(index == -1){
            index= this.text.indexOf(" mi ");
        }
        if(index == -1){
            return "unknown";
        }
        let rest = this.text.substring(index+4);
        let withIndex = rest.indexOf(" with");
        let dash = rest.indexOf(" - ");
        let end = rest.indexOf(" with");

        if(withIndex!= -1 && dash != -1){
            end = Math.min(withIndex, dash);
        }
        else if(withIndex!= -1){
            end = withIndex;
        }
        else{
            end = dash;
        }

        if(end == -1){
            return rest.trim()
        }
        return rest.substring(0, end).trim()

        //TODO: parse the activity type from the text of the tweet
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        let km = true;
        let index = this.text.indexOf( " km ");
        if(index == -1){
            index = this.text.indexOf(" mi ");
            km = false;
        }
        if(index == -1){
            return 0;
        }

        let words = this.text.substring(0, index).split(" ");
        let number = parseFloat(words[words.length-1]);
        if(km){
            number = number/1.609;
        }
        return number
        //TODO: prase the distance from the text of the tweet
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}