import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';

interface BackgroundDecorationsProps {
    width: number;
    height: number;
}

export default function BackgroundDecorations({ width, height }: BackgroundDecorationsProps) {
    return (
        <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
            {/* Clouds - very subtle */}
            <G opacity={0.05}>
                {/* Cloud 1 - top left */}
                <Ellipse cx={width * 0.2} cy={height * 0.1} rx="60" ry="30" fill="#FFFFFF" />
                <Circle cx={width * 0.15} cy={height * 0.1} r="25" fill="#FFFFFF" />
                <Circle cx={width * 0.25} cy={height * 0.1} r="30" fill="#FFFFFF" />

                {/* Cloud 2 - top right */}
                <Ellipse cx={width * 0.8} cy={height * 0.15} rx="50" ry="25" fill="#FFFFFF" />
                <Circle cx={width * 0.75} cy={height * 0.15} r="20" fill="#FFFFFF" />
                <Circle cx={width * 0.85} cy={height * 0.15} r="25" fill="#FFFFFF" />

                {/* Cloud 3 - middle */}
                <Ellipse cx={width * 0.3} cy={height * 0.4} rx="70" ry="35" fill="#FFFFFF" />
                <Circle cx={width * 0.25} cy={height * 0.4} r="30" fill="#FFFFFF" />
                <Circle cx={width * 0.35} cy={height * 0.4} r="35" fill="#FFFFFF" />

                {/* Cloud 4 - bottom */}
                <Ellipse cx={width * 0.7} cy={height * 0.7} rx="55" ry="28" fill="#FFFFFF" />
                <Circle cx={width * 0.65} cy={height * 0.7} r="22" fill="#FFFFFF" />
                <Circle cx={width * 0.75} cy={height * 0.7} r="27" fill="#FFFFFF" />
            </G>

            {/* Hills - very subtle */}
            <G opacity={0.04}>
                {/* Hill 1 - left */}
                <Path
                    d={`M 0 ${height * 0.8} Q ${width * 0.3} ${height * 0.6} ${width * 0.5} ${height * 0.8} L ${width * 0.5} ${height} L 0 ${height} Z`}
                    fill="#2E7D32"
                />

                {/* Hill 2 - right */}
                <Path
                    d={`M ${width * 0.5} ${height * 0.75} Q ${width * 0.7} ${height * 0.55} ${width} ${height * 0.75} L ${width} ${height} L ${width * 0.5} ${height} Z`}
                    fill="#388E3C"
                />
            </G>

            {/* Grass blades - scattered, very subtle */}
            <G opacity={0.03}>
                {[...Array(15)].map((_, i) => {
                    const x = (width / 15) * i + Math.random() * 20;
                    const y = height * 0.85 + Math.random() * (height * 0.1);
                    const h = 15 + Math.random() * 10;
                    return (
                        <Path
                            key={`grass-${i}`}
                            d={`M ${x} ${y} Q ${x + 2} ${y - h / 2} ${x + 1} ${y - h}`}
                            stroke="#4CAF50"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                        />
                    );
                })}
            </G>

            {/* Small stars/sparkles - very subtle */}
            <G opacity={0.04}>
                {[...Array(8)].map((_, i) => {
                    const x = Math.random() * width;
                    const y = Math.random() * (height * 0.5);
                    const size = 3 + Math.random() * 2;
                    return (
                        <G key={`star-${i}`}>
                            <Path
                                d={`M ${x} ${y - size} L ${x} ${y + size} M ${x - size} ${y} L ${x + size} ${y}`}
                                stroke="#FFD700"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </G>
                    );
                })}
            </G>
        </Svg>
    );
}
