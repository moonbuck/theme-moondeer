{{ with .Scratch.Get "plugin-table-of-contents.Parameters" -}}

/*
  Symbols used for property storage.
*/

// Symbol used to store the backrop element in the document object.
const BACKDROP_ELEMENT = Symbol('{{ .Specifiers.BackdropID }}');

// Symbol used to store the TOC container in the document object.
const CONTAINER_ELEMENT = Symbol('{{ .Specifiers.ContainerID }}');

// Symbol used to store TOC visibility state in the document object.
const VISIBLE = Symbol();

// Symobl used to store the swipe gesture in the document body.
const GESTURE = Symbol();

// Whether to disallow static insertion.
const ALWAYS_OFFSCREEN = true;

/*
  Use the DOMContentLoaded event as the hook for inserting the TOC.
*/
document.addEventListener('DOMContentLoaded', () => {
  
  // Establish a parent for the TOC container.
  let parent = document.querySelector('{{ .Config.ContainerParent }}') ?? document.body;

  // Create the container.
  let container = createTOCContainer();
  
  // Configure components.
  configureComponents(parent, container);
  
  // Insert the container.
  parent.prepend(container);
  
});

/* 
  Configure components for an offscreen or static TOC.
*/
function configureComponents(parent, toc) {
  
  // Get the parent's geometry to assess available space.
  let geometry = parent.getBoundingClientRect();
    
  // Check whether the TOC fits inside its container
  // and we're flagged to allow for static insertion.
  // If so, just return.
  if (   geometry.width >= {{ .Style.Variables.TOCWidth }} 
      && !ALWAYS_OFFSCREEN) 
  { 
    return; 
  }
  
  // Prepend the backdrop.
  parent.prepend(createBackdrop());
  
  // Add the offscreen class to the container for CSS transforms.
  toc.className = '{{ .Specifiers.OffscreenClassName }}';
  
  // Initialize the property storing visibility state.
  document[VISIBLE] = false;
  
  // Insert the button for toggling the TOC.
  let toggleParent = document.querySelector('{{ .Config.ToggleParent }}');
  toggleParent?.append(createTOCToggle());
  
  // Hide the TOC on selection.
  window.onhashchange = () => hideTOC();
        
  // Only add the swipe gesture for touch screen devices.
  if ('ontouchstart' in window) 
  {
    document.body[GESTURE] = 
        new SwipeGesture(document.body, showTOC, [LEFT_EDGE]);
  }
  
}


function showTOC() {
  
  // Ensure the table of contents is not already visible.
  if (document[VISIBLE]) { return; }
  
  // Retrieve the backdrop.
  let backdrop = document[BACKDROP_ELEMENT];
    
  // Configure the backdrop for visibility.
  backdrop.classList.add('{{ .Specifiers.ShowClassName }}');
  
  // Retrieve the container.
  let container = document[CONTAINER_ELEMENT];
  
  // Configure the container for visibility.
  container.removeAttribute('aria-hidden');
  container.setAttribute('aria-modal', true);
  container.setAttribute('role', 'dialog');
  container.classList.add('{{ .Specifiers.ShowClassName }}');
  
  // Update the property storing the state.
  document[VISIBLE] = true;
  
}

function hideTOC() {
  
  // Ensure the table of contents is actually visible.
  if (!document[VISIBLE]) { return; }
  
  // Retrieve the backdrop.
  let backdrop = document[BACKDROP_ELEMENT];
    
  // Configure the backdrop for invisibility.
  backdrop.classList.remove('{{ .Specifiers.ShowClassName }}');
  
  // Retrieve the container.
  let container = document[CONTAINER_ELEMENT];
  
  // Configure the container for invisibility.
  container.setAttribute('aria-hidden', true);
  container.removeAttribute('aria-modal');
  container.removeAttribute('role');
  container.classList.remove('{{ .Specifiers.ShowClassName }}');
  
  // Update the property storing the state.
  document[VISIBLE] = false;
  
}

/* 
  Create the HTML element that will serve as the TOC container.
*/
function createTOCContainer() {
  let container = document.createElement('DIV');
  
  // Store the element for easy access.
  document[CONTAINER_ELEMENT] = container;
  
  // Set the ID.
  container.id = '{{ .Specifiers.ContainerID }}';
  
  // Remove the container from tab navigation.
  container.tabIndex = '-1';
  
  // Specify its label.
  container.setAttribute('aria-labelledby', '{{ .Specifiers.TitleID }}');
  
  // Append the header.
  container.append(createHeader());
  
  // Append the entries.
  container.append(createTOCBody());
  
  return container;
}

