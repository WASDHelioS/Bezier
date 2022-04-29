class Point {
    constructor(location, size) {
        this.color = "BLACK";
        this.location = location;
        this.size = size;
    }

    setColor(color) {
        this.color = color;
    }

    isWithinBorders(location) {
        if(location.x > this.location.x-size/2 && 
           location.x < this.location.x+size/2 &&
           location.y > this.location.y-size/2 &&
           location.y < this.location.y+size/2) {
               return true;
           }
           return false;
    }

    draw(ctx) {
        ctx.fillStyle =this.color;
        ctx.fillRect(this.location.x, this.location.y, this.size, this.size);
        //ctx.arc(this.location.x-this.size/2,this.location.y-this.size/2,this.size/2,0, Math.PI);
        //ctx.stroke();
    }
}