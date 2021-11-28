/*

Card:

image?           og:image | twitter:image
title            og:title | twitter:title
description      og:description | twitter:description
reading-time?    article:reading_time
publish-date?    article:publish_date

*/

// Fetch the parameterized flag values
const queryCards = {{ site.Params.Theme.Cardify.QueryCards }};
const queryString = 'cardify';
const hostMatchCards = {{ site.Params.Theme.Cardify.HostMatchCards }};
const hostname = "{{ (urls.Parse site.BaseURL).Host | lower }}";

// Add the event listener for a loaded DOM
document.addEventListener('DOMContentLoaded',() => {
  
  // Return if we aren't meant to be generating cards
  if !(queryCards || hostMatchCards) { return; }
  
  // Check whether we're only processing query tagged links
  else if (queryCards && !hostMatchCards) {
    
    document.querySelectorAll(`a[href$="${queryString}"]`)
            .forEach(link => processLink(link));
          
  }
  
  // Fetch query tagged and host matched links
  else {
    
    // Create a set to hold cardifiable links
    let links = new Set();
    
    document.links.forEach(link => {
      
      // Create a URL object from the provided link
      let url = new URL(link);
      
      // Check whether the query string is present
      // or the host name is match
      if (   url.search.includes(queryString)
          || url.hostname.toLowerCase() == hostname) {
        
        // Add the link to the set of links
        links.add(link)
        
      }
      
    }); // document.links.forEach
    
    // Process any links we've gathered
    links.forEach(link => processLink(link));
    
  }
  
  
}); // document.addEventListener

// Fetches page text and feeds it to scrapePage(html, link)
function processLink(link) {  
  fetch(link)
    .then(response => response.text())
    .then(html => scrapePage(html, link));
}

// Selectors used to match meta tags
const urlSel = 'meta[property="og:url"],meta[name="twitter:url"]';
const imgSel = 'meta[property="og:image"],meta[name="twitter:image"]';
const titleSel = 'meta[property="og:title"],meta[name="twitter:title"]';
const descSel = 'meta[property="og:description"],meta[name="twitter:description"]';
const readingTimeSel = 'meta[name="article:reading_time"]';
const publishDateSel = 'meta[property="article:published_time"]';

// Creates a DOM from the provided HTML text, 
// queries for meta tags, and replaces the provided link
// with a new div element containing child elements
// displaying the information fetched from the meta tags.
function scrapePage(html, link) {
    	// Convert the HTML string into a document object
  	var parser = new DOMParser();
  	var page = parser.parseFromString(html, 'text/html'); 
    let urlTag = page.querySelector(urlSel);   
    let imgTag = page.querySelector(imgSel);
    let titleTag = page.querySelector(titleSel);
    let descTag = page.querySelector(descSel);
    let readingTimeTag = page.querySelector(readingTimeSel);
    let publishDateTag = page.querySelector(publishDateSel);
    
    var url = null, img = null, title = null, desc = null;
    var readingTime = null, publishDate = null;
    
    if (publishDateTag) { publishDate = publishDateTag.content;; }
    if (readingTimeTag) { readingTime = readingTimeTag.content; }
    if (descTag) { desc = descTag.content.trim(); }
    if (titleTag) { title = titleTag.content.trim(); }
    if (imgTag) { img = imgTag.content; }
    if (urlTag) { url = urlTag.content; }

    if (url && title && desc) {
      
      let cardDiv = document.createElement("div");
      cardDiv.className = "card cardify-card";
      
      if (img) {
        let cardImg = document.createElement("img");
        cardImg.src = img;
        cardImg.className = "card-img-top";
        cardDiv.appendChild(cardImg);
      }
      
      let cardBody = document.createElement("div");
      cardBody.className = "card-body";
      cardDiv.appendChild(cardBody);
      
      let cardTitle = document.createElement("h3");
      cardTitle.className = "card-title";
      cardTitle.innerText = title;
      cardBody.appendChild(cardTitle);
      
      let cardDescription = document.createElement("p");
      cardDescription.className = "card-text";
      cardDescription.innerText = desc;
      cardBody.appendChild(cardDescription);
      
      let cardLink = document.createElement("a");
      cardLink.className = "stretched-link";
      cardLink.href = url;
      cardBody.appendChild(cardLink);
      
      if (readingTime || publishDate) {
        
        let cardMutedText = document.createElement("p");
        cardMutedText.className = "card-text";
        cardBody.appendChild(cardMutedText);
        
        if (readingTime) {
          let readingTimeElement = document.createElement("small");
          readingTimeElement.className = "reading-time text-muted";
          let value = parseInt(readingTime);
          let units = `minute${value > 1 ? 's' : ''}`;
          readingTimeElement.innerText = `${value} ${units}`;
          cardMutedText.appendChild(readingTimeElement);          
        }
        
        if (publishDate) {
          let publishDateElement = document.createElement("small");
          publishDateElement.className = "publish-date";
          publishDateElement.innerText = publishDate;
          cardMutedText.appendChild(publishDateElement);
        }

      }

      let parentNode = link.parentNode;
      if (cardDiv && parentNode) {
        parentNode.replaceChild(cardDiv, link);
      }
    }
    
}