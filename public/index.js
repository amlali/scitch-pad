function changeColor(e){
    console.log(e);
    switch(e.id){
            
            
        case 'red':
            ctx.strokeStyle = '#ff0000';
            break;
        case 'green':
            ctx.strokeStyle = '#008000';
            break;
        case 'blue':
            ctx.strokeStyle = '#0000FF';
            break;
        case 'black':
            ctx.strokeStyle = '	#000000';
            break;
        case 'yellow':
            ctx.strokeStyle = '#FFFF00';
            break;
        case 'purple':
            ctx.strokeStyle = '#800080';
            break;

    }
}




let soc = io.connect('http://localhost:3001');

let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let prevX = 0
let prevY = 0
let currX = 0
let currY = 0
let color;
let siz= 5
let paint = false;
let clicked=false;
soc.on('message',e =>{
    console.log(e);
    soc.emit('message','iam hear')
})


function draw(e) {
        console.log('enter drow with '+paint);
        
        if(paint){
        ctx.beginPath();
        ctx.lineWidth = siz;
        ctx.strokeStyle = e.color
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.stroke();
        ctx.closePath();
        
    }
    if(clicked){
        clicked = false
        paint = false;
    }
}
function findxy(e) {
    console.log('enter findxy');

    if(clicked){
        
        prevX = currX;
        prevY = currY;
        currX = e.x - c.offsetLeft + 1
        currY = e.y - c.offsetTop  + 1

    }else{
        
        prevX = currX;
        prevY = currY;
        ctx.lineJoin = "square";
        ctx.lineCap = 'square';
        currX = e.x - c.offsetLeft;
        currY = e.y - c.offsetTop;
    }
    
    console.log('prevX' ,prevX ,'prevY' ,prevY ,'currX',currX,'currY' ,currY)
}
$('#myCanvas').click(function(e){
    
    clicked = true
    paint = true;
    // findxy({x:e.clientX ,y:e.clientY})
    // draw({color:ctx.strokeStyle})
})
   


$('#myCanvas').mouseup(function(e){
    console.log(' mouseup noDrowing');
    
     soc.emit('no-drowing')
     paint = false;
    });
$('#myCanvas').mouseleave(function(e){
    
     soc.emit('no-drowing')
     paint = false; });
$('#myCanvas').mousedown(function(e){ 
   
     soc.emit('canDrow')
     paint = true;
     
     findxy({x:e.clientX ,y:e.clientY})
     draw({color:ctx.strokeStyle}) 
     
 })
$('#myCanvas').mousemove(function(e){ 
    
    findxy({x:e.clientX ,y:e.clientY})
    draw({color:ctx.strokeStyle})

    soc.emit('moving',{x:e.clientX ,y:e.clientY,color:ctx.strokeStyle})
});

$("#clear").click(function(e){
    ctx.clearRect(0, 0, c.width, c.height);

});

soc.on('drowing',(e)=>{
    if(paint){
    findxy(e)
    draw(e) 
 }
})
soc.on('no-drowing',()=>{
    paint = false;
})
soc.on('canDrow',()=>{
    paint = true;
})
