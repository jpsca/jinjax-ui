/**
 * @jest-environment jsdom
 */
import {jest} from '@jest/globals'
import { on, off, onKeydown, offKeydown } from "./jxui.js";

describe("on and off functions", () => {
  let callback1, callback2, callback3, callback4;
  let parentNode, childNode1, childNode2;

  beforeEach(() => {
    // Clear any previous event routes
    jest.clearAllMocks();

    // Create a DOM nodes for testing
    parentNode = document.createElement('div');
    parentNode.className = 'parent';

    childNode1 = document.createElement('div');
    childNode1.className = 'child1';
    parentNode.appendChild(childNode1);

    childNode2 = document.createElement('div');
    childNode2.className = 'child1';
    parentNode.appendChild(childNode2);

    document.body.appendChild(parentNode);

    // Create mock callback functions
    callback1 = jest.fn();
    callback2 = jest.fn();
    callback3 = jest.fn();
    callback4 = jest.fn();
  });

  afterEach(() => {
    // Remove the test nodes
    document.body.removeChild(parentNode);
  });

  it("should add an event listener", () => {
    const _fn = document.addEventListener;
    document.addEventListener = jest.fn();
    const callback = jest.fn();
    on("click", ".test-selector", callback);

    expect(document.addEventListener).toHaveBeenCalledWith("click", expect.any(Function), true);
    document.addEventListener = _fn
  });

  it("should remove an event listener", () => {
    const _fn = document.removeEventListener;
    document.removeEventListener = jest.fn();
    const callback = jest.fn();
    on("click", ".test-selector", callback);
    off("click", ".test-selector");

    expect(document.removeEventListener).toHaveBeenCalledWith("click", expect.any(Function));
    document.removeEventListener = _fn
  });

  describe('on function', () => {
    it('should dispatch a keyboard event to all registered callbacks', () => {
      // Register the mock callbacks with on
      on('click', '.parent', callback1);
      on('click', '.child1', callback2);
      on('click', '.child1', callback3);
      on('click', '.child2', callback4);

      // Create a mock KeyboardEvent
      const clickEvent = new MouseEvent('click');

      // Trigger the event on the test node
      childNode1.dispatchEvent(clickEvent);

      // Expect both callbacks to have been called with the event
      expect(callback2).toHaveBeenCalledWith(clickEvent, childNode1);
      expect(callback3).toHaveBeenCalledWith(clickEvent, childNode1);

      // Since the event wasn't stopped, expect the callback for the
      // parent node to have been called as well
      expect(callback1).toHaveBeenCalledWith(clickEvent, parentNode);

      // Expect the callback for the not matching node to not have been called
      expect(callback4).not.toHaveBeenCalled();

      // Clean up event listeners
      off('click', '.parent');
      off('click', '.child1');
      off('click', '.child1');
      off('click', '.child2');
    });

    it('should stop the event from bubbling up', () => {
      const callback2 = jest.fn((event) => { event.stopPropagation() });

      // Register the mock callbacks with on
      on('click', '.parent', callback1);
      on('click', '.child1', callback2);
      on('click', '.child1', callback3);
      on('click', '.child2', callback4);

      // Create a mock KeyboardEvent
      const clickEvent = new MouseEvent('click');

      // Trigger the event on the test node
      childNode1.dispatchEvent(clickEvent);

      // Expect both callbacks to have been called with the event
      expect(callback2).toHaveBeenCalledWith(clickEvent, childNode1);
      expect(callback3).toHaveBeenCalledWith(clickEvent, childNode1);

      // Since the event was stopped, expect the callback for the
      // parent node to not have been called
      expect(callback1).not.toHaveBeenCalled();
      expect(callback4).not.toHaveBeenCalled();

      off('click', '.parent');
      off('click', '.child1');
      off('click', '.child1');
      off('click', '.child2');
    });

    it('should stop the event immediately', () => {
      callback2 = jest.fn((event) => { event.stopImmediatePropagation() });

      // Register the mock callbacks with on
      on('click', '.parent', callback1);
      on('click', '.child1', callback2);
      on('click', '.child1', callback3);
      on('click', '.child2', callback4);

      // Create a mock KeyboardEvent
      const clickEvent = new MouseEvent('click');

      // Trigger the event on the test node
      childNode1.dispatchEvent(clickEvent);

      // Expect only of the callbacks to have been called with the event
      expect(callback2).toHaveBeenCalledWith(clickEvent, childNode1);

      // Since the event was immediately stopped, expect other callback
      // to not have been called
      expect(callback1).not.toHaveBeenCalled();
      expect(callback3).not.toHaveBeenCalled();
      expect(callback4).not.toHaveBeenCalled();

      // Clean up event listeners
      off('click', '.parent');
      off('click', '.child1');
      off('click', '.child1');
      off('click', '.child2');
    });

  });

});

