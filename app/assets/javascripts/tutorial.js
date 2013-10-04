var rewire = 0.10;
var meanDegree = 3;
var diseaseIsSpreading = false;
var transmissionRate = .35;
var recoveryRate = 0;
var maxRecoveryTime = 1000000;
var numberVaccinated = 0;
var timeToStop = true;
var guideRailsPosition = 0;
var postInitialOutbreak = false;
var finalStop = false;
var endGame = false;
var intervention = false;
var tutorial = false;
var charge = -400;
var newInfections = [];
var xyCoords = [];
var vax = 1;
var exposureEdges = [];
var currentFlash = 0;
var keepFlashing = true;
var xFlashCounter = 0;
var numberQuarantined = 0;
var vaccineSupply = 0;
var vaccineResearched = false;
var vaccinateMode = false;
var treatMode = false;
var quarantineMode = false;
var twine = [];
var twineIndex = 0;
var numberOfCommunities = null;
var largestCommunity = null;
var communities = [];
var groupCounter = 1;
var bcScores = [];
var timestep = 0;
var indexCase = null;
var simulation = true;
var opacityIndex = 0;
var lessonText;
var vaccinatedBayStartYCoord = 125;
var start = false;
var nextX = 800;
var nextY = 140;
var guideXCoord = 400;
var guideYCoord = 70;
var guide2YCoordChange = 35;
var width = 1000,
    height = 700,
    svg;
var guideTextSVG;
var actionBay;
var force, link, node;
var pleaseWait = false;
var friction = 0.90;
var backX = 115;
var numberSaved = 0;
var infectedBar;
var uninfectedBar;
var scoreMeter;

var startButton;

var fromMenu = false;

backEnable = true;
nextEnable = true;



// this is the full graph, made by Ike
var tailoredGraph = {};
var tailoredNodes = getTailoredNodes();
var tailoredLinks = getTailoredLinks();

// this is the working graph
var graph = {};
graph.nodes = tailoredNodes;
graph.links = tailoredLinks;

// this is the graph that starts as trivial (one node, no edges) and is built to reflect tailoredGraph. At which point, we switch to working graph
trivialGraph = {};
trivialGraph.nodes = [];
trivialGraph.links = [];

var player = graph.nodes[0];
trivialGraph.nodes.push(player);
var numberOfIndividuals = tailoredNodes.length;

// this is the graph with a few weak ties between communities to illustrate segregation by vaccination
var weakTieNodes = getWeakTieNodes();
var weakTieLinks = getWeakTieLinks();

var backArrow, timestepTicker, timestepText, nextArrow;

d3.select("body").append("text")
    .attr("class", "homeTitle")
    .text("VAX!")

d3.select("body").append("text")
    .attr("class", "homeText")
    .text("A game about epidemic prevention.")

d3.select("body").append("text")
    .attr("class", "homeTutorial")
    .text("Tutorial >")
    .on("click", function() {
        homeToTutorial();
    })

d3.select("body").append("text")
    .attr("class", "homeModules")
    .text("Modules >")
    .on("click", function() {
        d3.select(this)
            .text("Under Construction...")
            .style("font-size", "15px")
    })

d3.select("body").append("text")
    .attr("class", "homeGame")
    .text("Full Game >")
    .on("click", function() {
        window.location.href = 'http://vax.herokuapp.com/game'
    })

function homeToTutorial() {
    d3.select("#homeBackground").remove();
    d3.select(".homeTitle").remove();
    d3.select(".homeText").remove();
    d3.select(".homeTutorial").remove();
    d3.select(".homeGame").remove();
    d3.select(".homeModules").remove();

    svg = d3.select("body").append("svg")
//        .attr("width", width)
//        .attr("height", height)
        .attr({
            "width": "100%",
            "height": "85%"
        })
        .attr("viewBox", "0 0 " + width + " " + height )
//        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("class", "svg")
        .style("pointer-events", "all")
//        .call(d3.behavior.zoom().on("zoom", redraw))


    guideTextSVG = d3.select(".svg").append("svg:svg")
        .attr("class", "guideTextSVG")
        .attr("x", 0)
        .attr("y", 500)


    guide = d3.select(".guideTextSVG").append("text")
        .attr("class", "guide")
        .attr("font-size", 28)
        .style("font-family", "Nunito")
        .style("fill", "#707070")
        .style("font-weight", 300)
        .text("")

    lessonText = d3.select(".svg").append("text")
        .attr("class", "lessonText")
        .attr("x", 35)
        .attr("y", 30)
        .style("font-size", 28)
        .style("font-family", "Nunito")
        .style("fill", "#707070")
        .style("font-weight", 700)
        .attr("opacity", 1)
        .text("Lesson 1: Networks")


    guide2 = d3.select(".guideTextSVG").append("text")
        .attr("class", "guide2")
        .attr("x",guideXCoord).attr("y",guideYCoord+guide2YCoordChange)
        .attr("font-size", 28)
        .style("font-family", "Nunito")
        .style("fill", "#707070")
        .style("font-weight", 300)
        .text("")

    advanceTutorial()
}

