//這次分號是我自己加的
;(function($){
    //json資料
    let dataUrl = 'https://monkeywu.github.io/cart_data.json/'
    //放資料的陣列
    let originData = []
    //在購物車內的商品
    let itemInCart = []
    //取得商品資料，將商品資料帶入
    function addData(){
        //ajax取得資料
        $.when( $.get(dataUrl,function(data){
            originData.push(JSON.parse(data))
        }))
        //產生產品的div區塊
        .done(function(){
            let length = originData[0].length;
            let str = '';
            for(let i = 0;i<length;i++){
                str += `
                <div class="item ${originData[0][i].class}">
                    <div class="cover"></div>
                    <span class="title">${originData[0][i].title}</span>
                    <div class="flex">
                        <span class="price">${originData[0][i].price}</span>
                        <select name="${originData[0][i].id}">
                            <option value="default" disabled selected>select</option>
                        </select>
                    </div>
                    <div class="btn">Add to Cart</div>
                </div>    
                `
            }
            $('.items').append(str)
        //產生產品數量的option及圖片 
        }).done(function(){
                $('.item select').each(function(index){
                        let length = originData[0][index].amount.length
                        for(let i=1;i<=length;i++){
                            $(this).append($("<option></option>").attr("value", i).text(i))
                        }
                })
                $('.cover').each(function(index){
                    $(this).css('background-image','url('+originData[0][index].cover+')')
                })

        })
    }
    //新增商品至購物車內容，改變右上角購物車數量
    function showItem(ID,totalP,itemAmount,img,title,price){
        // let originAmount = +$('.cartNum').text()
        console.log(itemInCart)
        let originPrice = itemInCart.map((x)=>x.totalPrice).reduce((a,b)=>a+b)
        let originAmount = itemInCart.map((x)=>x.amount).reduce((a,b)=>a+b)
        let str = ''
        $('.totalPrice').text(originPrice)
        $('.cartNum').text(originAmount)
        $('.itemNum').text(originAmount)
            str = `
                <div class="cartFlex">
                    <div class="imgWrap">
                        <img src="${img}">
                    </div>
                    <div class="detail">
                        <p>${title}</p>
                        <p class="itemPrice">$${price}</p>
                    </div>
                    <div class="itemAmount">
                        <p>amount:${itemAmount}</p>
                    </div>
                    <div class="delete">
                        delete this item
                    </div>
                </div>
            `
        $('.cartWrap').append(str)
        
    }
    function init(){
        addData()
        //選擇商品種類
        $('#chooseItem').change(function(){
            let val = $(this).val()
            if (val === 'all'){
                $('.board,.suit,.pants').css('display','block')
            } else if (val ==='board'){
                $('.suit,.pants').css('display','none')
                $('.board').css('display','block')
            } else if (val === 'pants'){
                $('.board,.suit').css('display','none')
                $('.pants').css('display','block')
            } else {
                $('.board,.pants').css('display','none')
                $('.suit').css('display','block')
            }
        })
        //選擇頁面
        $('.linkToHome').click(function(e){
            e.preventDefault();
            $('.homepage').css('display','block')
            $('.product,.about').css('display','none')
        })
        $('.linkToProducts').click(function(e){
            e.preventDefault();
            $('.homepage,.about').css('display','none')
            $('.product').css('display','block')
        })
        $('.linkToAbout').click(function(e){
            e.preventDefault();
            $('.homepage,.product').css('display','none')
            $('.about').css('display','block')
        })
        //點擊右上方購物車顯示出購物車內容
        $('.cart').click(function(){
            $('.incart').fadeIn(500)
        })
        //關閉購物車內容
        $('.close').click(function(){
            $('.incart').fadeOut(500)
        })
        //增加商品到購物車
        $('.items').on('click','.btn',function(){
            //index為第幾個按鈕
            let index = $('.btn').index(this)
            //商品id
            let ID = originData[0][index].id
            //選擇的商品數量
            let itemAmount = +$(this).siblings('.flex').children('select').val()
            //商品單價
            let price = originData[0][index].price
            //總價格
            let totalP = price*itemAmount
            //要在購物車內顯示圖片，所以把img url傳過去
            let img = originData[0][ID].cover
            //商品名稱
            let title = originData[0][ID].title
            
            //檢查購物車內是否有商品
            let check  = itemInCart.findIndex((x)=> x.id === ID)
            //如果商品不在購物車內，選擇數量也不為0時，將商品加到購物車
            if(check === -1 && itemAmount !== 0 ){
                //將商品資料傳到購物車陣列裡
                itemInCart.push({
                    id:ID,
                    totalPrice: totalP,
                    amount:itemAmount,
                    img:img,
                    title:title,
                    price:price
                })
            //已加到購物車的案件改為已購買及改變背景色    
            $(this).text('Already In Cart').css('background-color','#ccc')
            //將資料顯示在購物車內容裡
            showItem(ID,totalP,itemAmount,img,title,price)
            } 
        })
        //刪除購物車內商品
        $('.incart').on('click','.delete',function(){
            let index = $('.delete').index(this)
            let id = itemInCart[index].id
            let price = itemInCart[index].totalPrice
            let amount = itemInCart[index].amount
            let newPrice = itemInCart.map((x)=>x.totalPrice).reduce((a,b)=>a+b) - price
            let newAmount = itemInCart.map((x)=>x.amount).reduce((a,b)=>a+b) - amount
            //更新總數量跟價格
            $('.totalPrice').text(newPrice)
            $('.itemNum').text(newAmount)
            $('.cartNum').text(newAmount)
            //讓商品可重新點擊
            $('.btn').eq(id).css('background-color','#dee').text('Add to Cart')
            //刪除購物車內項目
            $(this).parent('.cartFlex').remove();
            itemInCart.splice(index,1)
        })
    }

    init();
}($))