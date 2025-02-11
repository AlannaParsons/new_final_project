//https://stackoverflow.com/questions/1484506/random-color-generator
export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

//https://www.freecodecamp.org/news/javascript-debounce-example/
export function debounce(func, timeout = 800){
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  };

export function checkReturn(response){
    if (response.isArray())
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  };