function advanceTutorial() {
    if (start) {
        guideRails();
    }
    else {
        start = true;
        initTutorial()
    };
}

// tick function, which does the physics for each individual node & link.
function tick() {


    node.attr("cx", function(d) { return d.x = Math.max(8, Math.min(width - 8, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(8, Math.min(500 - 8, d.y)); });


    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });


}

function tutorialUpdate() {
    if (guideRailsPosition == 3) {
        d3.selectAll(".node").transition().duration(300).attr("r", 8)
    }

    var nodes = removeVaccinatedNodes(graph);
    var links = removeOldLinks(graph);
    graph.links = links;
    updateCommunities();

    force
        .nodes(nodes)
        .charge(charge)
        .friction(0.75)
        .links(links)
        .start();

    link = svg.selectAll("line.link")
        .data(links, function(d) { return d.source.id + "-" + d.target.id;});


    link.enter().insert("svg:line", ".node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // Exit any old links.
    link.exit().remove();

    // Update the nodes…
    node = svg.selectAll("circle.node")
        .data(nodes, function(d) { return d.id; })
        .attr("r", 8)
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#b7b7b7";
            if (d.status == "E") color = "#ef5555";
            if (d.status == "I") color = "#ef5555";
            if (d.status == "R") color = "#9400D3";
            if (d.status == "V") color = "#d9d678";
            if (d.id == player.id && d.status != "I" && guideRailsPosition<6) color = "#2fa0ef";


            return color;});

    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 8)
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#b7b7b7";
            if (d.status == "E") color = "#ef5555";
            if (d.status == "I") color = "#ef5555";
            if (d.status == "R") color = "#9400D3";
            if (d.status == "V") color = "#d9d678";
            if (d.id == player.id && d.status != "I" && guideRailsPosition<6) color = "#2fa0ef";


            return color;

        })
        .on("click", function(d) {
            if (quarantineMode) {
                vaccinateMode = false;

                d3.status = "Q"

            }
            if (vaccinateMode) {
                quarantineMode = false;
                if (vaccineSupply <= 0) {
                    window.alert("Out of Vaccines!")
                    return;
                }
                d.status = "V";

                vaccineSupply--;
                numberVaccinated++;


                tutorialUpdate();
            }
        })
        .call(force.drag);

    // Exit any old nodes.
    node.exit().remove();

    d3.select(".vaccineCounterText").text("")

    d3.select(".vaccineCounterText")
        .text(vaccineSupply + " / " + vax);

}

function addOneFriend() {

    trivialGraph.nodes.push(graph.nodes[1]);
    trivialGraph.links.push({source:trivialGraph.nodes[0],target:trivialGraph.nodes[1],remove:false})

    stepWiseUpdate();

}

function centerElement(element, classString) {
    var leftSide = element.node().getBBox().x;
    var width = element.node().getBBox().width;
    var rightSide = leftSide + width;
    var leftDistance = leftSide - 0;
    var rightDistance = 960 - rightSide;
    var delta = leftDistance - rightDistance;

    if (delta > 0) {
        var halfDelta = Math.round(0.5 * delta);
        var newLeftSide = leftSide - halfDelta;
        var selection = "." + classString;
        d3.select(selection).attr("x", newLeftSide);
    }

    if (delta < 0) {
        var halfDelta = Math.round(0.5 * delta);
        var newLeftSide = leftSide + halfDelta;
        var selection = "." + classString;
        d3.select(selection).attr("x", newLeftSide);
    }
}

function buildGraph() {
    //remove friend, it will be added again below
    trivialGraph.nodes.splice(1,1);
    trivialGraph.links = [];
    tutorial = true;

    // add player neighbors
    for (var i = 0; i < graph.nodes.length; i++) {

        if (edgeExists(graph.nodes[i], trivialGraph.nodes[0], graph)) {
            trivialGraph.nodes.push(graph.nodes[i]);
        }
    }

    // add relevant links
    for (var ii = 0; ii < trivialGraph.nodes.length; ii++) {
        for (var iii = 0; iii < trivialGraph.nodes.length; iii++) {
            if (edgeExists(trivialGraph.nodes[ii], trivialGraph.nodes[iii], graph)) {
                var linkString = {source:trivialGraph.nodes[ii],target:trivialGraph.nodes[iii],remove:false};
                if (testDuplicate(trivialGraph.links, linkString)) continue;
                trivialGraph.links.push(linkString);
            }
        }
    }

    stepWiseUpdate();
}


