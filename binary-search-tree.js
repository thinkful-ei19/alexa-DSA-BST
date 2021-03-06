'use strict';

class BinarySearchTree {
  constructor(key=null, value=null, parent=null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }

  insert(key, value) {
    //if the tree is empty then this key being inserted is the root node of the tree
    if (this.key == null) {
      this.key = key;
      this.value = value;
    }

    //If the tree already exist, then start at the root, 
    //and compare it to the key you want to insert
    // If the new key is less than the node's key 
    //then the new node needs to live in the left-hand branch.
    else if (key < this.key) {
      //if the existing node does not have any left child, 
      //meaning that if the `left` pointer is empty 
      //then we can just instantiate and insert the new node 
      //as the left child of that node, passing `this` as the parent.  
      if (this.left == null) {
        this.left = new BinarySearchTree(key, value, this);
      }
      //if the node has an existing left child, 
      //then we recursively call the `insert` method 
      //so the node is added further down the tree.
      else {
        this.left.insert(key, value);
      }
    }
    //Similarly, if the new key is greater than the node's key 
    //then you do the same thing, but on the right-hand side.
    else {
      if (this.right == null) {
        this.right = new BinarySearchTree(key, value, this);
      }
      else {
        this.right.insert(key, value);
      }
    }
  }

  find(key) {
    //if the item is found at the root then return that value
    if (this.key == key) {
      return this.value;
    }
    //if the item you are looking for is less than the root 
    //then follow the left child
    //if there is an existing left child, 
    //then recursively check its left and/or right child
    //until you find the item.
    else if (key < this.key && this.left) {
      return this.left.find(key);
    }
    //if the item you are looking for is greater than the root 
    //then follow the right child
    //if there is an existing right child, 
    //then recursively check its left and/or right child
    //until you find the item.
    else if (key > this.key && this.right) {
      return this.right.find(key);
    }
    //You have search the treen and the item is not in the tree
    else {
      throw new Error('Key Error');
    }
  }

  _replaceWith(node) {
    if (this.parent) {
      if (this == this.parent.left) {
        this.parent.left = node;
      }
      else if (this == this.parent.right) {
        this.parent.right = node;
      }

      if (node) {
        node.parent = this.parent;
      }
    }
    else {
      if (node) {
        this.key = node.key;
        this.value = node.value;
        this.left = node.left;
        this.right = node.right;
      }
      else {
        this.key = null;
        this.value = null;
        this.left = null;
        this.right = null;
      }
    }
  }

  _findMin() {
    if (!this.left) {
      return this;
    }
    return this.left._findMin();
  }

  remove(key) {
    if (this.key == key) {
      if (this.left && this.right) {
        const successor = this.right._findMin();
        this.key = successor.key;
        this.value = successor.value;
        successor.remove(successor.key);
      }
      //If the node only has a left child, 
      //then you replace the node with its left child.  
      else if (this.left) {
        this._replaceWith(this.left);
      }
      //And similarly if the node only has a right child 
      //then you replace it with its right child.
      else if (this.right) {
        this._replaceWith(this.right);
      }
      //If the node has no children then
      //simply remove it and any references to it 
      //by calling "this._replaceWith(null)".
      else {
        this._replaceWith(null);
      }
    }
    else if (key < this.key && this.left) {
      this.left.remove(key);
    }
    else if (key > this.key && this.right) {
      this.right.remove(key);
    }
    else {
      throw new Error('Key Error');
    }
  }
}

//////////// create new BST ////////////

const BST = new BinarySearchTree();
// 3,1,4,6,9,2,5,7
function main() {
  BST.insert(3);
//   BST.insert(1);
  BST.insert(4);
  BST.insert(6);
  BST.insert(9);
//   BST.insert(2);
  BST.insert(5);
  BST.insert(7);

  //   BST.remove(3);
  //   console.log(BST);
  return BST;
}

main();


//////////// Height of a BST ////////////

// approach one:

// function getHeight(tree) {
//   // if root ie: single node => height is 0
//   if (!tree) {
//     return -1;
//   }

//   let leftHeight = getHeight(tree.left);
//   let rightHeight = getHeight(tree.right);

//   if (leftHeight > rightHeight) {
//     return leftHeight + 1;
//   } else {
//     return rightHeight + 1;
//   }
// }

// console.log(getHeight(BST)); // => 4

//approach 2 using Math.max:

function getHeight2(tree) {
  if (tree === null) {
    return 0;
  } else if (!tree.left && !tree.right) {
    return 1;
  } else if (tree.left || tree.right) {
    return Math.max(getHeight2(tree.left) + 1, getHeight2(tree.right) + 1);
  }
}

// console.log(getHeight2(BST));


//////////// is it BST? ////////////

// BST ->  
// all elements in its left subtree are less to the node (<), 
// and all the elements in its right subtree are greater than the node (>).

//return true if tree -> BST
function isBST(tree) {
  if(!tree) {
    return true;
  }

  // if left node exists and if root key < left key
  if (tree.left !== null && tree.key < tree.left.key) {
    return false;
  }

  // if right node exists and if root.key > right key
  if (tree.right !== null && tree.key > tree.right.key) {
    return false;
  }

  // call function again with left subtree and right subtree
  return isBST(tree.left) && isBST(tree.right);
}

// console.log(isBST(BST)); //=> return true;
// to test for BT -> console.log(isBST(BST)); // => returns false
// reverse code in insert on line 23



//////////// Third largest node ////////////

// third largest is parent of second largest node
// let max = new BinarySearchTree();
let temp = new BinarySearchTree();
//O(n) -> try to make O(log(n)) BST
function thirdLargestNode(tree) {
  if (tree) {
    thirdLargestNode(tree.left);
    
    temp.insert(tree.key);
    thirdLargestNode(tree.right);
  }
  
  let curr = temp;

  while (curr.right) {
    curr = curr.right;
  }

  if (curr.parent && curr.parent.parent) {
    return curr.parent.parent.key;
  }
}

// console.log(thirdLargestNode(BST)); // => return 6


//////////// Balanced BST ////////////

function balencedBST(tree) {


  let leftHeight = getHeight2(tree.left);
//   console.log('left height:', leftHeight);
  let rightHeight = getHeight2(tree.right);
//   console.log('right height:', rightHeight);

  let absVal = (Math.abs(leftHeight - rightHeight));

//   console.log('this is the ABSVAL of left and right:', absVal);

  if (absVal > 1) {
    return false;
  }
  return true;
}

console.log(balencedBST(BST));

// or
// function to get height of shortest
// max height - shortest height

