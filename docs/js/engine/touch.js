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
//
// Built on Pointer Events with pointer capture rather than raw Touch Events.
// Touch Events deliver to whatever element the gesture started on and quietly
// stop if that target changes or the browser decides the drag was a scroll —
// which is exactly how a look-drag or a vertical walk-drag goes dead on a real
// phone while a horizontal one keeps working. Capturing the pointer pins every
// move to this surface until release, whatever else happens on the page.

const STICK_RADIUS = 62;      // px of travel that reads as full deflection
const DEAD_ZONE = 0.10;
const TAP_SLOP = 12;          // px of travel that still counts as a tap
const HOLD_MS = 220;          // press longer than this and it is a hold

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
    this.lookLast = { x: 0, y: 0 };

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

    // No act button. It sat on the look side, looked like a second pad, and
    // did nothing for the camera — players read it as a broken view control.
    // Acting is a tap on the look side instead; dragging there still looks.
    this.pause = el('tc-pause', this.wrap);
    this.pause.textContent = '≡';
    this.pause.setAttribute('role', 'button');
    this.pause.setAttribute('aria-label', 'menu');

    this.hintMove = el('tc-hint tc-hint-move', this.wrap);
    this.hintMove.textContent = 'walk';
    this.hintLook = el('tc-hint tc-hint-look', this.wrap);
    this.hintLook.textContent = 'look · tap to act';
  }

  _bind() {
    const surface = this.wrap;
    const stop = (e) => { e.preventDefault(); e.stopPropagation(); };

    // The pause button swallows its own pointer so a thumb on it never also
    // steers the camera.
    this.pause.addEventListener('pointerdown', (e) => { stop(e); this.onPause?.(); });

    surface.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      // Pin this pointer to the surface for the life of the gesture.
      try { surface.setPointerCapture(e.pointerId); } catch { /* older browsers */ }

      if (this._isMoveSide(e.clientX)) {
        if (this.moveId !== null) return;
        this.moveId = e.pointerId;
        this.origin.x = e.clientX;
        this.origin.y = e.clientY;
        this._showStick(e.clientX, e.clientY);
      } else {
        if (this.lookId !== null) return;
        this.lookId = e.pointerId;
        this.lookLast.x = e.clientX;
        this.lookLast.y = e.clientY;
        // a stationary press is an act; a moving one is a look
        this.lookStart = { x: e.clientX, y: e.clientY, t: performance.now() };
        this.lookMoved = 0;
        this.holdTimer = setTimeout(() => {
          if (this.lookId !== null && this.lookMoved < TAP_SLOP) {
            if (!this.actHeld) this.actPressed = true;
            this.actHeld = true;
          }
        }, HOLD_MS);
      }
      this._fadeHints();
    });

    surface.addEventListener('pointermove', (e) => {
      if (!this.enabled) return;

      if (e.pointerId === this.moveId) {
        e.preventDefault();
        const dx = e.clientX - this.origin.x;
        const dy = e.clientY - this.origin.y;
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
      } else if (e.pointerId === this.lookId) {
        e.preventDefault();
        const ddx = e.clientX - this.lookLast.x;
        const ddy = e.clientY - this.lookLast.y;
        this.lookDX += ddx;
        this.lookDY += ddy;
        this.lookLast.x = e.clientX;
        this.lookLast.y = e.clientY;
        this.lookMoved += Math.hypot(ddx, ddy);
        if (this.lookMoved >= TAP_SLOP && this.actHeld) {
          // it turned into a drag after all — stop acting, start looking
          this.actHeld = false;
          clearTimeout(this.holdTimer);
        }
      }
    });

    const end = (e) => {
      if (e.pointerId === this.moveId) {
        this.moveId = null;
        this.moveX = this.moveY = 0;
        this._hideStick();
      } else if (e.pointerId === this.lookId) {
        clearTimeout(this.holdTimer);
        // a short, stationary press that never became a hold is a tap
        const quick = performance.now() - (this.lookStart?.t ?? 0) < HOLD_MS;
        if (quick && this.lookMoved < TAP_SLOP && !this.actHeld) this.actPressed = true;
        this.actHeld = false;
        this.lookId = null;
      }
    };
    surface.addEventListener('pointerup', end);
    surface.addEventListener('pointercancel', end);
    // If capture is lost for any reason, drop the gesture rather than leaving
    // the player walking forever.
    surface.addEventListener('lostpointercapture', end);
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
    clearTimeout(this.holdTimer);
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
  return (coarse && noHover) || (navigator.maxTouchPoints > 1 && coarse);
}
