
    let guessNumber = null;
    let interval = 50;
    let results = [];
    let solution = null;
    let gameOver = false;

    function setup() {     
        createCanvas(windowWidth,windowHeight);     
    } 

    function draw() {
        
        let gameScore = getGameScore(results);
        
        if(gameScore.loss === 5 || gameScore.total === 10){
            gameOver = true;
            displayGameOver(gameScore);
            return; // Game stops working if condition is med
        }
        
        background(0);

        // If frame count is equal to 1, the content would display for the first hundred frames
        // and other random numbers for the consecutive interval frames
	    if(frameCount === 1 || frameCount % interval === 0){

            solution = null; // Change back to the original background color after the given interval of frames

            guessNumber = new GuessItem(width/2, height/2, 16);
        }
        // Call the render method only if guessNumber exists
        if(guessNumber){
            guessNumber.render();
        } 
        if(solution !== null){
            solutionMessage(gameScore.total, solution);
        }                 
    }

    function solutionMessage(seed, solution){
        let trueMessages = [
            'GOOD JOB!',
            'DOING GREAT!',
            'OMG!',
            'SUCH WIN!',
            'I APPRECIATE YOU!',
            'IMPRESSIVE!'
        ];
        let falseMessages = [
            'OH NO!',
            'BETTER LUCK NEXT TIME!',
            ':('   
        ];
        let messages;
        push();
        textAlign(CENTER, CENTER);
        textSize(36);
        fill(237, 34, 93);
        randomSeed(seed * 10000);
        if(solution === true){
            background(255);
            messages = trueMessages;
        }else if(solution === false){ // solution is null initially, so cannot replace this line with else{...}
            background(0);    
            messages = falseMessages;
        }
        translate(width/2, height/2);
        text(messages[parseInt(random(messages.length), 10)], 0, 0);
        randomSeed();
        pop();
    }

    function displayGameOver(score){
        push();
        background(255);
        textAlign(CENTER, CENTER);
        translate(width/2, height/3);
        fill(237, 34, 93);
        textSize(26);
        text('GAME OVER!', 0, 0);

        fill(100);
        translate(0, 50);
        text('You have ' + score.win + ' correct guesses', 0, 0);   

        let alternatingValue = map(sin(frameCount / 20), -1, 1, 0, 255); // Gets the text to be blinking

        fill(237, 34, 93, alternatingValue);
        textSize(20);
        translate(0, 100); 
        text('Press ENTER to Restart ', 0, 0);  
        
        pop();       
    }

    function getGameScore(score){
        let wins = 0;
        let losses = 0;
        let total = score.length;

        for(let i = 0; i < total; i++){
            let item = score[i];
            if(item === true){
                wins += 1;
            }else{
                losses += 1;
            }
        }
        return {win: wins, loss: losses, total: total};
    }
    function resartGame(){
        results = [];
        solution = null;
        gameOver = false;
    }

    // keyPressed function is a p5.js function that gets called everytime a key is pressed
    function keyPressed(){
        if(gameOver === true){
            if(keyCode === ENTER){
                resartGame();
                return;
            }
        }
        if(guessNumber){
            console.log('you pressed', key);
            solution = guessNumber.solving(key);
            if(solution){
                results.push(true); // If solution is true , adds true to the end of result array
            }else{
                results.push(false);
            }
            guessNumber = null;
        }else{
            console.log("Nothing to be solved.");
        }       
    }

    function GuessItem(x, y, scl){ // Not using the name as scale which is a p5.js function
        this.x = x;
        this.y = y;
        this.scale = scl;
        this.scaleIncrement = 0.2;
        this.content = getContent();
        this.alpha = 255;
        this.alphaDecrement = 3;
        this.solved;
        this.contentMap ={
            '1': 'one',
            '2': 'two',
            '3': 'three',
            '4': 'four',
            '5': 'five',
            '6': 'six',
            '7': 'seven',
            '8': 'eight',
            '9': 'nine',
            '0': 'zero'
        };
        this.colors = [
            [63, 184, 175],
            [127, 199, 175],
            [218, 216, 167],
            [255, 158, 154],
            [255, 61, 127],
            [55, 191, 211],
            [159, 223, 82],
            [234, 289, 43],
            [250, 69, 8],
            [20, 79, 48],
            [150, 99, 28],
            [194, 13, 0]
        ];

        // Keeping the function name generic helps with the future expansion work that we might want to do
        function getContent(){
            return String(parseInt(random(10), 10));
        }
        // solving method would receive an input(users press key) and check to see if it's equal to the content inside it
        this.solving = function(input){
            if(input === this.content){ // input is of type string, so convert this.content from number to a string
                this.solved = true;
            }else{
                this.solved = false;
            }
            return this.solved;
        }

        this.drawEllipse = function(size, sWeight, speedMultiplier, seed){
            push();
            randomSeed(seed);
            noFill();
            strokeWeight(sWeight);
            translate(this.x, this.y);
            scale(this.scale * 0.5* speedMultiplier);
            let circleColor = this.colors[parseInt(random(this.colors.length), 10)];
            stroke(circleColor);
            ellipse(0,0,size,size); 
            randomSeed();
            pop();
        }

        this.render = function(){
            if(this.solved === false){ // If user press key !== this.content, nothing to be rendered
                return;
            }
            this.drawEllipse(115, 10, 1.4, this.content * 1000); // Multiply the value to generate random values wide apart otherwise colors of rings would be almost the same 
            this.drawEllipse(95, 7, 1.2, this.content * 2000);
            this.drawEllipse(80, 5, 1, this.content * 3000);
            push();
            fill(255, this.alpha);
            textAlign(CENTER,CENTER); // if 'center' -> Error
            translate(this.x, this.y);
            scale(this.scale);
            text(this.contentMap[this.content], 0, 0); // Move the object to 0 point and let translate function do the positioning
            this.scale += this.scaleIncrement;
            this.alpha -= this.alphaDecrement; // Change the opacity of the color of text as it's being animated

            pop();  /* translate function goes with push() & pop() 
                        so that tansformation state change caused by translate function will not contaminate anything yield
                        that comes after GuessNumber object   */
            
        }
    }

    
    