describe("onKeydown and offKeydown functions", () => {
  let callback1, callback2, callback3, callback4;
  let parentNode, childNode1, childNode2;

  beforeEach(() => {
    // Clear any previous event routes
    jest.clearAllMocks();

    // Create a DOM nodes for testing
    parentNode = document.createElement('div');
    parentNode.className = 'parent';

    childNode1 = document.createElement('div');
    childNode1.className = 'child1';
    parentNode.appendChild(childNode1);

    childNode2 = document.createElement('div');
    childNode2.className = 'child1';
    parentNode.appendChild(childNode2);

    document.body.appendChild(parentNode);

    // Create mock callback functions
    callback1 = jest.fn();
    callback2 = jest.fn();
    callback3 = jest.fn();
    callback4 = jest.fn();
  });

  afterEach(() => {
    // Remove the test nodes
    document.body.removeChild(parentNode);
  });

  describe('onKeydown function', () => {
    it('should dispatch a keyboard event to all registered callbacks', () => {
      // Register the mock callbacks with onKeydown
      onKeydown('Enter', '.parent', callback1);
      onKeydown('Enter', '.child1', callback2);
      onKeydown('Enter', '.child1', callback3);
      onKeydown('Enter', '.child2', callback4);
      onKeydown('Escape', '.child2', callback4);

      // Create a mock KeyboardEvent
      const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });

      // Trigger the event on the test node
      childNode1.dispatchEvent(keyboardEvent);

      // Expect both callbacks to have been called with the event
      expect(callback2).toHaveBeenCalledWith(keyboardEvent, childNode1);
      expect(callback3).toHaveBeenCalledWith(keyboardEvent, childNode1);

      // Since the event wasn't stopped, expect the callback for the
      // parent node to have been called as well
      expect(callback1).toHaveBeenCalledWith(keyboardEvent, parentNode);

      // Expect the callback for the not matching node to not have been called
      expect(callback4).not.toHaveBeenCalled();

      // Clean up event listeners
      offKeydown('Enter', '.parent');
      offKeydown('Enter', '.child1');
      offKeydown('Enter', '.child2');
      offKeydown('Escape', '.child2');
    });

    it('should ignore an unregistered key', () => {
      // Register the mock callbacks with onKeydown
      onKeydown('Enter', '.parent', callback1);
      onKeydown('Enter', '.child1', callback2);
      onKeydown('Enter', '.child1', callback3);
      onKeydown('Enter', '.child2', callback4);
      onKeydown('Escape', '.child2', callback4);

      // Create a mock KeyboardEvent
      const keyboardEvent = new KeyboardEvent('keydown', { key: 'a' });

      // Trigger the event on the test node
      childNode1.dispatchEvent(keyboardEvent);

      // Expect that no callback was called for the unregistered key
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
      expect(callback3).not.toHaveBeenCalled();
      expect(callback4).not.toHaveBeenCalled();

      // Clean up event listeners
      offKeydown('Enter', '.parent');
      offKeydown('Enter', '.child1');
      offKeydown('Enter', '.child2');
      offKeydown('Escape', '.child2');
    });

    it('should dispatch only for the used key', () => {
      // Register the mock callbacks with onKeydown
      onKeydown('a', '.child1', callback1);
      onKeydown('b', '.child1', callback2);
      onKeydown('c', '.child1', callback3);
      onKeydown('d', '.child1', callback4);
      onKeydown('e', '.child1', callback4);

      // Create a mock KeyboardEvent
      const keyboardEvent = new KeyboardEvent('keydown', { key: 'b' });

      // Trigger the event on the test node
      childNode1.dispatchEvent(keyboardEvent);

      // Expect only the callbacks for the key to have been called
      expect(callback2).toHaveBeenCalledWith(keyboardEvent, childNode1);

      // Expect that the callback for different keys were not called
      expect(callback1).not.toHaveBeenCalled();
      expect(callback3).not.toHaveBeenCalled();
      expect(callback4).not.toHaveBeenCalled();

      // Clean up event listeners
      offKeydown('a', '.child1');
      offKeydown('b', '.child1');
      offKeydown('c', '.child1');
      offKeydown('d', '.child1');
      offKeydown('e', '.child1');
    });

    it('should treat pressed modifiers as different keys', () => {
      // Register the mock callbacks with onKeydown
      onKeydown('a', '.child1', callback1, {shiftKey: true});
      onKeydown('a', '.child1', callback2, {ctrlKey: true});
      onKeydown('a', '.child1', callback3, {altKey: true});
      onKeydown('a', '.child1', callback4, {metaKey: true});

      // Create a mock KeyboardEvent
      const keyboardEvent = new KeyboardEvent('keydown', { key: 'a', altKey: true });

      // Trigger the event on the test node
      childNode1.dispatchEvent(keyboardEvent);

      // Expect only the callbacks for the key to have been called
      expect(callback3).toHaveBeenCalledWith(keyboardEvent, childNode1);

      // Expect that the callback for different keys were not called
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
      expect(callback4).not.toHaveBeenCalled();

      // Clean up event listeners
      offKeydown('a', '.child1');
    });

  });

});
