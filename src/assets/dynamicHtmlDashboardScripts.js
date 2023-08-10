var htmlDashboardDynamicScripts = {};


function registerHtmlDashboardDynamicScript(id, htmlDashboard) {
  htmlDashboardDynamicScripts[id] = newHtmlDashboardDynamicScript(id);
  htmlDashboardDynamicScripts[id].htmlDashboardRef = htmlDashboard;
}

function defineHtmlDashboardGetFromBackend(id, getFromBackend) {
  if (typeof htmlDashboardDynamicScripts[id].defineGetFromBackend == "function"){
    htmlDashboardDynamicScripts[id].defineGetFromBackend(getFromBackend);
  }
}

function defineHtmlDashboardGetFromUrl(id, getFromUrl) {
  if (typeof htmlDashboardDynamicScripts[id].defineGetFromUrl == "function")
    htmlDashboardDynamicScripts[id].defineGetFromUrl(getFromUrl);
}

function defineHtmlDashboardPostToBackend(id, postToBackend) {
  if (typeof htmlDashboardDynamicScripts[id].definePostToBackend == "function")
    htmlDashboardDynamicScripts[id].definePostToBackend(postToBackend);
}

function defineHtmlDashboardPostToUrl(id, postToUrl) {
  if (typeof htmlDashboardDynamicScripts[id].definePostToUrl == "function")
    htmlDashboardDynamicScripts[id].definePostToUrl(postToUrl);
}

function defineHtmlDashboardPutToBackend(id, putToBackend) {
  if (typeof htmlDashboardDynamicScripts[id].definePutToBackend == "function")
    htmlDashboardDynamicScripts[id].definePutToBackend(putToBackend);
}

function defineHtmlDashboardPutToUrl(id, putToUrl) {
  if (typeof htmlDashboardDynamicScripts[id].definePutToUrl == "function")
    htmlDashboardDynamicScripts[id].definePutToUrl(putToUrl);
}

function defineHtmlDashboardDeleteFromBackend(id, deleteFromBackend) {
  if (typeof htmlDashboardDynamicScripts[id].defineDeleteFromBackend == "function")
    htmlDashboardDynamicScripts[id].defineDeleteFromBackend(deleteFromBackend);
}

function defineHtmlDashboardDeleteFromUrl(id, deleteFromUrl) {
  if (typeof htmlDashboardDynamicScripts[id].defineDeleteFromUrl == "function")
    htmlDashboardDynamicScripts[id].defineDeleteFromUrl(deleteFromUrl);
}

function defineHtmlDashboardNavigator(id, navigate) {
  if (typeof htmlDashboardDynamicScripts[id].defineListNavigator == "function")
    htmlDashboardDynamicScripts[id].defineListNavigator(navigate);
}

function nativeHtmlDashboardEventsHandler(id, type, metadata) {
  if (typeof htmlDashboardDynamicScripts[id].nativeListEventsHandler == "function")
    htmlDashboardDynamicScripts[id].nativeListEventsHandler(type, metadata);
}

function nativeAreaClickHandler(id, classList) {
  htmlDashboardDynamicScripts[id].nativeAreaClickHandler(classList);
}
