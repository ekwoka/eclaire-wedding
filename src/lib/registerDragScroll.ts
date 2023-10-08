import { nextTick } from './nextTick';

const preventStop = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
};

const cancelEvents = ['pointerup', 'mouseup', 'touchend'] as const;

export const registerDragScroll = (el: HTMLElement) => {
  const moveHandler = (e: PointerEvent) => {
    preventStop(e);
    el.scrollLeft -= e.movementX;
    el.scrollTop -= e.movementY;
  };
  let snapClassses: string[] = [];
  const upHandler = async (e: PointerEvent | MouseEvent | TouchEvent) => {
    preventStop(e);
    document.removeEventListener('pointermove', moveHandler, true);
    document.body.classList.remove(
      '!cursor-grabbing',
      '[&>*]:pointer-events-none',
    );
    el.classList.add('cursor-grab', ...snapClassses);
    await nextTick();
    document.removeEventListener('click', preventStop, true);
    cancelEvents.forEach((event) =>
      document.removeEventListener(event, upHandler, {
        capture: true,
      }),
    );
  };
  const downHandler = (e: PointerEvent | MouseEvent | TouchEvent) => {
    if (isTouch(e)) return; // skip touch inputs (allow native scrolling)
    if (e.button === 2) return; // skip right-click
    preventStop(e);
    snapClassses = Array.prototype.filter.call(el.classList, (c) => c.startsWith('snap') || c.startsWith('scroll'));
    el.classList.remove('cursor-grab', ...snapClassses);
    document.body.classList.add(
      '!cursor-grabbing',
      '[&>*]:pointer-events-none',
    );
    document.addEventListener('pointermove', moveHandler, { capture: true });
    cancelEvents.forEach((event) =>
      document.addEventListener(event, upHandler, {
        capture: true,
      }),
    );
    document.addEventListener('click', preventStop, { capture: true });
  };
  el.addEventListener('pointerdown', downHandler);
  return () => el.removeEventListener('pointerdown', downHandler);
};

const isTouch = (e: PointerEvent | MouseEvent | TouchEvent): e is TouchEvent =>
  e instanceof TouchEvent ||
  (e instanceof PointerEvent && e.pointerType === 'touch');
