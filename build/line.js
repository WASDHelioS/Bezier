class Line{
    constructor(start, end) {
        this.color = "BLACK";
        this.start = start;
        this.end = end;
    }
    
    setColor(color) {
        this.color = color;
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.start.location.x, this.start.location.y);
        ctx.lineTo(this.end.location.x, this.end.location.y);
        ctx.closePath();
        ctx.stroke();
    }
}