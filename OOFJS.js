//Functions only used in home

function initialize1() {
    warning = document.getElementById("warning");
    img = document.getElementById("fighterImg");
    space = document.getElementById("space");

    sessionStorage.setItem("fighter",0);
}

function display1() {
    if (sessionStorage.getItem("fighter") === "1") {
        img.src = "images/fox.png";
    } else {
        img.src = "images/falco.png";
    }
    warning.innerHTML = "";
    space.innerHTML = "<br><br>";
}

function selectFighter(num) {
    sessionStorage.setItem("fighter",num); //have to use session storage because data doesn't get saved across pages. second parameter is a string not a number
    display1();
}

function start() {
    if (sessionStorage.getItem("fighter") === "0") {
        warning.innerHTML = "Please pick a fighter";
    } else {
        location.href = "OOFFight.html";
    }
}

/**********************************************************************************************************************************************/

//Functions only used in fight

function initialize2() {
    pStrDisplay = document.getElementById("pStr");
    pSpdDisplay = document.getElementById("pSpd");
    pCunDisplay = document.getElementById("pCun");
    pFatDisplay = document.getElementById("pFat");
    cStrDisplay = document.getElementById("cStr");
    cSpdDisplay = document.getElementById("cSpd");
    cCunDisplay = document.getElementById("cCun");
    cFatDisplay = document.getElementById("cFat");

    buttons = document.getElementById("buttons");
    atkBtn = document.getElementById("atkBtn");
    defBtn = document.getElementById("defBtn");
    fMvBtn = document.getElementById("fMvBtn");
    fMvBtn.style.display = "none";

    stageDisplay = document.getElementById("stage");

    if (sessionStorage.getItem("fighter") === "2") {
        stageDisplay.style.transform = "rotateY(180deg)";
    }

    log = document.getElementById("log");
    
    //Stats
    pStrength = pSpeed = pCunning = cStrength = cSpeed = cCunning = 6;
    pFatigue = cFatigue = maxPFatigue = maxCFatigue = 30;
    pFMove = cFMove = false;

    //Calculate attack and defense
    pAttack = cAttack = pDefense = cDefense = pFAttack = cFAttack = 0;

    //Used to check if game is over
    gameOver = 0;

    //Randomizing 2 of the computer's stats
    for (let i = 0; i < 2; i++) {
        var stat = getRandomInt(1,4);
        //Loops until selects unaltered stat
        while ((stat === 1 && cStrength != 6) || (stat === 2 && cSpeed != 6) || (stat === 3 && cCunning != 6) || (stat === 4 && cFatigue != 30)) {
            stat = getRandomInt(1,4);
        }
        if (getRandomInt(0,1) === 0) { //increase stat
            if (stat === 1) {
                cStrength += 1;
            } else if (stat === 2) {
                cSpeed += 1;
            } else if (stat === 3) {
                cCunning += 1;
            } else {
                cFatigue += getRandomInt(1,6);
                maxCFatigue = cFatigue;
            }
        } else { //decrease stat
            if (stat === 1) {
                cStrength -= 1;
            } else if (stat === 2) {
                cSpeed -= 1;
            } else if (stat === 3) {
                cCunning -= 1;
            } else {
                cFatigue -= getRandomInt(1,6);
                maxCFatigue = cFatigue;
            }
        }
    }

    display2();
}

function display2() {
    //Stats
    pStrDisplay.innerHTML = pStrength;
    pSpdDisplay.innerHTML = pSpeed;
    pCunDisplay.innerHTML = pCunning;
    pFatDisplay.innerHTML = pFatigue;
    cStrDisplay.innerHTML = cStrength;
    cSpdDisplay.innerHTML = cSpeed;
    cCunDisplay.innerHTML = cCunning;
    cFatDisplay.innerHTML = cFatigue;

    //Show finishing move button if player can do it
    if (pFMove) {
        fMvBtn.style.display = "inline";
        buttons.style.gridTemplateColumns = "auto auto auto";
    } else {
        fMvBtn.style.display = "none";
        buttons.style.gridTemplateColumns = "auto auto";
    }

    //Game over image
    if (gameOver === 1) {
        if (sessionStorage.getItem("fighter") === "1") {
            stage.src = "images/fox-falcodead.png";
        } else {
            stage.src = "images/foxdead-falco.png";
        }
    } else if (gameOver === 2) {
        if (sessionStorage.getItem("fighter") === "1") {
            stage.src = "images/foxdead-falco.png";
        } else {
            stage.src = "images/fox-falcodead.png";
        }
    }
}

function updateLog(str) { //Updates log and adds new line after
    log.innerHTML += str + "<br>";
}

function getRandomInt(l,u) { //Gives random integer between l and u
    var num = parseInt(Math.random()*(u-l+1)+l);
    return num;
}

