window.onload = () => {
    const courtContainer = document.getElementById("court-container");
    const courtSvg = basketballCourt({ width: 600, type: "nba", fullCourt: true }).toDom();
    courtSvg.id = "court";
    courtContainer.appendChild(courtSvg);
    const totalSpan = document.getElementById("total");
    const makesSpan = document.getElementById("makes");
    const missesSpan = document.getElementById("misses");
    const fgSpan = document.getElementById("fg");
    const resetBtn = document.getElementById("reset-btn");

    // Load saved shots from localStorage
    const savedShots = JSON.parse(localStorage.getItem("shotData")) || [];

    updateStats(savedShots);

    // Redraw saved shots on the court
    savedShots.forEach(drawShot);

    // click to log new shot
    courtSvg.addEventListener("click", (e) => {
        // get SVG coordinate system
        const pt = courtSvg.createSVGPoint();

        // assign mouse position to point
        pt.x = e.clientX;
        pt.y = e.clientY;

        // convert to SVG coordinates using the current transorm matrix
        const svgPoint = pt.matrixTransform(courtSvg.getScreenCTM().inverse());

        const result = prompt("Shot result? 'make' or 'miss':");

        if (result === 'make' || result === 'miss') {
            const shot = {
                x: svgPoint.x,
                y: svgPoint.y,
                result,
                timestamp: Date.now(),
            };

            savedShots.push(shot);
            localStorage.setItem("shotData", JSON.stringify(savedShots));
            drawShot(shot);

            updateStats(savedShots);
        } else {
            alert("Invalid input. Please type 'make' or 'miss'.")
        }

        //log it
        console.log(`Shot at: x = ${svgPoint.x.toFixed(2)}, y = ${svgPoint.y.toFixed(2)}`);
    });

    // Draw a shot on the SVG
    function drawShot({x, y, result}) {
        const shot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        shot.setAttribute("cx", x);
        shot.setAttribute("cy", y);
        shot.setAttribute("r", 5);
        shot.setAttribute("fill", result === 'make' ? "var(--make-color)" : "var(--miss-color)");
        shot.setAttribute("opacity", 0.8);
        courtSvg.appendChild(shot);
    }

    function updateStats(data) {
        const total = data.length;
        const makes = data.filter(s => s.result === "make").length;
        const misses = data.filter(s => s.result === "miss").length;
        const fg = total > 0 ? ((makes / total) * 100).toFixed(1) + "%" : "0%";

        totalSpan.textContent = total;
        makesSpan.textContent = makes;
        missesSpan.textContent = misses;
        fgSpan.textContent = fg;
    }

    resetBtn.addEventListener("click", () => {
        localStorage.removeItem("shotData");
        courtSvg.querySelectorAll("circle").forEach(c => c.remove());
        savedShots.length = 0;
        updateStats(savedShots);
    })

    document.querySelectorAll("#filters button[data-filter]").forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");
            courtSvg = querySelectorAll("circle").forEach(c => c.remove());

            const filteredShots = filter === "all"
            ? savedShots
            : savedShots.filter(shot => shot.result === filter);

            filteredShots.forEach(drawShot);
            updateStats(filteredShots);
        });
    });

    const exportBtn = document.getElementById("export-btn");

    exportBtn.addEventListener("click", () => {
        if (savedShots.length === 0) {
            alert("No shots to export.");
            return;
        }

        const header = ["x", "y", "result", "timestamp"];
        const rows = savedShots.map(s =>
            [s.x.toFixed(2), s.y.toFixed(2), s.result, new Date(s.timestamp).toISOString()]
        );
        const csvContent = 
            [header, ...rows]
                .map(row => row.join(","))
                .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv"});
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "shot_data.csv";
        a.click();

        URL.revokeObjectURL(url);
    });

    const courtLines = courtSvg.querySelectorAll("line, circle, path");
    courtLines.forEach(el => {
        el.setAttribute("stroke", "var(--court-line)");
        el.setAttribute("stroke-width", "2");
    });
};