document.addEventListener('DOMContentLoaded', () => {
  
  let main = document.querySelector('body > main');
  let dl = document.createElement('DL');
  dl.id = 'debug-console';
  main.prepend(dl);
  
  const originalLog = console.log;
  
  console.log = function(message, ...rest) {
    
    originalLog(message, ...rest);
    
    message = (typeof message == 'object'
              ? JSON.stringify(message)
              : message);
              
    label = rest.length == 1 ? rest[0] ?? 'log';
    
    let dt = document.createElement('DT');
    dt.innerHTML = `${label}`;
    dl.append(dt);
    
    let dd = document.createElement('DD');
    dd.innerHTML = `${message}`;
    dl.append(dd)

    dl.scrollTop = dl.scrollHeight - dl.clientHeight
    
    dl.append(document.createElement('SPAN'))    
    
  }
  
});