/*
  Create the backdrop used when configured for an
  offscreen TOC.
*/
function createBackdrop() {
  // Create the backdrop.
  let backdrop = document.createElement('DIV');
  
  // Store the element for easy access.
  document[BACKDROP_ELEMENT] = backdrop;
  
  // Set the ID.
  backdrop.id = '{{ .Specifiers.BackdropID }}';
  
  // Give it the fade class so it's initially hidden.
  backdrop.className = '{{ .Specifiers.FadeClassName }}';
  
  // Add a handler for touches/clicks.
  backdrop.onclick = () => hideTOC();
    
  return backdrop;
}

/*
  Create TOC header element.
*/
function createHeader() {
  // Create the header element
  let header = document.createElement('HEADER');
  header.id = '{{ .Specifiers.HeaderID }}';
  
  // Append the title to the header and the header to the container.
  header.append(createTitle());
  
  header.append(createCloseButton());
  
  return header;
}

/* 
  Create the TOC heading.
*/
function createTitle() {
  // Create the table of contents title.
  let title = document.createElement('H2');
  title.id = '{{ .Specifiers.TitleID }}';
  title.innerHTML = `<nobr>{{ .Config.TitleText }}</nobr>`;
  return title;
}

/*
  Create the close button used to hide the TOC on small screens.
*/
function createCloseButton() {
  // Create the button.
  let button = document.createElement('BUTTON');
  button.id = '{{ .Specifiers.CloseButtonID }}';
  button.type = 'button';
  button.onclick = () => hideTOC();
  
  // Create the SVG icon.
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', true);
  svg.setAttribute('focusable', false);
  svg.setAttribute('role', 'img');
  svg.setAttribute('viewBox', '0 0 512 512');
  
  let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.append(g);
  
  let secondaryPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  secondaryPath.className = 'secondary';
  secondaryPath.setAttribute('fill', 'currentColor');
  secondaryPath.setAttribute('opacity', 0.4);
  secondaryPath.setAttribute('d', '\
M464 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 \
48h416a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48zm-83.6 \
290.5a12.31 12.31 0 0 1 0 17.4l-40.5 40.5a12.31 12.31 \
0 0 1-17.4 0L256 313.3l-66.5 67.1a12.31 12.31 0 0 \
1-17.4 0l-40.5-40.5a12.31 12.31 0 0 1 \
0-17.4l67.1-66.5-67.1-66.5a12.31 12.31 0 0 1 \
0-17.4l40.5-40.5a12.31 12.31 0 0 1 17.4 0l66.5 67.1 \
66.5-67.1a12.31 12.31 0 0 1 17.4 0l40.5 40.5a12.31 \
12.31 0 0 1 0 17.4L313.3 256z');

  g.append(secondaryPath);
  
  let primaryPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  primaryPath.className = 'primary';
  primaryPath.setAttribute('fill', 'currentColor');
  primaryPath.setAttribute('d', '\
M380.4 322.5a12.31 12.31 0 0 1 0 17.4l-40.5 \
40.5a12.31 12.31 0 0 1-17.4 0L256 313.3l-66.5 \
67.1a12.31 12.31 0 0 1-17.4 0l-40.5-40.5a12.31 \
12.31 0 0 1 0-17.4l67.1-66.5-67.1-66.5a12.31 12.31 \
0 0 1 0-17.4l40.5-40.5a12.31 12.31 0 0 1 17.4 0l66.5 \
67.1 66.5-67.1a12.31 12.31 0 0 1 17.4 0l40.5 \
40.5a12.31 12.31 0 0 1 0 17.4L313.3 256z');

  g.append(primaryPath);
  button.append(svg);

  return button;
}

