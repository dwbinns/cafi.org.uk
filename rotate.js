function rotate(container) {
    var images=container.querySelectorAll("div");

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
        let size=sizes.filter((size)=>size.split("x")[0]>devicePixelWidth)[0] || "full";
        if (currentImage) currentImage.className='hide';
        currentImage=nextImage;
        currentImage.className='show';
        nextImage=images[(imageNumber++)%images.length];
        nextImage.style.backgroundImage='url('+["images",size, nextImage.getAttribute('data-src')].join("/")+')';
        nextImage.className='hide';
        if (title) title.textContent=currentImage.getAttribute('title');
    }

    change();
    change();

    container.onclick=function() {paused=true;change();};
}

window.addEventListener('DOMContentLoaded',function() {
    document.body.querySelectorAll('div.rotate').forEach(rotate);
});
