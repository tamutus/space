// Set the parameter for the projection width
const projectionWidth = 700; // unit: pixels

// Turn on the projector to set DOM elements 
const projector = turnOnProjector("project-ions");

function turnOnProjector(theaterID){
    const   theater = document.querySelector(`#${theaterID}`),
            projectionStrip = theater.querySelector(".projections"),
            projections = projectionStrip.querySelectorAll(".projection"),
            filmStills = theater.querySelectorAll(".still"),
            titles = [];
    projections.forEach(projection => {
        titles.push(projection.dataset.title); 
    });  
    filmStills.forEach(still => {
        $(still).on("click", () => {
            activate(still.dataset.title);
        });
    })
    // sectionSelection.forEach(section => {
    //     sectionTitles.push(section.dataset.title);
    // });
    // if(sectionTitles.length > 0){
    //     const tableOfContents = d3.select("body").append("div")
    //         .attr("id", "table-of-contents");
    //     tableOfContents.append("h4")
    //         .text("On this page:");
    //     const titleList = tableOfContents.append("ol");
    //     sectionTitles.forEach(title => {
    //         titleList.append("li")
    //             .text(title)
    //             .on("click", () => {
    //                 document.querySelector(`section[data-title="${title}"]`).scrollIntoView({
    //                     behavior: "smooth"
    //                 });
    //             });
    //     });
    // }
    function activate(title){
        console.log(title);
        $(projectionStrip).css("transform", `translateX(${titles.indexOf(title) * -1 * projectionWidth}px)`);
    }
    return {
        theater: theater,
        titles: titles,
        projections: projections,
        filmStills: filmStills,
        activate: activate
    }
}
console.log(projector.theater);
console.log(projector.titles);
console.log(projector.projections);
console.log(projector.filmStills);