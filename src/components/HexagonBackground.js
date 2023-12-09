import './HexagonBackground.css';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import React, { useEffect } from 'react';

const HexagonBackground = () => {
  let R = 50;
  let blobs = [];

  // Define an array of possible colors
  const colors = ['#FF5733', '#FF33A1', '#33FF7A', '#3380FF', '#FFD133', '#33FFD1'];

  const hexagon = (p, x, y, r) => {
    p.beginShape(p.LINES);
    let angle = (2 * p.PI) / 6 / 2;
    for (let i = 0; i < 6; i++) {
      p.vertex(x + r * p.cos(angle), y + r * p.sin(angle));
      angle += (2 * p.PI) / 6;
      p.vertex(x + r * p.cos(angle), y + r * p.sin(angle));
    }
    p.endShape();
  };
  useEffect(() => {
    const preventZoom = (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    window.addEventListener('wheel', preventZoom, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventZoom);
    };
  }, []);

  const sketch = (p) => {
    let shouldRunAnimation = true; // State to control animation
    let minStrokeWeight = 1; // Minimum line thickness
    let maxStrokeWeight = 3; // Maximum line thickness
    let increasing = true; // Boolean to track whether stroke weight is increasing or decreasing
    let currentStrokeWeight = minStrokeWeight; // Initialize stroke weight

    p.setup = () => {
      const canvasWidth = 1690; // Fixed width
      const canvasHeight = 1200; // Fixed height
      p.createCanvas(canvasWidth, canvasHeight);
      createBlobs();
    };

    const createBlobs = () => {
      blobs = [];
      for (let i = 0; i < 15; i++) {
        const x = p.random(p.width);
        const y = p.random(p.height);
        const radius = p.random(50, 200); // Adjust radius as needed
        const color = p.random(colors); // Randomly select a color
        blobs.push({ x, y, radius, color });
      }
    };

    p.draw = () => {
      if (shouldRunAnimation === false) {
        shouldRunAnimation = true;
      }
      if (!shouldRunAnimation) return; // Stop animation
      p.background(25);
      p.frameRate(6);
        // Update stroke weight based on a time-dependent pattern
      if (increasing) {
        currentStrokeWeight += 0.1; // Adjust the rate of increase as needed
        if (currentStrokeWeight >= maxStrokeWeight) {
          increasing = false;
        }
      } else {
        currentStrokeWeight -= 0.1; // Adjust the rate of decrease as needed
        if (currentStrokeWeight <= minStrokeWeight) {
          increasing = true;
        }
      }
      for (const blob of blobs) {
        // Adjust the blob's position and radius based on frame count
        const speed = 2; // Adjust the speed as needed
        const xOffset = p.cos(p.frameCount * 0.1) * speed;
        const yOffset = p.sin(p.frameCount * 0.1) * speed;
        blob.x += xOffset;
        blob.y += yOffset;
        blob.radius = p.map(p.sin(p.frameCount * 0.05), -1, 1, 50, 200); // Adjust size change

        // Keep blob within canvas bounds
        blob.x = p.constrain(blob.x, 0, p.width);
        blob.y = p.constrain(blob.y, 0, p.height);

        // Set the stroke color for the blob
        p.stroke(blob.color);
        p.strokeWeight(currentStrokeWeight);

        // Adjust the opacity of the hexagonal grid based on blob position
        const x_offset = R * p.cos(p.PI / 6);
        const y_offset = R * p.sin(p.PI / 6) + R;
        const x_space = 2 * x_offset;
        const y_space = 2 * y_offset;

        for (let y = 0; y < p.height; y += y_space) {
          for (let x = 0; x < p.width; x += x_space) {
            // Calculate the distance between the blob and the hexagon center
            const d = p.dist(x, y, blob.x, blob.y);

            // Adjust the opacity based on distance from the blob
            const maxDist = blob.radius + R * 2.0; // Adjust the factor as needed
            const opacity = p.map(d, 0, maxDist, 50, 0); // Adjust values as needed
            // Set the stroke opacity for the hexagon
            p.stroke(p.red(blob.color), p.green(blob.color), p.blue(blob.color), opacity);
            hexagon(p, x, y, R);
            hexagon(p, x + x_offset, y + y_offset, R);
          }
        }
      }
      p.keyPressed = () => {
        shouldRunAnimation = false;
      };
    };
  };

  return (
    <div className="HexagonBackground">
      <ReactP5Wrapper sketch={sketch} />
    </div>
  );
};

export default React.memo(HexagonBackground);