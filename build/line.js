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
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.closePath();
        ctx.stroke();
    }
}