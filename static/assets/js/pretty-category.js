var href = window.location.href;

if (href.includes("/categories")) {
  href = href.replace("/categories", "");
  history.pushState({}, "", href);   
}