/* 
  Create the TOC body.
*/
function createTOCBody() {
  // Create the <nav> element that will contain the links.
  let body = document.createElement('NAV');
  body.id = '{{ .Specifiers.BodyID }}';
  
  // Fetch eligible headings for link generation.
  let headings = document
    .querySelectorAll([2,3,4,5,6]
                      .map(i => `{{ .Config.SourceSandbox }} h${i}[id]`)
                      .join(','));
    
  // Create an array for section number tallying.
  let sectionNumbers = [0,0,0,0,0];
  
  // Iterate the headings, which should all have IDs courtesy of
  // the selector used to fetch them.
  for (let heading of headings) {
   
    // Parse the heading level, subtracting one as we 
    // never include <h1> headings.
    let level = parseInt(heading.tagName.charAt(1)) - 1;
    
    // Increment the number for this level.
    sectionNumbers[level - 1]++;
    
    // Zero out lower section numbers.
    for (let i = level; i < sectionNumbers.length; i++) { 
      sectionNumbers[i] = 0; 
    }
    
    // Generate the section number.
    let sectionNumber = sectionNumbers.slice(0, level).join('.');
    
    // Create the entry.
    let entry = document.createElement('DIV');
    entry.classList.add('{{ .Specifiers.TOCEntryClassName }}');
    entry.classList.add(`${'{{ .Specifiers.LevelClassNamePrefix }}'}${level}`);
        
    // Create the number element.
    let number = document.createElement('SPAN');
    number.innerHTML = sectionNumber;
    number.className = '{{ .Specifiers.SectionNumberClassName }}';
    
    // Create the anchor element.
    let link = document.createElement('A');
    link.href = `#${heading.id}`;
    link.innerHTML = heading.innerHTML;
    
{{ if .Config.SectionNumbers -}} 
    entry.append(number); 
{{- end }}
    
    entry.append(link);
        
    // Append the anchor to the <nav> element.
    body.append(entry);
    
{{ if .Config.InjectSectionNumbers -}}
    // Insert the section number into the heading.
    let injectedNumber = document.createElement('SPAN');
    injectedNumber.textContent = sectionNumber;
    injectedNumber.className = '{{ .Specifiers.InjectedSectionNumberClassName }}';
    heading.prepend(injectedNumber);
{{- end }}
    
  }  
  
  return body;
}

/*
  Create the toggle button.
*/
function createTOCToggle() {
  
  // Create the button.
  let toggle = document.createElement('BUTTON');
  
  // Set the ID.
  toggle.id = '{{ .Specifiers.ToggleID }}';
  
  // Set the type.
  toggle.type = 'button';
  
  // Set the button's text.
  toggle.innerHTML = '{{ .Config.ToggleText }}';
  
  // Connect the button to the element it controls.
  toggle.setAttribute('aria-controls', '{{ .Specifiers.ContainerID }}');
  
  // Configure the button action.
  toggle.onclick = () => document[VISIBLE] ? hideTOC() : showTOC();
    
  return toggle;  
}

class Touch {
  
  constructor() {    
    this.isDown = false;
    this.inLeft = false;
    this.inRight = false;
    this.timestamp = null;    
  }
  
}

class Threshold {
  
  constructor(width, ms) {    
    this.width = width;
    this.start = 0.2 * width;
    this.end = 0.3 * width;
    this.ms = ms;    
  }
  
  resize(width) {    
    this.width = width;
    this.start = 0.2 * width;
    this.end = 0.3 * width;    
  }
  
}

const LEFT_EDGE = Symbol();
const RIGHT_EDGE = Symbol();
const EDGES = new Set([LEFT_EDGE, RIGHT_EDGE]);

/*
  An object for tracking left to right swiping touches 
  with associated action invocation.
*/
class SwipeGesture {
  
  constructor(element, action, edges = EDGES) {
    
    this.element = element;
    this.action = action;
    this.threshold = new Threshold(window.innerWidth, 500);
    this.touch = new Touch();
    this.edges = new Set([...edges].filter(edge => EDGES.has(edge)));
    
    document.addEventListener('resize', () => {      
      this.threshold.resize(window.innerWidth)
    });
    
    element.addEventListener('touchstart', event => {
      
      let x = event.touches[0].pageX;
      this.touch.isDown = true;
      this.touch.timestamp = performance.now();
      
      if (this.edges.has(LEFT_EDGE) && x < this.threshold.start) {
        this.touch.inLeft = true;
      }
      
      else if (this.edges.has(RIGHT_EDGE) && x > this.threshold.width - this.threshold.start) {
        this.touch.inRight = true;
      }
      
    });
    
    element.addEventListener('touchmove', event => {
      
      let x = event.touches[0].pageX;
      
      if (this.touch.inLeft && x > this.threshold.end) {
        this.touch.inLeft = false;
        
        if (performance.now() - this.touch.timestamp < this.threshold.ms) {
          this._action?.('inLeft');
        }
      } 
      
      else if (this.touch.inRight && x < this.threshold.width - this.threshold.end) {
        this.touch.inRight = false;
        
        if (performance.now() - this.touch.timestamp < this.threshold.ms) {
          this._action?.('inRight');
        }
      }
      
            
    });

    element.addEventListener('touchend', event => {
      this.touch = new Touch();
    });

  }
  
  get action() { return _action; }
  
  set action(action) {
    this._action = typeof action === 'function' ? action : null;
  }
    
}

{{- end }}