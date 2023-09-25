/**
 * @jest-environment jsdom
 */
import {jest} from '@jest/globals'
import { on, off, onKeydown, offKeydown } from "./jxui.js";

// Mock the document and addEventListener to simulate browser environment
document.addEventListener = jest.fn();
document.removeEventListener = jest.fn();

describe("on and off functions", () => {
  beforeEach(() => {
    // Clear any previous event routes
    jest.clearAllMocks();
  });

  it("should add an event listener", () => {
    const callback = jest.fn();
    on("click", ".test-selector", callback);

    expect(document.addEventListener).toHaveBeenCalledWith("click", expect.any(Function), true);
  });

  it("should remove an event listener", () => {
    const callback = jest.fn();
    on("click", ".test-selector", callback);
    off("click", ".test-selector");

    expect(document.removeEventListener).toHaveBeenCalledWith("click", expect.any(Function));
  });
});

describe("onKeydown and offKeydown functions", () => {
  beforeEach(() => {
    // Clear any previous keydown routes
    jest.clearAllMocks();
  });

  describe('onKeydown function', () => {
    let callback1, callback2, callback3, callback4;
    let parentNode, childNode1, childNode2;

    beforeEach(() => {
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

      // Register the mock callbacks with onKeydown
      onKeydown('Enter', '.parent', callback1);
      onKeydown('Enter', '.child1', callback2);
      onKeydown('Enter', '.child1', callback3);
      onKeydown('Enter', '.child2', callback4);
    });

    afterEach(() => {
      // Remove the test node and clean up event listeners
      document.body.removeChild(parentNode);
      offKeydown('Enter', '.parent');
      offKeydown('Enter', '.child');
    });

    it('should dispatch a keyboard event to all registered callbacks', () => {
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
    });

  });

});