function stepWiseUpdate() {

    var links = trivialGraph.links;
    var nodes = trivialGraph.nodes;

    updateCommunities();

    force
        .nodes(nodes)
        .charge(charge)
        .friction(friction)
        .links(links)
        .start();

    link = svg.selectAll("line.link")
        .data(links, function(d) { return d.source.id + "-" + d.target.id;});


    link.enter().insert("svg:line", ".node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // Exit any old links.
    link.exit().remove();

    // Update the nodes…
    node = svg.selectAll("circle.node")
        .data(nodes, function(d) { return d.id; })
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#b7b7b7";
            if (d.status == "E") color = "#ef5555";
            if (d.status == "I") color = "#ef5555";
            if (d.status == "R") color = "#9400D3";
            if (d.status == "V") color = "#d9d678";
            if (d.id == player.id && d.status != "I") color = "#2fa0ef";
            return color;})
            .on("click", function(d) {
                if (vaccinateMode) {
                    if (vaccineSupply <= 0) {
                        window.alert("Out of Vaccines!")
                        return;
                    }
                    d.status = "V";
                    d3.select(this)
//                        .attr("class", "vaxNode")
//                        .style("stroke", "#636363")
//                        .style("stroke-width", 2)
                        .style("fill", "#d9d678")

//                    vaccinatedBayStartYCoord += 25;
                    vaccineSupply--;
                    numberVaccinated++;


                    tutorialUpdate();
                }});

    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 8)
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#b7b7b7";
            if (d.status == "E") color = "#ef5555";
            if (d.status == "I") color = "#ef5555";
            if (d.status == "R") color = "#9400D3";
            if (d.status == "V") color = "#d9d678";

            if (d.id == player.id && d.status != "I") color = "#2fa0ef";

            return color;

        })
        .call(force.drag)
        .on("click", function(d) {
            if (vaccinateMode) {
                if (vaccineSupply <= 0) {
                    window.alert("Out of Vaccines!")
                    return;
                }
                d.status = "V";


                vaccineSupply--;
                numberVaccinated++;



                tutorialUpdate();
            }});

    // Exit any old nodes.
    node.exit().remove();
}

function getPathogen_xyCoords(newInfections) {
    var xyCoords = [];
    var recentTransmitters = [];
    for (var i = 0; i < newInfections.length; i++) {
        recentTransmitters.push(newInfections[i].infectedBy);
        var coordString = {id: i, receiverX: newInfections[i].x, receiverY: newInfections[i].y, transmitterX: newInfections[i].infectedBy.x, transmitterY: newInfections[i].infectedBy.y}
        xyCoords.push(coordString);
    }
    return xyCoords;
}

function movePathogens() {
    xyCoords = getPathogen_xyCoords(newInfections);

    d3.selectAll(".pathogen")
        .sort()
        .transition()
        .duration(400)
        .attr("cx", function(d) { return d.receiverX} )
        .attr("cy", function(d) { return d.receiverY} );
}

function createPathogens() {
    xyCoords = getPathogen_xyCoords(newInfections);

    var pathogen = svg.selectAll(".pathogen")
        .data(xyCoords)
        .enter()
        .append("circle")
        .attr("class", "pathogen")
        .attr("cx", function(d) { return d.transmitterX })
        .attr("cy", function(d) { return d.transmitterY })
        .attr("r", 4)
        .style("fill", "black")
}

function removePathogens() {
    d3.selectAll(".pathogen")
        .transition()
        .duration(200)
        .style("opacity", 0)

    d3.selectAll(".node")
        .transition()
        .duration(200)
        .attr("r", 8)

    d3.selectAll(".pathogen").remove();
}

function tutorialTimesteps() {
    infection();
    stateChanges();
    newInfections = [];
    newInfections = updateExposures();
//    d3.select(".timestepTicker")
//        .text(timestep);
    detectCompletion();
    this.timestep++;

    if (!timeToStop) {
        animatePathogens_thenUpdate();
        window.setTimeout(tutorialTimesteps, 1000);
    }
    else{
        animatePathogens_thenUpdate();
        nextEnable = true;
        resetBack();
        resetNext();


    }

}


function animatePathogens_thenUpdate() {
    window.setTimeout(createPathogens, 150)
    window.setTimeout(movePathogens  , 200)
    window.setTimeout(popNewInfection, 450)
    window.setTimeout(tutorialUpdate , 550)
    window.setTimeout(removePathogens, 600)
}

function animateQuarantinePathogens_thenUpdate() {
    window.setTimeout(createPathogens, 700)
    window.setTimeout(movePathogens  , 900)
    window.setTimeout(popNewInfection, 1300)
    window.setTimeout(tutorialUpdate , 1400)
    window.setTimeout(removePathogens, 1500)
}

function popNewInfection() {
    d3.selectAll(".node")
        .transition()
        .duration(100)
        .attr("r", function(d) {
            var size = 8;
            if (d.status == "I") {
                if (timestep - d.exposureTimestep == 1) size = 12;
            }
            return size;
        })
}

