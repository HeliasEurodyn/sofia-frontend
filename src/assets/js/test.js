var returnBack;

function myfunction(param) {
  if (typeof test == 'function' && param == 'test') this.test();
  if (typeof test2 == 'function' && param == 'test2') this.test2();
  if (typeof test3 == 'function' && param == 'test3') this.test3();
  if (typeof test4 == 'function' && param == 'test4') this.test4();
}

function passArray(params) {
  alert(params.get('SSS')  );
}

function test() {
  alert('test');
}

function test2() {
  returnBack('hello from Js');
}

function test3() {
  alert('test3');
}

/*Call back to send back data*/
function sendMessage(myCallback) {
  returnBack = myCallback;
 // myCallback('hello from Js');
}