/*
Order of how functions below are called:
1. Call move function
2. Call playerMove and computerMove function (they only calculate the attack, defense, and finishing attack stats)
3. Depending on speed, call calcStats function for player or computer (will calculate how much damage they deal or how much fatigue they recover)
*/
function move(pMove) {
    //Decide what move the computer is going to do
    var cMove = getRandomInt(1,2);
    if (cFMove) {
        cMove = 3;
    }

    //Calculate attack and/or defense
    playerMove(pMove);
    computerMove(cMove);
    calcStats();
    if (gameOver === 0) {
        updateLog(""); //space out moves from each turn so it's easier to read
        checkFMove(); //Checks if finishing move is available for player and computer after each turn
    }
    display2();
}

function playerMove(move) {
    if (move === 1) {
        attack(true);
    } else if (move === 2) {
        defend(true);
    } else {
        fMove(true);
    }
}

function computerMove(move) {
    if (move === 1) {
        attack(false);
    } else if (move === 2) {
        defend(false);
    } else {
        fMove(false);
    }
}

function attack(turn) { //Calculate attack, defense, finishing attack stats
    if (turn) {
        pAttack = Math.round((pStrength+pSpeed+pCunning)/getRandomInt(1,3));
        pDefense = pSpeed + getRandomInt(1,6);
        pFAttack = 0;
    } else {
        cAttack = Math.round((cStrength+cSpeed+cCunning)/getRandomInt(1,3));
        cDefense = cSpeed + getRandomInt(1,6);
        cFAttack = 0;
    }
}

function defend(turn) { //Calculate attack, defense, finishing attack stats
    if (turn) {
        pAttack = 0;
        pDefense = pSpeed+pCunning;
        pFAttack = 0;
    } else {
        cAttack = 0;
        cDefense = cSpeed+cCunning;
        cFAttack = 0;
    }
}

function fMove(turn) { //Calculate attack, defense, finishing attack stats
    if (turn) {
        pAttack = 0;
        pDefense = pSpeed+pCunning;
        pFAttack = Math.round((pStrength+pSpeed)/getRandomInt(1,3));
    } else {
        cAttack = 0;
        cDefense = cSpeed=cCunning;
        cFAttack = Math.round((cStrength+cSpeed)/getRandomInt(1,3));
    }
}

function checkFMove() { //Checks if finishing move is available
    pFMove = (pFatigue >= (cFatigue*2) || cFatigue < 0);
    cFMove = (cFatigue >= (pFatigue*2) || pFatigue < 0);
    
    if (pFMove) {
        updateLog("Your finishing move is available.<br><br>");
    }
    if (cFMove) {
        updateLog("Computer's finishing move is available.<br><br>");
    }
}

function recoverFatigue(turn) { //Recover some fatigue
    var num = getRandomInt(1,6);
    if (turn) { //computer recovers b/c player did no damage
        if ((cFatigue+num) > maxCFatigue) { //prevents computer fatigue from going over max
            num = maxCFatigue-cFatigue;
            cFatigue = maxCFatigue;
        } else {
            cFatigue += num;
        }
        updateLog("Computer recovers " + num + " fatigue.<br>");
    } else { //player recovers b/c computer did no damage
        if ((pFatigue+num) > maxPFatigue) { //prevents player fatigue from going over max
            num = maxPFatigue-pFatigue;
            pFatigue = maxPFatigue;
        } else {
            pFatigue += num;
        }
        updateLog("Player recovers " + num + " fatigue.<br>");
    }
}