function detectCompletion() {
    var numberOfInfecteds = 0;
    for (var nodeIndex = 0; nodeIndex < graph.nodes.length; nodeIndex++) {
        var node = graph.nodes[nodeIndex];
        if (node.status == "I") numberOfInfecteds++;
    }
    if (numberOfInfecteds == numberOfIndividuals) {
        timeToStop = true;
        diseaseIsSpreading = false;
    }
    else {
        detectEndGame();
    }

    if (finalStop) {
        detectEndGame();
        if (endGame) {
            timeToStop = true;
        }
    }

    if (timeToStop & pleaseWait & !quarantineMode) {
        d3.select("#epidemicSxn").attr("class", "menuItemBold")
            .text("Epidemics")
        pleaseWait = false;

    }

    if (timeToStop & pleaseWait & quarantineMode) {
        d3.select("#quarantineMode").attr("class", "menuItemBold")
            .text("Quarantine")
        pleaseWait = false;

    }
}

function timedRemoval(elementString) {
    d3.select(elementString).remove();
}

function slideOutStepwiseNav(menu) {
    d3.select(".stepwiseNavBar")
        .style("right", "-1000px")

    window.setTimeout(clearStepwiseNavBar, 500);

    window.setTimeout(createMenuBox(500), 550);

    if (menu) {

    }
    else {
        startButton = d3.select(".guideTextSVG").append("text")
            .attr("class", "startButton")
            .attr("font-size", 18)
            .attr("opacity", 1)
            .attr("x", nextX)
            .attr("y", nextY)
            .style("cursor", "pointer")
            .style("font-family", "Nunito")
            .style("fill", "#707070")
            .style("font-weight", 470)
            .text("Start >")
            .on("click", function() {

                if (guideRailsPosition == 3) {
                    slideOutMenuBox();
                    tutorialTimesteps();

                }

                if (guideRailsPosition == 4) {
                    slideOutMenuBox();
                    tutorialTimesteps();
                }
                if (guideRailsPosition == 8) {
                    slideOutMenuBox();
                    guideRailsPosition++;
                    guideRails();
                }

                if(guideRailsPosition == 9) {
                    loadSyringe();
                }

                if (guideRailsPosition == 18) {
                    slideOutMenuBox();
                    guideRailsPosition++;
                    guideRails();
                }

                d3.select(this).attr("opacity", "0")

            })
    }

}

function slideOutMenuBox() {
    d3.select(".menuBox")
        .style("right", "-1000px")

    window.setTimeout(clearMenuBox, 500);

    window.setTimeout(createStepwiseNavBar, 700);

    window.setTimeout(initNavBar, 750);

    d3.select(".startButton").remove()
}



function createMenuBox(time) {
    d3.select("body").append("div")
        .attr("class", "menuBox")
        .style("right", "-1000px")
        .style("visibility", "visible")

    window.setTimeout(initMenuBox, time);

}

function createStepwiseNavBar() {
    d3.select("body").append("div")
        .attr("class", "stepwiseNavBar")
        .style("right", "-1000px")

    d3.select(".stepwiseNavBar").append("svg")
        .attr("class", "stepwiseNavSVG")
        .style("background", "#85bc99")
}

function clearStepwiseNavBar() {
    d3.select(".stepwiseNavBar").remove();
}

function clearMenuBox() {
    d3.select(".menuBox").remove();
}

function initMenuBox() {
    // network
    d3.select(".menuBox").append("div")
        .attr("class", "menuItemNormal")
        .attr("id", "networkSxn")
        .text("Networks")
        .on("click", restoreNetworkLesson)


    // epidemic
    d3.select(".menuBox").append("div")
        .attr("class", "menuItemNormal")
        .attr("id", "epidemicSxn")
        .text("Epidemics")
        .on("click", restoreEpidemicLesson)

    // vaccinate
    d3.select(".menuBox").append("div")
        .attr("class", "menuItemNormal")
        .attr("id", "vaccinateSxn")
        .text("Vaccinate")
        .on("click", restoreVaccineLesson);

    //quarantine
    d3.select(".menuBox").append("div")
        .attr("class", "menuItemNormal")
        .attr("id", "quarantineSxn")
        .text("Quarantine")
        .on("click", restoreQuarantineLesson)


    d3.select(".menuBox")
        .style("right", "0px")
}

