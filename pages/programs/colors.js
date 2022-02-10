function remap(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

let titles= document.querySelectorAll('h2');

for(let i = 0 ; i < titles.length; i++)
{
    titles[i].style.color = `hsl(${180 + remap(i+1,0,titles.length,0,330)}, 75%, 75%)`;
}

let h1 = document.querySelector('h1');
h1.style.color= `hsl(${180}, 75%, 75%)`