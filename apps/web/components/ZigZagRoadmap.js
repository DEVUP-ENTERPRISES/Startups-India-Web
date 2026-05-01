'use client';

import { motion } from 'framer-motion';
import Icon from './Icon';

/**
 * ZigZagRoadmap Component
 * Renders an alternating left/right path from a center line.
 * @param {Array} items - Array of roadmap nodes { title, description, icon, status }
 */
export default function ZigZagRoadmap({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="zigzag-container">
      <div className="zigzag-track">
        {/* The Central Path SVG */}
        <div className="zigzag-svg-wrapper">
          <svg width="100%" height="100%" preserveAspectRatio="none" viewBox={`0 0 100 ${items.length * 200}`}>
            <motion.path
              d={generateZigZagPath(items.length)}
              fill="none"
              stroke="rgba(233, 34, 34, 0.2)"
              strokeWidth="4"
              strokeDasharray="8 8"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d={generateZigZagPath(items.length)}
              fill="none"
              stroke="var(--brand-red)"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 0.7 }} // Mock progress
              viewport={{ once: true }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </svg>
        </div>

        {/* The Nodes */}
        <div className="zigzag-nodes">
          {items.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={index}
                className={`zigzag-node-wrapper ${isLeft ? 'node-left' : 'node-right'}`}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Connector Line (Horizontal part) */}
                <div className="node-connector-horizontal" />

                {/* Node Content Card */}
                <div className="zigzag-node-card glass-card">
                  <div className="node-badge" style={{ background: item.completed ? 'var(--brand-red)' : 'var(--slate-100)' }}>
                    {item.completed ? (
                      <Icon name="check" size={14} color="#fff" />
                    ) : (
                      <span className="node-number">{(index + 1).toString().padStart(2, '0')}</span>
                    )}
                  </div>
                  <div className="node-content">
                    <h4 className="node-title">{item.title}</h4>
                    <p className="node-desc">{item.description}</p>
                    {item.details && (
                      <div className="node-details">
                         {item.details.slice(0, 2).map((d, i) => (
                           <span key={i} className="node-tag">#{d.replace(/\s+/g, '')}</span>
                         ))}
                      </div>
                    )}
                  </div>
                  {item.icon && <div className="node-icon-bg">{item.icon}</div>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .zigzag-container {
          position: relative;
          padding: 80px 0;
          max-width: 1000px;
          margin: 0 auto;
        }
        .zigzag-track {
          position: relative;
          min-height: \${items.length * 200}px;
        }
        .zigzag-svg-wrapper {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
        .zigzag-nodes {
          position: relative;
          z-index: 2;
        }
        .zigzag-node-wrapper {
          display: flex;
          align-items: center;
          width: 50%;
          margin-bottom: 120px;
          position: relative;
        }
        .node-left {
          margin-right: auto;
          justify-content: flex-end;
          padding-right: 100px;
        }
        .node-right {
          margin-left: auto;
          justify-content: flex-start;
          padding-left: 100px;
        }
        .zigzag-node-card {
          width: 340px;
          padding: 24px;
          position: relative;
          transition: transform 0.3s ease;
          cursor: pointer;
        }
        .zigzag-node-card:hover {
          transform: translateY(-5px) scale(1.02);
        }
        .node-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: -16px;
          left: 24px;
          box-shadow: 0 4px 12px rgba(233, 34, 34, 0.3);
          z-index: 3;
        }
        .node-number {
          font-size: 0.7rem;
          font-weight: 900;
          color: var(--slate-400);
        }
        .node-title {
          font-size: 1.1rem;
          font-weight: 950;
          margin: 0 0 8px 0;
          color: var(--brand-black);
        }
        .node-desc {
          font-size: 0.85rem;
          color: var(--slate-500);
          line-height: 1.5;
          margin: 0;
          font-weight: 600;
        }
        .node-details {
          margin-top: 15px;
          display: flex;
          gap: 8px;
        }
        .node-tag {
          font-size: 0.65rem;
          font-weight: 900;
          color: var(--brand-red);
          background: rgba(233, 34, 34, 0.05);
          padding: 4px 10px;
          border-radius: 6px;
          text-transform: uppercase;
        }
        .node-icon-bg {
          position: absolute;
          right: 20px;
          bottom: 20px;
          opacity: 0.05;
          transform: scale(3);
          pointer-events: none;
        }
        .node-connector-horizontal {
          position: absolute;
          width: 100px;
          height: 2px;
          background: rgba(233, 34, 34, 0.2);
          top: 50%;
          z-index: 0;
        }
        .node-left .node-connector-horizontal {
          right: 0;
        }
        .node-right .node-connector-horizontal {
          left: 0;
        }

        @media (max-width: 768px) {
          .zigzag-node-wrapper {
            width: 100%;
            padding: 0 0 0 60px !important;
            justify-content: flex-start !important;
          }
          .zigzag-svg-wrapper {
            left: 30px;
            transform: none;
          }
          .node-connector-horizontal {
            width: 30px !important;
            left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

function generateZigZagPath(count) {
  let path = "M 50 0 "; // Start middle top
  const segmentHeight = 200;
  for (let i = 0; i < count; i++) {
    const isLeft = i % 2 === 0;
    const y = (i + 0.5) * segmentHeight;
    const x = isLeft ? 10 : 90; // Zig zag between 10% and 90% of the SVG width (which is 200px wide in wrapper)
    // Actually our SVG is viewBox 0 0 100 [height]. 
    // So 10 is 10%, 90 is 90%.
    
    // Quadratic curve for smooth zig-zag
    const prevY = i * segmentHeight;
    path += `Q 50 \${prevY + segmentHeight/4}, \${x} \${y} `;
    path += `T 50 \${(i + 1) * segmentHeight} `;
  }
  return path;
}
