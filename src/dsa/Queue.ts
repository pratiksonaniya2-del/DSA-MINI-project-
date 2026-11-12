/**
 * DATA STRUCTURE 1: FIFO Queue
 * Used for maintaining patients with the same priority / arrival sequence.
 */

export class QueueNode<T> {
  value: T;
  next: QueueNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class Queue<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;
  private count: number = 0;

  enqueue(item: T): void {
    const newNode = new QueueNode(item);
    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.count++;
  }

  dequeue(): T | null {
    if (!this.head) return null;
    const removedValue = this.head.value;
    this.head = this.head.next;
    if (!this.head) {
      this.tail = null;
    }
    this.count--;
    return removedValue;
  }

  peek(): T | null {
    return this.head ? this.head.value : null;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  size(): number {
    return this.count;
  }

  toArray(): T[] {
    const result: T[] = [];
    let curr = this.head;
    while (curr) {
      result.push(curr.value);
      curr = curr.next;
    }
    return result;
  }

  // Remove specific patient matching predicate (for cancellation)
  remove(predicate: (item: T) => boolean): T | null {
    if (!this.head) return null;

    if (predicate(this.head.value)) {
      return this.dequeue();
    }

    let prev = this.head;
    let curr = this.head.next;

    while (curr) {
      if (predicate(curr.value)) {
        prev.next = curr.next;
        if (curr === this.tail) {
          this.tail = prev;
        }
        this.count--;
        return curr.value;
      }
      prev = curr;
      curr = curr.next;
    }
    return null;
  }
}