function initNavBar() {
   d3.select(".stepwiseNavBar")
       .style("right", "-5px")

    backArrow = d3.select(".stepwiseNavSVG").append("text")
        .attr("class", "backArrow")
        .attr("x", 25)
        .attr("y", 20)
        .attr("fill", function() {
            if (backEnable) return "white";
            else return "#838383";
        })
        .style("font-family", "Nunito")
        .attr("opacity", 1)
        .style("font-weight", 500)
        .attr("font-size", 18)
        .text('< Back')
        .on("click", function() {
            if (backEnable) {
                if (diseaseIsSpreading) return;


                guideRailsPosition--;
                guideRailsReverse();

                if (guideRailsPosition == 9) {
                    loadSyringe();
                    backEnable = false;
                    resetBack();
                }
            }
            else return;
        })

    nextArrow = d3.select(".stepwiseNavSVG").append("text")
        .attr("class", "nextArrow")
        .attr("x", 400)
        .attr("y", 20)
        .attr("fill", function() {
            if (nextEnable) return "white";
            else return "#838383";
        })
        .style("font-family", "Nunito")
        .attr("opacity", 1)
        .style("font-weight", 500)
        .attr("font-size", 18)
        .text("Next >")
        .on("click", function() {
            if (nextEnable) {
                if (diseaseIsSpreading) return;

                guideRailsPosition++;
                guideRails();


            }
            else return;
        });


    d3.select(".stepwiseNavSVG").append("text")
        .attr("class", "menuNav")
        .attr("x", 215)
        .attr("y", 20)
        .style("font-family", "Nunito")
        .style("fill", "white")
        .attr("opacity", 0)
        .style("font-weight", 500)
        .attr("font-size", 18)
        .text("Menu")
        .style("cursor", "pointer")
        .on("click", menuConfirm)

    d3.select(".menuNav")
        .transition()
        .duration(500)
        .attr("opacity", 1)

}

function menuConfirm() {


    d3.select(".svg").append("text")
        .attr("class", "confirmHEAD")
        .attr("x", window.innerWidth/4 + 50)
        .attr("y", window.innerHeight/2)
        .style("font-family", "Nunito")
        .style("fill", "black")
        .style("font-weight", 700)
        .style("font-size", 35)
        .text("Skip Lesson?")


    d3.select(".svg").append("text")
        .attr("class", "confirmYES")
        .attr("x", window.innerWidth/4 + 90)
        .attr("y", window.innerHeight/2 + 50)
        .style("font-family", "Nunito")
        .style("fill", "black")
        .style("font-weight", 500)
        .style("font-size", 28)
        .text("Yes")
        .on("click", function() {
            d3.select(".confirmYES").remove();
            d3.select(".confirmNO").remove();
            d3.select(".confirmHEAD").remove();

            wipeOut();

            svg = d3.select("body").append("svg")
//        .attr("width", width)
//        .attr("height", height)
                .attr({
                    "width": "100%",
                    "height": "85%"
                })
                .attr("viewBox", "0 0 " + width + " " + height )
//        .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("class", "svg")
                .style("pointer-events", "all")
//        .call(d3.behavior.zoom().on("zoom", redraw))


            guideTextSVG = d3.select(".svg").append("svg:svg")
                .attr("class", "guideTextSVG")
                .attr("x", 0)
                .attr("y", 500)


            guide = d3.select(".guideTextSVG").append("text")
                .attr("class", "guide")
                .attr("font-size", 28)
                .attr("opacity", 0)
                .attr("x", guideXCoord)
                .attr("y", guideYCoord)
                .style("font-family", "Nunito")
                .style("fill", "#707070")
                .style("font-weight", 300)
                .text("Please select a lesson from")

            lessonText = d3.select(".svg").append("text")
                .attr("class", "lessonText")
                .attr("x", 35)
                .attr("y", 30)
                .style("font-size", 28)
                .style("font-family", "Nunito")
                .style("fill", "#707070")
                .style("font-weight", 700)
                .attr("opacity", 1)
                .text("Lesson #: ")


            guide2 = d3.select(".guideTextSVG").append("text")
                .attr("class", "guide2")
                .attr("x",guideXCoord).attr("y",guideYCoord+guide2YCoordChange)
                .attr("font-size", 28)
                .attr("opacity", 0)
                .style("font-family", "Nunito")
                .style("fill", "#707070")
                .style("font-weight", 300)
                .text("the menu bar below.")

            centerElement(guide, "guide")
            centerElement(guide2, "guide2")

            d3.select(".guide").attr("opacity", 1)
            d3.select(".guide2").attr("opacity", 1)

            d3.select("body").append("div")
                .attr("class", "vaxLogoDiv")
                .text("VAX!")

            d3.select(".vaxLogoDiv")
                .style("visibility", "visible")

            d3.select(".vaxLogoDiv")
                .style("left", "-12px")

            createMenuBox(1);

            keepFlashing = false;


        })


    d3.select(".svg").append("text")
        .attr("class", "confirmNO")
        .attr("x", window.innerWidth/4 + 150 + 30)
        .attr("y", window.innerHeight/2 + 50)
        .style("font-family", "Nunito")
        .style("fill", "black")
        .style("font-weight", 500)
        .style("font-size", 28)
        .style("cursor", "pointer")
        .text("No")
        .on("click", function() {
            d3.select(".confirmYES").remove();
            d3.select(".confirmNO").remove();
            d3.select(".confirmHEAD").remove();
        })




}

