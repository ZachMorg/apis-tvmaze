"use strict";

const $showsList = $("#showsList");
const $episodesList = $('#episodesList');
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  let res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  return res.data;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.show.image.medium}
              alt=${show.show.name}
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
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

$showsList.on('click', '.Show-getEpisodes', getAndPopulateEpisodes);


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  return res.data;
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesList.empty();
  $episodesArea.show();
  let episodeInfo = episodes.map(epi => ({
    id: epi.id,
    name: epi.name,
    season: epi.season,
    number: epi.number
  }));
  for(let episode of episodeInfo){
    const entry = $(
      `<li>
        ${episode.name}(season ${episode.season}, episode ${episode.number})
        </li>`
    );
    $episodesList.append(entry);
  }
}


async function getAndPopulateEpisodes(e){
  const showID = $(e.target).closest('.Show').data('show-id');
  const episodes = await getEpisodesOfShow(showID);
  populateEpisodes(episodes);
}