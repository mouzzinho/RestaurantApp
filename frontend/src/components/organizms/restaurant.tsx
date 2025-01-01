import React, { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';

import { ITable, TTableStatus } from '@/models/table';

interface IRestaurantProps {
    handleClick: (table: ITable) => void;
    tables?: ITable[];
}

const Restaurant: React.FC<IRestaurantProps> = ({ handleClick, tables }) => {
    const [stageSize, setStageSize] = useState(getRestaurantSize());
    const [hoveredTable, setHoveredTable] = useState<number | null>(null);

    const updateStageSize = () => {
        setStageSize(getRestaurantSize());
    };

    useEffect(() => {
        window.addEventListener('resize', updateStageSize);
        return () => window.removeEventListener('resize', updateStageSize);
    }, []);

    const calculatePosition = (x: number, y: number, width: number, height: number) => {
        return {
            x: (stageSize.width * x) / 100,
            y: (stageSize.width * y) / 100,
            width: (stageSize.width * width) / 100,
            height: (stageSize.width * height) / 100,
        };
    };

    if (!tables) return null;

    return (
        <Stage width={stageSize.width} height={stageSize.height}>
            <Layer>
                <Rect x={0} y={0} width={stageSize.width} height={stageSize.height} fill="#ddd" stroke="#333" strokeWidth={4} />
                <Rect
                    x={stageSize.width * 0.03}
                    y={1}
                    width={stageSize.width * 0.69}
                    height={stageSize.width * 0.12}
                    fill="yellow"
                    stroke="#333"
                    strokeWidth={2}
                />
                <Text
                    text="KASA"
                    fontSize={stageSize.width / 25}
                    fontFamily="Arial"
                    fill="#333"
                    x={stageSize.width * 0.27}
                    y={stageSize.width * 0.045}
                    width={stageSize.width * 0.21}
                    align="center"
                />
                <Rect
                    x={stageSize.width * 0.72}
                    y={1}
                    width={stageSize.width * 0.28 - 1}
                    height={stageSize.width * 0.54}
                    fill="orange"
                    stroke="#333"
                    strokeWidth={2}
                />
                <Text
                    text="KUCHNIA"
                    fontSize={stageSize.width / 25}
                    fontFamily="Arial"
                    fill="#333"
                    x={stageSize.width * 0.72}
                    y={stageSize.width * 0.25}
                    width={stageSize.width * 0.28 - 1}
                    align="center"
                />
                {tables.map((table, index) => {
                    const isHovered = hoveredTable === index;
                    const scale = isHovered ? 1.1 : 1;
                    const adjustedPosition = calculatePosition(table.x, table.y, table.width, table.height);
                    const offsetX = (adjustedPosition.width * (scale - 1)) / 2;
                    const offsetY = (adjustedPosition.height * (scale - 1)) / 2;
                    return (
                        <React.Fragment key={index}>
                            <Rect
                                x={adjustedPosition.x - offsetX}
                                y={adjustedPosition.y - offsetY}
                                width={adjustedPosition.width * scale}
                                height={adjustedPosition.height * scale}
                                fill={getTableColor(table.status)}
                                cornerRadius={8}
                                shadowBlur={isHovered ? 10 : 0}
                                shadowColor={isHovered ? 'black' : ''}
                                onClick={() => {
                                    handleClick(table);
                                }}
                                onTap={() => {
                                    handleClick(table);
                                }}
                                onMouseEnter={(e) => {
                                    const container = e.target.getStage()?.container();
                                    if (container) {
                                        container.style.cursor = 'pointer';
                                        setHoveredTable(index);
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    const container = e.target.getStage()?.container();
                                    if (container) {
                                        container.style.cursor = 'default';
                                        setHoveredTable(null);
                                    }
                                }}
                            />
                            <Text
                                text={table.name.replace('Stolik', '')}
                                x={adjustedPosition.x - adjustedPosition.width / 20 - offsetX}
                                y={adjustedPosition.y - offsetY}
                                width={adjustedPosition.width * scale}
                                height={adjustedPosition.height * scale}
                                fontSize={stageSize.width / 25}
                                align="center"
                                verticalAlign="middle"
                                fill="black"
                                listening={false}
                            />
                        </React.Fragment>
                    );
                })}
            </Layer>
        </Stage>
    );
};

function getRestaurantSize() {
    const minSize = Math.min(window.innerWidth - 40, window.innerHeight - 116);

    return {
        width: minSize,
        height: minSize,
    };
}

function getTableColor(status: TTableStatus) {
    switch (status) {
        case 'empty':
            return '#47af1a';
        case 'new':
            return '#5face1';
        case 'ordered':
            return '#e89430';
        case 'prepared':
            return '#630bd1';
        case 'busy':
            return '#E63946';
        case 'dirty':
            return '#4e321e';
    }
}

export default Restaurant;
