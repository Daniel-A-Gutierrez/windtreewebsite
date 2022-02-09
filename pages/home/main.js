function setupSlider(
    sliderSelector,
    leftButtonSelector,
    rightButtonSelector,
    offset = 65,
    dx = 100,
    endskip = 0,
    startat=0,
    paginationSelector = '')
{
    const leftbtn = document.querySelector(leftButtonSelector);
    const rightbtn = document.querySelector(rightButtonSelector);
    const slider = document.querySelector(sliderSelector);
    let pagination = null;
    if(paginationSelector !== ''){pagination=document.querySelector(paginationSelector);}
    let numChildren = slider.childElementCount - endskip;
    let index = startat;

    if(pagination)
    {
        pagination.children[index].style.transform = 'scale(2,2)';
    }

    slider.style.left = `calc(${offset}px + ${-index*dx}%)`;

    if(index === numChildren-1)
        {rightbtn.style.transform = 'scale(0,0)';}

    if(index === 0)
        {leftbtn.style.transform = 'scale(0,0)';}

    leftbtn.addEventListener("click", ()=>
    {
        if(index>0)
        {
            index-=1;
            slider.style.left = `calc(${offset}px + ${-index*dx}%)`;
            rightbtn.style.transform = 'scale(1,1)';
            if(index === 0)
            {
                leftbtn.style.transform = 'scale(0,0)';
            }
            if(pagination)
            {
                pagination.children[index].style.transform = 'scale(2,2)';
                pagination.children[index+1].style.transform = 'scale(1,1)';
            }

        }
        
    });

    rightbtn.addEventListener("click",()=>
    {
        //index = index % numChildren;
        if(index < numChildren-1)
        {
            index+=1;
            slider.style.left = `calc(${offset}px + ${-index*dx}%)`;
            leftbtn.style.transform = 'scale(1,1)';
            if(index === numChildren-1)
            {
                rightbtn.style.transform = 'scale(0,0)'
            }
            if(pagination)
            {
                pagination.children[index].style.transform = 'scale(2,2)';
                pagination.children[index-1].style.transform = 'scale(1,1)';
            }
        }
    })
}

function setupGallery()
{
    setupSlider('.gallery-images','.gallery-left','.gallery-right',0,33.333,2);
}

function setupTestimonials()
    {setupSlider('.reactions','.reactions-left','.reactions-right');}

function setupOverview()
{
    setupSlider('.slides', '.slides-left', '.slides-right',0, 100,0,0,'.slides-pagination');
}

setupTestimonials();
setupGallery();
setupOverview();