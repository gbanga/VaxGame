var menuColorFlash = true;
var colorIndex = 0;
var menuColors = ["#007138","#ffffff"];

function guideRails(back) {

    if (guideRailsPosition == 1) {

        d3.select(".backArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)

        d3.select(".lessonText")
            .transition()
            .duration(2000)
            .attr("opacity", 0)

        if (!back) addOneFriend();
        d3.selectAll(".node").style("cursor", 'pointer');


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("And this is you with one friend. The connection")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("represents contact between you two.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);
    }

    if (guideRailsPosition == 2) {
        if (!back) buildGraph();

        d3.selectAll(".node").style("cursor", 'pointer');


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now here are more friends who are connected to you and")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("to each other. This is your immediate contact group.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);
    }

    if (guideRailsPosition == 3) {
        d3.select(".backArrow").text("").attr("opacity", 0)
        d3.select(".nextArrow").text("Next: Epidemics >")
        charge = -400;
        if (!back) tutorialUpdate();
        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Your friends have friends, who would be strangers to you,")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("but together they make up your contact network.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);
        d3.selectAll(".node").style("cursor", 'pointer');
        removeDuplicateEdges(graph);


    }

    if (guideRailsPosition == 4) {
        removeDuplicateEdges(graph);
        d3.select(".lessonText").attr("opacity", 1)
            .text("LESSON 2: EPIDEMICS")

        d3.select("#networkSxn").attr("class","menuItemNormal")

        d3.select("#epidemicSxn").attr("class","menuItemBold")

        d3.select(".nextArrow").text("next >")


        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("But now, one of the strangers gets sick and the infection")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("starts to spread across the network...")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        var indexPatientID = Math.floor(Math.random() * numberOfIndividuals);
        graph.nodes[indexPatientID].status = "I";
        removeDuplicateEdges(graph);
        tutorialUpdate();

        diseaseIsSpreading=true;
        timeToStop = false;
        window.setTimeout(tutorialTimesteps, 2000);

//        d3.select(".timestepText").text("Day: ")
//        d3.select(".timestepTicker").text(timestep)

        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .text("")

        d3.select(".lessonText")
            .transition()
            .duration(3000)
            .attr("opacity", 0)
            .text("LESSON 2: EPIDEMICS")
    }

    if (guideRailsPosition == 5) {
        var img2 = svg.selectAll("image").data([0]);
        img2.enter()
            .append("image")
            .attr("xlink:href", "/assets/redX.svg")
            .transition()
            .duration(500)
            .attr("x", "280")
            .attr("y", "85")
            .attr("width", "450")
            .attr("height", "450")
            .attr("opacity", 0.6)
            .attr("class", "redX")

        flashRedX();

        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("next >")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("If no action is taken, then pretty soon")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("the entire network will be infected.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);
    }

    if (guideRailsPosition == 6) {
        d3.select(".redX").remove();
        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .text("next >")

        loadSyringe();
        vaccineSupply = 1;
        vax = 1;
        numberVaccinated = 0;

        d3.select(".backArrow").attr("opacity", 0).text("")
//
//        d3.select(".timestepText")
//            .transition()
//            .duration(500)
//            .attr("opacity", 0)
//
//        d3.select(".timestepTicker")
//            .transition()
//            .duration(500)
//            .attr("opacity", 0)
//            .text(timestep)

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Select the 'Vaccinate' tool in the upper right")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("then click the flashing node to vaccinate it.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        graph.nodes = [];
        graph.links = [];

        // reset all node attributes after outbreak simulation
        for (var i = 0; i < tailoredNodes.length; i++) {
            tailoredNodes[i].status = "S";
            tailoredNodes[i].infectedBy = null;
            tailoredNodes[i].exposureTimestep = null;
        }

        // add the highest degree node only, to illustrate single vaccination
        graph.nodes.push(tailoredNodes[2]);

        // add its neighbors
        graph.nodes.push(tailoredNodes[14-13])
        graph.nodes.push(tailoredNodes[16-13])
        graph.nodes.push(tailoredNodes[21-13])
        graph.nodes.push(tailoredNodes[22-13])
        graph.nodes.push(tailoredNodes[23-13])
        graph.nodes.push(tailoredNodes[24-13])
        graph.nodes.push(tailoredNodes[25-13])

        // add only the links that are connected to the highest degree node
        for (var i = 0; i < tailoredLinks.length; i++) {
            var link = tailoredLinks[i];
            if (link.source.id == tailoredNodes[2].id || link.target.id == tailoredNodes[2].id) {
                graph.links.push(link);
            }
        }
        removeDuplicateEdges(graph);
        tutorialUpdate();
        flashNode();
    }

    if (guideRailsPosition == 7) {
        keepFlashing = false;
        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("next >")

        d3.select(".backArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("< Instant Replay!")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("When we vaccinate a node,")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("it is removed because it cannot be infected.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        removeDuplicateEdges(graph);
        tutorialUpdate();
    }

    if (guideRailsPosition == 8) {
        d3.select(".backArrow").attr("opacity", 0).text("< back")
        d3.select(".nextArrow").attr("opacity", 0).text("next >")

        keepFlashing=true;
        loadSyringe();
        vaccineSupply = 1;
        numberVaccinated = 0;
        charge = -300;

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now let's separate this network into two groups")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("by vaccinating any of the flashing nodes.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);


        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        graph.nodes = [];
        graph.links = [];

        for (var i = 0; i < weakTieNodes.length; i++) {
            graph.nodes.push(weakTieNodes[i]);
        }

        for (var ii = 0; ii < weakTieLinks.length; ii++) {
            graph.links.push(weakTieLinks[ii]);
        }

        // remove nodes w/o edges
        for (var iv = 0; iv < graph.nodes.length; iv++) {
            var counter = 0;
            var node = graph.nodes[iv];
            for (var iii = 0; iii < graph.links.length; iii++) {
                var link = graph.links[iii];
                if (link.source.id == node.id || link.target.id == node.id) counter++;
            }
            if (counter == 0) graph.nodes.splice(iv, 1);
        }
        removeDuplicateEdges(graph);
        tutorialUpdate();
        flashNodes();
    }

    if (guideRailsPosition == 9) {
        vaccinateMode = false;

        d3.selectAll(".node")
            .attr("r", 8)
            .style("fill", "#b7b7b7")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now if an outbreak were to occur,")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("it would not spread to both groups.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".nextArrow").attr("opacity", 1).text("Next: Vaccines >")

        d3.selectAll(".node").style("fill", "#b7b7b7")

    }

    if (guideRailsPosition == 10) {
        hideSyringe();
        vaccinateMode = false;
        timeToStop = true;
        d3.select(".vaccineDepressedState").style("visibility", "hidden")

        d3.select(".backArrow")
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .text("")


        d3.select(".lessonText")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("LESSON 3: VACCINES")

        d3.select("#epidemicSxn").attr("class","menuItemNormal")
        d3.select("#vaccineSxn").attr("class","menuItemBold")

        graph.nodes = [];
        graph.links = [];

        for (var i = 0; i < tailoredNodes.length; i++) {
            graph.nodes.push(tailoredNodes[i]);
            graph.nodes[i].status = "S";
            graph.nodes[i].infectedBy = null;
            graph.nodes[i].exposureTimestep = null;
        }

        for (var ii = 0; ii < tailoredLinks.length; ii++) {
            graph.links.push(tailoredLinks[ii]);
        }

        d3.selectAll(".node")
            .on("click", function(d) {
                if (vaccinateMode) {
                    if (vaccineSupply <= 0) {
                        window.alert("Out of Vaccines!")
                        return;
                    }
                    d.status = "V";
//                    d.fixed = true;
                    d3.select(this)
//                        .attr("class", "vaxNode")
                        .style("fill", "#d9d678")
//                    vaccinatedBayStartYCoord += 25;
                    vaccineSupply--;
                    numberVaccinated++;

                    if (vaccineSupply == 2) {
                        guideRailsPosition++;
                        guideRails();
                    }

                    if (vaccineSupply == 0 && intervention) {
                        guideRailsPosition++;
                        guideRails();
                    }
                    removeDuplicateEdges(graph);
                    tutorialUpdate();
                }});

        removeDuplicateEdges(graph);
        tutorialUpdate();

//        d3.select(".timestepText")
//            .transition()
//            .duration(500)
//            .attr("opacity", 0)
//
//        d3.select(".timestepTicker")
//            .transition()
//            .duration(500)
//            .attr("opacity", 0)
//            .text(timestep)

        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("next >")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now let's look at the original network again, but this time")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("we'll use vaccines to break up the network.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        vaccinateMode = false;
    }

    if (guideRailsPosition == 11) {
        vaccineSupply = 3;
        vax = 3;


        d3.select(".lessonText")
            .transition()
            .duration(1000)
            .attr("opacity", 0)
            .text("LESSON 3: VACCINES")

        loadSyringe();

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Select the 'Vaccinate' tool in the upper right and select")

        vaccineSupply = 3;
        diseaseIsSpreading = false;
        postInitialOutbreak = true;

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("nodes to vaccinate. You only get " + vaccineSupply + " vaccines, so choose wisely.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".nextArrow").attr("opacity", 0).text("")
    }

    if (guideRailsPosition == 12) {
        d3.select(".backArrow").attr("opacity", 1).text("< Clear Vaccinations")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("When you vaccinate a node, they are effectively removed from")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("the network because they can no longer spread the infection.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);
    }

    if (guideRailsPosition == 13) {
        d3.select(".backArrow").attr("opacity", 1).text("< Clear Vaccinations")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Vaccinating breaks the network into smaller pieces")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("making it less likely for an infection to spread to every node.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".nextArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("next >")
    }

    if (guideRailsPosition == 14) {
        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now, when an infection spreads, it is more likely")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("to be confined to a smaller network.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        var numberOfPeople = graph.nodes.length;
        do{
            var randomIndex = Math.floor(Math.random() * numberOfPeople);
            var indexCase = graph.nodes[randomIndex];
        }
        while (indexCase.status == "V");

        indexCase.status = "I";
        diseaseIsSpreading = true;
        timestep = 0;
        timeToStop = false;
        postInitialOutbreak = false;
        finalStop = true;
//
//        d3.select(".timestepText")
//            .transition()
//            .duration(500)
//            .attr("opacity", 1)
//
//        d3.select(".timestepTicker")
//            .transition()
//            .duration(500)
//            .attr("opacity", 1)
//            .text(timestep)

        tutorialTimesteps();
    }

    if (guideRailsPosition == 15) {
        d3.select(".lessonText")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("LESSON 3: QUARANTINE")

        finalStop = false;
//        d3.selectAll(".fixedVaxNode").remove()
        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Now we'll look at actions that can be taken after an infection")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("has begun to spread.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        graph = {};
        graph.nodes = [];
        graph.links = [];

        graph = generateSmallWorld(35, 0.12, 4)
        removeDuplicateEdges(graph);

        for (var i = 0; i < graph.nodes.length; i++) {
            graph.nodes[i].status = "S";
        }

        quarantineUpdate();

//        d3.select(".timestepText").attr("opacity", 0)
//        d3.select(".timestepTicker").attr("opacity", 0)
        d3.select(".backArrow").text("").attr("opacity", 0)

        vax = 0;
        vaccineSupply = 0;


    }

    if (guideRailsPosition == 16) {
        d3.select(".backArrow")
            .transition()
            .duration(500)
            .attr("opacity", 1)
            .text("< back")

        d3.select(".lessonText")
            .transition()
            .duration(2000)
            .attr("opacity", 0)
        hideSyringe();
        loadSyringe();

        d3.select("#quarantineSxn").attr("class","menuItemBold")
        d3.select("#vaccineSxn").attr("class","menuItemNormal")

        d3.select(".backArrow").text("< back")
        d3.select(".nextArrow").text("next >")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Vaccines take time to 'kick in' so they're ineffective")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("if an infection has already begun to spread.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

    }

    if (guideRailsPosition == 17) {
        d3.select(".lessonText")
            .transition()
            .duration(1000)
            .attr("opacity", 0)

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Quarantining is a way to immediately remove nodes that")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("are likely to be infected during an epidemic outbreak.")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);


    }

    if (guideRailsPosition == 18) {
        hideSyringe();
        loadQuarantine();

        d3.select(".nextArrow").attr("opacity", 0).text("")

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Select the 'Quarantine' tool in the upper right and click nodes to")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("quarantine. You're racing against the infection so act fast!")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

    }

    if (guideRailsPosition == 19) {
        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text("Pretty tough right? Let's see how many you saved...")

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text("")

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".nextArrow").attr("opacity", 1).text("next >")
    }

    if (guideRailsPosition == 20) {
        countSaved();
        var totalNodes = graph.nodes.length;

        graph = {};
        graph.nodes = [];
        graph.links = [];
        quarantineUpdate();

//        d3.select(".timestepTicker").attr("opacity", 0)
//        d3.select(".timestepText").attr("opacity", 0)


        var modifier = ".";
        if (((numberSaved/totalNodes)*100) > 50) modifier = "!";

        var string = "Congratulations! You saved " + numberSaved + " people. That's about " + ((numberSaved/totalNodes)*100).toFixed(0) + "%" + modifier;
        var graphExplainString = "This represents how effective you were at containing the outbreak.";

        if (numberSaved == 1) {
            string = "";
            graphExplainString = "You only saved one person... ಠ_ಠ";
        }

        if (numberSaved >= totalNodes - 1) {
            graphExplainString = "Did you cheat? ಠ_ಠ";
            string = "";
        }

        d3.select(".guide")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord)
            .attr("opacity", 0)
            .text(graphExplainString)

        d3.select(".guide2")
            .attr("x", guideXCoord)
            .attr("y", guideYCoord + guide2YCoordChange)
            .attr("opacity", 0)
            .text(string)

        centerElement(guide, "guide");
        centerElement(guide2, "guide2");

        d3.select(".guide")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select(".guide2")
            .transition()
            .duration(500)
            .attr("opacity", 1);

        d3.select("#quarantineSxn")
            .attr("class","menuItemNormal")

        d3.select(".nextArrow")
            .attr("opacity", 1)
            .attr("x", 575)
            .text("Full Game >>")
            .on("click", function() {
                window.location.href = 'http://vax.herokuapp.com/game'
            })

        d3.select("#gameLink")
            .attr("class","menuItemBold")

        d3.select(".backArrow")
            .attr("opacity", 1)
            .text("<< Start Over")
            .attr("x", 345)
            .on("click", function() {
                window.location.href = 'http://vax.herokuapp.com/'
            })

        initRecap();


        menuColors = ["#007138","#ffffff"];
        window.setInterval(flashFullGame, 300);
    }

}

function flashFullGame() {

    if (menuColorFlash) colorIndex = 0;
    else colorIndex = 1;

    d3.select("#gameLink").style("color", menuColors[colorIndex])

    menuColorFlash = !menuColorFlash;

}