// Virtual controller for touch devices.
//
// The game has two verbs — walking and looking — plus one act. So: a floating
// analog stick on one side, a look-drag zone on the other, and a single act
// button that supports both a tap and a hold.
//
// The stick must be genuinely analog. Chapter 04's puzzle asks the player to
// hold a specific partial deflection for thirty-two paces, and chapter 06's
// line quality depends on gait, so a four-way d-pad would break two of the
// seven puzzles.

const STICK_RADIUS = 62;      // px, at which deflection reads as 1.0
const DEAD_ZONE = 0.10;

export class TouchControls {
  constructor(root, settings) {
    this.root = root;
    this.settings = settings;
    this.enabled = false;

    // outputs, read by Player each frame
    this.moveX = 0;
    this.moveY = 0;
    this.lookDX = 0;
    this.lookDY = 0;
    this.actHeld = false;
    this.actPressed = false;

    this.moveId = null;
    this.lookId = null;
    this.origin = { x: 0, y: 0 };

    this._build();
    this._bind();
  }

  _build() {
    const el = (cls, parent) => {
      const d = document.createElement('div');
      d.className = cls;
      (parent || this.root).appendChild(d);
      return d;
    };

    this.wrap = el('tc');
    this.wrap.hidden = true;

    this.stickBase = el('tc-base', this.wrap);
    this.stickKnob = el('tc-knob', this.wrap);
    this.stickBase.hidden = this.stickKnob.hidden = true;

    this.act = el('tc-act', this.wrap);
    this.act.textContent = '·';
    this.act.setAttribute('role', 'button');
    this.act.setAttribute('aria-label', 'act');

    this.pause = el('tc-pause', this.wrap);
    this.pause.textContent = '≡';
    this.pause.setAttribute('role', 'button');
    this.pause.setAttribute('aria-label', 'menu');

    this.hintMove = el('tc-hint tc-hint-move', this.wrap);
    this.hintMove.textContent = 'walk';
    this.hintLook = el('tc-hint tc-hint-look', this.wrap);
    this.hintLook.textContent = 'look';
  }

  _bind() {
    const surface = this.wrap;

    // The act button and the pause button swallow their own touches so a
    // thumb resting on them never also steers the camera.
    const stop = (e) => { e.preventDefault(); e.stopPropagation(); };

    this.act.addEventListener('touchstart', (e) => {
      stop(e);
      if (!this.actHeld) this.actPressed = true;
      this.actHeld = true;
      this.act.classList.add('down');
    }, { passive: false });
    const release = (e) => {
      stop(e);
      this.actHeld = false;
      this.act.classList.remove('down');
    };
    this.act.addEventListener('touchend', release, { passive: false });
    this.act.addEventListener('touchcancel', release, { passive: false });

    this.pause.addEventListener('touchstart', (e) => {
      stop(e);
      this.onPause?.();
    }, { passive: false });

    surface.addEventListener('touchstart', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (this._isMoveSide(t.clientX)) {
          if (this.moveId !== null) continue;
          this.moveId = t.identifier;
          this.origin.x = t.clientX;
          this.origin.y = t.clientY;
          this._showStick(t.clientX, t.clientY);
        } else {
          if (this.lookId !== null) continue;
          this.lookId = t.identifier;
          this.lookLast = { x: t.clientX, y: t.clientY };
        }
      }
      this._fadeHints();
    }, { passive: false });

    surface.addEventListener('touchmove', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier === this.moveId) {
          const dx = t.clientX - this.origin.x;
          const dy = t.clientY - this.origin.y;
          const d = Math.hypot(dx, dy);
          const clamped = Math.min(d, STICK_RADIUS);
          const nx = d > 0 ? dx / d : 0;
          const ny = d > 0 ? dy / d : 0;
          let mag = clamped / STICK_RADIUS;
          mag = mag < DEAD_ZONE ? 0 : (mag - DEAD_ZONE) / (1 - DEAD_ZONE);
          this.moveX = nx * mag;
          this.moveY = -ny * mag;              // screen-down is backwards
          this.stickKnob.style.transform =
            `translate(${this.origin.x + nx * clamped}px, ${this.origin.y + ny * clamped}px) translate(-50%,-50%)`;
        } else if (t.identifier === this.lookId) {
          this.lookDX += t.clientX - this.lookLast.x;
          this.lookDY += t.clientY - this.lookLast.y;
          this.lookLast = { x: t.clientX, y: t.clientY };
        }
      }
    }, { passive: false });

    const end = (e) => {
      if (!this.enabled) return;
      for (const t of e.changedTouches) {
        if (t.identifier === this.moveId) {
          this.moveId = null;
          this.moveX = this.moveY = 0;
          this._hideStick();
        } else if (t.identifier === this.lookId) {
          this.lookId = null;
        }
      }
    };
    surface.addEventListener('touchend', end, { passive: false });
    surface.addEventListener('touchcancel', end, { passive: false });
  }

  _isMoveSide(x) {
    const left = x < innerWidth * 0.5;
    return this.settings.leftHanded ? !left : left;
  }

  _showStick(x, y) {
    this.stickBase.hidden = this.stickKnob.hidden = false;
    this.stickBase.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
    this.stickKnob.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
  }

  _hideStick() {
    this.stickBase.hidden = this.stickKnob.hidden = true;
  }

  _fadeHints() {
    if (this._hinted) return;
    this._hinted = true;
    this.hintMove.classList.add('gone');
    this.hintLook.classList.add('gone');
  }

  setHanded(leftHanded) {
    this.wrap.classList.toggle('lefty', !!leftHanded);
  }

  show() { this.wrap.hidden = false; this.enabled = true; }
  hide() {
    this.wrap.hidden = true;
    this.enabled = false;
    this.moveX = this.moveY = 0;
    this.lookDX = this.lookDY = 0;
    this.actHeld = this.actPressed = false;
    this.moveId = this.lookId = null;
    this._hideStick();
  }

  /** Consume the accumulated look delta; call once per frame. */
  takeLook() {
    const d = { x: this.lookDX, y: this.lookDY };
    this.lookDX = this.lookDY = 0;
    return d;
  }

  endFrame() { this.actPressed = false; }
}

/** Touch-first device? Settings can force it on for testing on a desktop. */
export function isTouchDevice(settings) {
  if (settings?.forceTouch) return true;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const noHover = matchMedia('(hover: none)').matches;
  return (coarse && noHover) || navigator.maxTouchPoints > 1 && coarse;
}
