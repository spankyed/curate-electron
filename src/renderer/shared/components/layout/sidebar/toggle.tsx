import React, { CSSProperties, useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { sidebarOpenAtom } from './store';
import { colors } from '@renderer/shared/styles/theme';

type direction = 'top' | 'bottom';
const baseX = -50;
const verticalY = 0.325;
const verticalRotate = 0;
const arrowY = 0.2;
const arrowRotate = 25;

const invert = (value) => value * -1;
const transformString = (y, rotate) =>
  `translateX(${baseX}%) translateY(${y}rem) rotate(${rotate}deg)`;

const transformValues = {
  top: {
    open: transformString(invert(verticalY), verticalRotate),
    hover: transformString(invert(arrowY), arrowRotate),
    closed: transformString(invert(arrowY), invert(arrowRotate)),
  },
  bottom: {
    open: transformString(verticalY, verticalRotate),
    hover: transformString(arrowY, invert(arrowRotate)),
    closed: transformString(arrowY, arrowRotate),
  },
};

function SidebarToggleButton() {
  const [isSidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const toggleSidebar = (event) => {
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.tagName === 'SELECT' ||
        event.target.isContentEditable
      ) {
        return;
      }

      const isLeftArrow = event.keyCode === 37;
      const isRightArrow = event.keyCode === 39;

      if (isLeftArrow) {
        setSidebarOpen(false);
      } else if (isRightArrow) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('keydown', toggleSidebar);

    return () => {
      window.removeEventListener('keydown', toggleSidebar);
    };
  }, [setSidebarOpen]);

  const barBaseStyle: CSSProperties = {
    position: 'absolute',
    left: '50%',
    width: '0.25rem',
    height: '0.75rem',
    // backgroundColor: colors.palette.background.paper,
    backgroundColor: 'grey',
    transition: 'transform 0.3s ease',
    borderRadius: '9999px',
  };

  const getStyle = (position: direction): CSSProperties => {
    const state = isHovering && isSidebarOpen ? 'hover' : isSidebarOpen ? 'open' : 'closed';
    return { ...barBaseStyle, transform: transformValues[position][state] };
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        padding: '30px 0',
        cursor: 'pointer',
        zIndex: 1201,
      }}
      onClick={() => setSidebarOpen(!isSidebarOpen)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        style={{
          padding: '0rem 1rem',
        }}
      >
        <div style={getStyle('top')}></div>
        <div style={getStyle('bottom')}></div>
      </div>
    </div>
  );
}

export default SidebarToggleButton;
