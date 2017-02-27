var jwtParam = getQueryVariable('jwt')
if (jwtParam) localStorage.setItem('jwt', jwtParam)
if (jwtParam) jwt = jwtParam

function redirectToLogin() {
  localStorage.removeItem('jwt')
  window.location = ('../login?u=' + encodeURIComponent(window.location.href) )
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\\+/g, ' '));
};

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
}

var username = null
var p = window.location.pathname
var pMatch = p.match(/\w+$/)
if (Array.isArray(pMatch) && pMatch[0]) {
  username = pMatch[0]
}
document.getElementById('logout').addEventListener('click', redirectToLogin)
var jwtParam = getQueryVariable('jwt')
var jwtString = null
if (jwtParam && typeof jwtParam === 'string' && jwtParam.length > 10) {
  jwtString = jwtParam
  localStorage.setItem('jwt', jwtParam)
}
if (!jwtString || typeof jwtString !== 'string') {
  jwtString = localStorage.getItem('jwt')
}

if (jwtString && typeof jwtString === 'string' && jwtString.length > 10) {
  jwtArray = jwtString.split('.')
  if (Array.isArray(jwtArray) && jwtArray.length === 3) {
    jwt = {}

    jwt.header = JSON.parse(atob(jwtArray[0]))
    jwt.payload = JSON.parse(atob(jwtArray[1]))
    jwt.signature = jwtArray[2]
    var payloadUsername = jwt.payload.user || jwt.payload.username || null
    if (payloadUsername === username) {
      document.getElementById('authorization-hidden-input').setAttribute('value', jwtString)
      document.getElementById('container').setAttribute('style', 'display:inherit;')
    } else {
      redirectToLogin()
    }
  } else {
    redirectToLogin()
  }
} else {
  redirectToLogin()
}