function initTutorial() {

    d3.select("body").append("div")
        .attr("class", "vaxLogoDiv")
        .text("VAX!")


    startButton = d3.select(".guideTextSVG").append("text")
        .attr("class", "startButton")
        .attr("font-size", 18)
        .attr("opacity", 1)
        .attr("x", nextX)
        .attr("y", nextY)
        .style("cursor", "pointer")
        .style("font-family", "Nunito")
        .style("fill", "#707070")
        .style("font-weight", 470)
        .text("Start >")
        .on("click", function() {
            guideRailsPosition++;
            guideRails();
            slideOutMenuBox();
            d3.select(this).transition().duration(500).attr("opacity", 0)
            d3.select(this).transition().duration(500).text("")
        })

    // initialize force layout. point to nodes & links.  size based on prior height and width.  set particle charge. setup step-wise force settling.
    force = d3.layout.force()
        .nodes(trivialGraph.nodes)
        .links(trivialGraph.links)
        .size([width, height])
        .charge(charge)
        .friction(friction)
        .on("tick", tick)
        .start();

// associate empty SVGs with link data. assign attributes.
    link = svg.selectAll(".link")
        .data(trivialGraph.links)
        .enter().append("line")
        .attr("class", "link");

// associate empty SVGs with node data. assign attributes. call force.drag to make them moveable.
    node = svg.selectAll(".node")
        .data(trivialGraph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 15)
        .style("fill", "#2fa0ef")
        .call(force.drag)
        .on("click", function(d) {
            if (vaccinateMode) {
                if (vaccineSupply <= 0) {
                    window.alert("Out of Vaccines!")
                    return;
                }
                d.status = "V";

                vaccineSupply--;
                numberVaccinated++;


                tutorialUpdate();
            }
        });

    d3.select(".guide")
        .attr("x",guideXCoord)
        .attr("y",guideYCoord)
        .attr("font-size", 28)
        .attr("opacity", 0)
        .text("Suppose this is you")

    centerElement(guide, "guide");

    d3.select(".guide")
        .transition()
        .duration(500)
        .attr("opacity", 1)


    d3.selectAll(".node").style("cursor", 'pointer');

    d3.select(".lessonText")
        .attr("opacity", 1)

    d3.select(".vaxLogoDiv")
        .style("visibility", "visible")

    d3.select(".vaxLogoDiv")
        .style("left", "-12px")

    createMenuBox(1);


}



function flashRedX() {
    if (xFlashCounter > 2) return;
    var opacities = [.15, 0.75];
    if (opacityIndex == 0) opacityIndex = 1;
    else { if (opacityIndex == 1) opacityIndex = 0;};
    d3.selectAll(".redX")
        .transition()
        .duration(750)
        .attr("opacity", opacities[opacityIndex]);
    xFlashCounter++;
    window.setTimeout(flashRedX, 750);
}

function unFixNodes(graph) {
    for (var i = 0; i < graph.nodes.length; i++) {
        if (graph.nodes[i].fixed == true) graph.nodes[i].fixed = false;
    }

//    d3.selectAll(".fixedVaxNode").remove()

}

function loadSyringe() {
    if (quarantineMode) hideQuarantine();
    d3.select(".actionVax").style("visibility", "visible");
    d3.select(".actionVax").style("right", 0);

    d3.select(".vaccineCounterText").remove()

    d3.select(".actionVax").append("text")
        .attr("class", "vaccineCounterText")
        .style("font-size", 16)
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "white")
        .text("")

    d3.select(".vaccineCounterText").text(vaccineSupply + " / " + vax)
}

function hideSyringe() {
    vaccinationMode = false;
    d3.select(".actionVax").style("right", "-200px")
    d3.select(".svg").style("cursor", 'pointer');
    d3.selectAll(".node").style("cursor", 'pointer');
    d3.select(".vaccineDepressedState").style("visibility", "hidden")
}

function loadQuarantine() {
    if (vaccinateMode) hideSyringe();

    quarantineMode = true;
    d3.select(".actionQuarantine").style("visibility", "visible");
    d3.select(".actionQuarantine").style("right", "0px");

    d3.select(".quarantineCounterText").remove()

    d3.select(".actionQuarantine").append("text")
        .attr("class", "quarantineCounterText")
        .style("font-size", 16)
        .style("font-family", "Nunito")
        .style("font-weight", 300)
        .style("fill", "white")
        .text("")

    d3.select(".quarantineCounterText").text("x" + numberQuarantined)

}

