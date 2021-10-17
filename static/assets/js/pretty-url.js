var href = window.location.href;

var href_sans_categories = href;

if (href.includes("/categories") 
&& !(href.endsWith("categories") || href.endsWith("categories/")) 
{
  href_sans_categories = href.replace("/categories", "");
  
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    
  if (this.status < 400 && this.status >= 300) {
      alert('this redirects to ' + this.getResponseHeader("Location"));
    } else {
      alert('doesn\'t redirect ');
    }
  }
  xhr.open('HEAD', href_sans_categories, true);
  xhr.send();

     
}