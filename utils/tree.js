const _ = require('loadsh');

/**
 * 
 * @param {Array} array 需要构建的数组
 * @param {Number} level 树的层级
 */
module.exports.setTreeData = (array) => {
  // 树结构数组
  let finalTree = [];
  finalTree.push({
    id: '1',
    name: '',
    level: 0,
    children: []
  });
  setChildNodes(finalTree[0], array);
  return finalTree;
}

/**
 * 从子节点数组中找到父节点下的子节点并追加到父节点的children下
 * @param {Object} parentNode 父节点
 * @param {Array} nodesArray 子节点数组
 */
function setChildNodes(parentNode, nodesArray) {
  // 父节点的 id
  let parentNodeId = parentNode.id;
  // 找到当前父节点的子节点
  let childNodes = nodesArray.filter(item => item.parent === parentNodeId);
  parentNode.children = _.cloneDeep(childNodes);

  if (parentNode.children.length !== 0) { // 子节点数组长度不为 0 证明有子节点
    for (const i in parentNode.children) {
      let node = parentNode.children[i];
      setChildNodes(node, nodesArray);
    }
  }
  return;
}

module.exports.getLeafBranch = (tree, id) => {
  // 分支数组
  var branch = [];
  getNode(tree, id, branch);
  return branch;
}

function getNode(curNode, leafId, branch) {
  const { id, name, children } = curNode;
  branch.push({
    id, name, children
  });
  // console.log(branch, 'branch push');
  if (id === leafId) {
    //
    // console.log(curNode, ' === ');
    return true;
  } else {
    if (children.length > 0) {
      // 
      let i = 0;
      for (i = 0; i < children.length; i++) {
        // 
        const node = children[i];
        if (getNode(node, leafId, branch)) {
          // 
          return true;
        }
      }
      if (i === children.length) {
        // 
        branch.pop();
        return false;
      }
    } else {
      branch.pop();
      // console.log(branch, 'branch pop');
      return false;
    }
  }
}

/**
 * 根据节点id获取该节点的子节点数组
 * @param {Array} tree 树形结构数组
 * @param {String} id 节点id
 */
module.exports.getChildNodeById = (tree, id) => {
  // console.log(id, 'id');
  let finalChildNode = getChildNodes(tree, id);
  return finalChildNode;
}

function getChildNodes (node, parentId) {
  const { id, children } = node;
  // console.log(`id:${id} name:${node.name}`);
  if (id === parentId) {
    //
    // console.log(`id === parentId`);
    return node;
  } else {
    if (children.length > 0) {
      // 
      let i = 0;
      for (i = 0; i < children.length; i++) {
        const childNode = children[i];
        let finalNode = getChildNodes(childNode, parentId);
        if (finalNode) {
          // 
          return finalNode;
        }
      }
    }
    return false;
  }
}