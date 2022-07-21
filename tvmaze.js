"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${searchTerm}`);
  const backupImage = "https://tinyurl.com/tv-missing";

  return response.data.map(show => {
    return {
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary,
      image: show.show.image ? show.show.image.original : backupImage
    };
  });

}

/** Given list of shows, create markup for each and append to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return response.data.map(episode => {
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
    };
  });
}

/** pass in array of episode objects and populate it into the episode list id*/

function populateEpisodes(episodes) {
  console.log(episodes);
  $('#episodesArea').css('display', '');
  for (let episode of episodes) {
    $('#episodesList')
      .append(`<li>${episode.name}  (season ${episode.season}, number${episode.number})</li>`);

  }
}
/** handleEpisodeClick: handles the Episodes button click
 */
async function handleEpisodeClick(evt) {

  const showId = $(evt.target).parent().parent().parent().data('show-id');
  const episodes = await getEpisodesOfShow(showId);

  populateEpisodes(episodes);
}

/** add listener to episodes button */
$('#showsList').on('click', '.Show-getEpisodes', handleEpisodeClick);





