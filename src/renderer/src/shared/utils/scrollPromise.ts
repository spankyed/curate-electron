type ScrollContainer = {
  current?: Element | null;
};

// ! scrolling can block stuff like loading data
// todo turn this into a queue of scroll events promises as to not block other operations

/**
 * Scrolls an element into view or to a specified position within a container, resolving after the scroll ends or timing out after 2 seconds.
 * @param {Element} element - The DOM element to scroll into view.
 * @param {Object} options - The options for scrolling, like behavior and block for scrollIntoView, or top and behavior for scrollTo.
 * @param {string} method - Specifies the scroll method ('scrollIntoView' or 'scrollTo').
 * @param {Element} container - The scrollable container in which to perform the scroll. Defaults to the element's immediate scrollable parent if not specified.
 * @returns {Promise<boolean>} - Resolves to true if the scroll ended naturally, false if it timed out.
 */
export function scrollToElement({
  element, container = {}, options, method = 'scrollIntoView',
}: {
  element: Element,
  container?: ScrollContainer,
  options: any, // Assuming ScrollOptions is defined elsewhere according to the options API of scrollIntoView or scrollTo
  method?: 'scrollIntoView' | 'scrollTo'
}) {
  const scrollEl = container.current || element; // Use element if container is not provided or invalid
  const timeout = 1500;

  if (!element) return Promise.reject('Element not provided or does not exist.');

  return new Promise((resolve) => {
    let timeoutId;

    const clearScrollEvent = () => {
      scrollEl.removeEventListener('scrollend', onScrollEnd);
      clearTimeout(timeoutId);
    };

    const onScrollEnd = () => {
      clearScrollEvent();
      resolve(true); // Scroll ended naturally
    };

    timeoutId = setTimeout(() => {
      clearScrollEvent();
      resolve(false); // Scroll timed out
    }, timeout); // Set a max time of 2 seconds

    scrollEl.addEventListener('scrollend', onScrollEnd);

    switch (method) {
      case 'scrollIntoView':
        element.scrollIntoView(options);
        break;
      case 'scrollTo':
        scrollEl.scrollTo(options);
        break;
      default:
        clearScrollEvent();
        resolve(false);
    }
  });
}
