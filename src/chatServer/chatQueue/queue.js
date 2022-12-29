'use strict';

class QueueNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class Queue extends QueueNode {
  constructor() {
    super();
    this.front = null;
    this.last = null;
  }

  enqueue(data) {
    let node = new QueueNode(data);
    if (!this.front) {
      this.front = node;
      this.last = node;
    } else {
      this.last.next = node;
      this.last = node;
    }
  }

  dequeue() {
    if (!this.front) {
      return null;
    }
    let current = this.front;
    this.front = this.front.next;
    if (!this.front) {
      this.last = null;
    }
    return current;
  }

  isEmpty() {
    return !this.front;
  }

  length() {
    let current = this.front;
    let count = 0;
    while (current) {
      count++;
      current = current.next;
    }
    return count;
  }
}

module.exports = Queue;
