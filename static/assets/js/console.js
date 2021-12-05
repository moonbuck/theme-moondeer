document.addEventListener('DOMContentLoaded', () => {
  
  let main = document.getElementsByTagName('MAIN')[0]
  
  let dl = document.createElement('DL')
  dl.style.lineHeight = 1
  dl.style.overflowX = 'hidden'
  dl.style.overflowWrap = 'anywhere'
  dl.style.overflowY = 'auto'
  dl.style.scrollBehavior = 'smooth'
  dl.style.maxHeight = '6em'
  dl.style.minWidth = '100%'
  dl.style.maxWidth = '100%'
  dl.style.display = 'flex'
  dl.style.flexWrap = 'wrap'
  
  main.insertBefore(dl, main.firstChild)
  
  console.log = function(message, label) {
    
    message = (typeof message == 'object'
              ? JSON.stringify(message)
              : message)
    label = label ?? 'log'
    
    let dt = document.createElement('DT')
    dt.innerText = `${label}`
    dt.style.marginRight = '1rem'
    dt.style.marginBottom = '0.5rem'
    dl.appendChild(dt)
    
    let dd = document.createElement('DD')
    dd.innerText = `${message}`
    dd.style.flexGrow = 1
    dl.appendChild(dd)
    dl.scrollTop = dl.scrollHeight - dl.clientHeight
    
    let spacer = document.createElement('SPAN')
    spacer.style.width = '100%'
    dl.appendChild(spacer)
    
  }
  
})