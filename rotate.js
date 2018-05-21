function rotate(container) {
    var images=container.querySelectorAll("img");

    var title=container.querySelector('p.title');



    var imageNumber=0;

    var currentImage=null;
    var nextImage=images[0];

    var paused=false;

    window.setInterval(checkchange,5000);

    function checkchange() {
        if (!paused) change();
    }

    let sizes=['400x300', '800x600', '1200x900'];


    function change() {
        let devicePixelWidth = container.offsetWidth * window.devicePixelRatio;
        let size=sizes.filter((size)=>size.split("x")[0]>devicePixelWidth)[0];
        if (currentImage) currentImage.className='hide';
        currentImage=nextImage;
        currentImage.className='show';
        nextImage=images[(imageNumber++)%images.length];
        nextImage.setAttribute('src',["images",size, nextImage.getAttribute('data-src')].filter(x=>x).join("/"));
        nextImage.className='hide';
        //nextImage.style.backgroundImage='url('+nextImage.getAttribute('data-src')+')';
        if (title) title.textContent=currentImage.getAttribute('title');
    }

    change();
    change();

    container.onclick=function() {paused=true;change();};
}

window.addEventListener('load',function() {
    document.body.querySelectorAll('div.rotate').forEach(rotate);
});
