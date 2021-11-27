/*

Card:

image?           og:image | twitter:image
title            og:title | twitter:title
description      og:description | twitter:description
reading-time?    article:reading_time
publish-date?    article:publish_date

*/
document.addEventListener('DOMContentLoaded',() => {
  // handle DOMContentLoaded event
  document.querySelectorAll('a[href$="cardify"]').forEach(link => processLink(link));
});

function processLink(link) {  
  fetch(link)
    .then(response => response.text())
    .then(html => scrapePage(html, link));
}

const urlSel = 'meta[property="og:url"],meta[name="twitter:url"]';
const imgSel = 'meta[property="og:image"],meta[name="twitter:image"]';
const titleSel = 'meta[property="og:title"],meta[name="twitter:title"]';
const descSel = 'meta[property="og:description"],meta[name="twitter:description"]';
const readingTimeSel = 'meta[name="article:reading_time"]';
const publishDateSel = 'meta[property="article:published_time"]';

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