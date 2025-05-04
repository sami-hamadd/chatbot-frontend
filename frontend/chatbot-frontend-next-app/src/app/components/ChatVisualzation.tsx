// 'use client';

// import React, { memo, useRef, useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import { Card, Loader, Paper, Text, useComputedColorScheme } from '@mantine/core';

// const Plot = dynamic(() => import('react-plotly.js'), {
//     ssr: false,
//     loading: () => <Loader color="blue" size="md" />
// });
// const MemoizedPlot = memo(Plot);

// interface ChatVisualizationProps {
//     generatedChart: any;
// }

// export default function ChatVisualization({ generatedChart }: ChatVisualizationProps) {
//     const [isPlotReady, setIsPlotReady] = useState(false);
//     const plotContainerRef = useRef<HTMLDivElement>(null);
//     const plotRef = useRef<any>(null);
//     const PlotlyRef = useRef<any>(null);
//     const computedColorScheme = useComputedColorScheme('light');

//     useEffect(() => {
//         let resizeObserver: ResizeObserver;

//         const initializePlotly = async () => {
//             const plotlyModule = await import('plotly.js-dist');
//             PlotlyRef.current = plotlyModule;

//             // Initialize ResizeObserver after Plotly is loaded
//             resizeObserver = new ResizeObserver(() => {
//                 if (plotRef.current && PlotlyRef.current) {
//                     PlotlyRef.current.Plots.resize(plotRef.current);
//                 }
//             });

//             if (plotContainerRef.current) {
//                 resizeObserver.observe(plotContainerRef.current);
//             }
//         };

//         const handleFullscreenChange = () => {
//             if (plotRef.current && PlotlyRef.current) {
//                 PlotlyRef.current.Plots.resize(plotRef.current);
//             }
//         };

//         initializePlotly();
//         document.addEventListener('fullscreenchange', handleFullscreenChange);

//         return () => {
//             document.removeEventListener('fullscreenchange', handleFullscreenChange);
//             if (resizeObserver) {
//                 resizeObserver.disconnect();
//             }
//         };
//     }, []);

//     if (!generatedChart?.data || !generatedChart?.layout) {
//         return null;
//     }

//     const themeColors = {
//         background: computedColorScheme === 'dark' ? '#152f55' : 'rgb(240, 240, 240)',
//     };

//     return (
//         <Card
//             radius="md"
//             p="sm"
//             style={{
//                 width: '100%',
//                 height: '100%',
//                 backgroundColor: themeColors.background
//             }}
//         >
//             {!isPlotReady && (
//                 <Paper
//                     style={{
//                         display: 'flex',
//                         justifyContent: 'center',
//                         margin: '1rem 0',
//                         backgroundColor: "transparent",
//                     }}
//                 >
//                     <Text mr="md">Loading Plot</Text>
//                     <Loader color="blue" size="md" />
//                 </Paper>
//             )}
//             <div
//                 ref={plotContainerRef}
//                 style={{
//                     position: 'relative',
//                     width: '100%',
//                     height: '400px',
//                     transition: 'width 0.5s ease-in-out'
//                 }}
//             >
//                 <MemoizedPlot
//                     data={generatedChart.data}
//                     layout={{
//                         ...generatedChart.layout,
//                         autosize: true,
//                     }}
//                     config={{
//                         responsive: true,
//                         displayModeBar: true,
//                         displaylogo: false,
//                         modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'zoom2d', 'zoom3d', 'autoscale'],
//                         modeBarButtons: [[
//                             'toImage',
//                             'zoomIn2d',
//                             'zoomOut2d',
//                             'resetScale2d',
//                             {
//                                 name: 'Full Screen',
//                                 title: 'Toggle Full Screen',
//                                 icon: {
//                                     width: 500,
//                                     height: 500,
//                                     path: "M 50 50 L 200 50 L 50 200 M 450 50 L 450 200 L 300 50 M 450 450 L 300 450 L 450 300 M 50 450 L 50 300 L 200 450"
//                                 },
//                                 click: (gd: HTMLElement) => {
//                                     if (!document.fullscreenElement) {
//                                         gd.requestFullscreen?.();
//                                     } else {
//                                         document.exitFullscreen?.();
//                                     }
//                                 },
//                             },
//                         ]]
//                     }}
//                     style={{
//                         width: '100%',
//                         height: '100%',
//                     }}
//                     useResizeHandler={true}
//                     onInitialized={(figure, graphDiv) => {
//                         plotRef.current = graphDiv;
//                         setIsPlotReady(true);
//                     }}
//                     onUpdate={(figure, graphDiv) => {
//                         plotRef.current = graphDiv;
//                         setIsPlotReady(true);
//                     }}
//                 />
//             </div>
//         </Card>
//     );
// }