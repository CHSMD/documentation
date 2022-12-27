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
    return current.data;
  }

  isEmpty() {
    return !this.front;
  }
}

module.exports = Queue;