function hideQuarantine() {
    quarantineMode = false;
    d3.select(".actionQuarantine").style("right", "-200px")
    d3.select(".svg").style("cursor", 'pointer');
    d3.selectAll(".node").style("cursor", 'pointer');
    d3.select(".quarantineDepressedState").style("visibility", "hidden")
}

function flashNode() {
    var node = graph.nodes[0];
    if (currentFlash == 0) currentFlash = 1;
    else {
        if (currentFlash == 1) currentFlash = 0;
    }
    var availableColors = ["#d9d678", "#b7b7b7"]

    d3.selectAll(".node")
        .transition()
        .duration(500)
        .style("fill", function(d) {
            if (d.id == node.id) return availableColors[currentFlash];
            else return availableColors[1];
        })
    d3.selectAll(".node")
        .on("click", function(d) {
            if (d.id == node.id) {
                if (vaccinateMode) {
                    d.status = "V";
                    vaccineSupply--;
                    numberVaccinated++;
                    keepFlashing = false;

                    nextEnable = true;
                    backEnable = false;
                    resetBack();
                    resetNext();

                    tutorialUpdate();

                }
            }
        });
    if (keepFlashing) window.setTimeout(flashNode, 500);
}

function flashNodes() {
    var nodeA = graph.nodes[3];
    var nodeB = graph.nodes[5];
    var nodeC = graph.nodes[9];
    if (currentFlash == 0) currentFlash = 1;
    else {
        if (currentFlash == 1) currentFlash = 0;
    }
    var availableColors = ["#d9d678", "#b7b7b7"]
    d3.selectAll(".node")
        .transition()
        .duration(500)
        .style("fill", function(d) {
            if (d.id == 10 || d.id == 4 || d.id == 6) return availableColors[currentFlash];
            else return availableColors[1];
        })

    d3.selectAll(".node")
        .on("click", function(d) {
            if (d.id == 10 || d.id == 4 || d.id == 6) {
                if (vaccinateMode) {
                    d.status = "V";
                    vaccineSupply--;
                    numberVaccinated++;
                    keepFlashing = false;

                    nextEnable = true;
                    backEnable = false;
                    resetBack();
                    resetNext();

                    tutorialUpdate();

                }
            }
        });
    if (keepFlashing) window.setTimeout(flashNodes, 500);
}

function activateVaccinationMode() {
    vaccinateMode = true;
    d3.selectAll(".node").style("cursor", 'url(/assets/vax_cursor.cur)');
    d3.select(".svg").style("cursor", 'url(/assets/vax_cursor.cur)');
    vaccineResearched = true;
    intervention = true;
    d3.select(".vaccineCounterText")
        .text(vaccineSupply + " / " + vax);
    d3.select(".vaccineDepressedState").style("visibility", "visible")
}

function activateQuarantineMode() {

    friction = 0.9;
    vaccinateMode = false;
    quarantineMode = true;
    d3.selectAll(".node").style("cursor", 'url(/assets/vax_cursor.cur)');
    d3.select(".svg").style("cursor", 'url(/assets/vax_cursor.cur)');
    d3.select(".quarantineDepressedState").style("visibility", "visible")

    window.setTimeout(startQuarantineOutbreak, 500);
}

function startQuarantineOutbreak() {
    for (var i = 0; i < graph.nodes.length; i++) {
        graph.nodes.status = "S";
        graph.nodes.infectedBy = null;
        graph.nodes.exposureTimestep = null;
    }

    graph.nodes[5].status = "I";
    diseaseIsSpreading = true;
    timestep = 0;
    timeToStop = false;
    postInitialOutbreak = true;
    numberOfIndividuals = graph.nodes.length;
    quarantineUpdate();
}

function quarantineTimesteps() {
    console.log(timestep)
    exposureEdges = [];

    infection();
    stateChanges();
    newInfections = [];
    newInfections = updateExposures();
    xyCoords = getPathogen_xyCoords(newInfections);
    this.timestep++;
    detectCompletion();
    if (!timeToStop) {
        animateQuarantinePathogens_thenUpdate();
    }
    else {
        animateQuarantinePathogens_thenUpdate();
        nextEnable = true;
        resetNext();

    }
}

function redraw() {
    if (!quarantineMode) return;

    svg.attr("transform",
        "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")");
}

