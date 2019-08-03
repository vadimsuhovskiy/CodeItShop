'use strict'

$( document ).ready(function() {

    let filterText 
    let initialItemsList = [];
    let mainContent = $('#main-content .row');
    let pagesContainer = $('.main-pagination');
    let currentItems = [];
    let currentPageNumber = 1;
    let clearFilterButton = $('.main-filter__clear');

    function slickSliderInit() {
        $('.slider').slick({
            infinity: true,
            arrows: false,
            slidesToShow: 4,
            autoplay: true,
            autoplaySpeed: 3000,
            slidesPerRow: 1,
        })
    }

    function clearPageFilter() {
        $('.main-filter__input').val('')
        filterText = ''
        clearFilterButton[0].disabled = true;
        filterItems(filterText)
    }

    function drawPageButtons(pagesToShow) {
        let buttonsList = []
        for (let i = pagesToShow; i >= 1; i-- ) {            
            if (i != currentPageNumber) {
                buttonsList.push(`
                <button class="main-pagination__btn" data-page="${i}">${i}</button>
            `)
            } else {
                buttonsList.push(`
                <button class="main-pagination__btn active" data-page="${i}">${i}</button>
            `)
            }         
        }
        pagesContainer.html(buttonsList.reverse())
    }

    function splitItems(currentPageNumber) {  
        
        let firstItem = ( currentPageNumber - 1 ) * 8
        let arrayToDisplay = Array.from(currentItems)
        
        displayItems(arrayToDisplay.splice(firstItem, 8))
    }

    function filterItems(text = '') {
                
        currentItems = initialItemsList.filter(item => {                

            return item.title.toUpperCase().indexOf(text.toUpperCase()) != -1

        });

        let pagesToShow = Math.ceil( currentItems.length / 8 )
        
        drawPageButtons(pagesToShow)
        
        splitItems(currentPageNumber)               

    }

    function createItem(item) {
        let oldPrice;
        if (item.oldPrice) {
            oldPrice = `<span class="card-price__old">$${item.oldPrice}</span>`
        } else {
            oldPrice = ''
        }
        return (`
        <div class="col-3">
            <div data-id="${item.id}" class="main-content__item card">
                <div class="card__img">
                    <img src="images/${item.image}.png" alt="Iphone">
                    <div class="card-overlay">
                        <button class="card-overlay__button card-remove-btn_js">remove from list</button>
                    </div>
                </div>
                <h3 class="card__name">${item.title}</h3>
                <div class="card-price">
                        <span class="card-price__new">$${item.price}</span>   
                        ${oldPrice}                         
                </div>
                <div class="card-buttons">
                        <button class="button card-buttons__trash card-remove-btn_js"><i class="fal fa-trash-alt"></i></button>
                        <button class="button card-buttons__basket"><i class="fas fa-shopping-cart"></i></button>
                </div>
            </div>
        </div>
        `);
    }

    function displayItems(currentItems) {
        
        let itemsToDraw = [];
        
        if (!currentItems.length  && currentPageNumber != 1) {
            currentPageNumber-- 
            filterItems(filterText)
            return
        }
        
        $.each( currentItems, function( key, val ) {
            
            itemsToDraw.push(createItem(val))    

        });
        
        mainContent.html(itemsToDraw)

    }

    $('.main-pagination').on('click', '.main-pagination__btn', function(){
        currentPageNumber = this.dataset.page;
        splitItems(currentPageNumber);
        $('.main-pagination__btn').removeClass('active')
        $(this).addClass('active')
        
    })

    $('.main-filter__input').on('input', function(){

        filterText = $(this).val()
        
        if(!filterText) {
            clearFilterButton[0].disabled = true;
        } else {
            clearFilterButton[0].disabled = false;
        }
        currentPageNumber = 1 
        filterItems(filterText)
    })    

    $('.main-content').on('click', '.card-remove-btn_js', function(){
        
        initialItemsList = initialItemsList.filter( item => {
            return item.id != $(this).closest('.card').data("id")
        })
        filterItems(filterText)

    })

    clearFilterButton.on('click', clearPageFilter)
    
    fetch("https://api.myjson.com/bins/1bcbi5", {
        method: "GET",
    }).then(response => {
        response.json().then(data => {  
            initialItemsList = data.items
            filterItems();
        })
    });

    slickSliderInit()
    
});
