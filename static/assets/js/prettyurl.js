/* Script for altering the URL to remove "/categories", requires the aliases configured in front matter under /content/categories/some-category/_index.md */
var href = window.location.href;

if (href.includes("/categories")) {
  href = href.replace("/categories", "");
  history.pushState({}, "", href);   
}