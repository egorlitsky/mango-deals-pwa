import { useEffect } from 'react';
import { DATA_PAGE_SIZE } from '../constants/DealsConstants';
import { IDeal } from '../interfaces/DealsInterfaces';

interface IDealsChartProps {
    data: IDeal[];
    smoothCurves?: boolean;
}

// size we will base our chart on
const CHART_HEIGHT = window.innerHeight * 0.4;
const CHART_WIDTH = window.innerWidth;

const CHART_TOP = 0;
const CHART_BOTTOM = CHART_HEIGHT;

const CHART_LEFT = 0;
const CHART_RIGHT = CHART_WIDTH;

const CHART_DOT_SIZE = 3;

const DealsChart = ({ data, smoothCurves = true }: IDealsChartProps) => {
    const drawHorizontalGridLines = (
        context: CanvasRenderingContext2D
    ): void => {
        context.beginPath();
        context.moveTo(CHART_LEFT, CHART_BOTTOM);
        context.lineTo(CHART_RIGHT, CHART_BOTTOM);
        context.stroke();

        context.beginPath();
        context.moveTo(CHART_LEFT, CHART_TOP);
        context.lineTo(CHART_RIGHT, CHART_TOP);
        context.stroke();

        context.beginPath();
        context.moveTo(CHART_LEFT, (CHART_HEIGHT / 4) * 3 + CHART_TOP);
        context.lineTo(CHART_RIGHT, (CHART_HEIGHT / 4) * 3 + CHART_TOP);
        context.stroke();

        context.beginPath();
        context.moveTo(CHART_LEFT, CHART_HEIGHT / 2 + CHART_TOP);
        context.lineTo(CHART_RIGHT, CHART_HEIGHT / 2 + CHART_TOP);
        context.stroke();

        context.beginPath();
        context.moveTo(CHART_LEFT, CHART_HEIGHT / 4 + CHART_TOP);
        context.lineTo(CHART_RIGHT, CHART_HEIGHT / 4 + CHART_TOP);
        context.stroke();
    };

    const drawVerticalGridLines = (context: CanvasRenderingContext2D): void => {
        const offset = CHART_WIDTH / DATA_PAGE_SIZE;
        for (let i = 1; i < DATA_PAGE_SIZE; i++) {
            const x = CHART_LEFT + offset * i - CHART_LEFT;

            context.beginPath();
            context.moveTo(x, CHART_TOP);
            context.lineTo(x, CHART_BOTTOM);
            context.stroke();
        }
    };

    const drawGrid = (context: CanvasRenderingContext2D) => {
        context.lineWidth = 1;
        drawHorizontalGridLines(context);
        drawVerticalGridLines(context);
    };

    const drawChart = (
        dataArr: number[],
        context: CanvasRenderingContext2D
    ): void => {
        const length = dataArr.length;
        const max = Math.max(...dataArr);

        context.clearRect(0, 0, CHART_WIDTH, CHART_HEIGHT);
        context.strokeStyle = '#52585eaa';

        drawGrid(context);

        context.beginPath();
        context.strokeStyle = '#3EAEFF';
        context.fillStyle = '#3EAEFF';

        context.moveTo(
            CHART_LEFT,
            CHART_HEIGHT - (dataArr[0] / max) * CHART_HEIGHT + CHART_TOP
        );

        context.lineWidth = 3;

        if (smoothCurves) {
            for (let i = 0; i < length - 1; i++) {
                const x1 = (CHART_RIGHT / length) * i + CHART_LEFT;
                const y1 =
                    CHART_HEIGHT -
                    (dataArr[i] / max) * CHART_HEIGHT +
                    CHART_TOP;

                const x2 = (CHART_RIGHT / length) * (i + 1) + CHART_LEFT;
                const y2 =
                    CHART_HEIGHT -
                    (dataArr[i + 1] / max) * CHART_HEIGHT +
                    CHART_TOP;

                const xMedian = (x1 + x2) / 2;
                const yMedian = (y1 + y2) / 2;
                const cpx1 = (xMedian + x1) / 2;
                const cpx2 = (xMedian + x2) / 2;

                context.quadraticCurveTo(cpx1, y1, xMedian, yMedian);
                context.quadraticCurveTo(cpx2, y2, x2, y2);

                context.fillRect(x1, y1, CHART_DOT_SIZE, CHART_DOT_SIZE);
                context.fillRect(x2, y2, CHART_DOT_SIZE, CHART_DOT_SIZE);
            }
        } else {
            for (let i = 1; i < length; i++) {
                const x = (CHART_RIGHT / length) * i + CHART_LEFT;
                const y =
                    CHART_HEIGHT -
                    (dataArr[i] / max) * CHART_HEIGHT +
                    CHART_TOP;

                context.lineTo(x, y);
                context.fillRect(x, y, CHART_DOT_SIZE, CHART_DOT_SIZE);
            }
        }

        context.stroke();
    };

    useEffect(() => {
        const canvas = document.getElementById('chartCanvas');
        const context: CanvasRenderingContext2D = (
            canvas as HTMLCanvasElement
        ).getContext('2d') as CanvasRenderingContext2D;

        const series = data.map((deal) => deal.value);

        if (context) {
            drawChart(series, context);
        }
    }, [data]);

    return (
        <canvas
            id="chartCanvas"
            className="deals-chart"
            height={CHART_HEIGHT}
            width={CHART_WIDTH}
        >
            {"HTML Canvas isn't supported by your browser."}
        </canvas>
    );
};

export default DealsChart;
