## Solidity smart contracts vulnerabilities. (With working examples)
#### - Re-entrancy
If we mix the call back to a fallback function when receving money to the ability to call again to the initial withdraw function inside this fallback, we have an explosive mixture.
#### - tx.origin
When programmers check if a function is callable comparing with owner's address, have to use msg.sender instead of tx.origin. Because if we have some nested calls inside smart contracts, tx.origin will be the original caller but msg.sender is the real caller.
#### - Variables created as private
On solidity smart contracts there are not a real private variable that only creator should now. Because eveything is public, we could not have real access to private variables but to smart contract storage, and checking each position and with patience....