//Attack, defense, and finishing attack stats should already be calculated from move(). This function calculates what happens to fatigue
function calcStats() {
    if (gameOver === 0) {
        if (pFAttack > 0 && cFAttack > 0) { //Both player and computer attempted finishing move. Use speed to decide who attacks first
            updateLog("Player uses finishing move and computer uses finishing move.");
            updateLog("Player Attack: " + pFAttack + "<br>Computer Defense: " + cDefense);
            updateLog("Computer Attack: " + cFAttack + "<br>Player Defense: " + pDefense);
            if (pSpeed > cSpeed) { //Player uses finishing move first
                playerFMove();
                if (gameOver === 0) { //Player's finishing move failed
                    computerFMove();
                }
            } else if (cSpeed > pSpeed) { //Computer uses finishing move first
                computerFMove();
                if (gameOver === 0) { //Computer's finishing move failed
                    playerFMove();
                }
            } else { //Randomly decide who uses finishing move first
                if (getRandomInt(1,2) === 1) { //Player goes first
                    playerFMove();
                    if (gameOver === 0) { //Player's finishing move failed
                        computerFMove();
                    }
                } else { //Computer goes first
                    computerFMove();
                    if (gameOver === 0) { //Computer's finishing move failed
                        playerFMove();
                    }
                }
            }
        } 
        
        else if (pFAttack > 0) { //Only player attempts finishing move
            if (cAttack > 0) {
                updateLog("Player uses finishing move and computer attacks.");
                updateLog("Player Attack: " + pFAttack + "<br>Computer Defense: " + cDefense);
                updateLog("Computer Attack: " + cAttack + "<br>Player Defense: " + pDefense);
                playerFMove();
                if (gameOver === 0) { //Computer attacks
                    if ((cAttack-pDefense) > 0) {
                        pFatigue -= (cAttack-pDefense);
                        updateLog("Computer dealt " + (cAttack-pDefense) + " damage to player.");
                    } else {
                        updateLog("Computer dealt 0 damage to player.");
                    }
                    updateLog("");
                }
            } else { //Computer defends
                updateLog("Player uses finishing move and computer defends.");
                playerFMove();
            }
        } 
        
        else if (cFAttack > 0) { //Only computer attempts finishing move
            if (pAttack > 0) {
                updateLog("Player attacks and computer uses finishing move.");
                updateLog("Player Attack: " + pAttack + "<br>Computer Defense: " + cDefense);
                updateLog("Computer Attack: " + cFAttack + "<br>Player Defense: " + pDefense);
                computerFMove();
                if (gameOver === 0) { //Player attacks
                    if ((pAttack-cDefense) > 0) {
                        cFatigue -= (pAttack-cDefense);
                        updateLog("Player dealt " + (pAttack-cDefense) + " damage to computer.");
                    } else {
                        updateLog("Player dealt 0 damage to computer.");
                    }
                    updateLog("");
                }
            } else { //Player defends
                updateLog("Player defends and computer uses finshing move.");
                computerFMove();
            }
        } 
        
        else if (pAttack === 0 && cAttack === 0) { //Both player and computer defends
            updateLog("Player defends.");
            recoverFatigue(false); //Player heals
            updateLog("Computer defends.");
            recoverFatigue(true); //Computer heals
        } 
        
        else if (pAttack === 0) { //Player defends and computer attacks
            updateLog("Player defends and computer attacks.");
            updateLog("Computer Attack: " + cAttack + "<br>Player Defense: " + pDefense);

            if (cAttack-pDefense > 0) { //Computer dealt damage
                pFatigue -= (cAttack-pDefense);
                updateLog("Computer deals " + (cAttack-pDefense) + " damage to player.");
                updateLog("");
            } else { //Computer dealt no damage
                updateLog("Computer deals 0 damage to player.");
                recoverFatigue(false); //Player heals
            }
        } 
        
        else if (cAttack === 0) { //Computer defends and player attacks
            updateLog("Player attacks and computer defends.");
            updateLog("Player Attack: " + pAttack + "<br>Computer Defense: " + cDefense);

            if (pAttack-cDefense > 0) { //Player dealt damage
                cFatigue -= (pAttack-cDefense);
                updateLog("Player deals " + (pAttack-cDefense) + " damage to computer.");
                updateLog("");
            } else { //Player dealt no damage
                updateLog("Player deals 0 damage to computer.");
                recoverFatigue(true); //Computer heals
            }
        } 
        
        else { //Both player and computer attacks
            updateLog("Player attacks and computer attacks.");
            updateLog("Player Attack: " + pAttack + "<br>Computer Defense: " + cDefense);
            updateLog("Computer Attack: " + cAttack + "<br>Player Defense: " + pDefense);

            if (pAttack-cDefense > 0) { //Player dealt damage
                cFatigue -= (pAttack-cDefense);
                updateLog("Player deals " + (pAttack-cDefense) + " damage to computer.");
            } else { //Player dealt no damage
                updateLog("Player deals 0 damage to computer.");
            }

            if (cAttack-pDefense > 0) { //Computer dealt damage
                pFatigue -= (cAttack-pDefense);
                updateLog("Computer deals " + (cAttack-pDefense) + " damage to player.");
            } else { //Computer dealt no damage
                updateLog("Computer deals 0 damage to player.");
            }
            updateLog("");
        }
    }
}

function playerFMove() { //Player attempts finishing move
    if (pFAttack-cDefense > 0) { //Success
        updateLog("Player's finishing move succeeded, dealing " + (pFAttack-cDefense) + " damage to computer.<br>");
        updateLog("Player wins!");
        endGame(true);
    } else { //Fail
        updateLog("Player's finishing move failed, dealing 0 damage to computer.");
        if (cFAttack === 0 && cAttack === 0) { //Computer defended
            recoverFatigue(true);
        }
    }
}

function computerFMove() { //Computer attempts finishing move
    if (cFAttack-pDefense > 0) { //Success
        updateLog("Computer's finishing move succeeded, dealing " + (cFAttack-pDefense) + " damage to player.<br>");
        updateLog("Computer wins!");
        endGame(false);
    } else { //Fail
        updateLog("Computer's finishing move failed, dealing 0 damage to player.");
        if (pFAttack === 0 && pAttack === 0) { //Player defends
            recoverFatigue(false);
        }
    }
}

function endGame(win) { //Game over
    atkBtn.disabled = true;
    defBtn.disabled = true;
    fMvBtn.disabled = true;
    if (win) {
        gameOver = 1; //computer lost
    } else {
        gameOver = 2; //player lost
    }
}

function reset() { //Reset game
    location.href = "OOFHome.html";
}