function quarantineUpdate() {
    var nodes = removeVaccinatedNodes(graph);
    var links = removeOldLinks(graph);

    graph.links = links;
    updateCommunities();



    force
        .nodes(nodes)
        .charge(charge)
        .friction(0.80)
        .links(links)
        .start();

    link = svg.selectAll("line.link")
        .data(links, function(d) { return d.source.id + "-" + d.target.id;});


    link.enter().insert("svg:line", ".node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // Exit any old links.
    link.exit().remove();

    // Update the nodes…
    node = svg.selectAll("circle.node")
        .data(nodes, function(d) { return d.id; })
        .attr("r", 8)
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#b7b7b7";
            if (d.status == "E") color = "#ef5555";
            if (d.status == "I") color = "#ef5555";
            if (d.status == "V") color = "#d9d678";
            return color;});

    // Enter any new nodes.
    node.enter().append("svg:circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 8)
        .style("fill", function(d) {
            var color = null;
            if (d.status == "S") color = "#b7b7b7";
            if (d.status == "E") color = "#ef5555";
            if (d.status == "I") color = "#ef5555";
            if (d.status == "V") color = "#d9d678";
            if (d.status == "Q") color = "#d9d678";

            return color;

        })
        .on("click", function(d) {
            if (!quarantineMode) return;

            if (d.status == "S") {
                d.status = "Q";
                quarantineUpdate();
                numberQuarantined++;
                d3.select(".quarantineCounterText").text("x" + numberQuarantined)
                quarantineTimesteps();
            }
        })
        .call(force.drag);

    // Exit any old nodes.
    node.exit().remove();

    d3.select(".quarantineCounterText").text("x" + numberQuarantined)


//    d3.select(".timestepText")
//        .text("Day: ")
//        .attr("opacity", 1)
//
//    d3.select(".timestepTicker")
//        .text(timestep)
//        .attr("opacity", 1);

}

function countSaved() {
    numberSaved = 0;
    for (var i = 0; i < graph.nodes.length; i++)  {
        if (graph.nodes[i].status == "Q" || graph.nodes[i].status == "S") numberSaved++;
    }
}

function initRecap() {

    // details - left
    d3.select(".svg").append("text")
        .attr("class", "networkSizeText")
        .attr("x", backX)
        .attr("y", 195)
        .text("Network Size: " + numberOfIndividuals);

    d3.select(".svg").append("text")
        .attr("class", "numberQuarantinedText")
        .attr("x", backX)
        .attr("y", 230)
        .text("Quarantined: " + numberQuarantined)

    d3.select(".svg").append("text")
        .attr("class", "numberVaccinatedText")
        .attr("x", backX)
        .attr("y", 265)
        .attr("opacity", 0) // <-- for now...
        .text("Vaccinated: " + numberVaccinated)


    var realTop, realBottom;
    var calcTop = 100;
    var calcBottom = 380;
    var calcSpace = calcBottom - calcTop;

    var infectedHeight = (1.00 - (numberSaved/numberOfIndividuals).toFixed(2)) * (calcSpace);
    var uninfectedHeight = (numberSaved/numberOfIndividuals).toFixed(2) * (calcSpace)


    // figure - center
    infectedBar = d3.select(".svg").append("rect")
        .attr("class", "infectedBar")
        .attr("x", 1200)
        .attr("y", 310)
        .attr("height", infectedHeight)
        .attr("width", 85)
        .attr("opacity", 0)
        .attr("fill", "#ef5555")

    centerElement(infectedBar, "infectedBar")
    infectedBar.attr("opacity", 1)
    infectedBar.attr("x", infectedBar.node().getBBox().x + 35)

    uninfectedBar = d3.select(".svg").append("rect")
        .attr("class", "uninfectedBar")
        .attr("x", 1200)
        .attr("y", 300)
        .attr("height", uninfectedHeight)
        .attr("width", 85)
        .attr("opacity", 0)
        .attr("fill", "#b7b7b7")


    centerElement(uninfectedBar, "uninfectedBar")

    uninfectedBar.attr("opacity", 1)
    uninfectedBar.attr("y", infectedBar.node().getBBox().height + 15)
    infectedBar.attr("y", infectedBar.node().getBBox().y + 10)

    centerElement(uninfectedBar, "uninfectedBar")
    uninfectedBar.attr("x", uninfectedBar.node().getBBox().x + 35)


    uninfectedBar.attr("opacity", 1)



    // legend - right
    d3.select(".svg").append("text")
        .attr("class", "uninfectedLegendText")
        .attr("x", backX + 550)
        .attr("y", 195)
        .text("Uninfected")

    d3.select(".svg").append("text")
        .attr("class", "infectedLegendText")
        .attr("x", backX + 550)
        .attr("y", 245)
        .text("Infected")

    d3.select(".svg").append("text")
        .attr("class", "uninfectedPercentage")
        .attr("x", backX + 675)
        .attr("y", 195)
        .text(Math.round(((numberSaved/numberOfIndividuals)*100)).toFixed(0) + "%")

    d3.select(".svg").append("rect")
        .attr("class", "uninfectedLegendBox")
        .attr("x", backX + 521)
        .attr("y", 177)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "#b7b7b7")

    d3.select(".svg").append("rect")
        .attr("class", "infectedLegendBox")
        .attr("x", backX + 521)
        .attr("y", 227)
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", "#ef5555")

}
