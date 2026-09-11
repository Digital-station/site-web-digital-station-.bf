import React from "react";
import styled from "styled-components";

const Switch = () => {
  return (
    <StyledWrapper>
      <label className="ux-vault-toggle">
        <input
          type="checkbox"
          className="ux-vault-toggle__input"
          aria-label="Toggle language"
        />
        <div className="ux-vault-toggle__wrapper">
          <svg className="ux-vault-toggle__filter" width={0} height={0}>
            <defs>
              <filter id="ux-metal-noise">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.75"
                  numOctaves={3}
                  result="noise"
                />
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.12 0"
                  in="noise"
                  result="coloredNoise"
                />
                <feComposite
                  operator="in"
                  in="coloredNoise"
                  in2="SourceGraphic"
                  result="composite"
                />
                <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
              </filter>
            </defs>
          </svg>
          <div className="ux-vault-toggle__track">
            <div className="ux-vault-toggle__texture" />
            <svg className="ux-vault-toggle__circuit" viewBox="0 0 140 60">
              <path
                d="M 35 30 L 60 30 L 75 18 L 115 18"
                className="ux-circuit-path ux-circuit--off"
              />
              <path
                d="M 25 42 L 65 42 L 80 30 L 105 30"
                className="ux-circuit-path ux-circuit--on"
              />
            </svg>
            <div className="ux-vault-toggle__status ux-vault-toggle__status--off">
              <span style={{ "--i": 1 } as React.CSSProperties}>F</span>
              <span style={{ "--i": 2 } as React.CSSProperties}>R</span>
            </div>
            <div className="ux-vault-toggle__status ux-vault-toggle__status--on">
              <span style={{ "--i": 1 } as React.CSSProperties}>E</span>
              <span style={{ "--i": 2 } as React.CSSProperties}>N</span>
            </div>
          </div>
          <div className="ux-vault-toggle__thumb">
            <div className="ux-vault-toggle__thumb-ring" />
            <div className="ux-vault-toggle__thumb-core">
              <svg
                className="ux-thumb-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx={12} cy={12} r={5} />
                <path d="M12 2 L12 5 M12 19 L12 22 M2 12 L5 12 M19 12 L22 12" />
              </svg>
            </div>
            <div className="ux-vault-toggle__thumb-glare" />
          </div>
        </div>
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .ux-vault-toggle {
    --color-slate-base: #151515;
    --color-slate-dark: #0f0f0f;
    --color-slate-light: #2a2a2a;
    --color-amber: #6b7280;
    --color-emerald: #c1ff72;
    --color-text-dim: #6b7280;
    --track-w: 140px;
    --track-h: 60px;
    --thumb-size: 50px;
    display: inline-block;
    position: relative;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .ux-vault-toggle__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .ux-vault-toggle__wrapper {
    width: var(--track-w);
    height: var(--track-h);
    position: relative;
    border-radius: 40px;
    background: var(--color-slate-base);
    box-shadow:
      0 0 0 2px var(--color-slate-dark),
      0 8px 24px rgba(0, 0, 0, 0.6);
    isolation: isolate;
  }

  .ux-vault-toggle__filter {
    position: absolute;
    pointer-events: none;
  }

  .ux-vault-toggle__track {
    position: absolute;
    inset: 2px;
    border-radius: 38px;
    background: var(--color-slate-dark);
    box-shadow:
      inset 0 8px 16px rgba(0, 0, 0, 0.9),
      inset 0 3px 6px rgba(0, 0, 0, 0.7),
      inset 0 -2px 4px rgba(255, 255, 255, 0.03);
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .ux-vault-toggle__texture {
    position: absolute;
    inset: 0;
    background: var(--color-slate-dark);
    filter: url(#ux-metal-noise);
    opacity: 0.6;
    mix-blend-mode: overlay;
    pointer-events: none;
  }

  .ux-vault-toggle__circuit {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .ux-circuit-path {
    fill: none;
    stroke-width: 2;
    stroke-dasharray: 100;
    stroke-linecap: round;
    transition:
      stroke-dashoffset 0.6s cubic-bezier(0.65, 0, 0.35, 1),
      stroke 0.6s ease;
  }

  .ux-circuit--off {
    stroke: var(--color-amber);
    stroke-dashoffset: 0;
    opacity: 0.4;
  }

  .ux-circuit--on {
    stroke: var(--color-emerald);
    stroke-dashoffset: 100;
    opacity: 0.4;
  }

  .ux-vault-toggle__status {
    position: absolute;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    font-weight: 800;
    font-size: 14px;
    letter-spacing: 2px;
    display: flex;
    z-index: 2;
  }

  .ux-vault-toggle__status span {
    display: inline-block;
    transition:
      transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
      opacity 0.4s ease,
      color 0.4s ease;
    transition-delay: calc(var(--i) * 0.05s);
  }

  .ux-vault-toggle__status--off {
    right: 24px;
    color: var(--color-amber);
    text-shadow: 0 0 8px rgba(107, 114, 128, 0.4);
  }

  .ux-vault-toggle__status--on {
    left: 24px;
    color: var(--color-emerald);
    text-shadow: 0 0 8px rgba(193, 255, 114, 0.4);
  }

  .ux-vault-toggle__status--on span {
    opacity: 0;
    transform: translateY(15px) scale(0.8);
    color: var(--color-text-dim);
  }

  .ux-vault-toggle__thumb {
    position: absolute;
    top: 5px;
    left: 5px;
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: 50%;
    background: linear-gradient(
      145deg,
      var(--color-slate-light),
      var(--color-slate-base)
    );
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.6),
      0 4px 8px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.15),
      inset 0 -3px 6px rgba(0, 0, 0, 0.5);
    z-index: 3;
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .ux-vault-toggle__thumb-ring {
    position: absolute;
    inset: 2px;
    border-radius: 50%;
    background: linear-gradient(to bottom, #3a3f46, #1a1d21);
    box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.8);
    z-index: 1;
  }

  .ux-vault-toggle__thumb-core {
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    background: var(--color-slate-dark);
    border: 2px solid var(--color-amber);
    box-shadow:
      inset 0 0 10px rgba(107, 114, 128, 0.3),
      0 0 15px rgba(107, 114, 128, 0.4);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      border-color 0.6s ease,
      box-shadow 0.6s ease;
  }

  .ux-thumb-icon {
    width: 18px;
    height: 18px;
    color: var(--color-amber);
    transition:
      color 0.6s ease,
      transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .ux-vault-toggle__thumb-glare {
    position: absolute;
    top: 2px;
    left: 10%;
    width: 80%;
    height: 40%;
    border-radius: 50%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.15),
      transparent
    );
    z-index: 4;
    pointer-events: none;
  }

  .ux-vault-toggle__input:checked
    ~ .ux-vault-toggle__wrapper
    .ux-vault-toggle__thumb {
    transform: translateX(80px);
  }

  .ux-vault-toggle__input:checked
    ~ .ux-vault-toggle__wrapper
    .ux-vault-toggle__thumb-core {
    border-color: var(--color-emerald);
    box-shadow:
      inset 0 0 12px rgba(193, 255, 114, 0.4),
      0 0 20px rgba(193, 255, 114, 0.5);
  }

  .ux-vault-toggle__input:checked ~ .ux-vault-toggle__wrapper .ux-thumb-icon {
    color: var(--color-emerald);
    transform: rotate(180deg) scale(1.1);
  }

  .ux-vault-toggle__input:checked ~ .ux-vault-toggle__wrapper .ux-circuit--off {
    stroke-dashoffset: -100;
    opacity: 0;
  }

  .ux-vault-toggle__input:checked ~ .ux-vault-toggle__wrapper .ux-circuit--on {
    stroke-dashoffset: 0;
    opacity: 0.8;
  }

  .ux-vault-toggle__input:checked
    ~ .ux-vault-toggle__wrapper
    .ux-vault-toggle__status--off
    span {
    opacity: 0;
    transform: translateY(-15px) scale(0.8);
    color: var(--color-text-dim);
  }

  .ux-vault-toggle__input:checked
    ~ .ux-vault-toggle__wrapper
    .ux-vault-toggle__status--on
    span {
    opacity: 1;
    transform: translateY(0) scale(1);
    color: var(--color-emerald);
  }

  .ux-vault-toggle:hover .ux-vault-toggle__thumb-core {
    box-shadow:
      inset 0 0 15px rgba(107, 114, 128, 0.5),
      0 0 25px rgba(107, 114, 128, 0.6);
  }

  .ux-vault-toggle__input:checked:hover
    ~ .ux-vault-toggle__wrapper
    .ux-vault-toggle__thumb-core {
    box-shadow:
      inset 0 0 15px rgba(193, 255, 114, 0.6),
      0 0 25px rgba(193, 255, 114, 0.7);
  }

  .ux-vault-toggle:active .ux-vault-toggle__thumb {
    transform: scale(0.95);
  }

  .ux-vault-toggle__input:checked:active
    ~ .ux-vault-toggle__wrapper
    .ux-vault-toggle__thumb {
    transform: translateX(80px) scale(0.95);
  }
`;

export default Switch;
