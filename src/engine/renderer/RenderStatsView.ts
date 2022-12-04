export class RenderStatsView {
    public static readonly CANVAS_WIDTH:int = 125;
    public static readonly CANVAS_HEIGHT:int = 75;
    public static readonly FRAME_TIME:float = 16;

    private readonly _context:CanvasRenderingContext2D;

    public constructor() {
        const canvas = document.createElement('canvas');
        canvas.height = RenderStatsView.CANVAS_HEIGHT;
        canvas.width = RenderStatsView.CANVAS_WIDTH;

        const canvasParent = document.querySelector('#graphs');
        canvasParent.appendChild(canvas);

        this._context = canvas.getContext('2d');
    }

    private extractPointHeight(content:Vector<int>, index:int):float {
        return (
            (1.0 - content[index] / RenderStatsView.FRAME_TIME) *
            RenderStatsView.CANVAS_HEIGHT
        );
    }

    public renderStats(render:Vector<int>, update:Vector<int>):void {
        const { CANVAS_WIDTH, CANVAS_HEIGHT } = RenderStatsView;

        //-----------------------------------

        this._context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        //-----------------------------------

        this._context.lineWidth = 1;
        this._context.strokeStyle = '#FF0000';
        this._context.beginPath();

        for (let index = 0; index < render.length; index++) {
            if (index === 0) {
                this._context.moveTo(index * 2.5, this.extractPointHeight(render, index));
            } else {
                this._context.lineTo(index * 2.5, this.extractPointHeight(render, index));
            }
        }

        this._context.stroke();

        //-----------------------------------

        this._context.lineWidth = 1;
        this._context.strokeStyle = '#0000FF';
        this._context.beginPath();

        for (let index = 0; index < update.length; index++) {
            if (index === 0) {
                this._context.moveTo(index * 2.5, this.extractPointHeight(update, index));
            } else {
                this._context.lineTo(index * 2.5, this.extractPointHeight(update, index));
            }
        }

        this._context.stroke();

        //-----------------------------------

        this._context.lineWidth = 3;
        this._context.strokeStyle = '#FFFFFF';
        this._context.beginPath();
        this._context.moveTo(CANVAS_WIDTH, CANVAS_HEIGHT);
        this._context.lineTo(CANVAS_WIDTH, 0);
        this._context.stroke();
    }
}
