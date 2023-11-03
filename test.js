// using ethereumjs-util 7.1.3
const ethUtil = require('ethereumjs-util');

// using ethereumjs-abi 0.6.9
const abi = require('ethereumjs-abi');

const typedData = {
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Person: [
      { name: 'name', type: 'string' },
      { name: 'wallet', type: 'address' }
    ],
    Mail: [
      { name: 'from', type: 'Person' },
      { name: 'to', type: 'Person' },
      { name: 'contents', type: 'string' }
    ],
  },
  primaryType: 'Mail',
  domain: {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  },
  message: {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
    contents: 'Hello, Bob!',
  },
};

const types = typedData.types;

// Recursively finds all the dependencies of a type
function dependencies(primaryType, found = []) {
  if (found.includes(primaryType)) {
    return found;
  }
  if (types[primaryType] === undefined) {
    return found;
  }
  found.push(primaryType);
  for (let field of types[primaryType]) {
    for (let dep of dependencies(field.type, found)) {
      if (!found.includes(dep)) {
        found.push(dep);
      }
    }
  }
  return found;
}

function encodeType(primaryType) {
  // Get dependencies primary first, then alphabetical
  let deps = dependencies(primaryType);
  deps = deps.filter(t => t != primaryType);
  deps = [primaryType].concat(deps.sort());

  // Format as a string with fields
  let result = '';
  for (let type of deps) {
    result += `${type}(${types[type].map(({ name, type }) => `${type} ${name}`).join(',')})`;
  }
  return result;
}

function typeHash(primaryType) {
  return ethUtil.keccakFromString(encodeType(primaryType), 256);
}

function encodeData(primaryType, data) {
  let encTypes = [];
  let encValues = [];

  // Add typehash
  encTypes.push('bytes32');
  encValues.push(typeHash(primaryType));

  // Add field contents
  for (let field of types[primaryType]) {
    let value = data[field.name];
    if (field.type == 'string' || field.type == 'bytes') {
      encTypes.push('bytes32');
      value = ethUtil.keccakFromString(value, 256);
      encValues.push(value);
    } else if (types[field.type] !== undefined) {
      encTypes.push('bytes32');
      value = ethUtil.keccak256(encodeData(field.type, value));
      encValues.push(value);
    } else if (field.type.lastIndexOf(']') === field.type.length - 1) {
      throw 'TODO: Arrays currently unimplemented in encodeData';
    } else {
      encTypes.push(field.type);
      encValues.push(value);
    }
  }

  return abi.rawEncode(encTypes, encValues);
}

function structHash(primaryType, data) {
  const encoded = encodeData(primaryType, data)
  console.log("!!! prehash", encoded.toString('hex'))
  return ethUtil.keccak256(encoded);
}

function signHash() {
  return ethUtil.keccak256(
    Buffer.concat([
      Buffer.from('1901', 'hex'),
      structHash('EIP712Domain', typedData.domain),
      structHash(typedData.primaryType, typedData.message),
    ]),
  );
}

console.log(structHash('Mail', typedData.message).toString('hex'))
// console.log(structHash('Person', typedData.message.from).toString('hex'))