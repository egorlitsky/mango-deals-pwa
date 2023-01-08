import {ReactElement, useEffect} from 'react';
import _ from 'lodash';
import {DATA_PAGE_SIZE} from '../constants/DealsConstants';
import {IDeal} from '../interfaces/DealsInterfaces';

interface IDealsChartProps {
    data: IDeal[];
    hoveredDealId: string;
    smoothCurves?: boolean;
}

// size we will base our chart on
const CHART_HEIGHT = window.innerHeight * 0.4; // chart is 40vh from the screen
const CHART_WIDTH = window.innerWidth;

const CHART_TOP = 0;
const CHART_BOTTOM = CHART_HEIGHT;

const CHART_LEFT = 0;
const CHART_RIGHT = CHART_WIDTH;

// color codes
const styles = getComputedStyle(document.body);
const highlightColorCode = styles.getPropertyValue('--mango-highlight');
const blueColorCode = styles.getPropertyValue('--mango-blue');
const grayColorCode = styles.getPropertyValue('--mango-table-border');

/**
 * Renders a chart with deals.
 * smoothCurves prop enables/disables smooth curves algorithm.
 * @param props DealsChart props
 * @returns DealsChart React-element
 */
const DealsChart = (
    props: IDealsChartProps
): ReactElement<IDealsChartProps> => {
    const {data, hoveredDealId, smoothCurves = true} = props;

    const setContextDefaults = (context: CanvasRenderingContext2D): void => {
        context.strokeStyle = blueColorCode;
        context.fillStyle = blueColorCode;
        context.lineWidth = 5;
        context.globalAlpha = 1;
    };

    const drawHorizontalGridLines = (
        context: CanvasRenderingContext2D
    ): void => {
        // bottom line
        context.beginPath();
        context.moveTo(CHART_LEFT, CHART_BOTTOM);
        context.lineTo(CHART_RIGHT, CHART_BOTTOM);
        context.stroke();

        // top line
        context.beginPath();
        context.moveTo(CHART_LEFT, CHART_TOP);
        context.lineTo(CHART_RIGHT, CHART_TOP);
        context.stroke();

        // 3 the rest lines
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

        // fraw 10 lines with offset
        for (let i = 1; i < DATA_PAGE_SIZE; i++) {
            const x = CHART_LEFT + offset * i - CHART_LEFT;

            context.beginPath();
            context.moveTo(x, CHART_TOP);
            context.lineTo(x, CHART_BOTTOM);
            context.stroke();
        }
    };

    const drawGrid = (context: CanvasRenderingContext2D): void => {
        context.strokeStyle = grayColorCode;
        context.lineWidth = 1;
        drawHorizontalGridLines(context);
        drawVerticalGridLines(context);
    };

    const drawHoveredDeal = (
        context: CanvasRenderingContext2D,
        x: number,
        y: number
    ): void => {
        context.lineWidth = 2;
        context.strokeStyle = highlightColorCode;

        // draw lines
        context.beginPath();
        context.moveTo(x, CHART_TOP);
        context.lineTo(x, CHART_BOTTOM);
        context.stroke();

        context.beginPath();
        context.moveTo(CHART_LEFT, y);
        context.lineTo(CHART_RIGHT, y);
        context.stroke();

        // draw circles
        context.beginPath();
        context.globalAlpha = 0.5;
        context.arc(x, y, 16, 0, 2 * Math.PI, true);
        context.fillStyle = 'white';
        context.fill();

        context.beginPath();
        context.globalAlpha = 1;
        context.arc(x, y, 8, 0, 2 * Math.PI, true);
        context.fill();

        // draw circle border
        context.lineWidth = 3;
        context.strokeStyle = highlightColorCode;
        context.stroke();

        setContextDefaults(context);
    };

    const drawChart = (
        dataArray: number[],
        context: CanvasRenderingContext2D,
        hoveredDealIndex: number
    ): void => {
        const length = dataArray.length;
        const max = Math.max(...dataArray);

        let hoveredDealX = 0;
        let hoveredDealY = 0;

        context.clearRect(0, 0, CHART_WIDTH, CHART_HEIGHT);

        drawGrid(context);

        context.beginPath();
        setContextDefaults(context);

        context.moveTo(
            CHART_LEFT,
            CHART_HEIGHT - (dataArray[0] / max) * CHART_HEIGHT + CHART_TOP
        );

        if (smoothCurves) {
            // when smooth curves
            for (let i = 0; i < length - 1; i++) {
                // to smooth curves we need to process two neighboring points
                // determine 1st point coordinates
                const x1 = (CHART_RIGHT / length) * i + CHART_LEFT;
                const y1 =
                    CHART_HEIGHT -
                    (dataArray[i] / max) * CHART_HEIGHT +
                    CHART_TOP;

                // determine 1st point coordinates
                const x2 = (CHART_RIGHT / length) * (i + 1) + CHART_LEFT;
                const y2 =
                    CHART_HEIGHT -
                    (dataArray[i + 1] / max) * CHART_HEIGHT +
                    CHART_TOP;

                // determine a middle distance between them
                const xMedian = (x1 + x2) / 2;
                const yMedian = (y1 + y2) / 2;

                // determine control points
                const cpx1 = (xMedian + x1) / 2;
                const cpx2 = (xMedian + x2) / 2;

                // concat two curve lines
                context.quadraticCurveTo(cpx1, y1, xMedian, yMedian);
                context.quadraticCurveTo(cpx2, y2, x2, y2);

                // determine coordinates of the point of the deal that's hovered in the table
                if (i === hoveredDealIndex) {
                    hoveredDealX = x1;
                    hoveredDealY = y1;
                }

                if (i === length - 2 && hoveredDealIndex === length - 1) {
                    hoveredDealX = x2;
                    hoveredDealY = y2;
                }
            }
        } else {
            // linear mode (no smoothing curves)
            for (let i = 1; i < length; i++) {
                const x = (CHART_RIGHT / length) * i + CHART_LEFT;
                const y =
                    CHART_HEIGHT -
                    (dataArray[i] / max) * CHART_HEIGHT +
                    CHART_TOP;

                context.lineTo(x, y);

                if (i === hoveredDealIndex) {
                    hoveredDealX = x;
                    hoveredDealY = y;
                }
            }
        }

        context.stroke();

        if (hoveredDealIndex !== -1) {
            // highlight the hovered deal
            drawHoveredDeal(context, hoveredDealX, hoveredDealY);
        }
    };

    useEffect(() => {
        const canvas = document.getElementById('chartCanvas');
        const context: CanvasRenderingContext2D = (
            canvas as HTMLCanvasElement
        ).getContext('2d') as CanvasRenderingContext2D;

        const series = data.map((deal) => deal.value);
        const hoveredDealIndex = _.findIndex(
            data,
            (deal: IDeal) => deal.id === hoveredDealId
        );

        if (context) {
            drawChart(series, context, hoveredDealIndex);
        }
        // eslint-disable-next-line
    }, [data, hoveredDealId]);

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
