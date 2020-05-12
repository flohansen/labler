import React, { useRef, useEffect } from "react";
import "./MediaGrid.css";

const MediaGrid = ({ columns = 3, spacing = 24, ...props }) => {

	const containerRef = useRef(null);

	useEffect(() => {
		console.log(containerRef.current.clientWidth);

	}, []);

	return (
		<div className="mediagrid" ref={containerRef}>
			{props.children.map((child, idx) => (
				<div
					className="mediagrid__item"
					key={idx}
					style={
						{
							width: `calc(${100 / columns}% - ${(columns - 1) * spacing / columns}px)`,
							marginBottom: `${spacing}px`
						}
					}>
					{child}
				</div>
			))}
		</div>
	);

};

export default MediaGrid;
