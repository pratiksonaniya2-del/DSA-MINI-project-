/**
 * DATA STRUCTURE 2: Singly Linked List
 * Used for maintaining treatment history.
 * Newer treated patients can be prepended or appended.
 */

export class LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class LinkedList<T> {
  private head: LinkedListNode<T> | null = null;
  private tail: LinkedListNode<T> | null = null;
  private length: number = 0;

  // Insert at beginning for most recent history first
  prepend(item: T): void {
    const node = new LinkedListNode(item);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    this.length++;
  }

  // Insert at end
  append(item: T): void {
    const node = new LinkedListNode(item);
    if (!this.tail) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
  }

  getHead(): T | null {
    return this.head ? this.head.value : null;
  }

  size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  toArray(): T[] {
    const arr: T[] = [];
    let current = this.head;
    while (current) {
      arr.push(current.value);
      current = current.next;
    }
    return arr;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
}
