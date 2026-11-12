import { Patient } from "../types/patient";

export class BSTNode {
  patient: Patient;
  left: BSTNode | null = null;
  right: BSTNode | null = null;

  constructor(patient: Patient) {
    this.patient = patient;
  }
}

export class BinarySearchTree {
  private root: BSTNode | null = null;
  private count: number = 0;

  
  insert(patient: Patient): void {
    const newNode = new BSTNode(patient);
    if (!this.root) {
      this.root = newNode;
      this.count++;
      return;
    }

    let current = this.root;
    while (true) {
      if (patient.id === current.patient.id) {
        
        current.patient = patient;
        return;
      }
      if (patient.id < current.patient.id) {
        if (!current.left) {
          current.left = newNode;
          this.count++;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          this.count++;
          return;
        }
        current = current.right;
      }
    }
  }

  
  search(id: string): Patient | null {
    let current = this.root;
    while (current) {
      if (id === current.patient.id) {
        return current.patient;
      }
      if (id < current.patient.id) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return null;
  }

  
  delete(id: string): boolean {
    let deleted = false;

    const removeNode = (node: BSTNode | null, targetId: string): BSTNode | null => {
      if (!node) return null;

      if (targetId < node.patient.id) {
        node.left = removeNode(node.left, targetId);
        return node;
      } else if (targetId > node.patient.id) {
        node.right = removeNode(node.right, targetId);
        return node;
      } else {
        
        deleted = true;
        this.count--;

        
        if (!node.left && !node.right) {
          return null;
        }

        
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        
        
        let successor = node.right;
        while (successor.left) {
          successor = successor.left;
        }
        node.patient = successor.patient;
        node.right = removeNode(node.right, successor.patient.id);
        return node;
      }
    };

    this.root = removeNode(this.root, id);
    return deleted;
  }

  
  inOrderTraversal(): Patient[] {
    const result: Patient[] = [];
    const traverse = (node: BSTNode | null) => {
      if (node) {
        traverse(node.left);
        result.push(node.patient);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return result;
  }

  
  getTreeStructure(): any {
    const serialize = (node: BSTNode | null): any => {
      if (!node) return null;
      return {
        id: node.patient.id,
        name: node.patient.name,
        emergencyLevel: node.patient.emergencyLevel,
        left: serialize(node.left),
        right: serialize(node.right),
      };
    };
    return serialize(this.root);
  }

  size(): number {
    return this.count;
  }
}
